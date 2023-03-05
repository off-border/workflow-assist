import { createApi } from './api.js';
import config from './config.js';
import * as utils from './utils.js';
import { workflow } from './workflow.js';

const api = createApi({ config });
const cmd = process.argv.slice(2).join(' ');

workflow({ config, api }, cmd);
