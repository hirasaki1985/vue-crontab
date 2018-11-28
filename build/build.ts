const package = require("../package.json")
const rollup = require('rollup')
//import rollup from 'rollup'

/**
 * build main
 */
function main() {
  const target = process.argv[2] || 'module'
  const package_name = process.argv[3] || package.name
  const version = package.version

  const option = {
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
  // console.log(configs)
  for (const i in configs) {
    const config = configs[i]
    console.log(config)
    const bundle = await buildEntry(config)
    await write(bundle, config)
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
