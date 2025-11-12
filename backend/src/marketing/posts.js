/**
 * Marketing Automation Agent - Posts Handler
 * Fetches and manages scheduled social media posts
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb')
const { shouldUseMockMode } = require('../../mock/bedrockMock')

// Check if we should use mock mode
const USE_MOCK_MODE = shouldUseMockMode()

if (USE_MOCK_MODE) {
  console.log('🔧 Running in LOCAL MOCK MODE - AWS credentials not required')
}

// In-memory store for mock mode
let mockPostsStore = []

// Initialize client only if not in mock mode
let dynamoClient = null

if (!USE_MOCK_MODE) {
  dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' }))
}

/**
 * GET - Fetch all posts
 */
exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'GET') {
      if (USE_MOCK_MODE) {
        // Return mock posts from in-memory store
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            posts: mockPostsStore,
          }),
        }
      }

      // Fetch posts from DynamoDB
      const result = await dynamoClient.send(
        new ScanCommand({
          TableName: process.env.POSTS_TABLE || 'MarketingPosts',
        })
      )

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          posts: result.Items || [],
        }),
      }
    }

    if (event.httpMethod === 'POST') {
      const body = event.body ? (typeof event.body === 'string' ? JSON.parse(event.body) : event.body) : {}
      const { platform, content, scheduledDate } = body

      if (!platform || !content || !scheduledDate) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ error: 'Platform, content, and scheduledDate are required' }),
        }
      }

      const post = {
        id: `POST-${Date.now()}`,
        platform,
        content,
        scheduledDate,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        metrics: {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
        },
      }

      if (USE_MOCK_MODE) {
        // Save to in-memory store
        mockPostsStore.push(post)
        console.log('📝 [MOCK] Post saved:', post)
      } else {
        // Save to DynamoDB
        try {
          await dynamoClient.send(
            new PutCommand({
              TableName: process.env.POSTS_TABLE || 'MarketingPosts',
              Item: post,
            })
          )
        } catch (error) {
          console.error('DynamoDB error (continuing in mock mode):', error.message)
        }
      }

      // Placeholder: In production, schedule post via social media APIs
      // await schedulePostOnPlatform(platform, content, scheduledDate)

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: true,
          post,
        }),
      }
    }

    if (event.httpMethod === 'PUT') {
      const body = event.body ? (typeof event.body === 'string' ? JSON.parse(event.body) : event.body) : {}
      const { id, platform, content, scheduledDate, status } = body

      if (!id) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ error: 'Post ID is required' }),
        }
      }

      if (USE_MOCK_MODE) {
        // Update post in in-memory store
        const postIndex = mockPostsStore.findIndex((p) => p.id === id)
        if (postIndex === -1) {
          return {
            statusCode: 404,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'Post not found' }),
          }
        }

        const existingPost = mockPostsStore[postIndex]
        const updatedPost = {
          ...existingPost,
          ...(platform && { platform }),
          ...(content && { content }),
          ...(scheduledDate && { scheduledDate }),
          ...(status && { status }),
          updatedAt: new Date().toISOString(),
        }

        mockPostsStore[postIndex] = updatedPost
        console.log('📝 [MOCK] Post updated:', updatedPost)

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            success: true,
            post: updatedPost,
          }),
        }
      }

      // Update post in DynamoDB
      try {
        // First, get the existing post
        const getResult = await dynamoClient.send(
          new GetCommand({
            TableName: process.env.POSTS_TABLE || 'MarketingPosts',
            Key: { id },
          })
        )

        if (!getResult.Item) {
          return {
            statusCode: 404,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'Post not found' }),
          }
        }

        const existingPost = getResult.Item
        const updateExpression = []
        const expressionAttributeNames = {}
        const expressionAttributeValues = {}

        if (platform) {
          updateExpression.push('#platform = :platform')
          expressionAttributeNames['#platform'] = 'platform'
          expressionAttributeValues[':platform'] = platform
        }
        if (content) {
          updateExpression.push('#content = :content')
          expressionAttributeNames['#content'] = 'content'
          expressionAttributeValues[':content'] = content
        }
        if (scheduledDate) {
          updateExpression.push('#scheduledDate = :scheduledDate')
          expressionAttributeNames['#scheduledDate'] = 'scheduledDate'
          expressionAttributeValues[':scheduledDate'] = scheduledDate
        }
        if (status) {
          updateExpression.push('#status = :status')
          expressionAttributeNames['#status'] = 'status'
          expressionAttributeValues[':status'] = status
        }

        updateExpression.push('#updatedAt = :updatedAt')
        expressionAttributeNames['#updatedAt'] = 'updatedAt'
        expressionAttributeValues[':updatedAt'] = new Date().toISOString()

        await dynamoClient.send(
          new UpdateCommand({
            TableName: process.env.POSTS_TABLE || 'MarketingPosts',
            Key: { id },
            UpdateExpression: `SET ${updateExpression.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
          })
        )

        const updatedPost = {
          ...existingPost,
          ...(platform && { platform }),
          ...(content && { content }),
          ...(scheduledDate && { scheduledDate }),
          ...(status && { status }),
          updatedAt: new Date().toISOString(),
        }

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            success: true,
            post: updatedPost,
          }),
        }
      } catch (error) {
        console.error('DynamoDB error:', error.message)
        return {
          statusCode: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ error: 'Failed to update post' }),
        }
      }
    }

    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  } catch (error) {
    console.error('Error in marketing posts handler:', error)
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

