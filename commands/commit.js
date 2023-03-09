export function createCommitCommand({ api }) {
    return function commit(...messageArr) {
        api.msg('COMMITTING');

        if (!messageArr.length) {
            api.msg('ERROR: commit message not found');
            return;
        }

        const taskId = api.tasks.getCurrentTaskId();
        const commitMessage = `${taskId} | ${messageArr.join(' ')}`;

        api.git.commit(commitMessage);

        return {
            commitMessage,
        };
    };
}
