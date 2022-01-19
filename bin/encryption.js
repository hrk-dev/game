const fs = require('fs-extra')
const path = require('path')
const md5 = require('md5-js')

let num = 0

function md5Dir(dir, name) {
  const oldDir = path.join(dir, name)
  const newDir = path.join(oldDir, `../${md5(name)}`)
  fs.renameSync(oldDir, newDir)
  console.log(`  ${oldDir}\n→ ${newDir}\n`)
  md5Filename(newDir)
}

function md5Filename(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file)
    const newPath = path.join(fullPath, `../${md5(file)}`)
    if (fs.lstatSync(fullPath).isDirectory()) {
      fs.renameSync(fullPath, newPath)
      console.log(`  ${fullPath}\n→ ${newPath}\n`)
      md5Filename(newPath)
    } else {
      num++
      console.log(`  ${fullPath}\n→ ${newPath}\n→ ${num}\n`)
      fs.renameSync(fullPath, newPath)
    }
  })
}

const dir = path.join(__dirname, '../dist')

let s = Date.now()
console.log('开始复制文件')

fs.emptyDirSync(dir)
fs.copySync(path.join(__dirname, '../src'), dir, {
  filter: src => {
    const reg = new RegExp(`src\\${path.sep}module\\${path.sep}devtools.js|src\\${path.sep}icu|Game.rpgproject|src\\${path.sep}game\\${path.sep}js\\${path.sep}env\\${path.sep}dev.js`)
    if (reg.test(src)) {
      console.log('已忽略 ', src)
      return false
    } else {
      return true
    }
  }
})
console.log(`复制文件结束 ${((Date.now() - s) / 1000).toFixed(2)}s`)

s = Date.now()
console.log('开始加密文件')

md5Dir(path.join(dir, 'game'), 'audio')
md5Dir(path.join(dir, 'game'), 'img')

console.log(`加密文件完成 ${((Date.now() - s) / 1000).toFixed(2)}s\n`)
