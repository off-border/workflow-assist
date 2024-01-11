import { join } from 'path';
import { loadConfig } from '../config-loader.js';
import { error, header, info } from '../api/msg.js';
import { dirExists, resolvePath } from '../api/fs.js';
import { bash } from '../api/bash.js';
import { branchExists } from '../api/git.js';
import { getTaskDir } from '../api/task.js';

async function startNewTask(taskId: string) {
    header(`STARTING NEW TASK: ${taskId}`);
    await cloneOrUpdateRepo();
    await createWorkingCopy(taskId);
}

async function cloneOrUpdateRepo() {
    const config = await loadConfig();
    const repoUrl = config.repo;
    const rootDir = resolvePath(config.rootDir);
    const originDir = join(rootDir, config.originDir);
    const baseBranch = config.branches.baseBranch;
    const originUpdatedHook = config.hooks.originUpdated;

    if (dirExists(originDir)) {
        header('updating origin repo');
        bash(`git checkout ${baseBranch}`, { cwd: originDir });
    } else {
        header('cloning origin repo');
        bash(`git clone ${repoUrl} ${originDir}`);
        bash(`git checkout -b ${baseBranch}`, { cwd: originDir });
        bash(`git push --set-upstream origin ${baseBranch}`, {
            cwd: originDir,
        });
    }

    bash(`git fetch origin ${baseBranch}`, { cwd: originDir });
    bash(`git reset --hard origin/${baseBranch}`, { cwd: originDir });

    if (originUpdatedHook) {
        header('running originUpdatedHook');
        for (const cmd of originUpdatedHook) {
            bash(cmd, { cwd: originDir });
        }
    }
}

async function createWorkingCopy(TaskId: string) {
    const config = await loadConfig();
    const rootDir = resolvePath(config.rootDir);
    const originDir = join(rootDir, config.originDir);
    const taskBranch = config.branches.inLowerCase
        ? TaskId.toLowerCase()
        : TaskId;
    const shouldCopyDir = config.copyOriginToTask !== false;
    const taskDir = await getTaskDir(taskBranch);
    const taskDirExists = dirExists(taskDir);
    const taskBranchExists =
        taskDirExists && branchExists(taskBranch, { cwd: originDir });
    const taskCopyReadyHook = config.hooks.taskCopyReady;

    if (taskBranch.length > (config.branches.maxLength || Infinity)) {
        error(
            `Branch name "${taskBranch}" is too long (${taskBranch.length}).`,
            `Max length is ${config.branches.maxLength}`
        );
        return;
    }

    header('creating working copy');
    info('---taskDir', taskDir);

    if (taskBranchExists) {
        header('task branch already exists');
        return;
    }

    if (shouldCopyDir && !taskDirExists) {
        header('copying origin to task dir');
        bash(`cp -r ${originDir} ${taskDir}`);
    }

    header('checking out new branch');
    bash(`git checkout -b ${taskBranch}`, { cwd: taskDir });
    info('working copy created in:', taskDir);

    if (taskCopyReadyHook) {
        header('running taskCopyReadyHook');
        process.env.TASK_DIR = taskDir;
        for (const cmd of taskCopyReadyHook) {
            bash(cmd, { cwd: originDir });
        }
    }
}

export { startNewTask };
