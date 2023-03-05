import { createHelpers } from "../helpers";

export function createCommitCommand({ config, utils }) {
    // console.log('---createCommitCommand', );
    const h = createHelpers({ config, utils });
    
    return function commit(message) {
        console.log('---COMMIT', );
        if (!message) {
            return {
                error: 'commit message not found'
            }
        }

        const commitMessage = h.getCurrentTaskId();
        
    }
}