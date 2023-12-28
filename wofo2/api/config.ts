import { join } from "path";
import { loadConfig } from "../../utils/config-loader/config-loader";
import { resolvePath, dirExists } from "./fs.js";

async function getBaseBranch() {
    const config = await loadConfig();
    return config.branches.baseBranch;
}