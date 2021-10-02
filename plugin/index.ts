import { Compilation, Compiler } from 'webpack'
import archiver from 'archiver'
import * as path from 'path'
import * as fs from 'fs'

export interface ChromeExtensionArchiveWebpackPluginOptions {
    /**
     * Specifies the compressing algorithm
     * 
     * default: 'zip'
     */
    algorithm: archiver.Format

    /**
     * Output path of the archive
     * 
     */
    filename: string

    /**
     * Glob of files to include
     */
    directory: string
}

class ChromeExtensionArchiveWebpackPlugin {
    private archive: archiver.Archiver

    constructor(options: ChromeExtensionArchiveWebpackPluginOptions) {
        const { algorithm, directory } = options
        const filename = options.filename ? options.filename : path.parse(directory).name

        const archive = archiver(algorithm, {
            zlib: {
                level: 9
            },
        })

        const output = fs.createWriteStream(path.join(__dirname, filename))
        archive.pipe(output)
        archive.directory(directory, directory)

        this.archive = archive
    }

    apply(compiler: Compiler): void {
        const pluginName = this.constructor.name;

        compiler.hooks.thisCompilation.tap(pluginName, (compilation: Compilation) => {
            compilation.hooks.processAssets.tapPromise({
                name: pluginName
            }, async (_): Promise<void> => {
                this.archive.finalize()
            })
            return
        })
    }
}

export default ChromeExtensionArchiveWebpackPlugin
