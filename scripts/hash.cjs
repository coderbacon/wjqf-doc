/**
 * 生成 SHA-256 密码哈希
 * 用法: node scripts/hash.cjs 你的密码
 */
const crypto = require('crypto')

const password = process.argv[2]
if (!password) {
  console.log('用法: node scripts/hash.cjs <密码>')
  process.exit(1)
}

const hash = crypto.createHash('sha256').update(password).digest('hex')
console.log(hash)
