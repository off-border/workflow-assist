import jest from 'jest-mock';
import { createGitApi } from './git';

const setup = () => {
    const bash = jest.fn();

    const api = {
        bash,
    };

    const git = createGitApi({ api });

    return {
        git,
        bash,
    };
};

describe('api/git', () => {
    describe('.fetch()', () => {
        it('- fetch remote branch', () => {
            const { git, bash } = setup();

            git.fetch('task-1234', { branchName: 'remote-branch' });

            expect(bash).toHaveBeenCalledWith(
                'cd task-1234 && git fetch origin remote-branch'
            );
        });
    });

    describe('.checkout()', () => {
        it('- checkout existing branch', () => {
            const { git, bash } = setup();

            git.checkout('task-1234', 'some-branch');

            expect(bash).toHaveBeenCalledWith(
                'cd task-1234 && git checkout some-branch'
            );
        });
    });

    describe('.getUpstream()', () => {
        it('- checkout existing branch', () => {
            const { git, bash } = setup();

            bash.mockReturnValue('origin/remote-branch');

            const result = git.getUpstream('task-1234');

            expect(result).toEqual({
                remoteName: 'origin',
                branchName: 'remote-branch',
            });
        });
    });

    describe('.getMergeBase()', () => {
        it('- get nearest common ancestor between 2 branches', () => {
            const { git, bash } = setup();

            bash.mockReturnValue('merge_base_commit');

            const result = git.getMergeBase('task-1234', {
                remoteName: 'origin',
                branchName: 'remote-branch',
            });

            expect(bash).toHaveBeenCalledWith(
                'cd task-1234 && git merge-base HEAD origin/remote-branch'
            );

            expect(result).toEqual('merge_base_commit');
        });
    });

    describe('.rebase()', () => {
        it('- rebase current branch onto remote branch', () => {
            const { git, bash } = setup();

            git.rebase('task-1234', {
                remoteName: 'origin',
                branchName: 'remote-branch',
                mergeBase: 'merge_base_commit',
            });

            expect(bash).toHaveBeenCalledWith(
                'cd task-1234 && git rebase merge_base_commit --onto origin/remote-branch'
            );
        });
    });
});
