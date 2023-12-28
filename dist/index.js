#!/usr/bin/env node
import { Argument, program } from 'commander';
import { startNewTask } from './commands/start.js';
import { commit } from './commands/commit.js';
import { rebase } from './commands/rebase.js';
import { loadConfig } from './config-loader.js';
import { info } from './api/msg.js';
import { getTaskIdFromBranch } from './api/task.js';
import { getCurrentBranch } from './api/git.js';
program.name('wofo2').version('1.0.0');
program
    .command('start')
    .description('start new task (create working copy, task branch, and install deps)')
    .argument('<taskId>', 'JIRA task id')
    .action(startNewTask)
    .showHelpAfterError();
program
    .command('commit')
    .description('commit changes to task branch')
    .argument('<type>', 'type of the commit (fix, feat, refc, etc')
    .argument('<message...>', 'commit message')
    .action(commit)
    .showHelpAfterError();
program
    .command('rebase')
    .description('smart rebase branch onto another branch')
    .argument('[targetBranch]', 'branch to rebase onto (default: config.branches.baseBranch)')
    .action(rebase);
program
    .command('show')
    .description('show additional info')
    .addArgument(new Argument('<topic>', 'topic to show').choices(['config', 'task']))
    .action(async (topic) => {
    const config = await loadConfig();
    switch (topic) {
        case 'config':
            info('current config:');
            console.log(config);
            return;
        case 'task':
            const currentBranch = getCurrentBranch();
            const taskId = await getTaskIdFromBranch(currentBranch || '');
            info('current task:');
            console.log(taskId);
            return;
    }
})
    .showHelpAfterError();
program.parse(process.argv);
