/**
 * Mock AWS Bedrock Service
 * Simulates Bedrock API responses for local development without AWS credentials
 */

/**
 * Mock Bedrock invocation - simulates AI model responses
 * @param {string} prompt - The input prompt
 * @param {Object} options - Options like temperature, maxTokens
 * @returns {Promise<string>} - Mock AI response
 */
async function mockInvokeBedrock(prompt, options = {}) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))

  // Analyze prompt to generate contextually appropriate mock responses
  const lowerPrompt = prompt.toLowerCase()

  // Support Agent responses
  if (lowerPrompt.includes('customer') || lowerPrompt.includes('support') || lowerPrompt.includes('help')) {
    const supportResponses = [
      "Thank you for contacting us! I understand your concern. Let me help you with that. Based on your inquiry, I recommend checking our knowledge base or I can escalate this to a human agent if needed.",
      "I'd be happy to assist you! It sounds like you're experiencing an issue. Here's what I suggest: First, try refreshing the page. If that doesn't work, please provide more details and I'll help you further.",
      "Hello! I'm here to help. For the issue you're describing, we typically see this resolved by following these steps: 1) Clear your cache, 2) Restart the application, 3) Contact support if the problem persists. Would you like me to create a support ticket?",
    ]
    return supportResponses[Math.floor(Math.random() * supportResponses.length)]
  }

  // Analytics Agent responses
  if (lowerPrompt.includes('analyze') || lowerPrompt.includes('data') || lowerPrompt.includes('insight') || lowerPrompt.includes('trend')) {
    return `Based on sample data analysis, here are the key insights:

1. **Revenue Trends**: Revenue has shown steady growth over the past quarter, with a 12.5% increase month-over-month.

2. **Customer Metrics**: Active customer count is stable at 4,890 customers. Trial conversion rate is at 23%, which is above industry average.

3. **Key Opportunities**: 
   - Focus on upselling to existing customers (potential revenue increase of 15-20%)
   - Improve engagement in the trial period to boost conversion rates
   - Target high-value customer segments for expansion

4. **Recommendations**:
   - Implement a customer success program for trial users
   - Launch a referral program to leverage existing customer base
   - Consider A/B testing pricing strategies

Overall, the business is performing well with positive growth indicators.`
  }

  // Marketing Agent responses
  if (lowerPrompt.includes('marketing') || lowerPrompt.includes('post') || lowerPrompt.includes('content') || lowerPrompt.includes('social')) {
    if (lowerPrompt.includes('generate') || lowerPrompt.includes('suggestion')) {
      const marketingPosts = [
        "🚀 Exciting news! We're launching new features that will transform how you work. Stay tuned for updates! #Innovation #ProductLaunch",
        "💡 Did you know? Our customers save an average of 10 hours per week using our platform. See how we can help your business grow! #Productivity #BusinessGrowth",
        "✨ We're constantly improving based on your feedback. Thank you for being part of our journey! What feature would you like to see next? #CustomerFirst #Feedback",
        "🎯 Ready to take your business to the next level? Our team is here to help you succeed. Book a free consultation today! #BusinessGrowth #Consultation",
      ]
      return marketingPosts[Math.floor(Math.random() * marketingPosts.length)]
    }

    if (lowerPrompt.includes('recommend') || lowerPrompt.includes('plan') || lowerPrompt.includes('next week')) {
      return `**Next Week Marketing Plan Recommendations:**

**Monday - Wednesday:**
- Post engaging content about new product features (LinkedIn & Facebook)
- Share customer success stories (Twitter)
- Focus on educational content to establish thought leadership

**Thursday - Friday:**
- Launch a promotional campaign for new signups
- Engage with user-generated content and comments
- Post behind-the-scenes content to humanize the brand

**Weekend:**
- Light engagement posts (memes, quotes, community highlights)
- Respond to all comments and messages
- Prepare content for the following week

**Optimal Posting Times:**
- LinkedIn: 8-10 AM, 12-1 PM (weekdays)
- Facebook: 1-3 PM (weekdays)
- Twitter: 9-11 AM, 1-3 PM (daily)

**Content Themes:**
- 40% Educational/Value-driven
- 30% Product/Feature highlights
- 20% Customer success stories
- 10% Behind-the-scenes/Brand personality

**Engagement Strategy:**
- Respond to all comments within 2 hours
- Use relevant hashtags (3-5 per post)
- Include clear call-to-actions
- A/B test different post formats`
    }
  }

  // Default generic response
  const defaultResponses = [
    "Mock reply generated. This is a placeholder response for local development.",
    "Based on the information provided, I recommend taking the following steps to address your inquiry.",
    "Thank you for your question. Here's a helpful response that addresses your needs.",
  ]
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

/**
 * Check if we should use mock mode
 * @returns {boolean} - True if AWS credentials are missing
 */
function shouldUseMockMode() {
  // Explicitly enabled
  if (process.env.USE_MOCK_MODE === 'true') {
    return true
  }
  
  // AWS credentials missing or empty
  const hasAccessKey = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_ACCESS_KEY_ID.trim() !== ''
  const hasSecretKey = process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_SECRET_ACCESS_KEY.trim() !== ''
  
  if (!hasAccessKey || !hasSecretKey) {
    return true
  }
  
  return false
}

/**
 * Mock Bedrock client that mimics the real Bedrock SDK
 */
class MockBedrockClient {
  constructor() {
    this.isMock = true
  }

  async send(command) {
    if (command.input.modelId) {
      const prompt = this.extractPromptFromCommand(command)
      const response = await mockInvokeBedrock(prompt, {
        temperature: command.input.body?.temperature || 0.7,
        maxTokens: command.input.body?.max_tokens || 1024,
      })

      // Return response in Bedrock format
      return {
        body: {
          transformToString: () => JSON.stringify({
            content: [
              {
                text: response
              }
            ]
          })
        }
      }
    }
    throw new Error('Invalid mock command')
  }

  extractPromptFromCommand(command) {
    try {
      const body = JSON.parse(command.input.body)
      if (body.messages && body.messages.length > 0) {
        return body.messages[body.messages.length - 1].content
      }
      return body.prompt || ''
    } catch (e) {
      return ''
    }
  }
}

module.exports = {
  mockInvokeBedrock,
  shouldUseMockMode,
  MockBedrockClient,
}

