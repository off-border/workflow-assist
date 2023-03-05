import * as fsApi from './api/fs.js';
import { bash } from './api/bash.js';
import { createGitApi } from './api/git.js';
import { msg } from './api/msg.js';

export function createApi({ config }) {
    let api = {
        msg,
        fs: fsApi,
        bash: bash,
    };

    api.git = createGitApi({ api });
    return api;
}
