import { workflow } from "./workflow.js";

const config = {
    repo: "ssh://git@test-github.com:2022/some-user/test-repo.git",
    rootDir: '~/workflow',
    originDir: ".origin",
    commands: {
        installDeps: 'make install'
    }
};

const setup = ({ originDirExists = true, taskDirExists = false }) => {
    const shellCommands = [];

    const utils = {
        setWorkingDir: () => {},
        bash: (cmd) => shellCommands.push(cmd),
        dirExists: (path) => {
            const exists =
                path === config.originDir ? originDirExists : taskDirExists;

            console.log("--- dirExists", path, exists);

            return exists;
        },
    };

    const run = (cmd) => {
        workflow({ config, utils })(cmd);
    };

    const getShell = () => shellCommands;

    return {
        run,
        getShell,
    };
};

describe("workflow", () => {
    describe("start", () => {
        describe("workflow start TASK-1234", () => {
            describe('if task dir exists', () => {
                it('do nothing', () => {
                    const { run, getShell } = setup({ taskDirExists: true });
        
                    run("start TASK-1234");
        
                    expect(getShell()).toEqual([]);
                });
            });
            describe("update .origin:", () => {
                describe("if .origin doesn`t exist", () => {
                    it("- clone repo", () => {
                        const { run, getShell } = setup({
                            originDirExists: false,
                        });

                        run("start TASK-1234");

                        expect(getShell()[0]).toEqual(
                            `git clone ssh://git@test-github.com:2022/some-user/test-repo.git .origin`
                        );
                    });
                });

                describe("if .origin exists", () => {
                    it("- git pull", () => {
                        const { run, getShell } = setup({
                            originDirExists: true,
                        });

                        run("start TASK-1234");

                        expect(getShell()[0]).toEqual(`cd .origin && git pull`);
                    });
                });
            });

            describe('make working copy:', () => {
                it("- copy origin", () => {
                    const { run, getShell } = setup({ originDirExists: true });
        
                    run("start TASK-1234");
        
                    expect(getShell()[1]).toEqual(`cp .origin TASK-1234`);
                });

                it('install deps', () => {
                    const { run, getShell } = setup({ originDirExists: true });
        
                    run("start TASK-1234");
        
                    expect(getShell()[2]).toEqual(`cd TASK-1234 && make install`);
                });
            });
        });
    });
});
