import { createCommitCommand } from './commit.js';
import { createHelpCommand } from './help.js';
import { createInitCommand } from './init.js';
import { createShowCommand } from './show.js';
import { createStartTaskCommand } from './start-task.js';

export function createCommands({ config, api }) {
    const init = createInitCommand({ api, config });
    const startTask = createStartTaskCommand({ api, config });
    const commit = createCommitCommand({ api, config });
    const help = createHelpCommand({ api, config });
    const show = createShowCommand({ api, config });

    return {
        help,
        start: startTask,
        s: startTask,
        commit,
        c: startTask,
        init,
        show,
    };
}
