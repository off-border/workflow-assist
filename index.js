import { createApi } from './api/api.js';
import config from './config.js';
import { workflow } from './workflow.js';

const api = createApi({ config });
const cmd = process.argv.slice(2).join(' ');

workflow({ config, api }, cmd);
