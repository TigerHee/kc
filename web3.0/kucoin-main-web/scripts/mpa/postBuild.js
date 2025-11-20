const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')
const pkg = require('../../package.json')
const resolveAliCdn = require('./resolveAlicdn.js')

const cwd = process.cwd()
console.log(`post build cwd: ${cwd}`)
// 构建完成，移动 static 和 cdnAssets
function resolveStaticAndAlicdn() {
  fse.copySync(
    path.resolve(cwd, 'cdnAssets/static'),
    path.resolve(cwd, `dist/${pkg.name}/${pkg.version}/static`)
  )
  fs.copyFileSync(
    path.resolve(cwd, 'cdnAssets/inspect-case.js'),
    path.resolve(cwd, `dist/${pkg.name}/${pkg.version}/inspect-case.js`)
  )
  moveChartingLibrary()
  moveAppAds()
  // 遍历多页
  const subApps = fs.readdirSync(path.resolve(cwd, `dist/${pkg.name}/${pkg.version}/`)).filter(subApp => {
    return subApp !== 'static' && subApp !== 'inspect-case.js'
  })
  for (const subApp of subApps) {
    const subAppDir = `dist/${pkg.name}/${pkg.version}/${subApp}`
    // 移动 static
    // const staticDir = `${subAppDir}/static`
    // const files = fs.readdirSync(path.resolve(cwd, staticDir))
    // for (const file of files) {
    //   const distFile = path.resolve(cwd, `dist/${pkg.name}/${pkg.version}/static/${file}`)
    //   if (!fs.existsSync(distFile)) {
    //     fse.moveSync(path.resolve(cwd, `${staticDir}/${file}`), distFile)
    //   }
    // }
    // fse.removeSync(path.resolve(cwd, staticDir));
    // 移动 html
    fse.moveSync(path.resolve(cwd, `${subAppDir}/index.html`), path.resolve(cwd, `dist/${subApp}/index.html`))
    // resolve alicdn
    resolveAliCdn(path.resolve(cwd, subAppDir))
  }
}

// 将charting_library_master移到dist下
function moveChartingLibrary() {
  fs.rename(
    path.resolve(cwd, `dist/${pkg.name}/${pkg.version}/static/charting_library_master`),
    path.resolve(cwd, `dist/charting_library_master`),
    (err) => {
      if (!err) {
        console.log('Move charting library success!')
      }
    },
  )
}

// 移动 app-ads.txt
function moveAppAds(){
  fs.copyFileSync(
    path.resolve(cwd, `dist/${pkg.name}/${pkg.version}/static/app-ads/app-ads.txt`),
    path.resolve(cwd, `dist/app-ads.txt`)
  )
}

// 生成version.json
function generateVersion() {
  try {
    const versionObj = {
      release: `${pkg.name}_${pkg.version}`,
    }
    console.log(versionObj)
    fs.writeFileSync(path.resolve(cwd, 'dist/version.mpa.json'), JSON.stringify(versionObj))
  } catch (err) {
    console.log(err)
  }
}

try {
  resolveStaticAndAlicdn()
  generateVersion()
} catch (err) {
  console.log(err)
}

