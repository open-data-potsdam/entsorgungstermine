const webpack = require('webpack');
const path = require('path');
const vueSelectize = require('vue-selectize');

var $ = require('jquery');

var CopyWebpackPlugin = require('copy-webpack-plugin');
var LiveReloadPlugin = require('webpack-livereload-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// the path(s) that should be cleaned
let pathsToClean = [
  'dist/*',
]

const config = {
	context: path.resolve(__dirname, 'src'),
	watch: true,
	entry: './js/app.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	plugins: [
		new LiveReloadPlugin({ port: 35729, appendScriptTag: false }),
		new CopyWebpackPlugin([
            { from: 'index.html' },
            { from: 'data/**/*'  },
            { from: 'css/style.scss', to: 'css/style.css' },
        ])
	],
	module: {
		rules: [
		{
	    	test: /\.js$/,
	    	include: path.resolve(__dirname, '/(src)/'),
	    	use: [{
	    		loader: 'babel-loader',
	    		options: {
	    			presets: [
	    				['es2015', { module: false }]
	    			]
	    		}
    		}]
		},
		{
			test: /\.scss$/,
			use: ['style-loader', 'css-loader', 'sass-loader']
		}]
	}
}

module.exports = config