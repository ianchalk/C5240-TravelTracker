import {App} from './App';
import * as dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 8080;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbProtocol = process.env.DB_PROTOCOL;
const mongoDBConnection = dbProtocol + dbUser + ':' + encodeURIComponent(dbPassword) + process.env.DB_INFO;
const sessionSecret = process.env.SESSION_SECRET || 'your-session-secret';
console.log("server db connection URL " + mongoDBConnection);
console.log("Google OAuth configured for:", process.env.CALLBACK_URL);

let server: any = new App(mongoDBConnection, sessionSecret).express;
server.listen(port);
console.log("server running in port " + port);