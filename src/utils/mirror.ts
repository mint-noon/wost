import {
    statSync,
    unlinkSync,
    readFileSync,
    writeFileSync,
    ensureLinkSync,
} from 'fs-extra'
import path from 'path'
import collect from './collect'


const mirror = (src: string, dst: string, ignore: string[]) => {
    const dstCollection = collect(dst, ignore)

    for (const file of dstCollection) {
        const srcPath = path.join(src, file)
        const dstPath = path.join(dst, file)

        const srcStat = statSync(srcPath)
        const dstStat = statSync(dstPath)

        if (srcStat.mtimeMs < dstStat.mtimeMs) {
            writeFileSync(srcPath, readFileSync(dstPath))
        }
        if (
            srcStat.mtimeMs > dstStat.mtimeMs ||
            srcStat.size !== dstStat.size
            ) {
            unlinkSync(dstPath)
            ensureLinkSync(srcPath, dstPath)
        }
    }
}

export default mirror