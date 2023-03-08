import { loadConfig } from './config-loader.js';
import { createApi } from './api/api.js';
import { workflow } from './workflow.js';

async function run() {
    const config = await loadConfig();
    console.log('---config', config);
    const api = createApi({ config });
    const cmd = process.argv.slice(2).join(' ');
    workflow({ config, api }, cmd);
}

run();
