import { bash } from '../api/bash.js';
import { getCurrentBranch } from '../api/git.js';
import { error, header } from '../api/msg.js';
import { getCommitMessage, getTaskIdFromBranch } from '../api/task.js';
async function commit(type, message) {
    const currentBranch = getCurrentBranch();
    header('COMMITTING CHANGES');
    if (!currentBranch) {
        error('Not on a task branch');
        return;
    }
    const taskId = await getTaskIdFromBranch();
    const commitMessage = await getCommitMessage(taskId, type, message);
    bash(`git commit -m "${commitMessage}"`);
}
export { commit };
