export function createTasksApi({ api, config }) {
    function isTaskDirExists(taskId) {
        return api.fs.dirExists(taskId);
    }

    function getCurrentTaskId() {
        const currentBranch = api.git.getCurrentBranch();

        const casedBranch = config.commits?.taskId?.upperCase
            ? currentBranch.toUpperCase()
            : currentBranch;

        const taskId = config.commits?.taskId?.extractRegex
            ? casedBranch.match(config.commits?.taskId?.extractRegex)?.[0] ||
              currentBranch
            : casedBranch;

        return taskId;
    }

    function getTaskDir(taskId) {
        const shouldCreateTaskDir = config.copyOriginToTaskDir !== false;
        const escapedTaskId = shouldCreateTaskDir
            ? taskId.replace(/\//g, '_')
            : '.';
        return api.fs.resolveSubdir(config.rootDir, escapedTaskId);
    }

    return {
        isTaskDirExists,
        getCurrentTaskId,
        getTaskDir,
    };
}
