const jwt = require('jsonwebtoken')

const SECRET = process.env.SSO_JWT_SECRET || 'nexlayer-shared-sso-secret-change-in-production-64chars!!'

function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    req.user = jwt.verify(token, SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = { requireAuth }
