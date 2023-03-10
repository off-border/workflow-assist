export function createStartTaskCommand({ api, config }) {
    return function startTask(taskId) {
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
