const package = require("../package.json")
const rollup = require('rollup')
//import rollup from 'rollup'

/**
 * build main
 */
function main() {
  const target = process.argv[2] || 'module'
  // const package_name = process.argv[3] || package.name
  const file_name = 'vue-crontab'
  const package_name = process.argv[3] || "VueCrontab"
  const version = package.version

  const option = {
    'file_name' : file_name,
    'package_name' : package_name,
    'target': target,
    'version': version
  }

  const configs = require('./configs')(option)
  build(configs)
}

/**
 * build options.
 * @param {Object} 'configs rollup configs.
 */
async function build(configs) {
  console.log('build build()')
  try {
    // console.log(configs)
    for (const i in configs) {
      const config = configs[i]
      console.log(config)
      const bundle = await buildEntry(config)
      await write(bundle, config)
    }
  } catch(e) {
    console.error(e)
  }
}

/**
 * build option.
 * @param {Object} rollup option.
 * @return {Object} rollup bundle.
 */
async function buildEntry({input, output}) {
  console.log('build buildEntry()')
  console.log(input)
  console.log(output)
  // create a bundle
  return rollup.rollup(input)
    .then(bundle => {
      bundle.generate(output)
      return bundle
    })
}

/**
 * write bundle file.
 * @param {Object} rollup bundle.
 * @param {Object} rollup option.
 */
async function write(bundle, {input, output}) {
  return bundle.write(output)
}

// exec main
main()
