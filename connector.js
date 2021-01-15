'use strict';

const SleepNumberConnectorAPI = require('./sleep-number-bed-connector-api')
const ComponentTypes = require('./sleep-number-bed-components')

const {SchemaConnector, DeviceErrorTypes} = require('st-schema')

const DEVICE_PROFILE_ID = 'ea030dc7-2409-4e9f-b8e6-21329f5eccbd'
const DEVICE_ID = 'external-device-1';
const DEVICE_NAME = 'Smart Bed';
const DEVICE_MANUFACTURER_NAME = 'Sleep Number';
const DEVICE_MODEL_NAME = 'Sleep Number';

const oauth2 = require('./oauth2')
const ACCESS_TOKEN_CLIENT_ID = process.env.ACCESS_TOKEN_CLIENT_ID;

class SleepNumberBedSchemaConnector extends SchemaConnector {
  constructor() {
    super()

    this.bedSide = 0
    this.healthStatus =  false

    this.oauth = new oauth2(ACCESS_TOKEN_CLIENT_ID)

    this.sncAPI = new SleepNumberConnectorAPI(process.env.SLEEPIQ_EMAIL, process.env.SLEEPIQ_PASSWORD)
  }
  
  async initialize(accessToken) {
    this.healthStatus = true
    try {
        await this.sncAPI.setup(this.oauth, accessToken);
        return this.sncAPI.refresh();
    }
    catch (error) {
      this.healthStatus = false
    }
  }

  setError(deviceResponse, cmd, state, error=DeviceErrorTypes.DEVICE_UNAVAILABLE) {
    deviceResponse.setError(
      `Command '${cmd.command} of capability '${cmd.capability} and value '${state.value}' for component '${state.component} failed`,
      error)
  }

  async stateRefreshCallback(accessToken, response) {
    await this.initialize(accessToken)
    const deviceResponse = response.addDevice(DEVICE_ID)
    
    const bed = this.sncAPI.getBed()
    deviceResponse.addState(ComponentTypes.BED, 'st.presenceSensor', 'presence', bed.isInBed ? 'present' : 'not present')
    deviceResponse.addState(ComponentTypes.BED, 'st.sleepSensor', 'sleeping', 'not sleeping')
    deviceResponse.addState(ComponentTypes.PRESET, 'st.switchLevel', 'level', bed.preset)
    deviceResponse.addState(ComponentTypes.MAIN, 'st.healthCheck', 'checkInterval', 600)
    deviceResponse.addState(ComponentTypes.MAIN, 'st.healthCheck', 'DeviceWatch-DeviceStatus', this.healthStatus ? 'online' : 'offline')
    deviceResponse.addState(ComponentTypes.MAIN, 'st.healthCheck', 'healthStatus', this.healthStatus ? 'online' : 'offline')
    deviceResponse.addState(ComponentTypes.FOOTWARMER, 'st.switchLevel', 'level', bed.footWarmingStatus)
    deviceResponse.addState(ComponentTypes.SLEEPNUMBER,'st.switchLevel', 'level', bed.sleepNumber)
    deviceResponse.addState(ComponentTypes.HEAD, 'st.switchLevel', 'level', bed.headPosition)
    deviceResponse.addState(ComponentTypes.FOOT, 'st.switchLevel', 'level', bed.footPosition)
  }
  
  async commandCallback(accessToken, response, devices) {
    await this.initialize(accessToken)
    
    for (const device of devices) {
      const deviceResponse = response.addDevice(device.externalDeviceId)
      const bed = this.sncAPI.getBed()
      
      for (const cmd of device.commands) {
        const state = {
          component: cmd.component,
          capability: cmd.capability
        }
        if (cmd.capability === 'st.switchLevel' && cmd.command === 'setLevel') {
          state.attribute = 'level'
          state.value = cmd.arguments[0]

          if (cmd.component === ComponentTypes.PRESET) {
            if (!this.sncAPI.preset(state.value)) { 
              this.setError(deviceResponse, cmd, state)
            }
          }
          else if (cmd.component === ComponentTypes.HEAD) {
            if (!this.sncAPI.adjust('H', state.value)) { 
              this.setError(deviceResponse, cmd, state)
            }
          }
          else if (cmd.component === ComponentTypes.FOOT) {
            if (!this.sncAPI.adjust('F', state.value)) { 
              this.setError(deviceResponse, cmd, state)
            }
          }
          else if (cmd.component === ComponentTypes.FOOTWARMER) {
            if (!this.sncAPI.footwarming(state.value, 120)) { 
              this.setError(deviceResponse, cmd, state)
            }
          }
        } 
        else if (cmd.capability === 'st.presenceSensor') {
          state.attribute = 'presence';
          state.value = bed.isInBed ? 'present' : 'not present';
        } 
        else if (cmd.capability === 'st.sleepSensor') {
          state.attribute = 'sleeping';
          state.value = cmd.command;
        }
        else if (cmd.capability === 'st.healthcheck') {
          state.attribute = 'healthStatus';
          state.value = this.healthStatus ? 'online' : 'offline'
        }
        else {
          this.setError(deviceResponse, cmd, state, DeviceErrorTypes.CAPABILITY_NOT_SUPPORTED)
        }
        
        deviceResponse.addState(state);
      }
    }
  }
  
  discoveryCallback(accessToken, response) {
    const device = response.addDevice(DEVICE_ID, DEVICE_NAME, DEVICE_PROFILE_ID);
    device.manufacturerName(DEVICE_MANUFACTURER_NAME);
    device.modelName(DEVICE_MODEL_NAME);
  }

  accessTokenIsValid(req, res) {
    if (this.oauth.validateToken(req.body.authentication.token)) {
      return true
    }

    console.log('Unauthorized request from ', this.oauth.username)
    res.status(401).send('Unauthorized')
    return false
  }
}

const connector = new SleepNumberBedSchemaConnector()
connector.enableEventLogging(2)
connector.discoveryHandler(connector.discoveryCallback)
connector.stateRefreshHandler(connector.stateRefreshCallback)
connector.commandHandler(connector.commandCallback)

module.exports = connector
