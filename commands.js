import { msg } from './utils.js';
import { createHelpers } from './helpers.js';

export function createCommands({ config, utils }) {
    function startTask(taskId) {
        const h = createHelpers({ config, utils, taskId });

        if (h.isTaskDirExists()) {
            msg('TASK DIR ALREADY EXISTS:', utils.resolvePath(taskId));
            return;
        }

        msg('STARTING TASK:', taskId);
        h.updateOrigin();
        h.copyOriginToTaskDir();
        h.createTaskBtanch();
        h.installDeps();

        msg('TASK DIR READY:', utils.resolvePath(taskId));
    }

    return {
        startTask,
    };
}
