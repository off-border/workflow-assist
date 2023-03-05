import { msg } from './utils.js';
import { createHelpers } from './helpers.js';
import { createCommitCommand } from './commands/cmd-commit.js';
import { createApi } from './api.js';
import { createStartTaskCommand } from './commands/start-task.js';

export function createCommands({ config, api }) {
    // function startTask(taskId) {
    //     msg('STARGING TASK:', taskId);
    //     const h = createHelpers({ config, utils, taskId });

    //     if (h.isTaskDirExists()) {
    //         msg('TASK DIR ALREADY EXISTS:', utils.resolvePath(taskId));
    //         return;
    //     }

    //     msg('STARTING TASK:', taskId);
    //     h.updateOrigin();
    //     h.copyOriginToTaskDir();
    //     h.createTaskBtanch();
    //     h.installDeps();

    //     msg('TASK DIR READY:', utils.resolvePath(taskId));
    // }

    // function commit(...args) {
    //     msg('COMMITTING');

    //     if (h.isTaskDir()) {
    //         msg('ERROR: not in a task dir');
    //     }
    // }

    // const api = createApi({ config });

    const startTask = createStartTaskCommand({ api });
    const commit = createCommitCommand({ api });

    return {
        startTask,
        commit,
    };
}
