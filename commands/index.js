import { createCommitCommand } from './commit.js';
import { createStartTaskCommand } from './start-task.js';

export function createCommands({ config, api }) {
    const startTask = createStartTaskCommand({ api });
    const commit = createCommitCommand({ api });

    return {
        startTask,
        commit,
    };
}
