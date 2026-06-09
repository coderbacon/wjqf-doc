const { execSync } = require('child_process')
const path = require('path')

const dist = path.resolve(__dirname, '..', '.vitepress', 'dist')
const zip = path.resolve(__dirname, '..', 'wjqf-doc.zip')

execSync(
  `powershell -Command "Compress-Archive -Path '${dist}\\*' -DestinationPath '${zip}' -Force"`,
  { stdio: 'inherit' }
)
console.log(`Zip created: ${zip}`)
