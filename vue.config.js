const { defineConfig } = require('@vue/cli-service')
const { DefinePlugin } = require('webpack')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const fs = require('fs')
const path = require('path')


module.exports = defineConfig({
	filenameHashing: true,
	transpileDependencies: true,

	configureWebpack: {
		plugins: [
			new NodePolyfillPlugin(),

			new DefinePlugin({
				'__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(false),
				'__VUE_OPTIONS_API__': JSON.stringify(true),
				'__VUE_PROD_DEVTOOLS__': JSON.stringify(false)
			})
		]
	},

	chainWebpack: config => {
		config.plugin('define').tap(([definitions]) => {
			const { message } = JSON.parse(fs.readFileSync('./version-badge.json', 'utf-8'))

			definitions['process.env.APP_VERSION'] = JSON.stringify(message)

			// Function to count files in a folder
			const countFiles = (folderPath) => {
				try {
				  const files = fs.readdirSync(folderPath)

				  return files.length
				} catch (error) {
				  console.error(`Error counting files in folder ${folderPath}:`, error)

				  return 0
				}
			}

			// Count the files in the positive folder
			const positivePath = path.resolve(__dirname, 'src/assets/meme/Positive')
			const positiveFileCount = countFiles(positivePath)

			// Count the files in the negative folder
			const negativePath = path.resolve(__dirname, 'src/assets/meme/Negative')
			const negativeFileCount = countFiles(negativePath)

			// Write the results to environment variables
			definitions['process.env.MEME_POSITIVE_FILE_COUNT'] = JSON.stringify(positiveFileCount)
			definitions['process.env.MEME_NEGATIVE_FILE_COUNT'] = JSON.stringify(negativeFileCount)

			return [definitions]
		})
	}
})