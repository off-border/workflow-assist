import { program } from 'commander';
import { join } from 'path';
import { loadConfig } from './config-loader.js';
import { dirExists, resolvePath } from './api/fs.js';
import { bash } from './api/bash.js';
import { header, info } from './api/msg.js';
import { branchExists } from './api/git.js';

program.name('wofo2').version('1.0.0');
program
    .command('start')
    .description(
        'start new task (create working copy, task branch, and install deps)'
    )
    .argument('<taskId>', 'JIRA task id')
    .action(startNewTask);

program.parse(process.argv);

async function startNewTask(taskId: string) {
    header(`STARTING NEW TASK: ${taskId}`);
    const config = await loadConfig();
    const rootDir = resolvePath(config.rootDir);
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

    console.log('---config', config);
    console.log('---rootDir', rootDir);
    console.log('---originDir', originDir);

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
    const taskBranch = `${TaskId}`;
    const escapedTaskBranch = taskBranch.replace(/\//g, '_');
    const shouldCopyDir = config.copyOriginToTask !== false;
    const taskDir = shouldCopyDir
        ? join(rootDir, escapedTaskBranch)
        : originDir;
    const taskDirExists = dirExists(taskDir);
    const taskCopyReadyHook = config.hooks.taskCopyReady;

    header('creating working copy');

    console.log('---taskDir', taskDir);
    
    
    if (branchExists(taskBranch, { cwd: originDir })) {
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
