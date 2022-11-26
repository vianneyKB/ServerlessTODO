// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'hs7iz7ogwe';
export const apiEndpoint = `https://${apiId}.execute-api.us-west-2.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-xgy61617ogag3jn1.us.auth0.com',            // Auth0 domain
  clientId: 'N6LFAX0iAeZWGwv2twDN70pAPzyajmic',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
};
