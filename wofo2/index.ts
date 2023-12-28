import { program } from 'commander';
import { startNewTask } from './commands/start.js';

program.name('wofo2').version('1.0.0');
program
    .command('start')
    .description(
        'start new task (create working copy, task branch, and install deps)'
    )
    .argument('<taskId>', 'JIRA task id')
    .action(startNewTask);

program.parse(process.argv);

