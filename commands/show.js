export function createShowCommand({ api, config }) {
    return function show(target) {
        const targets = {
            config: () => {
                api.msg('Workspace config: \n\n', config, '\n');
            },
            task: () => {
                api.msg('Current task:', api.tasks.getCurrentTaskId(), '\n');
            },
        };
        if (targets[target]) {
            targets[target]();
        } else {
            api.msg(
                'unknown show param \n usage: wofo show',
                Object.keys(targets).join('|'),
                '\n'
            );
        }
    };
}
