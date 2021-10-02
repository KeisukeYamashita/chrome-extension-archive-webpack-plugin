import { Compiler } from 'webpack'
import archiver from 'archiver'
import * as path from 'path'
import * as fs from 'fs'

export interface ChromeExtensionArchiveWebpackPluginOptions {
    /**
     * Specifies the compressing algorithm
     * 
     * default: 'zip'
     */
    algorithm?: archiver.Format

    /**
     * Name of the archive
     * 
     * default: options.directory
     */
    filename?: string

    /**
     * Output path
     * 
     * default: '.
     */
    to?: string

    /**
     * Glob of files to include
     */
    directory: string
}

export class ChromeExtensionArchiveWebpackPlugin {
    private archive: archiver.Archiver

    constructor(options: ChromeExtensionArchiveWebpackPluginOptions) {
        const { algorithm = 'zip', directory, to = '.' } = options
        const filename = options.filename ? options.filename : `${path.parse(directory).name}.${algorithm}`

        const archive = archiver(algorithm, {
            zlib: {
                level: 9
            },
        })

        const output = fs.createWriteStream(path.join(to, filename))
        archive.pipe(output)
        archive.directory(directory, directory)

        this.archive = archive
    }

    apply(compiler: Compiler): void {
        const pluginName = this.constructor.name;

        compiler.hooks.afterEmit.tap(pluginName, async () => {
            this.archive.finalize()
        })
    }
}

export default ChromeExtensionArchiveWebpackPlugin
