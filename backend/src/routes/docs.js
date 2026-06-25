const { Router } = require('express')
const { pool } = require('../db')
const { requireAuth } = require('../middleware/auth')

const router = Router()
router.use(requireAuth)

router.get('/tags', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT DISTINCT unnest(tags) AS tag FROM docs ORDER BY tag')
    res.json(rows.map(r => r.tag))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const { q, tags } = req.query
    const tagArr = tags ? String(tags).split(',').map(t => t.trim()).filter(Boolean) : []
    let query = 'SELECT id, title, tags, pushed_by, created_at, updated_at FROM docs WHERE 1=1'
    const params = []
    if (q) { params.push(`%${q}%`); query += ` AND title ILIKE $${params.length}` }
    if (tagArr.length) { params.push(tagArr); query += ` AND tags && $${params.length}` }
    query += ' ORDER BY updated_at DESC'
    const { rows } = await pool.query(query, params)
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM docs WHERE id = $1', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { title, content, tags } = req.body
    if (!title || !content) return res.status(400).json({ error: 'title and content required' })
    const tagArr = Array.isArray(tags) ? tags : []
    const pushedBy = req.user?.email || req.user?.sub || 'agent'
    const { rows } = await pool.query(
      'INSERT INTO docs (title, content, tags, pushed_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, tagArr, pushedBy]
    )
    res.status(201).json(rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { title, content, tags } = req.body
    const { rows } = await pool.query(
      `UPDATE docs SET
        title = COALESCE($1, title),
        content = COALESCE($2, content),
        tags = COALESCE($3, tags),
        updated_at = now()
      WHERE id = $4 RETURNING *`,
      [title || null, content || null, Array.isArray(tags) ? tags : null, req.params.id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM docs WHERE id = $1', [req.params.id])
    res.status(204).end()
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

module.exports = router
