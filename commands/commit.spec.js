import jest from 'jest-mock';
import { createCommitCommand } from './commit';

const setup = ({ config = {} } = {}) => {
    const api = {
        tasks: {
            getCurrentTaskId: () => 'TASK-1234',
        },
        git: {
            commit: jest.fn(),
        },
        msg: jest.fn(),
    };

    const commit = createCommitCommand({ api, config });

    return {
        api,
        commit,
    };
};

describe('commit', () => {
    describe('if message not provided', () => {
        it('- show error', () => {
            const { commit, api } = setup();
            commit();
            expect(api.msg).toHaveBeenCalledWith(
                'ERROR: commit message not found'
            );
        });

        it('- skip commit', () => {
            const { commit, api } = setup();
            commit();
            expect(api.git.commit).not.toHaveBeenCalled();
        });
    });

    describe('if message is provided', () => {
        describe('format commit message:', () => {
            describe('if config.commits.taskId:', () => {
                describe('provided', () => {
                    it('- prepend taskId to the message', () => {
                        const { commit } = setup({
                            config: { commits: { taskId: {} } },
                        });
                        const { commitMessage } = commit('some message');
                        expect(commitMessage).toContain('TASK-1234');
                    });
                });

                describe('missed', () => {
                    it('- skip taskId', () => {
                        const { commit } = setup({ config: { commits: {} } });
                        const { commitMessage } = commit('some message');
                        expect(commitMessage).not.toContain('TASK-1234');
                    });
                });
            });

            describe('if config.commits.headerSeparator:', () => {
                describe('provided', () => {
                    it('- joint parts with separator', () => {
                        const { commit } = setup({
                            config: {
                                commits: { taskId: {}, headerSeparator: ' / ' },
                            },
                        });
                        const { commitMessage } = commit('some message');
                        expect(commitMessage).toContain(
                            'TASK-1234 / some message'
                        );
                    });
                });

                describe('missed', () => {
                    it('- joint parts with SPACE', () => {
                        const { commit } = setup({
                            config: { commits: { taskId: {} } },
                        });
                        const { commitMessage } = commit('some message');
                        expect(commitMessage).toContain(
                            'TASK-1234 some message'
                        );
                    });
                });
            });

            describe('if config.commits.firstWordAsCommitType:', () => {
                describe('provided', () => {
                    it('- separate first message wort to commit type field', () => {
                        const { commit } = setup({
                            config: {
                                commits: {
                                    taskId: {},
                                    headerSeparator: ' / ',
                                    firstWordAsCommitType: true,
                                },
                            },
                        });
                        const { commitMessage } = commit('some message');
                        expect(commitMessage).toContain(
                            'TASK-1234 / some / message'
                        );
                    });
                });
            });

            it('- append provided commit message', () => {
                const { commit } = setup();
                const { commitMessage } = commit('some message');
                expect(commitMessage).toContain('some message');
            });
        });

        it('- make commit', () => {
            const { commit, api } = setup();
            commit('some message');
            expect(api.git.commit).toHaveBeenCalledWith('some message');
        });
    });
});
