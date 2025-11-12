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

// Default Google API key (can be overridden from config)
const DEFAULT_GOOGLE_API_KEY = 'AIzaSyBKgR2EYZPaXlvPiaM2I_WDwpBYPokr5KE'

/**
 * Get API key from config or use default
 */
function getSupportAgentApiKey() {
  // Try to get from environment first
  if (process.env.SUPPORT_AGENT_API_KEY) {
    return process.env.SUPPORT_AGENT_API_KEY
  }
  
  // Try to get from admin config
  try {
    const { getSupportAgentApiKey: getApiKey } = require('../admin/config')
    const apiKey = getApiKey()
    if (apiKey && apiKey.trim() !== '') {
      return apiKey
    }
  } catch (error) {
    console.log('Could not fetch config, using default API key:', error.message)
  }
  
  return DEFAULT_GOOGLE_API_KEY
}

/**
 * Invoke Google Gemini API
 */
async function invokeGoogleGemini(prompt, apiKey) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: parseFloat(process.env.MODEL_TEMPERATURE || '0.7'),
          maxOutputTokens: 1024,
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Google API error:', response.status, errorData)
      throw new Error(`Google API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text
    }
    
    throw new Error('Invalid response format from Google API')
  } catch (error) {
    console.error('Google Gemini invocation error:', error.message)
    throw error
  }
}

/**
 * Invoke AI model to generate response (Google Gemini, Bedrock, or mock)
 */
async function invokeAI(prompt) {
  // Always try Google Gemini first if API key is available
  try {
    const apiKey = getSupportAgentApiKey()
    if (apiKey && apiKey.trim() !== '') {
      console.log('🤖 Using Google Gemini API')
      return await invokeGoogleGemini(prompt, apiKey)
    }
  } catch (error) {
    console.log('⚠️ Google Gemini failed, falling back to mock mode:', error.message)
  }

  // Fall back to mock mode
  if (USE_MOCK_MODE) {
    console.log('🔧 Using mock Bedrock service')
    return await mockInvokeBedrock(prompt, {
      temperature: parseFloat(process.env.MODEL_TEMPERATURE || '0.7'),
      maxTokens: 1024,
    })
  }

  // Try AWS Bedrock if credentials are available
  try {
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
    console.error('Bedrock invocation error, falling back to mock:', error.message)
    // Final fallback to mock
    return await mockInvokeBedrock(prompt, {
      temperature: parseFloat(process.env.MODEL_TEMPERATURE || '0.7'),
      maxTokens: 1024,
    })
  }
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
 * Demo mode responses - predefined answers for common questions
 */
function getDemoResponse(message, conversationHistory) {
  const lowerMessage = message.toLowerCase().trim()
  
  // Greeting responses
  if (lowerMessage.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)) {
    return {
      response: "Hello! 👋 Welcome to our AI Automation Suite support. I'm here to help you with any questions about our services, features, or technical issues. How can I assist you today?",
      confidence: 0.95,
      demo: true
    }
  }

  // Help requests
  if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return {
      response: "I'd be happy to help! Our AI Automation Suite offers three main agents:\n\n1. **Customer Support Agent** - Handles customer inquiries and ticket management\n2. **Data Analytics Agent** - Analyzes CRM data and generates insights\n3. **Marketing Automation Agent** - Schedules posts and tracks engagement\n\nWhat specific feature would you like to know more about?",
      confidence: 0.90,
      demo: true
    }
  }

  // Pricing questions
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
    return {
      response: "Thank you for your interest! Our pricing plans are flexible and designed to scale with your business needs. We offer:\n\n• **Starter Plan** - Perfect for small teams\n• **Professional Plan** - For growing businesses\n• **Enterprise Plan** - Custom solutions for large organizations\n\nWould you like me to connect you with our sales team for detailed pricing information?",
      confidence: 0.85,
      demo: true
    }
  }

  // Feature questions
  if (lowerMessage.includes('feature') || lowerMessage.includes('what can') || lowerMessage.includes('capabilities')) {
    return {
      response: "Our AI Automation Suite includes powerful features:\n\n✨ **AI-Powered Support** - Automated ticket triage and responses\n📊 **Data Analytics** - Real-time insights from your CRM data\n📱 **Social Media Management** - Schedule and track posts across platforms\n⚙️ **Admin Dashboard** - Configure settings and manage your agents\n\nIs there a specific feature you'd like to explore?",
      confidence: 0.90,
      demo: true
    }
  }

  // Technical issues
  if (lowerMessage.includes('error') || lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('not working')) {
    return {
      response: "I'm sorry to hear you're experiencing an issue. Let me help you troubleshoot:\n\n1. **Check your connection** - Ensure you have a stable internet connection\n2. **Clear cache** - Try clearing your browser cache and cookies\n3. **Refresh the page** - Sometimes a simple refresh resolves the issue\n4. **Check browser compatibility** - We support Chrome, Firefox, Safari, and Edge\n\nIf the problem persists, I can escalate this to our technical team. Can you provide more details about the error?",
      confidence: 0.80,
      demo: true
    }
  }

  // Account questions
  if (lowerMessage.includes('account') || lowerMessage.includes('sign up') || lowerMessage.includes('register')) {
    return {
      response: "Creating an account is easy! Simply:\n\n1. Click the 'Sign Up' button on the login page\n2. Enter your name, email, and create a password\n3. Verify your email address\n4. Start using our AI agents!\n\nYour account gives you access to all three AI agents and the admin dashboard. Need help with the signup process?",
      confidence: 0.95,
      demo: true
    }
  }

  // Thank you responses
  if (lowerMessage.match(/^(thanks|thank you|appreciate|grateful)/)) {
    return {
      response: "You're very welcome! 😊 I'm glad I could help. If you have any other questions or need further assistance, feel free to ask. Have a great day!",
      confidence: 0.95,
      demo: true
    }
  }

  // Goodbye responses
  if (lowerMessage.match(/^(bye|goodbye|see you|farewell|exit|quit)/)) {
    return {
      response: "Thank you for contacting us! If you need any further assistance, don't hesitate to reach out. Have a wonderful day! 👋",
      confidence: 0.95,
      demo: true
    }
  }

  // Default demo response
  return {
    response: `Thank you for your message: "${message}". I'm here to help! Our AI Automation Suite can assist with:\n\n• Customer support automation\n• Data analytics and insights\n• Marketing campaign management\n• System configuration\n\nCould you provide more details about what you'd like help with? This will help me give you the most accurate assistance.`,
    confidence: 0.75,
    demo: true
  }
}

/**
 * Main handler
 */
exports.handler = async (event) => {
  try {
    const body = event.body ? (typeof event.body === 'string' ? JSON.parse(event.body) : event.body) : {}
    const { message, conversationHistory, demoMode } = body

    if (!message) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Message is required' }),
      }
    }

    // Check if demo mode is enabled (default to true in mock mode or when explicitly requested)
    // If demoMode is explicitly false, use AI. Otherwise, default to demo mode for better UX
    const useDemoMode = demoMode === true || (demoMode !== false && USE_MOCK_MODE)

    if (useDemoMode) {
      console.log('🎭 Using DEMO MODE - Providing predefined responses')
      const demoResponse = getDemoResponse(message, conversationHistory)
      
      // Create ticket
      const ticket = await createCRMTicket(message, demoResponse.confidence, false)
      
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
          ticketId: ticket.id,
          escalated: false,
          demoMode: true,
        }),
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

    // Generate AI response
    const aiResponse = await invokeAI(prompt)

    // Calculate confidence
    const confidence = calculateConfidence(aiResponse, message)
    const escalated = confidence < CONFIDENCE_THRESHOLD

    // Create ticket in CRM
    const ticket = await createCRMTicket(message, confidence, escalated)

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
        ticketId: ticket.id,
        escalated,
      }),
    }
  } catch (error) {
    console.error('Error in support chat handler:', error)
    
    // Try to provide a fallback response instead of just error
    try {
      const fallbackResponse = await mockInvokeBedrock(
        `You are a helpful customer support agent. A customer said: ${message}. Provide a helpful response.`,
        { temperature: 0.7, maxTokens: 512 }
      )
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          response: fallbackResponse,
          confidence: 0.7,
          ticketCreated: false,
          escalated: false,
          warning: 'Using fallback response due to API error',
        }),
      }
    } catch (fallbackError) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ 
          error: 'Internal server error',
          details: error.message 
        }),
      }
    }
  }
}

