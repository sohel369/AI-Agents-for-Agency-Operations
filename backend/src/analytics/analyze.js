/**
 * Data Analytics Agent - AI Analysis
 * Analyzes CRM data using AWS Bedrock and generates insights
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
 * Invoke Bedrock model to analyze data (or use mock)
 */
async function invokeBedrock(prompt) {
  if (USE_MOCK_MODE) {
    // Use mock Bedrock service
    return await mockInvokeBedrock(prompt, {
      temperature: parseFloat(process.env.MODEL_TEMPERATURE || '0.7'),
      maxTokens: 2048,
    })
  }

  try {
    const input = {
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 2048,
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
    const { data } = body

    if (!data) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Data is required' }),
      }
    }

    const prompt = `You are a data analytics expert. Analyze the following CRM data and provide key insights, trends, and actionable recommendations.

Data:
${JSON.stringify(data, null, 2)}

Provide a comprehensive analysis including:
1. Key metrics summary
2. Notable trends
3. Areas of concern
4. Actionable recommendations

Format your response in a clear, professional manner:`

    const insights = await invokeBedrock(prompt)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        insights,
        generatedAt: new Date().toISOString(),
      }),
    }
  } catch (error) {
    console.error('Error in analytics analyze handler:', error)
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

