import { createCommands } from './commands/index.js';

export function workflow({ config, api }, cmdLine) {
    const [cmd, ...args] = cmdLine.split(' ');

    const commands = createCommands({ config, api });

    const handler = commands[cmd] || commands['help'];

    handler(...args);
}
