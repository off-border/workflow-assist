import { bash } from '../api/bash.js';
import { error, info } from '../api/msg.js';
import {
    getCommitMessage,
    getTaskCommits,
    getTaskIdFromBranch,
} from '../api/task.js';

async function squash(messageArr: string[]) {
    const taskId = await getTaskIdFromBranch();
    const taskCommits = await getTaskCommits(taskId);

    if (!taskCommits.length) {
        error('no task commits found');
        return;
    }

    const firstCommit = taskCommits[taskCommits.length - 1];
    const firstCommitSha = firstCommit.split('###')[1].trim();
    const firstCommitMessage = firstCommit.split('###')[0].trim();
    const [commitType, ...messageWords] = messageArr;
    const message = commitType
    ? await getCommitMessage(taskId, commitType, messageWords)
    : firstCommitMessage;
    
    const currentCommit = bash(`git rev-parse HEAD`, { silent: true });
    try {
        bash(`git reset --soft ${firstCommitSha}~1`);
        bash(`git commit -m "${message}"`, { allowThrow: true });
    } catch (e) {
        error('failed to squash commits');
        info('restoring last commit');
        bash(`git reset --soft ${currentCommit}`);
        info(`you can rebase manually with:`)
        info(`\n    git rebase -i ${firstCommitSha}~1\n`)
    }
}

export { squash };
