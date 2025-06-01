const version = 'v1';
const port = '5000';
const path = `http://localhost:${port}/api/${version}`;

export const environment = {
    loginUrl: `${path}/user/login`,
    registerUrl: `${path}/user/register`,
    botUrl: `${path}/bots/`,
    messagesUrl: `${path}/messages/`
}