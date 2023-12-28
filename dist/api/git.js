import { bash } from './bash.js';
function branchExists(branchName, { cwd = process.cwd() }) {
    return bash(`git branch --list ${branchName}`, { cwd })?.trim() !== '';
}
function getCurrentBranch({ cwd = process.cwd() } = {}) {
    return bash(`git branch --show-current`, { cwd });
}
export { branchExists, getCurrentBranch, };
