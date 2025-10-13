import { Router } from 'express'
import archiveRoutes from './archive.js'
import codexRoutes from './codex.js'
import discourseRoutes from './discourse.js'

const router = Router()

// Agent status endpoint
router.get('/status', (req, res) => {
  res.json({
    agents: {
      archive: {
        status: 'active',
        capabilities: ['Knowledge Management', 'RAG Processing', 'Document Analysis'],
        privacy: 'strict',
        trust: 'high'
      },
      codex: {
        status: 'active',
        capabilities: ['Policy Analysis', 'Standards Management', 'Governance Modeling'],
        privacy: 'strict',
        trust: 'high'
      },
      discourse: {
        status: 'active',
        capabilities: ['Community Management', 'Consensus Building', 'Forum Integration'],
        privacy: 'moderate',
        trust: 'medium'
      }
    },
    timestamp: new Date().toISOString()
  })
})

// Agent coordination endpoint
router.get('/coordinate', (req, res) => {
  res.json({
    coordination: {
      active: true,
      mode: 'collaborative',
      agents: ['archive', 'codex', 'discourse'],
      lastSync: new Date().toISOString(),
      trustNetwork: 'healthy'
    }
  })
})

// Use agent-specific routes
router.use('/archive', archiveRoutes)
router.use('/codex', codexRoutes)
router.use('/discourse', discourseRoutes)

export default router

