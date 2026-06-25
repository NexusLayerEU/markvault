const { Router } = require('express')
const { requireAuth } = require('../middleware/auth')

const router = Router()

router.get('/me', requireAuth, (req, res) => {
  res.json({
    id: req.user.sub,
    email: req.user.sub,
    name: req.user.name || req.user.sub,
  })
})

module.exports = router
