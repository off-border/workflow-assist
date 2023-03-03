import { createHelpers } from './helpers.js';
import { createCommands } from './commands.js';




export function workflow ({ config, utils }, cmdLine) {
        const { parseCmdLine } = createHelpers({ config, utils })
        const { startTask } = createCommands({ config, utils });

        const [cmd, ...args] = parseCmdLine(cmdLine);

        const handlers = {
            start: startTask,
        };

        utils.createDirNotExist(config.rootDir);
        utils.setWorkingDir(config.rootDir);

        handlers[cmd](...args);
    };
