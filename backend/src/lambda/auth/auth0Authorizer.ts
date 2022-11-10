import 'source-map-support/register'

import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { JwtPayload } from '../../auth/JwtPayload'
import Axios from 'axios'

const logger = createLogger('auth');

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = 'https://dev-xgy61617ogag3jn1.us.auth0.com/.well-known/jwks.json';

export const handler = async (
  event: CustomAuthorizerEvent
  ): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  
  try 
  {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.iss,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } 
  catch (e) 
  {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> 
{
  try 
  {  
    const token = getToken(authHeader)
    const res = await Axios.get(jwksUrl, {
      headers: { 
        Authorization: `Bearer ${token}`
      }
    });
    // .then(res =>{console.log("all Good")}) ;
    // console.log(token)
    // const jwt: Jwt = decode(token, { complete: true }) as Jwt
  
    // TODO: Implement token verification
    // You should implement it similarly to how it was implemented for the exercise for the lesson 5
    // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
      const pemData = res['data']['keys'][0]['x5c'][0]
      const cert = `-----BEGIN CERTIFICATE-----\n${pemData}\n-----END CERTIFICATE-----`
  
    return verify(token, cert, { algorithms: ['RS256'] }) as Promise<JwtPayload>
    
  } catch (error) {
    logger.error('Failed to authenticate', error.response.data)
  }

}

function getToken(authHeader: string): string {
  if (!authHeader){ 
  logger.error('getToken', JSON.stringify({ input: authHeader, output: 'No authentication header'})) 
  throw new Error('No authentication header')
  }
  if (!authHeader.toLowerCase().startsWith('bearer')){
    logger.error('getToken', JSON.stringify({ input: authHeader, output: 'No authentication header'})) 
    throw new Error('Invalid authentication header')
  }
  const split = authHeader.split(' ')
  const token = split[1]
  logger.info('getToken', JSON.stringify({ input: authHeader, output: token})) 
  return token
}