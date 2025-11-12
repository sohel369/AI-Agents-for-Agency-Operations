/**
 * Marketing Automation Agent - Content Generator
 * Generates social media post suggestions using AWS Bedrock
 */

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime')
const { mockInvokeBedrock, shouldUseMockMode } = require('../../mock/bedrockMock')

// Check if we should use mock mode
const USE_MOCK_MODE = shouldUseMockMode()

if (USE_MOCK_MODE) {
  console.log('🔧 Running in LOCAL MOCK MODE - AWS credentials not required')
}

// Initialize client only if not in mock mode
let bedrockClient = null

if (!USE_MOCK_MODE) {
  bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION || 'us-east-1' })
}

const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-v2'

/**
 * Invoke Bedrock model to generate post content (or use mock)
 */
async function invokeBedrock(prompt) {
  if (USE_MOCK_MODE) {
    // Use mock Bedrock service
    return await mockInvokeBedrock(prompt, {
      temperature: parseFloat(process.env.MODEL_TEMPERATURE || '0.8'),
      maxTokens: 512,
    })
  }

  try {
    const input = {
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 512,
        temperature: parseFloat(process.env.MODEL_TEMPERATURE || '0.8'),
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
    console.error('Bedrock invocation error:', error)
    throw error
  }
}

/**
 * Main handler
 */
exports.handler = async (event) => {
  try {
    const body = event.body ? (typeof event.body === 'string' ? JSON.parse(event.body) : event.body) : {}
    const { platform } = body

    if (!platform) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Platform is required' }),
      }
    }

    const platformContext = {
      facebook: 'professional yet engaging, suitable for a business audience',
      linkedin: 'professional and thought-leadership focused',
      twitter: 'concise, engaging, and suitable for quick consumption',
    }

    const prompt = `Generate a compelling social media post for ${platform}. 

Style: ${platformContext[platform] || 'engaging and professional'}
Length: ${platform === 'twitter' ? '280 characters or less' : '2-3 sentences'}
Tone: Professional but approachable

Generate the post content:`

    const suggestion = await invokeBedrock(prompt)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        suggestion: suggestion.trim(),
        platform,
      }),
    }
  } catch (error) {
    console.error('Error in marketing generate handler:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}

