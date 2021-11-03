const packager = require('electron-packager')
const md5 = require('md5-js')

packager({
  name: 'Hiiro',
  dir: 'dist',
  overwrite: true,
  icon: 'src/icon/icon.ico',
  out: 'build',
  asar: {
    unpackDir: `**/{${md5('audio')},${md5('img')}}*`
  }
})
  .then(appPaths => {})
