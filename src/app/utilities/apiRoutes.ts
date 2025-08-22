const version = 'v1';
const port = '7152';
const baseRoute = `https://localhost:${port}/api/${version}`;

export const apiRoutes = {
    login: `${baseRoute}/user/login`,
    register: `${baseRoute}/user/register`,
    bot: `${baseRoute}/bots/`,
    messages: `${baseRoute}/messages/`
}