import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = process.env.PORT || 5000

// ─── Middleware ─────────────────────────────────────────────
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// ─── API: GitHub Stats ──────────────────────────────────────
// Replace 'yourusername' with your actual GitHub username
app.get('/api/github-stats', async (req, res) => {
  try {
    const username = process.env.GITHUB_USERNAME || 'yourusername'
    const headers = {}
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers }),
    ])

    if (!userRes.ok) throw new Error('GitHub API error')

    const user = await userRes.json()
    const repos = await reposRes.json()

    const totalStars = Array.isArray(repos)
      ? repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
      : 0

    res.json({
      repos: user.public_repos ?? repos.length,
      followers: user.followers ?? 0,
      stars: totalStars,
    })
  } catch (err) {
    console.error('GitHub stats error:', err.message)
    // Fallback mock data
    res.json({ repos: 32, followers: 140, stars: 287 })
  }
})

// ─── API: LinkedIn (placeholder) ────────────────────────────
app.get('/api/linkedin', (req, res) => {
  res.json({
    url: 'https://linkedin.com/in/yourusername',
    note: 'LinkedIn does not offer a public API. Link users to your profile directly.',
  })
})

// ─── API: Contact Form ──────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // Log for now — replace with nodemailer / SendGrid / Resend for real emails
  console.log('📨 New contact message:')
  console.log(`  From:    ${name} <${email}>`)
  console.log(`  Subject: ${subject}`)
  console.log(`  Message: ${message}`)

  // Example nodemailer integration (uncomment & install nodemailer):
  /*
  import nodemailer from 'nodemailer'
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  })
  await transporter.sendMail({
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Portfolio: ${subject}`,
    text: `From: ${name}\n\n${message}`,
  })
  */

  res.json({ success: true, message: 'Message received!' })
})

// ─── API: Resume Download ───────────────────────────────────
app.get('/api/resume', (req, res) => {
  const resumePath = path.join(__dirname, 'assets', 'resume.pdf')
  // Replace with your actual resume file
  res.download(resumePath, 'YourName_Resume.pdf', (err) => {
    if (err) {
      res.status(404).json({ error: 'Resume not found. Add resume.pdf to server/assets/' })
    }
  })
})

// ─── API: Projects (optional dynamic source) ────────────────
app.get('/api/projects', (req, res) => {
  // You can fetch these from a database or CMS in production
  res.json([
    { id: 1, title: 'NeuralChat', stars: 142, forks: 38 },
    { id: 2, title: 'QuantumDB', stars: 89, forks: 22 },
    { id: 3, title: 'AeroBoard', stars: 56, forks: 14 },
  ])
})

// ─── SPA Fallback ───────────────────────────────────────────
// Serve React app for all non-API routes (after build)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html')
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <h2 style="font-family:monospace;padding:2rem">
          🚀 API server running on port ${PORT}.<br/>
          Run <code>npm run dev</code> in the /client folder to start the React app.
        </h2>
      `)
    }
  })
})

// ─── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`)
  console.log(`   API endpoints:`)
  console.log(`   GET  /api/github-stats`)
  console.log(`   POST /api/contact`)
  console.log(`   GET  /api/resume\n`)
})

export default app
