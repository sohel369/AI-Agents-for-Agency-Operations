/**
 * Customer Support Agent - Chat Handler
 * Processes customer support messages using Google Gemini API or AWS Bedrock
 * Creates tickets in CRM and escalates to human if confidence is low
 */

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime')
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb')
const { mockInvokeBedrock, shouldUseMockMode } = require('../../mock/bedrockMock')

// Check if we should use mock mode
const USE_MOCK_MODE = shouldUseMockMode()

if (USE_MOCK_MODE) {
  console.log('🔧 Running in LOCAL MOCK MODE - AWS credentials not required')
}

// Initialize clients only if not in mock mode
let bedrockClient = null
let dynamoClient = null

if (!USE_MOCK_MODE) {
  bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION || 'us-east-1' })
  dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' }))
}

const CONFIDENCE_THRESHOLD = parseFloat(process.env.CONFIDENCE_THRESHOLD || '0.8')
const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-v2'
const CRM_ENDPOINT = process.env.CRM_ENDPOINT_URL || 'https://api.crm.example.com'

// Default Google AI Studio API key (can be overridden from config or env)
// NOTE: Get a valid Google AI API key from: https://aistudio.google.com/app/apikey
// Google AI keys start with "AIza..." not "sk-proj..."
// The key below is a placeholder - replace with your actual Google AI API key
const DEFAULT_GOOGLE_API_KEY = ''

/**
 * Get Google AI Studio API key from config or environment
 */
function getSupportAgentApiKey() {
  // Priority 1: Environment variable
  if (process.env.GOOGLE_AI_API_KEY && process.env.GOOGLE_AI_API_KEY.trim() !== '') {
    const key = process.env.GOOGLE_AI_API_KEY.trim()
    console.log('🔑 Using GOOGLE_AI_API_KEY from environment')
    return key
  }
  
  // Priority 2: Support Agent API key from environment
  if (process.env.SUPPORT_AGENT_API_KEY && process.env.SUPPORT_AGENT_API_KEY.trim() !== '') {
    const key = process.env.SUPPORT_AGENT_API_KEY.trim()
    console.log('🔑 Using SUPPORT_AGENT_API_KEY from environment')
    return key
  }
  
  // Priority 3: Admin config
  try {
    const { getSupportAgentApiKey: getApiKey } = require('../admin/config')
    const apiKey = getApiKey()
    if (apiKey && apiKey.trim() !== '') {
      console.log('🔑 Using API key from admin config')
      return apiKey.trim()
    }
  } catch (error) {
    console.log('⚠️ Could not fetch config, using default API key:', error.message)
  }
  
  // Priority 4: Default key
  console.log('🔑 Using default API key')
  return DEFAULT_GOOGLE_API_KEY
}

/**
 * Invoke Google AI Studio (Gemini API)
 * Uses the Generative AI API from Google AI Studio
 */
async function invokeGoogleGemini(prompt, apiKey) {
  try {
    // Use the latest Gemini model (gemini-1.5-flash or gemini-pro)
    const model = process.env.GOOGLE_AI_MODEL || 'gemini-1.5-flash'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: parseFloat(process.env.MODEL_TEMPERATURE || '0.7'),
        maxOutputTokens: parseInt(process.env.MAX_OUTPUT_TOKENS || '1024'),
        topP: 0.95,
        topK: 40,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    }

    console.log(`🤖 Calling Google AI Studio (${model})...`)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.text()
      let errorMessage = `Google AI API error: ${response.status}`
      
      try {
        const errorJson = JSON.parse(errorData)
        if (errorJson.error && errorJson.error.message) {
          errorMessage = `Google AI API error: ${errorJson.error.message}`
        }
      } catch (e) {
        // If parsing fails, use the raw error data
        errorMessage = `Google AI API error: ${response.status} - ${errorData.substring(0, 200)}`
      }
      
      console.error('Google AI API error:', response.status, errorData)
      throw new Error(errorMessage)
    }

    const data = await response.json()
    
    // Handle response format
    if (data.candidates && data.candidates[0]) {
      const candidate = data.candidates[0]
      
      // Check for safety ratings
      if (candidate.safetyRatings && candidate.safetyRatings.some(r => r.blocked)) {
        throw new Error('Response blocked by safety filters')
      }
      
      if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
        return candidate.content.parts[0].text
      }
    }
    
    throw new Error('Invalid response format from Google AI API')
  } catch (error) {
    console.error('Google AI Studio invocation error:', error.message)
    throw error
  }
}

