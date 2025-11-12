import { useState, useEffect } from 'react'
import { Save, Loader2, CheckCircle } from 'lucide-react'
import axios from 'axios'

const AdminPanel = () => {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [config, setConfig] = useState({
    modelTemperature: 0.7,
    confidenceThreshold: 0.8,
    crmEndpointUrl: 'https://api.crm.example.com',
    apiKeys: {
      bedrock: '',
      slack: '',
      crm: '',
      supportAgent: 'AIzaSyBKgR2EYZPaXlvPiaM2I_WDwpBYPokr5KE',
    },
    reportFormat: 'text',
  })

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await axios.get('/api/admin/config')
      if (response.data) {
        setConfig(response.data)
      }
    } catch (error) {
      console.error('Error fetching config:', error)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)
    try {
      await axios.post('/api/admin/config', config)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving config:', error)
      alert('Failed to save configuration. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setConfig((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setConfig((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Configuration Panel</h1>
        <p className="mt-2 text-gray-600">
          Configure AI model settings, thresholds, and API endpoints
        </p>
      </div>

      {saved && (
        <div className="mb-4 flex items-center space-x-2 rounded-lg bg-green-50 p-4 text-green-800">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Configuration saved successfully!</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Model Settings */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">AI Model Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Model Temperature
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={config.modelTemperature}
                onChange={(e) => handleChange('modelTemperature', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Controls randomness (0 = deterministic, 1 = creative)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confidence Threshold
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={config.confidenceThreshold}
                onChange={(e) => handleChange('confidenceThreshold', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum confidence for auto-resolution (below = human escalation)
              </p>
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">API Endpoints</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              CRM Endpoint URL
            </label>
            <input
              type="url"
              value={config.crmEndpointUrl}
              onChange={(e) => handleChange('crmEndpointUrl', e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://api.crm.example.com"
            />
          </div>
        </div>

        {/* API Keys */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">API Keys</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                AWS Bedrock API Key
              </label>
              <input
                type="password"
                value={config.apiKeys.bedrock}
                onChange={(e) => handleChange('apiKeys.bedrock', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter Bedrock API key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Slack API Key
              </label>
              <input
                type="password"
                value={config.apiKeys.slack}
                onChange={(e) => handleChange('apiKeys.slack', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter Slack API key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                CRM API Key
              </label>
              <input
                type="password"
                value={config.apiKeys.crm}
                onChange={(e) => handleChange('apiKeys.crm', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter CRM API key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Support Agent API Key
              </label>
              <input
                type="password"
                value={config.apiKeys.supportAgent || ''}
                onChange={(e) => handleChange('apiKeys.supportAgent', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter Support Agent API key"
              />
              <p className="mt-1 text-xs text-gray-500">
                API key for the Customer Support Agent service
              </p>
            </div>
          </div>
        </div>

        {/* Report Format */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Report Settings</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Default Report Format
            </label>
            <select
              value={config.reportFormat}
              onChange={(e) => handleChange('reportFormat', e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="text">Plain Text</option>
              <option value="markdown">Markdown</option>
              <option value="json">JSON</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center space-x-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            <span>{loading ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel

