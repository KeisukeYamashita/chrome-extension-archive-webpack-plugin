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

        const output = fs.createWriteStream(path.join(__dirname, filename))
        console.log('output', path.join(to, filename), 'directory', directory)
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
