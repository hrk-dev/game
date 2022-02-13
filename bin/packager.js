const packager = require('electron-packager')
const md5 = require('md5-js')

packager({
  name: 'Infinite Looping Highschool',
  appCopyright: '梦樱高校开发部',
  buildVersion: '0.0.0.0',
  executableName: 'game',
  win32metadata: {
    CompanyName: '梦樱高校开发部',
    FileDescription: 'A Game'
  },
  dir: 'dist',
  overwrite: true,
  icon: 'src/game/icon/icon.ico',
  out: 'build',
  asar: {
    unpack: '*.{lib,dll}',
    unpackDir: `**/{${md5('audio').substr(8, 16)},${md5('img').substr(8, 16)}}*`
  }
})
  .then(appPaths => { })
  .catch(err => {
    console.error(err)
  })
