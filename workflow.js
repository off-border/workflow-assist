import { createCommands } from './commands/index.js';

export function workflow({ config, api }, cmdLine) {
    api.fs.createDirNotExist(config.rootDir);

    const [cmd, ...args] = cmdLine.split(' ');

    const { startTask, commit } = createCommands({ config, api });

    const commands = {
        start: startTask,
        commit,
    };

    commands[cmd](...args);
}
