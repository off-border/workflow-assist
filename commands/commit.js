export function createCommitCommand({ api, config }) {
    return function commit(...messageArr) {
        api.msg('COMMITTING');

        const mesasgeWords = messageArr.join(' ').split(' ');

        if (!messageArr.length) {
            api.msg('ERROR: commit message not found');
            return;
        }

        const separator = config.commits?.headerSeparator || ' ';
        let commitMessage = '';

        if (config.commits?.taskId) {
            const taskId = api.tasks.getCurrentTaskId();
            commitMessage += taskId + separator;
        }

        if (config.commits?.firstWordAsCommitType) {
            const useFirstWord = !messageArr.join(' ').includes(separator);
            if (useFirstWord) {
                const commitType = mesasgeWords.shift();
                commitMessage += commitType + separator;
            }
        }

        commitMessage += mesasgeWords.join(' ');

        // const taskId = api.tasks.getCurrentTaskId();
        // const commitMessage = `${taskId} | ${messageArr.join(' ')}`;

        api.git.commit(commitMessage);

        return {
            commitMessage,
        };
    };
}
