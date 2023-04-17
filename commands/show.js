export function createShowCommand({ api, config }) {
    return function show(target) {
        if (target === 'config') {
            console.log('Workspace config: \n\n', config, '\n\n');
        }
    };
}
