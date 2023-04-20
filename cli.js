#!/usr/bin/env node

import { loadConfig } from './utils/config-loader/config-loader.js';
import { createApi } from './api/api.js';
import { workflow } from './workflow.js';

async function run() {
    const config = await loadConfig();
    const api = createApi({ config });
    const cmd = process.argv.slice(2).join(' ');
    workflow({ config, api }, cmd);
}

run();
