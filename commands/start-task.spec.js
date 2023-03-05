import jest from 'jest-mock';
import { createStartTaskCommand } from './start-task';

const setup = ({
    originDirExists = true,
    taskDirExists = false,
    lowerCaseBranches = false,
}) => {
    const api = {
        msg: jest.fn(),
        tasks: {
            isTaskDirExists: () => taskDirExists,
        },
        fs: {
            resolvePath: (path) => path,
        },
        bash: jest.fn(),
        steps: {
            updateOrigin: jest.fn(),
            copyOriginToTaskDir: jest.fn(),
            createTaskBranch: jest.fn(),
            installDeps: jest.fn(),
        },
    };

    const startTask = createStartTaskCommand({ api });

    return {
        startTask,
        api,
    };
};

describe('startTask(taskId)', () => {
    describe('if task dir exists', () => {
        it('- do nothing', () => {
            const { startTask, api } = setup({ taskDirExists: true });
            startTask('TASK-1234');
            expect(api.bash).not.toHaveBeenCalled();
        });
    });
    describe('if doesn`t exist:', () => {
        it('- update origin', () => {
            const { startTask, api } = setup({ originDirExists: false });
            startTask('TASK-1234');
            expect(api.steps.updateOrigin).toHaveBeenCalled();
        });

        it('- copy origin to task dir', () => {
            const { startTask, api } = setup({ originDirExists: false });
            startTask('TASK-1234');
            expect(api.steps.copyOriginToTaskDir).toHaveBeenCalledWith(
                'TASK-1234'
            );
        });

        it('- create task branch', () => {
            const { startTask, api } = setup({ originDirExists: false });
            startTask('TASK-1234');
            expect(api.steps.createTaskBranch).toHaveBeenCalledWith(
                'TASK-1234'
            );
        });

        it('- installDeps', () => {
            const { startTask, api } = setup({ originDirExists: false });
            startTask('TASK-1234');
            expect(api.steps.installDeps).toHaveBeenCalledWith('TASK-1234');
        });
    });
});
