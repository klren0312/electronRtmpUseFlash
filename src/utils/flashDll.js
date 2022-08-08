export default function initFlash(app) {
  const path = require('path')
  let dllName = 'pepflashplayer64_29_0_0_238.dll'
  if (process.arch === 'ia32') {
    dllName = 'pepflashplayer32_29_0_0_238.dll'
  }

  let libPath = path.resolve(`libs/flash/${dllName}`)
  if (process.env.NODE_ENV !== 'development') {
    libPath = path.resolve(`resources/flash/${dllName}`)
  }
  app.commandLine.appendSwitch('ppapi-flash-path', libPath)
  // app.commandLine.appendSwitch('ppapi-flash-version', '34.0.0.251')
}
