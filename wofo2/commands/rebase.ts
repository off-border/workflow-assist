import { bash } from "../api/bash.js";
import { getTaskCommits, getTaskIdFromBranch } from "../api/task.js";
import { error, header, info } from "../api/msg.js";
import { loadConfig } from "../config-loader.js";

async function rebase(targetBranch: string) {
    header('REBASING');

    const taskId = await getTaskIdFromBranch();
    if (!taskId) {
        error('no task found');
        return;
    }

    const taskCommits = await getTaskCommits(taskId);
    if (!taskCommits.length) {
        error('no task commits found');
        return;
    }

    const firstCommit = taskCommits[taskCommits.length - 1].split('###')[1].trim();
    const config = await loadConfig();
    const target = targetBranch || config.branches.baseBranch;
    bash(`git fetch origin ${target}`);
    bash(`git rebase ${firstCommit}~1 --onto origin/${target}`);
}

export {
    rebase,
}