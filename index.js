import config from './config.js';
import * as utils from './utils.js'
import { workflow } from './workflow.js';

const cmd = process.argv.slice(2).join(' ');

workflow({ config, utils })(cmd);