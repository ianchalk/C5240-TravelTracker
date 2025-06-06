import {App} from './App';

const port = process.env.PORT;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbProtocol = process.env.DB_PROTOCOL;
const mongoDBConnection = dbProtocol + dbUser + ':' + encodeURIComponent(dbPassword) + process.env.DB_INFO;

console.log("server db connection URL " + mongoDBConnection);
console.log("Google OAuth configured for:", process.env.CALLBACK_URL);

let server: any = new App(mongoDBConnection).express;
server.listen(port);
console.log("server running in port " + port);