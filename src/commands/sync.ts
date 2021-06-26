import {
    ensureLinkSync,
    readFileSync,
    statSync,
    unlinkSync,
    writeFileSync,
} from 'fs-extra'
import path from 'path'
import { Command } from 'commander'
import {
    log,
    collect,
    getConfig,
    getIgnore,
} from '../utils'

const config = getConfig()
const ignore = getIgnore()

export const sync = () => {
   const dstCollection = collect(config.dst, ignore)

   for (const file of dstCollection) {
        const srcPath = path.join(config.src, file)
        const dstPath = path.join(config.dst, file)

        if (statSync(srcPath).mtimeMs > statSync(dstPath).mtimeMs) {
            unlinkSync(dstPath)
            ensureLinkSync(srcPath, dstPath)
        }
        if (statSync(srcPath).mtimeMs < statSync(dstPath).mtimeMs) {
            writeFileSync(srcPath, readFileSync(dstPath))
        }
    }
}

export default new Command('sync')
    .option('-W, --watch')
    .action((options) => {
        log.info(options.watch)
    })