const packager = require('electron-packager')
const md5 = require('md5-js')

packager({
  name: 'Infinite Looping Highschool',
  dir: 'dist',
  overwrite: true,
  icon: 'src/game/icon/icon.ico',
  out: 'build',
  asar: {
    unpackDir: `**/{${md5('audio')},${md5('img')}}*`
  }
})
  .then(appPaths => {})
