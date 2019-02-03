const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  context: __dirname,
  node: {
    __dirname: true
  },
  mode: process.env.NODE_ENV || 'development',
  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    const fullDir = path.join(__dirname, dir)
    const entry = path.join(fullDir, 'app.js')
    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
      entries[dir] = ['es6-promise/auto', entry]
    }

    return entries
  }, {}),

  output: {
    path: path.join(__dirname, '__build__'),
    filename: '[name].js',
    // chunkFilename: '[id].chunk.js',
    publicPath: '__build__/'
  },

  module: {
    rules:[
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.ts$/,
        use: 'ts-loader'
      }

    ]
  },

  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js',
      vuex: 'vuex/dist/vuex.esm.js',
      'VueCrontab': path.join(__dirname, '..', 'src/index')
    },
    extensions: [
      '.ts', '.js'
    ]
  },

  /*
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  */
  devServer: {
    contentBase: 'examples',
    // port: 8080,
    // host: '0.0.0.0',
    inline: true,
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',

  plugins: [
    //new VuePlugin()
    new VueLoaderPlugin()
  ]
}

if (process.env.NODE_ENV === 'production') {
  console.log("NODE_ENV = production");
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
        drop_console: true
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
