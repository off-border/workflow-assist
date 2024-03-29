#!/usr/bin/env node
import { Argument, program } from 'commander';
import { startNewTask } from './commands/start.js';
import { commit } from './commands/commit.js';
import { rebase } from './commands/rebase.js';
import { squash } from './commands/squash.js';
import { loadConfig } from './config-loader.js';
import { info } from './api/msg.js';
import { getTaskIdFromBranch } from './api/task.js';
import { getCurrentBranch } from './api/git.js';
program.name('wofo2').version('1.0.0');
program
    .command('start')
    .description('start new task (create working copy, task branch, and install deps)')
    .argument('<taskId>', 'JIRA task id')
    .argument('[branch]', 'branch to start from')
    .showHelpAfterError()
    .action(startNewTask);
program
    .command('commit')
    .description('commit changes to task branch')
    .argument('[type]', 'type of the commit (fix, feat, refc, etc)')
    .argument('<message...>', 'commit message. can be porvided without " " around it')
    .showHelpAfterError()
    .action(commit);
program
    .command('rebase')
    .description('smart rebase branch onto targetBranch')
    .argument('[targetBranch]', 'branch to rebase onto (default: config.branches.baseBranch)')
    .showHelpAfterError()
    .action(rebase);
//add squash command
program
    .command('squash')
    .description('squash commits of the task into one')
    .argument('[type]', 'commit type')
    .argument('[message...]', 'commit message')
    .showHelpAfterError()
    .action(squash);
program
    .command('show')
    .description('show additional info')
    .addArgument(new Argument('<topic>', 'topic to show').choices(['config', 'task']))
    .showHelpAfterError()
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
});
program.parse(process.argv);
