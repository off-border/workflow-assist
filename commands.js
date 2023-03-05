import { createCommitCommand } from './commands/cmd-commit.js';
import { createStartTaskCommand } from './commands/start-task.js';

export function createCommands({ config, api }) {
    const startTask = createStartTaskCommand({ api });
    const commit = createCommitCommand({ api });

    return {
        startTask,
        commit,
    };
}
