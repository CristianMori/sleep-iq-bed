const jsonwebtoken = require('jsonwebtoken')
const jwkToPem = require('jwk-to-pem')

// https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json 
const jsonWebKeys = require('./webtoken.json')['keys']

const axios = require('axios')
const USER_INFO_ENDPOINT = "https://stgilderman-prod.auth.us-east-1.amazoncognito.com/oauth2/userInfo"



class oauth2 {
  constructor(clientId) {
    this.clientId = clientId
    this.username = null
    this.token = null
  }  
  
  getUserInfo(token, callback=null) {
    return axios.get(USER_INFO_ENDPOINT, { headers: {'Authorization': 'Bearer ' + token }})
                .then (response => {
                  if (callback) {
                    callback(response.data)
                  }
                })
                .catch(error => {
                  throw error;
                });
  }

  validateToken(token) {
      function decodeTokenHeader(token) {
          const [headerEncoded] = token.split('.')
          const buff = new Buffer(headerEncoded, 'base64')
          const text = buff.toString('ascii')
          return JSON.parse(text)
      }

      function getJsonWebKeyWithKID(kid) {
          for (let jwk of jsonWebKeys) {
              if (jwk.kid === kid) {
                  return jwk
              }
          }
          return null
      }

      function verifyJsonWebTokenSignature(token, jsonWebKey, clbk) {
          const pem = jwkToPem(jsonWebKey)
          jsonwebtoken.verify(token, pem, {algorithms: ['RS256']}, (err, decodedToken) => clbk(err, decodedToken))
      }
    
      const header = decodeTokenHeader(token);  // {"kid":"XYZAAAAAAAAAAAAAAA/1A2B3CZ5x6y7MA56Cy+6abc=", "alg": "RS256"}
      const jsonWebKey = getJsonWebKeyWithKID(header.kid)
      
      verifyJsonWebTokenSignature(token, jsonWebKey, (err, decodedToken) => {
          if (err) {
              console.error(err)
          } else {
              console.log(decodedToken);
              if (decodedToken.client_id === this.clientId) {
                this.username = decodedToken.username
                this.token = token
              }
          }
      })
    
    return this.username != null                           
  }
}

module.exports = oauth2

