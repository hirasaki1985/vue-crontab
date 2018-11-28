const path = require('path')
const babel       = require('rollup-plugin-babel'),
      replace     = require('rollup-plugin-replace'),
      typescript  = require('rollup-plugin-typescript2'),
      uglify      = require('rollup-plugin-uglify-es')

const resolve = _path => path.resolve(__dirname, '../', _path)

module.exports = function({target, package_name, version}) {
  console.log('configs exports()')
  console.log(target)
  console.log(package_name)
  console.log(version)

  const moduleEntryPoint = 'src/VueCrontab.ts'
  const banner =
`/*!
  * ${package_name} v${version}
  * (c) ${new Date().getFullYear()} Mamoru Hirasaki
  * @license MIT
  */`

  let config = [
    {
      file: resolve(`dist/${package_name}.js`),
      format: 'umd',
      banner: banner,
      version: version,
      package_name: package_name,
      entry_point: moduleEntryPoint
    },
    {
      file: resolve(`dist/${package_name}.min.js`),
      format: 'umd',
      banner: banner,
      version: version,
      package_name: package_name,
      entry_point: moduleEntryPoint,
      minify: {
        compress: {
          drop_console: true
        }
      },
    },
    {
      file: resolve(`dist/${package_name}.common.js`),
      format: 'cjs',
      banner: banner,
      version: version,
      package_name: package_name,
      entry_point: moduleEntryPoint
    },
    {
      file: resolve(`dist/${package_name}.esm.js`),
      format: 'es',
      banner: banner,
      version: version,
      package_name: package_name,
      entry_point: moduleEntryPoint
    }
  ]
  return config.map(getModuleConfig)
}

/**
 * get rollup's input, output config
 * @param {Object} opts outoput opts
 * @return {Object} config
 */
function getModuleConfig (opts) {
  let config = {
    input: {
      input: opts.entry_point,
      plugins: [
        typescript(),
        // babel(),
      ]
    },
    output: {
      file: opts.file,
      format: opts.format,
      banner: opts.banner,
      name: opts.package_name
    }
  }

  config = processOptions(config, opts)
  config.input.plugins.push(replace({
    __VERSION__: opts.version
   }))
  return config
}

function processOptions(config, opts) {
  if (typeof(opts.minify) !== 'undefined') {
    console.log('minify')
    config.input.plugins.push(uglify(opts.minify))
    // config.input.plugins.push(minify(opts.minify))
  }
  return config
}