/**
 * Invoke AI model to generate response (Google AI Studio, Bedrock, or mock)
 * Priority: Google AI Studio > Mock Mode > AWS Bedrock
 */
async function invokeAI(prompt) {
  // Priority 1: Try Google AI Studio (Gemini API) if API key is available
  const apiKey = getSupportAgentApiKey()
  
  // Validate API key format (Google AI keys start with "AIza")
  if (apiKey && apiKey.trim() !== '' && apiKey.trim().startsWith('AIza')) {
    try {
      console.log('🤖 Using Google AI Studio (Gemini API)')
      return await invokeGoogleGemini(prompt, apiKey)
    } catch (error) {
      console.error('⚠️ Google AI Studio failed:', error.message)
      // Continue to fallback options
    }
  } else if (apiKey && apiKey.trim() !== '') {
    console.log('⚠️ Invalid API key format. Google AI keys should start with "AIza...". Using fallback.')
  } else {
    console.log('⚠️ No Google AI API key found, using fallback')
  }

  // Priority 2: Fall back to mock mode if enabled
  if (USE_MOCK_MODE) {
    console.log('🔧 Using mock Bedrock service')
    return await mockInvokeBedrock(prompt, {
      temperature: parseFloat(process.env.MODEL_TEMPERATURE || '0.7'),
      maxTokens: 1024,
    })
  }

  // Priority 3: Try AWS Bedrock if credentials are available
  if (bedrockClient) {
    try {
      console.log('🔷 Attempting AWS Bedrock...')
      const input = {
        modelId: MODEL_ID,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: 1024,
          temperature: parseFloat(process.env.MODEL_TEMPERATURE || '0.7'),
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      }

      const command = new InvokeModelCommand(input)
      const response = await bedrockClient.send(command)
      const responseBody = JSON.parse(new TextDecoder().decode(response.body))
      
      return responseBody.content[0].text
    } catch (error) {
      console.error('⚠️ Bedrock invocation error:', error.message)
    }
  }

  // Final fallback: Mock response
  console.log('🔧 Using mock response as final fallback')
  return await mockInvokeBedrock(prompt, {
    temperature: parseFloat(process.env.MODEL_TEMPERATURE || '0.7'),
    maxTokens: 1024,
  })
}

/**
 * Create ticket in CRM (placeholder - replace with actual CRM API call)
 */
async function createCRMTicket(message, confidence, escalated) {
  // Placeholder: In production, make actual API call to CRM
  const ticket = {
    id: `TICKET-${Date.now()}`,
    message,
    confidence,
    escalated,
    status: escalated ? 'pending-human' : 'ai-resolved',
    createdAt: new Date().toISOString(),
  }

  if (USE_MOCK_MODE) {
    // In mock mode, just log to console
    console.log('📝 [MOCK] Ticket created:', ticket)
    return ticket
  }

  // Log to DynamoDB (only if not in mock mode)
  try {
    await dynamoClient.send(
      new PutCommand({
        TableName: process.env.TICKETS_TABLE || 'SupportTickets',
        Item: ticket,
      })
    )
  } catch (error) {
    console.error('DynamoDB error (continuing in mock mode):', error.message)
  }

  // In production, make HTTP request to CRM endpoint
  // const response = await fetch(CRM_ENDPOINT, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(ticket),
  // })

  return ticket
}

/**
 * Calculate confidence score (simplified - in production use actual model confidence)
 */
function calculateConfidence(response, message) {
  // Placeholder: In production, extract confidence from model response
  // For now, use a simple heuristic
  const keywords = ['error', 'problem', 'issue', 'help', 'urgent']
  const hasKeywords = keywords.some((kw) => message.toLowerCase().includes(kw))
  return hasKeywords ? 0.85 : 0.75
}

/**
 * Demo mode response - always returns the same saved answer
 */
function getDemoResponse(message, conversationHistory) {
  // Always return the same saved demo answer regardless of user input
  return {
    response: "Hello! 👋 Welcome to our AI Automation Suite support. I'm here to help you with any questions about our services, features, or technical issues. How can I assist you today?",
    confidence: 0.95,
    demo: true
  }
}

/**
 * Main handler
 */
