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

    constructor(private options: ChromeExtensionArchiveWebpackPluginOptions) {
        const { algorithm = 'zip' } = options

        this.archive = archiver(algorithm, {
            zlib: {
                level: 9
            },
        })
    }

    apply(compiler: Compiler): void {
        const pluginName = this.constructor.name;

        compiler.hooks.done.tap(pluginName, async () => {
            const { algorithm = 'zip', directory, filename, to = '.' } = this.options
            const _filename = filename ? filename : `${path.parse(directory).name}.${algorithm}`

            const output = fs.createWriteStream(path.join(to, _filename))
            this.archive.pipe(output)
            this.archive.directory(directory, directory)

            this.archive.finalize()
        })
    }
}
