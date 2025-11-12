/**
 * Local Development Server
 * Simulates API Gateway for local testing
 */
// This is the local server for the backend. It is used to test the backend locally.
// It is used to test the backend locally.
// It is used to test the backend locally.

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
    const message = req.body?.message || ''
    const demoMode = req.body?.demoMode !== false // Default to true
    
    console.log('📨 Received support chat request:', { 
      message: message.substring(0, 50),
      demoMode: demoMode 
    })
    
    // Ensure demo mode is always used for reliability
    req.body.demoMode = true
    
    const event = createLambdaEvent(req)
    const response = await supportChat.handler(event)
    
    console.log('✅ Support chat response status:', response.statusCode)
    
    // Ensure response is valid
    if (!response || !response.statusCode) {
      throw new Error('Invalid response from handler')
    }
    
    sendLambdaResponse(res, response)
  } catch (error) {
    console.error('❌ Error in support chat route:', error)
    console.error('Error stack:', error.stack)
    
    // Always provide a fallback demo response
    try {
      const fallbackResponse = {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          response: "Hello! 👋 Welcome to our AI Automation Suite support. I'm here to help you with any questions about our services, features, or technical issues. How can I assist you today?",
          confidence: 0.95,
          ticketCreated: false,
          escalated: false,
          demoMode: true,
          warning: 'Using fallback demo response',
        }),
      }
      sendLambdaResponse(res, fallbackResponse)
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError)
      res.status(200).json({ 
        response: "Hello! I'm here to help. Please try your message again.",
        confidence: 0.9,
        ticketCreated: false,
        escalated: false,
        demoMode: true,
        error: 'Server error occurred, but demo response provided'
      })
    }
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

app.put('/api/marketing/posts', async (req, res) => {
  try {
    const event = createLambdaEvent(req)
    event.httpMethod = 'PUT'
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