exports.handler = async (event) => {
  // Store event for error handling
  const eventCopy = event
  
  try {
    // Parse body - handle both string and object formats
    let body = {}
    try {
      if (typeof event.body === 'string') {
        body = JSON.parse(event.body)
      } else if (event.body) {
        body = event.body
      }
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Invalid request body format' }),
      }
    }

    const { message, conversationHistory, demoMode } = body

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Message is required and must be a non-empty string' }),
      }
    }

    // Check if demo mode is enabled
    // Priority: explicit demoMode flag > DEMO_MODE env var > mock mode fallback
    const envDemoMode = process.env.DEMO_MODE === 'true'
    const useDemoMode = demoMode === true || (demoMode !== false && (envDemoMode || USE_MOCK_MODE))

    if (useDemoMode) {
      console.log('🎭 Using DEMO MODE - Providing predefined responses')
      
      try {
        const demoResponse = getDemoResponse(message, conversationHistory)
        
        // Create ticket (safe, won't fail in demo mode)
        let ticket = { id: `TICKET-${Date.now()}` }
        try {
          ticket = await createCRMTicket(message, demoResponse.confidence, false)
        } catch (ticketError) {
          console.log('Ticket creation skipped in demo mode:', ticketError.message)
        }
        
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            response: demoResponse.response,
            confidence: demoResponse.confidence,
            ticketCreated: true,
            ticketId: ticket.id || `TICKET-${Date.now()}`,
            escalated: false,
            demoMode: true,
          }),
        }
      } catch (demoError) {
        console.error('Error in demo mode:', demoError)
        // Fallback response if demo mode fails
        return {
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
          }),
        }
      }
    }

    // Build context from conversation history
    const context = conversationHistory
      ? conversationHistory
          .slice(-5)
          .map((msg) => `${msg.sender}: ${msg.text}`)
          .join('\n')
      : ''

    const prompt = `You are a helpful customer support agent. Respond to the following customer inquiry professionally and helpfully.

${context ? `Previous conversation:\n${context}\n\n` : ''}Customer message: ${message}

Provide a helpful response:`

    try {
      // Generate AI response
      const aiResponse = await invokeAI(prompt)

      // Calculate confidence
      const confidence = calculateConfidence(aiResponse, message)
      const escalated = confidence < CONFIDENCE_THRESHOLD

      // Create ticket in CRM
      let ticket = { id: `TICKET-${Date.now()}` }
      try {
        ticket = await createCRMTicket(message, confidence, escalated)
      } catch (ticketError) {
        console.log('Ticket creation error (continuing):', ticketError.message)
      }

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          response: aiResponse,
          confidence,
          ticketCreated: true,
          ticketId: ticket.id || `TICKET-${Date.now()}`,
          escalated,
        }),
      }
    } catch (aiError) {
      console.error('AI invocation error, falling back to demo:', aiError.message)
      // Fallback to demo response if AI fails
      const demoResponse = getDemoResponse(message, conversationHistory)
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          response: demoResponse.response,
          confidence: demoResponse.confidence,
          ticketCreated: false,
          escalated: false,
          demoMode: true,
          warning: 'Using demo response due to AI error',
        }),
      }
    }
  } catch (error) {
    console.error('Error in support chat handler:', error)
    console.error('Error stack:', error.stack)
    
    // Get message from body if available, otherwise use default
    let userMessage = ''
    try {
      const body = eventCopy.body ? (typeof eventCopy.body === 'string' ? JSON.parse(eventCopy.body) : eventCopy.body) : {}
      userMessage = body.message || ''
    } catch (e) {
      // Ignore parse errors
    }
    
    // Provide helpful error messages
    let errorMessage = 'Sorry, I encountered an error. Please try again.'
    let errorDetails = undefined
    
    if (process.env.NODE_ENV === 'development' || USE_MOCK_MODE) {
      errorDetails = error.message
    }
    
    // Check for specific Google AI errors
    if (error.message && (error.message.includes('Google AI') || error.message.includes('Google'))) {
      errorMessage = 'Unable to connect to Google AI service. Please check your API key configuration.'
      if (process.env.NODE_ENV === 'development' || USE_MOCK_MODE) {
        errorDetails = error.message
      }
    }
    
    // Fallback to demo response if AI fails
    try {
      console.log('🔄 Attempting fallback to demo response due to error')
      const demoResponse = getDemoResponse(userMessage || 'Hello', [])
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          response: demoResponse.response,
          confidence: 0.5,
          ticketCreated: false,
          escalated: true,
          demoMode: true,
          warning: 'Using fallback response due to API error',
          error: errorMessage,
          errorDetails: errorDetails,
        }),
      }
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError)
      // If even fallback fails, return error with safe message
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: errorMessage,
          details: errorDetails,
          message: 'An unexpected error occurred. Please try again.',
        }),
      }
    }
  }
}

