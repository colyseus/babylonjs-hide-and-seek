const path = require("path");
const webpack = require("webpack");
const editor = require("babylonjs-editor-webpack-progress");
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
	const entryPath = path.join(__dirname, "src/index.ts");
	const package = require("./package.json");

	console.log(`********* WEBPACK Dir Path: "${__dirname}" *********`);

	let configPath = './configs/dev.env';

	if(env.production) {
		configPath = './configs/prod.env';
	}

	console.log(`*** Config Path: ${configPath} ***`);

	return {
		// we output both a minified version & a non minified version on production build
		entry: { "bundle": entryPath },
		output: {
			filename: `bundle.js`,
			path: path.join(__dirname, "dist"),
			library: "game",
			libraryTarget: "umd",
		},
		module: {
			rules: [
				{
					test: /\.ts?$/,
					loader: "ts-loader",
					exclude: [
						path.join(__dirname, "node_modules"),
						path.join(__dirname, "dist"),
						path.join(__dirname, "projects"),
						path.join(__dirname, "scenes"),
						// path.join(__dirname)
					],
				},
				{
					test: /\.fx?$/,
					loader: "raw-loader",
				},
				{
					test: /\.(woff|woff2|eot|ttf|otf)$/i,
					type: 'asset/resource',
				  }
			],
		},
		resolve: {
			extensions: [".ts", ".js"],
		},
		plugins: [
			new Dotenv({
				path: configPath
			}),
			new webpack.BannerPlugin({
				banner: `${package.name} ${package.version} ${new Date().toString()}`,
			}),
			new webpack.WatchIgnorePlugin({
				paths: [/\.js$/, /\.d\.ts$/],
			}),
			editor.createProgressPlugin(new webpack.ProgressPlugin()),
		],
		optimization: {
			minimize: false,
			usedExports: true,
		},
		devtool: "source-map"
	};
};