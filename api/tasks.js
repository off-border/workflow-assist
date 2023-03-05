export function createTasksApi({ api }) {
    function isTaskDirExists(taskId) {
        return api.fs.dirExists(taskId);
    }

    function getCurrentTaskId() {
        return api.git.getCurrentBranch().toUpperCase();
    }

    return {
        isTaskDirExists,
        getCurrentTaskId,
    };
}
