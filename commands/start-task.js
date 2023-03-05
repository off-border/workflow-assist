export function createStartTaskCommand({ api }) {
    return function startTask(taskId) {
        api.msg('STARGING TASK:', taskId);

        if (api.tasks.isTaskDirExists(taskId)) {
            api.msg('TASK DIR ALREADY EXISTS:', api.fs.resolvePath(taskId));
            return;
        }

        api.msg('STARTING TASK:', taskId);
        api.steps.updateOrigin();
        api.steps.copyOriginToTaskDir(taskId);
        api.steps.createTaskBranch(taskId);
        api.steps.installDeps(taskId);

        api.msg('TASK DIR READY:', api.fs.resolvePath(taskId));
    };
}
