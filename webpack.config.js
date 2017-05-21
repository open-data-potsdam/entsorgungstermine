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

// the clean options to use
let cleanOptions = {
  root:     '/Users/max/Developer/Abfallentsorgung/www/',
  exclude:  ['dist/data'],
  verbose:  true,
  dry:      false
}

const config = {
	context: path.resolve(__dirname, 'src'),
	entry: './js/script.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	plugins: [
		new CleanWebpackPlugin(pathsToClean, cleanOptions),
		new LiveReloadPlugin({ port: 35729, appendScriptTag: false }),
		new CopyWebpackPlugin([
			// {output}/to/file.txt
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