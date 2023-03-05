export function createCommitCommand({ api }) {
    return function commit(message) {
        api.msg('COMMITTING');

        if (!message) {
            api.msg('ERROR: commit message not found');
            return;
        }

        const taskId = api.tasks.getCurrentTaskId();
        const commitMessage = `${taskId} | ${message}`;

        api.git.commit(commitMessage);

        return {
            commitMessage,
        };
    };
}
