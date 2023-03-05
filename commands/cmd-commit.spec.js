import jest from 'jest-mock';
import { createCommitCommand } from './cmd-commit';

const setup = ({ taskId } = {}) => {
    const api = {
        git: {
            getCurrentTaskId: () => taskId,
            commit: jest.fn(),
        },
        msg: jest.fn(),
    };

    const commit = createCommitCommand({ api });

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
            expect(api.msg).toHaveBeenCalledWith('ERROR: commit message not found');
        });

        it('- skip commit', () => {
            const { commit, api } = setup();
            commit();
            expect(api.git.commit).not.toHaveBeenCalled();
        });
    });

    describe('if message is provided', () => {
        describe('format commit message:', () => {
            it('- prepend task name to the message', () => {
                const { commit } = setup({ taskId: 'TASK-1234' });
                const { commitMessage } = commit('some message');
                expect(commitMessage).toContain('TASK-1234');
            });
    
            it('- append provided commit message', () => {
                const { commit } = setup({ taskId: 'TASK-1234' });
                const { commitMessage } = commit('some message');
                expect(commitMessage).toContain('some message');
            });
        });
        

        it('- make commit', () => {
            const { commit, api } = setup({ taskId: 'TASK-1234' });
            commit('some message');
            expect(api.git.commit).toHaveBeenCalledWith('TASK-1234 | some message');
        });
    });
});
