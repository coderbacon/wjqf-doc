/**
 * 部署脚本：将构建后的 dist 文件夹上传到 Linux 服务器
 *
 * 用法：
 *   npm run deploy          # 先构建再部署
 *   npm run deploy:only     # 仅部署（跳过构建）
 *
 * 配置：复制 .env.deploy.example 为 .env.deploy 并填写真实值
 *
 * 清理策略：默认部署前会清空服务器目标目录（避免残留旧文件）
 *   设置 DEPLOY_CLEAN=false 可跳过清理（仅覆盖同名文件）
 */
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const os = require('os')

// ==================== 读取配置 ====================

const envPath = path.resolve(__dirname, '..', '.env.deploy')
if (!fs.existsSync(envPath)) {
  console.error('❌ 配置文件 .env.deploy 不存在！')
  console.error('   请复制 .env.deploy.example 为 .env.deploy 并填写服务器信息')
  process.exit(1)
}

// 解析 .env 文件（简单实现，兼容引号和无引号）
const env = {}
const content = fs.readFileSync(envPath, 'utf-8')
for (const line of content.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eqIdx = trimmed.indexOf('=')
  if (eqIdx === -1) continue
  const key = trimmed.slice(0, eqIdx).trim()
  let val = trimmed.slice(eqIdx + 1).trim()
  // 去掉首尾引号
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1)
  }
  env[key] = val
}

const HOST = env.DEPLOY_HOST
const USER = env.DEPLOY_USER
const DEPLOY_PATH = env.DEPLOY_PATH
const PORT = env.DEPLOY_PORT || '22'
const KEY = env.DEPLOY_KEY
// 默认开启部署前清理，设为 false 可跳过
const CLEAN = env.DEPLOY_CLEAN !== 'false'

if (!HOST || !USER || !DEPLOY_PATH) {
  console.error('❌ .env.deploy 配置不完整，请检查 DEPLOY_HOST、DEPLOY_USER、DEPLOY_PATH')
  process.exit(1)
}

// 安全校验：防止误删根目录
if (DEPLOY_PATH === '/' || DEPLOY_PATH === '/root' || DEPLOY_PATH === '/home') {
  console.error('❌ 安全警告：DEPLOY_PATH 不能为系统关键目录！')
  process.exit(1)
}

// ==================== 构建 dist 路径 ====================

const distDir = path.resolve(__dirname, '..', '.vitepress', 'dist')
if (!fs.existsSync(distDir)) {
  console.error('❌ dist 目录不存在，请先运行 npm run docs:build')
  process.exit(1)
}

// ==================== SSH 连接选项 ====================

const keyOpt = KEY ? `-i "${KEY}"` : ''
const portOpt = `-P ${PORT}`
const sshOpt = `${keyOpt} -p ${PORT}`

// ==================== 步骤1：清理服务器旧文件 ====================

if (CLEAN) {
  // 用 rm -rf 清空目标目录下的所有内容（保留目录本身）
  const cleanCmd = `ssh ${sshOpt} ${USER}@${HOST} "rm -rf ${DEPLOY_PATH}/*"`
  console.log(`🧹 正在清理服务器旧文件...`)

  try {
    execSync(cleanCmd, { stdio: 'pipe' })
    console.log('   清理完成')
  } catch (err) {
    console.error('   清理失败（可能目录为空或权限不足），继续部署...')
  }
} else {
  console.log('⏭️  跳过清理（DEPLOY_CLEAN=false），将覆盖同名文件')
}

// ==================== 步骤2：上传新文件 ====================

const scpCmd = `scp -r ${keyOpt} ${portOpt} "${distDir}\\*" ${USER}@${HOST}:${DEPLOY_PATH}/`

console.log()
console.log(`🚀 正在部署到 ${USER}@${HOST}:${DEPLOY_PATH}/ ...`)
console.log()

try {
  execSync(scpCmd, { stdio: 'inherit' })
  console.log()
  console.log('✅ 部署完成！')
} catch (err) {
  console.error()
  console.error('❌ 部署失败，请检查：')
  console.error('   1. 网络是否连通（ping 服务器）')
  console.error('   2. SSH 端口是否正确')
  console.error('   3. 用户名密码/密钥是否正确')
  console.error('   4. 目标目录是否有写入权限')
  process.exit(1)
}
