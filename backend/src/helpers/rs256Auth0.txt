
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtPayload } from '../auth/JwtPayload'

const cert = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJPFTaJZ6GXF1nMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi14Z3k2MTYxN29nYWczam4xLnVzLmF1dGgwLmNvbTAeFw0yMjExMDUx
MTIzMDRaFw0zNjA3MTQxMTIzMDRaMCwxKjAoBgNVBAMTIWRldi14Z3k2MTYxN29n
YWczam4xLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAJquKOHs37vBJiU/Yba+s33XSNAjyUUHA3FI54In4w25G6wfMthUOKxRQFkr
Hi0gVpIXP9ny5MiqSInzH5YQjvkhzwfmMxcmMCpVISUPdtwRjnSadsxXkeC07aFc
IgjiYkRxgtIvJEQHPl72neiYEzBThpdYESMwogkg5U0HkF8HaGl83jzZgDVPdoy+
wHW94fbNy+w+EvvkEtbgMmkmlDRnOANGht3hWGzFPqBAbU6445Q41xafLE8ZRijK
J7OqNaROjKN8D9INVl/A14J9eaHAB+WrRByMDnWtVkZ0iyoFhKIr7KKJhRJO3qhh
bdtlWHkAXy0e+pOgN3/H2L1gJU0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQULhHFjU7YItU1CuehVBvjunh7HYkwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQBw5xiqAZV6q1p93zWt++4Gx1HDv6Ve4xM2WEVh7wOK
S1BMoe6zx6y6iLE+CIBvoCTbidManuEPj+JBirbkNpgTygeYzzT+nDUEXxgoc34M
RkzSDfdl8R93WfAR6lUFyzRUy03t3MG/oaPF0YM1I0FypjYwC/6eDVmrlIZOHpTo
2IB7GI3zWW3E7BxHWAGT1InUHL0nkrPxwskczy9RpPK2mg/CMhs03LyJRvLI7tF1
uYIJN2EKlf8Xze216Ry+YcrRVKBPAKlBQphrlBGn2BQOzTu6wHspoqhA7a/e4oHb
UmV8nzJaUmUuRDaDxP4AFo0o8NEWnEFMT002tVt9l9hr
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const JwtPayload = verifyToken(event.authorizationToken)
    console.log('User was authorized', JwtPayload)

    return {
      principalId: JwtPayload.sub,
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
  } catch (e) {
    console.log('User authorized', e.message)

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

function verifyToken(authHeader: string): JwtPayload {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}
