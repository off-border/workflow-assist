import { createCommitCommand } from './commit.js';
import { createInitCommand } from './init.js';
import { createStartTaskCommand } from './start-task.js';

export function createCommands({ config, api }) {
    const init = createInitCommand({ api, config });
    const startTask = createStartTaskCommand({ api, config });
    const commit = createCommitCommand({ api, config });

    return {
        startTask,
        commit,
        init,
    };
}
