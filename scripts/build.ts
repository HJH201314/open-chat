import concurrently from 'concurrently';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as os from 'node:os';

const colorConsole = {
  info: (...args: any[]) => {
    console.log(
      `\x1B[34m[open-chat] ${'%s'.repeat(args.length)}\x1B[0m`,
      ...args
    );
  },
  warn: (...args: any[]) => {
    console.log(
      `\x1B[33m[open-chat] ${'%s'.repeat(args.length)}\x1B[0m`,
      ...args
    );
  },
  success: (...args: any[]) => {
    console.log(
      `\x1B[32m[open-chat] ${'%s'.repeat(args.length)}\x1B[0m`,
      ...args
    );
  },
  error: (...args: any[]) => {
    console.log(
      `\x1B[31m[open-chat] ${'%s'.repeat(args.length)}\x1B[0m`,
      ...args
    );
  },
};

// Build client and server using concurrently
colorConsole.info('Start Building...');
const platform = os.platform();
let buildCommands: string[];

if (platform === 'win32') {
  buildCommands = [
    'cd ../server',
    'set GOOS=linux GOARCH=amd64 && go build -o dist\\FChat_linux_amd64',
    'set GOOS=darwin GOARCH=amd64 && go build -o dist\\FChat_darwin_amd64',
    'set GOOS=windows GOARCH=amd64 && go build -o dist\\FChat_windows_amd64.exe'
  ];
} else {
  buildCommands = [
    'cd ../server',
    'GOOS=linux GOARCH=amd64 go build -o dist/FChat_linux_amd64',
    'GOOS=darwin GOARCH=amd64 go build -o dist/FChat_darwin_amd64',
    'GOOS=windows GOARCH=amd64 go build -o dist/FChat_windows_amd64.exe'
  ];
}

const {result} = concurrently(
  [
    {command: 'pnpm run build:client', name: 'client'},
    {
      command: buildCommands.join(' && '),
      name: 'server'
    },
  ],
  {
    prefix: 'build-{name}',
    killOthers: ['failure'],
    restartTries: 1,
    cwd: path.resolve(__dirname, './'),
  }
);

result
  .then(() => {
    // Concurrent tasks are completed
    colorConsole.info('✓ Build Completed.');

    try {
      // Copy file to ./dist
      colorConsole.info('Start Copying Dist Files...');
      fs.cpSync(
        path.resolve(__dirname, './client/dist'),
        path.resolve(__dirname, './dist/client'),
        {recursive: true}
      );
      fs.cpSync(
        path.resolve(__dirname, './server/dist'),
        path.resolve(__dirname, './dist/server'),
        {recursive: true}
      );

      colorConsole.success('✓ Copy Completed.');
    } catch (e) {
      colorConsole.error(e);
    }
  })
  .catch((e: any) => {
    // Error during concurrent tasks
    colorConsole.error(e);
  });
