import { TempSandbox } from 'temp-sandbox'
import { webpack, Configuration, Stats } from 'webpack'
import { ChromeExtensionArchiveWebpackPlugin, ChromeExtensionArchiveWebpackPluginOptions } from './index'

const sandbox = new TempSandbox({ randomDir: true })
const entryFile = 'src/index.js'
const entryFilePath = sandbox.path.resolve(entryFile)
const outputDirectory = 'dist'
const outputPath = sandbox.path.resolve(outputDirectory)

afterAll(() => {
    sandbox.destroySandboxSync();
})

describe('option', () => {
    test('default', async () => {
        await sandbox.createFile(entryFile, 'function main() {}')

        const pluginOptions: ChromeExtensionArchiveWebpackPluginOptions = {
            algorithm: 'zip',
            to: outputPath,
            filename: 'test.zip',
            directory: outputPath,
        }

        const options: Configuration = {
            entry: entryFilePath,
            output: {
                path: outputPath,
                filename: 'bundle.js',
                chunkFilename: '[name].bundle.js'
            },
            plugins: [
                new ChromeExtensionArchiveWebpackPlugin(pluginOptions)
            ]
        }

        const compiler = webpack(options)

        await new Promise((resolve, reject) => {
            compiler.run((err: Error | undefined, stats: Stats | undefined) => {
                if (err != null && !err) {
                    reject(err)
                    return
                }

                resolve(stats)
            })
        })

        expect(sandbox.getFileHashSync(outputPath).includes(pluginOptions.filename!)).toBe(true)
    })
})
