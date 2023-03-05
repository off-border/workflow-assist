import { createCommitCommand } from "./cmd-commit";

const setup = () => {
    const commit = createCommitCommand({});

    return {
        commit,
    }

};

describe('commit', () => {
    describe('if message not provided', () => {
        it('show error', () => {
            const { commit } = setup();

            const { error } = commit();

            expect(error).toBe('commit message not found')
        });
    });

    // describe('if message is provided', () => {
    //     it('append task name to the message', () => {
    //         const { commit } = setup({ taskId: 'TASK-1234' });

    //         const { commitMessage } = commit('some message');

    //         expect(commitMessage).toContain('TASK-1234');
    //     });
    // });
});