import { createHelpers } from './helpers.js';
import { createCommands } from './commands.js';




export function workflow ({ config, utils }, cmdLine) {
        utils.createDirNotExist(config.rootDir);
        utils.setWorkingDir(config.rootDir);

        const { parseCmdLine } = createHelpers({ config, utils })
        const [cmd, ...args] = parseCmdLine(cmdLine);
        
        const { startTask } = createCommands({ config, utils });
        const commands = {
            start: startTask,
        };

        commands[cmd](...args);
    };
