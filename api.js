import * as fsApi from './api/fs.js';
import { msg } from './api/msg.js';
import { bash } from './api/bash.js';
import { createGitApi } from './api/git.js';
import { createTasksApi } from './api/tasks.js';

export function createApi({ config }) {
    let api = {
        msg,
        fs: fsApi,
        bash: bash,
    };

    api.git = createGitApi({ api, config });
    api.tasks = createTasksApi({ api, config });

    return api;
}
