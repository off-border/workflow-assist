import { program } from 'commander';
import { startNewTask } from './commands/start.js';
import { commit } from './commands/commit.js';

program.name('wofo2').version('1.0.0');

program
    .command('start')
    .description(
        'start new task (create working copy, task branch, and install deps)'
    )
    .argument('<taskId>', 'JIRA task id')
    .action(startNewTask);

program
    .command('commit')
    .description('commit changes to task branch')
    .argument('<type>', 'type of the commit (fix, feat, refc, etc')
    .argument('<message...>', 'commit message')
    .action(commit);

program.parse(process.argv);
