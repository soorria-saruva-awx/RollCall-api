import 'dotenv/config';
import { app } from './app';
import { assertEnvVars } from './utils/env';

assertEnvVars([
  'AIRTABLE_API_KEY',
  'AIRTABLE_ENDPOINT_URL',
  'AIRTABLE_GROUPED_VIEW_ID',
]);

const port = app.get('port');

const server = app.listen(port, onListening);
server.on('error', onError);

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}

export default server;
