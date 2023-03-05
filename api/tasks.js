export function createTasksApi({ api }) {
    function isTaskDirExists(taskId) {
        return api.fs.dirExists(taskId);
    }

    return {
        isTaskDirExists,
    };
}
