import net from 'net';
import Docker from 'dockerode';
import { PGOptions } from '../src/lib/pgOptions';

export interface Container {
  start(opts?: {}): Promise<unknown>;
  kill(opts?: {}, callback?: Function): Promise<unknown>;
  logs(opts?: {}): Promise<unknown>;
}

export const getAvailablePort = (): Promise<number> =>
  new Promise((resolve, reject) => {
    const server = net.createServer();

    server.on('error', reject);
    server.listen(() => {
      const { port } = server.address() as net.AddressInfo;

      server.close((err?: Error) => (err ? reject(err) : resolve(port)));
    });
  });

export const runPostgres = (options: Partial<PGOptions>): Promise<Container> => {
  const docker = new Docker();

  return (docker.createContainer(
    {
      Image: 'postgres:10',
      name: 'pggittest',
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,
      OpenStdin: false,
      StdinOnce: false,
      HostConfig: {
        AutoRemove: true,
        PortBindings: {
          '5432/tcp': [
            {
              HostPort: options.port.toString(),
            },
          ],
        },
      },
      Env: [
        `POSTGRES_USER=${options.user}`,
        `POSTGRES_PASSWORD=${options.password}`,
        `POSTGRES_DB=${options.database}`,
      ],
    },
    undefined,
  ) as Promise<Container>).then(async container => {
    await container.start();

    return container;
  });
};
