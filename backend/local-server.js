/**
 * Local Development Server
 * Simulates API Gateway for local testing
 */

const express = require('express')
const cors = require('cors')
const app = express()
const port = 3001

// Middleware
app.use(cors())
app.use(express.json())

// Import Lambda handlers
const supportChat = require('./src/support/chat')
const analyticsData = require('./src/analytics/data')
const analyticsAnalyze = require('./src/analytics/analyze')
const analyticsExport = require('./src/analytics/export')
const marketingPosts = require('./src/marketing/posts')
const marketingGenerate = require('./src/marketing/generate')
const marketingRecommendations = require('./src/marketing/recommendations')
const adminConfig = require('./src/admin/config')

// Helper to convert Express request to Lambda event
const createLambdaEvent = (req) => ({
  httpMethod: req.method,
  path: req.path,
  headers: req.headers,
  body: req.body ? JSON.stringify(req.body) : null,
  queryStringParameters: req.query,
  pathParameters: req.params,
})

// Helper to send Lambda response
const sendLambdaResponse = (res, lambdaResponse) => {
  res.status(lambdaResponse.statusCode)
  Object.entries(lambdaResponse.headers || {}).forEach(([key, value]) => {
    res.setHeader(key, value)
  })
  res.send(lambdaResponse.body)
}

// Routes
app.post('/api/support/chat', async (req, res) => {
  try {
    const event = createLambdaEvent(req)
    const response = await supportChat.handler(event)
    sendLambdaResponse(res, response)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/analytics/data', async (req, res) => {
  try {
    const event = createLambdaEvent(req)
    const response = await analyticsData.handler(event)
    sendLambdaResponse(res, response)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/analytics/analyze', async (req, res) => {
  try {
    const event = createLambdaEvent(req)
    const response = await analyticsAnalyze.handler(event)
    sendLambdaResponse(res, response)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/analytics/export', async (req, res) => {
  try {
    const event = createLambdaEvent(req)
    const response = await analyticsExport.handler(event)
    sendLambdaResponse(res, response)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/marketing/posts', async (req, res) => {
  try {
    const event = createLambdaEvent(req)
    const response = await marketingPosts.handler(event)
    sendLambdaResponse(res, response)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/marketing/posts', async (req, res) => {
  try {
    const event = createLambdaEvent(req)
    const response = await marketingPosts.handler(event)
    sendLambdaResponse(res, response)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/marketing/generate', async (req, res) => {
  try {
    const event = createLambdaEvent(req)
    const response = await marketingGenerate.handler(event)
    sendLambdaResponse(res, response)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/marketing/recommendations', async (req, res) => {
  try {
    const event = createLambdaEvent(req)
    const response = await marketingRecommendations.handler(event)
    sendLambdaResponse(res, response)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/admin/config', async (req, res) => {
  try {
    const event = createLambdaEvent(req)
    const response = await adminConfig.handler(event)
    sendLambdaResponse(res, response)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/admin/config', async (req, res) => {
  try {
    const event = createLambdaEvent(req)
    const response = await adminConfig.handler(event)
    sendLambdaResponse(res, response)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Automation Suite API is running' })
})

app.listen(port, () => {
  console.log(`🚀 Local API server running on http://localhost:${port}`)
  console.log(`📡 API endpoints available at http://localhost:${port}/api`)
})

