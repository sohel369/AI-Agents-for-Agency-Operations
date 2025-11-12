/**
 * Data Analytics Agent - Data Fetcher
 * Fetches mock CRM data (in production, connects to actual CRM)
 */

exports.handler = async (event) => {
  try {
    // Placeholder: In production, fetch from actual CRM API
    const mockData = {
      customers: [
        { id: 1, name: 'Acme Corp', revenue: 125000, status: 'active', signupDate: '2024-01-15' },
        { id: 2, name: 'TechStart Inc', revenue: 89000, status: 'active', signupDate: '2024-02-20' },
        { id: 3, name: 'Global Solutions', revenue: 245000, status: 'active', signupDate: '2024-01-05' },
        { id: 4, name: 'Digital Ventures', revenue: 67000, status: 'trial', signupDate: '2024-03-10' },
        { id: 5, name: 'Enterprise Ltd', revenue: 189000, status: 'active', signupDate: '2024-02-01' },
      ],
      metrics: {
        totalRevenue: 715000,
        activeCustomers: 4,
        trialCustomers: 1,
        averageRevenue: 143000,
        growthRate: 12.5,
      },
      trends: {
        monthlyRevenue: [
          { month: 'Jan', revenue: 245000 },
          { month: 'Feb', revenue: 278000 },
          { month: 'Mar', revenue: 192000 },
        ],
        customerGrowth: [
          { month: 'Jan', customers: 2 },
          { month: 'Feb', customers: 4 },
          { month: 'Mar', customers: 5 },
        ],
      },
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(mockData),
    }
  } catch (error) {
    console.error('Error fetching analytics data:', error)
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

