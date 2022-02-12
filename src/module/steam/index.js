const greenworks = require('./greenworks')

try {
  greenworks.init()
  greenworks.activateAchievement('FIRST_START', () => { })
} catch (err) {
  console.error(err)
}
