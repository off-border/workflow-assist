import jest from 'jest-mock';
import { createStepsApi } from './steps';

const setup = ({ installDeps }) => {
    const config = {
        commands: {
            installDeps,
        },
    };

    const bash = jest.fn();

    const api = {
        msg: () => {},
        bash,
        fs: {
            resolveSubdir: (dir, subdir) => subdir,
        },
    };

    const steps = createStepsApi({ api, config });

    return {
        steps,
        bash,
    };
};

describe('api/steps', () => {
    describe('installDeps', () => {
        describe('if commands.installDeps config provided', () => {
            describe('if is a string', () => {
                it('execute this line', () => {
                    const { steps, bash } = setup({ installDeps: 'npm i' });

                    steps.installDeps('task-1234');

                    expect(bash).toHaveBeenCalledWith('cd task-1234 && npm i');
                });
            });

            describe('if is an array of string', () => {
                it('execute each line', () => {
                    const { steps, bash } = setup({
                        installDeps: ['npm i', 'run test'],
                    });

                    steps.installDeps('task-1234');

                    expect(bash).toHaveBeenCalledWith(
                        'cd task-1234 && npm i && run test'
                    );
                });
            });
        });
    });
});
