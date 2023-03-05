import { createHelpers } from './helpers.js';
import { createCommands } from './commands.js';

export function workflow({ config, api }, cmdLine) {
    api.fs.createDirNotExist(config.rootDir);
    // utils.setWorkingDir(config.rootDir);

    const { parseCmdLine } = createHelpers({ config, api });
    const [cmd, ...args] = parseCmdLine(cmdLine);

    const { startTask, commit } = createCommands({ config, api });

    const commands = {
        start: startTask,
        commit,
    };

    commands[cmd](...args);
}
