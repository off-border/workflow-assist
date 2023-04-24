import jest from 'jest-mock';
import { createRebaseCommand } from './rebase';

const setup = ({ config = {} } = {}) => {
    const api = {
        fs: {
            getCurrentDir: () => 'task-1234',
        },
        git: {
            getUpstream: () => ({
                remoteName: 'origin',
                branchName: 'remote-branch',
            }),
            fetch: jest.fn(),
            rebase: jest.fn(),
        },
        msg: jest.fn(),
    };

    const rebase = createRebaseCommand({ api, config });

    return {
        api,
        rebase,
    };
};

describe('commands/rebase', () => {
    it('fetch remote branch', () => {
        const { rebase, api } = setup();

        rebase('task-1234');

        expect(api.git.fetch).toHaveBeenCalledWith('task-1234', {
            remoteName: 'origin',
            branchName: 'remote-branch',
        });
    });

    it('rebase on remote branch', () => {
        const { rebase, api } = setup();

        rebase('task-1234');

        expect(api.git.rebase).toHaveBeenCalledWith('task-1234', {
            remoteName: 'origin',
            branchName: 'remote-branch',
        });
    });
});
