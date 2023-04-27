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
            checkoutRemoteBranch: jest.fn(),
            createTaskBranch: jest.fn(),
            runTaskDirReadyHook: jest.fn(),
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

        it('- runTaskDirReadyHook', () => {
            const { startTask, api } = setup({ originDirExists: false });
            startTask('TASK-1234');
            expect(api.steps.runTaskDirReadyHook).toHaveBeenCalledWith(
                'TASK-1234'
            );
        });
    });
});

describe('startTask(taskId, fromBranch)', () => {
    it('- derive task from specified remote branch', () => {
        const { startTask, api } = setup({});
        startTask('TASK-1234', 'remote-branch');

        expect(api.steps.checkoutRemoteBranch).toHaveBeenCalledWith(
            'TASK-1234',
            'remote-branch'
        );
    });
});
