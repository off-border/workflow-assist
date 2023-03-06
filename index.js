import { loadConfig } from './config-loader.js';
import { createApi } from './api/api.js';
import { workflow } from './workflow.js';

const config = loadConfig();
const api = createApi({ config });
const cmd = process.argv.slice(2).join(' ');

workflow({ config, api }, cmd);
