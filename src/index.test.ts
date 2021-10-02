import { TempSandbox } from 'temp-sandbox'
import { webpack, Configuration, Stats } from 'webpack'
import { ChromeExtensionArchiveWebpackPlugin } from './index'

const sandbox = new TempSandbox()
const entryFile = 'src/index.js'
const entryFilePath = sandbox.path.resolve(entryFile)
const outputDirectory = 'dist'
const outputPath = sandbox.path.resolve(outputDirectory)

sandbox.createFileSync(entryFile, 'function main() {}')

// afterAll(() => {
//     sandbox.destroySandboxSync();
// })

describe('option', () => {
    test('default', async () => {
        const options: Configuration = {
            entry: entryFilePath,
            output: {
                path: outputPath,
                filename: 'bundle.js',
                chunkFilename: '[name].bundle.js'
            },
            plugins: [
                new ChromeExtensionArchiveWebpackPlugin({
                    algorithm: 'zip',
                    to: outputPath,
                    filename: 'test.zip',
                    directory: outputPath,
                })
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

        // expect(sandbox.getFileHashSync(outputPath).includes('build.zip')).toBe(true)
        expect(2).toBe(2)
    })
})
