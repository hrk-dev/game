const fs = require('fs-extra')
const path = require('path')
const md5 = require('md5-js')

function md5Filename(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file)
    if (fs.lstatSync(fullPath).isDirectory()) {
      md5Filename(fullPath)
    } else {
      fs.renameSync(fullPath, fullPath.replace(file, md5(file)))
    }
  })
}

const dir = path.join(__dirname, '../dist')

let s = Date.now()
console.log('开始复制文件')

fs.emptyDirSync(dir)
fs.copySync(path.join(__dirname, '../src'), dir, {
  filter: src => {
    const reg = new RegExp(`src\\${path.sep}temp|src\\${path.sep}icu|Game.rpgproject|dev.js`)
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

const audioDir = path.join(dir, 'audio')
md5Filename(audioDir)
const audioList = fs.readdirSync(audioDir)
audioList.forEach(name => {
  fs.renameSync(path.join(audioDir, name), path.join(audioDir, md5(name)))
})
fs.renameSync(audioDir, path.join(dir, md5('audio')))

const imgDir = path.join(dir, 'img')
md5Filename(path.join(dir, 'img'))
const imgList = fs.readdirSync(imgDir)
imgList.forEach(name => {
  fs.renameSync(path.join(imgDir, name), path.join(imgDir, md5(name)))
})
fs.renameSync(imgDir, path.join(dir, md5('img')))

console.log(`加密文件完成 ${((Date.now() - s) / 1000).toFixed(2)}s`)
