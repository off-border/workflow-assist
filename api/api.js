import { createFsApi } from './fs.js';
import { msg } from './msg.js';
import { bash } from './bash.js';
import { createGitApi } from './git.js';
import { createTasksApi } from './tasks.js';
import { createStepsApi } from './steps.js';

export function createApi({ config }) {
    let api = {
        msg,
        bash: bash,
    };

    api.fs = createFsApi({ api, config });

    api.git = createGitApi({ api, config });
    api.tasks = createTasksApi({ api, config });
    api.steps = createStepsApi({ api, config });

    return api;
}
