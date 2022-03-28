// https://github.com/thelounge/thelounge/blob/0fb6dae8a68627cd7747ea6164ebe93390fe90f2/src/helper.js#L224

import * as os from "os"
import * as path from "path"
import config from "./config"
// Expand ~ into the current user home dir.
// This does *not* support `~other_user/tmp` => `/home/other_user/tmp`.
function getDatabasePath() {
    const fileName = "drift.sqlite"
    const databasePath = `${config.drift_home}/${fileName}` || `~/.drift/${fileName}`

    const home = os.homedir().replace("$", "$$$$");
    return path.resolve(databasePath.replace(/^~($|\/|\\)/, home + "$1"));
}

export default getDatabasePath()
