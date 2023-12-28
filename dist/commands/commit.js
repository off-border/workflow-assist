import { bash } from '../api/bash.js';
import { getCurrentBranch } from '../api/git.js';
import { error, header } from '../api/msg.js';
import { getTaskIdFromBranch } from '../api/task.js';
import { loadConfig } from '../config-loader.js';
async function commit(type, message) {
    const config = await loadConfig();
    const currentBranch = getCurrentBranch();
    header('COMMITTING CHANGES');
    if (!currentBranch) {
        error('Not on a task branch');
        return;
    }
    const taskId = await getTaskIdFromBranch(currentBranch);
    const headerSeparator = config.commits.headerSeparator || ' ';
    const firstWordAsCommitType = config.commits.firstWordAsCommitType;
    let commitMessage = config.commits.taskId
        ? `${taskId}${headerSeparator}${type}`
        : `${type}`;
    if (firstWordAsCommitType) {
        commitMessage += `${headerSeparator}`;
    }
    else {
        commitMessage += ' ';
    }
    commitMessage += `${message.join(' ')}`;
    bash(`git commit -m "${commitMessage}"`);
}
export { commit };
