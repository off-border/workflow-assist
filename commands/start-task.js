export function createStartTaskCommand({ api, config }) {
    return function startTask(
        taskId,
        baseBranch = config.branches.baseBranch ?? 'master'
    ) {
        if (api.tasks.isTaskDirExists(taskId)) {
            api.msg('TASK DIR ALREADY EXISTS:', api.fs.resolvePath(taskId));
            return;
        }

        api.msg('STARTING TASK:', taskId);
        api.steps.updateOrigin();

        const shouldCreateTaskDir = config.copyOriginToTaskDir !== false;
        if (shouldCreateTaskDir) api.steps.copyOriginToTaskDir(taskId);

        api.steps.checkoutRemoteBranch(taskId, baseBranch);
        api.steps.createTaskBranch(taskId);
        api.steps.runTaskCopyReadyHook(taskId);

        api.msg('TASK DIR READY:', api.fs.resolvePath(taskId));
    };
}
