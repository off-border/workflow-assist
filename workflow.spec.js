import jest from 'jest-mock';
import { createApi } from './api/api.js';
import { workflow } from './workflow.js';

const config = {
    repo: 'ssh://git@test-github.com:2022/some-user/test-repo.git',
    rootDir: '~/workflow',
    originDir: '.origin',
    commands: {
        installDeps: 'make install',
    },
};

const setup = ({
    rootDirExists = true,
    originDirExists = true,
    taskDirExists = false,
    lowerCaseBranches = false,
} = {}) => {
    const tunedConfig = {
        ...config,
        branches: {
            ...config.branches,
            inLowerCase: lowerCaseBranches,
        },
    };

    const api = createApi({ config: tunedConfig });

    api.bash = jest.fn();
    api.fs.resolveSubdir = (path, file) => `${path}/${file}`;
    api.fs.dirExists = (path) =>
        path === '~/workflow'
            ? rootDirExists
            : path === '~/workflow/.origin'
            ? originDirExists
            : taskDirExists;

    const run = (cmd) => workflow({ config: tunedConfig, api }, cmd);
    return {
        run,
        api,
    };
};

describe('workflow', () => {
    describe('start TASK-1234', () => {
        describe('if task dir exists', () => {
            it('- do nothing', () => {
                const { run, api } = setup({ taskDirExists: true });

                run('start TASK-1234');

                expect(api.bash).not.toHaveBeenCalled();
            });
        });
        describe('update .origin:', () => {
            describe('if .origin doesn`t exist', () => {
                it('- clone repo', () => {
                    const { run, api } = setup({
                        originDirExists: false,
                    });
                    run('start TASK-1234');
                    expect(api.bash).toHaveBeenCalledWith(
                        `git clone ssh://git@test-github.com:2022/some-user/test-repo.git ~/workflow/.origin`
                    );
                });
            });

            describe('if .origin exists', () => {
                it('- git pull', () => {
                    const { run, api } = setup();
                    run('start TASK-1234');
                    expect(api.bash).toHaveBeenCalledWith(
                        `cd ~/workflow/.origin && git pull`
                    );
                });
            });
        });

        describe('make working copy:', () => {
            it('- copy origin', () => {
                const { run, api } = setup({});
                run('start TASK-1234');
                expect(api.bash).toHaveBeenCalledWith(
                    `cp -r ~/workflow/.origin ~/workflow/TASK-1234`
                );
            });
            it('- create task branch', () => {
                const { run, api } = setup();
                run('start TASK-1234');
                expect(api.bash).toHaveBeenCalledWith(
                    `cd ~/workflow/TASK-1234 && git checkout -b TASK-1234`
                );
            });
            it('- install deps', () => {
                const { run, api } = setup();
                run('start TASK-1234');
                expect(api.bash).toHaveBeenCalledWith(
                    `cd ~/workflow/TASK-1234 && make install`
                );
            });
            describe('if config.branches.inLowerCase: true', () => {
                it('- create lowercase branch', () => {
                    const { run, api } = setup({
                        lowerCaseBranches: true,
                    });
                    run('start TASK-1234');
                    expect(api.bash).toHaveBeenCalledWith(
                        `cd ~/workflow/TASK-1234 && git checkout -b task-1234`
                    );
                });
            });
        });
    });
});
