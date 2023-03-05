import { createFsApi } from './api/fs.js';
import { msg } from './api/msg.js';
import { bash } from './api/bash.js';
import { createGitApi } from './api/git.js';
import { createTasksApi } from './api/tasks.js';
import { createStepsApi } from './api/steps.js';

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
