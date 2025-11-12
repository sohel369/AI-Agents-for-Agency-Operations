/**
 * Marketing Automation Agent - Recommendations Handler
 * Generates next-week marketing plan recommendations using AWS Bedrock
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
 * Invoke Bedrock model to generate recommendations (or use mock)
 */
async function invokeBedrock(prompt) {
  if (USE_MOCK_MODE) {
    // Use mock Bedrock service
    return await mockInvokeBedrock(prompt, {
      temperature: parseFloat(process.env.MODEL_TEMPERATURE || '0.7'),
      maxTokens: 1024,
    })
  }

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
    const { posts, metrics } = body

    // Analyze engagement patterns
    const totalEngagement = metrics?.reduce((sum, m) => sum + m.engagement, 0) || 0
    const avgEngagement = metrics?.length > 0 ? totalEngagement / metrics.length : 0
    const bestDay = metrics?.reduce((best, m) => (m.engagement > best.engagement ? m : best), metrics?.[0] || {})

    const prompt = `You are a marketing strategy expert. Based on the following data, provide recommendations for next week's marketing plan.

Recent Posts: ${posts?.length || 0} scheduled posts
Average Daily Engagement: ${avgEngagement.toFixed(0)}
Best Performing Day: ${bestDay?.date || 'N/A'} with ${bestDay?.engagement || 0} engagements

Provide a comprehensive next-week marketing plan including:
1. Optimal posting schedule
2. Content themes to focus on
3. Platform-specific recommendations
4. Engagement optimization strategies

Format your response in a clear, actionable manner:`

    const recommendations = await invokeBedrock(prompt)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        recommendations,
        generatedAt: new Date().toISOString(),
      }),
    }
  } catch (error) {
    console.error('Error in marketing recommendations handler:', error)
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

