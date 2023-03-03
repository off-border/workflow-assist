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
    originDirExists = true,
    taskDirExists = false,
    lowerCaseBranches = false,
} = {}) => {
    const shellCommands = [];

    const utils = {
        createDirNotExist: () => {},
        setWorkingDir: () => {},
        resolvePath: (dir) => dir,
        bash: (cmd) => shellCommands.push(cmd),
        dirExists: (path) => {
            return path === config.originDir ? originDirExists : taskDirExists;
        },
    };

    const tunedConfig = {
        ...config,
        branches: {
            ...config.branches,
            inLowerCase: lowerCaseBranches,
        },
    };

    const run = (cmd) => workflow({ config: tunedConfig, utils }, cmd);
    const getShell = () => shellCommands;

    return {
        run,
        getShell,
    };
};

describe('workflow', () => {
    describe('start TASK-1234', () => {
        describe('if task dir exists', () => {
            it('- do nothing', () => {
                const { run, getShell } = setup({ taskDirExists: true });

                run('start TASK-1234');

                expect(getShell()).toEqual([]);
            });
        });
        describe('update .origin:', () => {
            describe('if .origin doesn`t exist', () => {
                it('- clone repo', () => {
                    const { run, getShell } = setup({
                        originDirExists: false,
                    });

                    run('start TASK-1234');

                    expect(getShell()[0]).toEqual(
                        `git clone ssh://git@test-github.com:2022/some-user/test-repo.git .origin`
                    );
                });
            });

            describe('if .origin exists', () => {
                it('- git pull', () => {
                    const { run, getShell } = setup();

                    run('start TASK-1234');

                    expect(getShell()[0]).toEqual(`cd .origin && git pull`);
                });
            });
        });

        describe('make working copy:', () => {
            it('- copy origin', () => {
                const { run, getShell } = setup();

                run('start TASK-1234');

                expect(getShell()[1]).toEqual(`cp -r .origin TASK-1234`);
            });

            it('- create task branch', () => {
                const { run, getShell } = setup();

                run('start TASK-1234');

                expect(getShell()[2]).toEqual(
                    `cd TASK-1234 && git checkout -b TASK-1234`
                );
            });

            it('- install deps', () => {
                const { run, getShell } = setup();

                run('start TASK-1234');

                expect(getShell()[3]).toEqual(`cd TASK-1234 && make install`);
            });

            describe('if config.branches.inLowerCase: true', () => {
                it('- create lowercase branch', () => {
                    const { run, getShell } = setup({
                        lowerCaseBranches: true,
                    });

                    run('start TASK-1234');

                    expect(getShell()[2]).toEqual(
                        `cd TASK-1234 && git checkout -b task-1234`
                    );
                });
            });
        });
    });
});
