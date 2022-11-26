import 'source-map-support/register'
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares';
import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { JwtPayload } from '../../auth/JwtPayload'
import Axios from 'axios'

const logger = createLogger('auth');

const sId = process.env.AUTH_0_SECRET_ID
// const sField = process.env.AUTH_0_SECRET_FIELD

const jwksUrl = 'https://dev-xgy61617ogag3jn1.us.auth0.com/.well-known/jwks.json';

export const handler = middy( async (event: CustomAuthorizerEvent, context): Promise<CustomAuthorizerResult> => 
{
  logger.info('Authorizing a user', event.authorizationToken)
  try 
  {
    const decodeJwt = await verifyToken(
      event.authorizationToken, 
      // context.AUTH0_SECRET[sField]
      )
    logger.info('User was authorized', decodeJwt)

    return {
      principalId: decodeJwt.sub,
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
})

async function verifyToken(authHeader: string): Promise<JwtPayload> 
{
  try 
  {  
    const token = getToken(authHeader)
    const res = await Axios.get(jwksUrl, { headers: { Authorization: `Bearer ${token}`}});
    const pemData = res['data']['keys'][0]['x5c'][0]
    const cert = `-----BEGIN CERTIFICATE-----\n${pemData}\n-----END CERTIFICATE-----`
  
    return verify(token, cert, { algorithms: ['RS256'] }) as Promise<JwtPayload>
    
  } catch (error) {
    logger.error('Failed to authenticate', error.response.data)
  }
  
}

handler
 .use(httpErrorHandler())
 .use(
     cors({
       credentials: true,
       cache: true,
       cacheExpiryInMillis: 60000,
       throwOnFailedCall: true,
       secrets: {AUTH0_SECRET: sId}
  })

)

function getToken(authHeader: string): string {
  if (!authHeader)
  { 
    logger.error('getToken', JSON.stringify({ input: authHeader, output: 'No authentication header'})) 
    throw new Error('No authentication header')
  }

  if (!authHeader.toLowerCase().startsWith('bearer'))
  {
    logger.error('getToken', JSON.stringify({ input: authHeader, output: 'No authentication header'})) 
    throw new Error('Invalid authentication header')
  }

  const split = authHeader.split(' ')
  const token = split[1]

  // return verify (token, auth0Secret) as JwtPayload

   return token
}