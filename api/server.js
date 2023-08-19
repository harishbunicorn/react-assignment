import Hapi from 'hapi';
import { restart } from 'nodemon';

const server = new Hapi.Server({
    host: '127.0.0.1',
    port: '8080',
    routes: {
        cors: { origin: 'ignore' },
        timeout: {
            server: 60000 * 2,
            socket: 60000 * 5,
        },
    },
});

async function main() {
  await server.register([{
    plugin: require('./shifts-mock-api'),
    routes: { prefix: '/shifts' },
  }]);

  await server.start();

  console.info(`✅  API server is listening at ${server.info.uri.toLowerCase()}`);
}

main();
