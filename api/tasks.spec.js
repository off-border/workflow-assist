import { createTasksApi } from './tasks';

const setup = ({ branchName, extractRegex, upperCase }) => {
    const config = {
        commits: {
            taskId: {
                extractRegex,
                upperCase,
            },
        },
    };
    const api = {
        git: {
            getCurrentBranch: () => branchName,
        },
    };

    const { getCurrentTaskId } = createTasksApi({ api, config });

    return {
        getCurrentTaskId,
    };
};

describe('tasks api', () => {
    describe('getCurrentTaskId()', () => {
        describe('extract task id from branch', () => {
            describe('when has config.commits.taskId', () => {
                describe('.upperCase: true ', () => {
                    it('- return uppercase branch name', () => {
                        const { getCurrentTaskId } = setup({
                            branchName: 'task-1234-some-text',
                            upperCase: true,
                        });
                        const taskId = getCurrentTaskId();
                        expect(taskId).toBe('TASK-1234-SOME-TEXT');
                    });
                });

                describe('.extractRegex: /regex/ ', () => {
                    it('- return extracted value', () => {
                        const { getCurrentTaskId } = setup({
                            branchName: 'task-1234-some-text',
                            extractRegex: /(TASK-\d+)/i,
                        });
                        const taskId = getCurrentTaskId();
                        expect(taskId).toBe('task-1234');
                    });
                });
            });

            describe('when no cofig provided', () => {
                it('- return branch name', () => {
                    const { getCurrentTaskId } = setup({
                        branchName: 'task-1234-some-text',
                    });
                    const taskId = getCurrentTaskId();
                    expect(taskId).toBe('task-1234-some-text');
                });
            });
        });
    });
});
