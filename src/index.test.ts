import { TempSandbox } from 'temp-sandbox'
import { webpack, Configuration, Stats } from 'webpack'
import { ChromeExtensionArchiveWebpackPlugin, ChromeExtensionArchiveWebpackPluginOptions } from './index'

const sandbox = new TempSandbox()
const entryFile = 'src/index.js'
const entryFilePath = sandbox.path.resolve(entryFile)
const outputDirectory = 'dist'
const outputPath = sandbox.path.resolve(outputDirectory)

function Plugin(options: ChromeExtensionArchiveWebpackPluginOptions): ChromeExtensionArchiveWebpackPlugin {
    return new ChromeExtensionArchiveWebpackPlugin(options)
}

afterAll(() => {
    sandbox.destroySandboxSync();
})

describe('option', () => {
    test('default', async () => {
        const plugin = Plugin({
            algorithm: 'zip',
            directory: sandbox.path.resolve('.'),
        })

        console.log(outputPath)

        const options: Configuration = {
            entry: entryFilePath,
            output: {
                path: outputPath,
                filename: 'bundle.js',
                chunkFilename: '[name].bundle.js'
            },
            plugins: [plugin]
        }

        const compiler = webpack(options)

        await new Promise((resolve, reject) => {
            compiler.run((err: Error | undefined, stats: Stats | undefined) => {
                if (err || stats?.hasErrors) {
                    reject(err)
                    return
                }


                resolve(stats)
            })
        })

        expect(sandbox.getFileHashSync(outputPath).includes('build.zip')).toBe(true)
    })
})
