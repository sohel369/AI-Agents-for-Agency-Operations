/**
 * Quick test script for Support Agent
 * Run: node test-support-agent.js
 */

const supportChat = require('./backend/src/support/chat')

async function testSupportAgent() {
  console.log('🧪 Testing Support Agent...\n')

  // Test 1: Demo Mode
  console.log('Test 1: Demo Mode')
  try {
    const demoEvent = {
      body: JSON.stringify({
        message: 'hello',
        demoMode: true
      })
    }
    const demoResponse = await supportChat.handler(demoEvent)
    const demoData = JSON.parse(demoResponse.body)
    console.log('✅ Demo Mode:', demoData.demoMode)
    console.log('✅ Response:', demoData.response.substring(0, 80) + '...')
    console.log('')
  } catch (error) {
    console.error('❌ Demo Mode failed:', error.message)
  }

  // Test 2: AI Mode (will fallback to demo if no API key)
  console.log('Test 2: AI Mode (with fallback)')
  try {
    const aiEvent = {
      body: JSON.stringify({
        message: 'What are your features?',
        demoMode: false
      })
    }
    const aiResponse = await supportChat.handler(aiEvent)
    const aiData = JSON.parse(aiResponse.body)
    console.log('✅ Status:', aiResponse.statusCode)
    console.log('✅ Response:', aiData.response ? aiData.response.substring(0, 80) + '...' : aiData.error)
    console.log('')
  } catch (error) {
    console.error('❌ AI Mode failed:', error.message)
  }

  // Test 3: Error Handling
  console.log('Test 3: Error Handling')
  try {
    const errorEvent = {
      body: JSON.stringify({
        message: '', // Empty message should trigger error
        demoMode: true
      })
    }
    const errorResponse = await supportChat.handler(errorEvent)
    const errorData = JSON.parse(errorResponse.body)
    console.log('✅ Error handling:', errorResponse.statusCode === 400 ? 'Working' : 'Failed')
    console.log('✅ Error message:', errorData.error)
  } catch (error) {
    console.error('❌ Error handling test failed:', error.message)
  }

  console.log('\n✅ All tests completed!')
}

testSupportAgent().catch(console.error)

