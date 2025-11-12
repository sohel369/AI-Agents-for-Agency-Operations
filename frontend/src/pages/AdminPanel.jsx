import { useState, useEffect } from 'react'
import { Save, Loader2, CheckCircle, Settings, Key, Server, FileText, Shield, Sparkles } from 'lucide-react'
import axios from 'axios'
import { useNotifications } from '../context/NotificationContext'

const AdminPanel = () => {
  const { showSuccess, showError } = useNotifications()
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
      supportAgent: '',
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
      showSuccess('Configuration Saved', 'All settings have been saved successfully!')
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving config:', error)
      showError('Save Failed', 'Failed to save configuration. Please try again.')
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

  const sections = [
    {
      title: 'AI Model Settings',
      icon: Sparkles,
      gradient: 'from-primary-500 to-cyan-500',
      fields: [
        {
          label: 'Model Temperature',
          field: 'modelTemperature',
          type: 'number',
          min: 0,
          max: 1,
          step: 0.1,
          description: 'Controls randomness (0 = deterministic, 1 = creative)',
        },
        {
          label: 'Confidence Threshold',
          field: 'confidenceThreshold',
          type: 'number',
          min: 0,
          max: 1,
          step: 0.1,
          description: 'Minimum confidence for auto-resolution (below = human escalation)',
        },
      ],
    },
    {
      title: 'API Endpoints',
      icon: Server,
      gradient: 'from-primary-600 to-cyan-500',
      fields: [
        {
          label: 'CRM Endpoint URL',
          field: 'crmEndpointUrl',
          type: 'url',
          placeholder: 'https://api.crm.example.com',
        },
      ],
    },
    {
      title: 'API Keys',
      icon: Key,
      gradient: 'from-primary-500 to-primary-600',
      fields: [
        {
          label: 'AWS Bedrock API Key',
          field: 'apiKeys.bedrock',
          type: 'password',
          placeholder: 'Enter Bedrock API key',
        },
        {
          label: 'Slack API Key',
          field: 'apiKeys.slack',
          type: 'password',
          placeholder: 'Enter Slack API key',
        },
        {
          label: 'CRM API Key',
          field: 'apiKeys.crm',
          type: 'password',
          placeholder: 'Enter CRM API key',
        },
        {
          label: 'Support Agent API Key',
          field: 'apiKeys.supportAgent',
          type: 'password',
          placeholder: 'Enter Support Agent API key',
          description: 'API key for the Customer Support Agent service',
        },
      ],
    },
    {
      title: 'Report Settings',
      icon: FileText,
      gradient: 'from-cyan-500 to-primary-500',
      fields: [
        {
          label: 'Default Report Format',
          field: 'reportFormat',
          type: 'select',
          options: [
            { value: 'text', label: 'Plain Text' },
            { value: 'markdown', label: 'Markdown' },
            { value: 'json', label: 'JSON' },
          ],
        },
      ],
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-cyan-500 p-8 lg:p-12 shadow-2xl">
        {/* Pattern overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative flex items-center space-x-4">
          <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-lg">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white">Admin Configuration</h1>
            <p className="mt-2 text-lg text-white/90">
              Manage AI model settings, API keys, and system configuration
            </p>
          </div>
        </div>
      </div>

      {saved && (
        <div className="rounded-xl bg-green-900/30 border border-green-700/50 p-4 flex items-center space-x-3 animate-fade-in backdrop-blur-sm">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <span className="font-medium text-green-300">Configuration saved successfully!</span>
        </div>
      )}

      {/* Configuration Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <div
              key={section.title}
              className="group relative overflow-hidden rounded-2xl bg-slate-800/90 dark:bg-slate-900/90 backdrop-blur-lg border border-slate-700/50 dark:border-slate-600/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative">
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${section.gradient} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">{section.title}</h2>
                </div>

                <div className="space-y-4">
                  {section.fields.map((field) => (
                    <div key={field.field}>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {field.label}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          value={field.field.includes('.') 
                            ? config[field.field.split('.')[0]][field.field.split('.')[1]]
                            : config[field.field]
                          }
                          onChange={(e) => handleChange(field.field, e.target.value)}
                          className="w-full rounded-lg border border-slate-600 dark:border-slate-500 bg-slate-700 dark:bg-slate-800 text-white px-4 py-2 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                        >
                          {field.options.map((option) => (
                            <option key={option.value} value={option.value} className="bg-slate-800">
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          value={field.field.includes('.') 
                            ? config[field.field.split('.')[0]][field.field.split('.')[1]]
                            : config[field.field]
                          }
                          onChange={(e) => handleChange(field.field, field.type === 'number' ? parseFloat(e.target.value) : e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full rounded-lg border border-slate-600 dark:border-slate-500 bg-slate-700 dark:bg-slate-800 text-white px-4 py-2 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors placeholder-slate-400"
                        />
                      )}
                      {field.description && (
                        <p className="mt-1 text-xs text-slate-400">{field.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-8 py-4 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center space-x-2">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            <span>{loading ? 'Saving...' : 'Save Configuration'}</span>
          </div>
        </button>
      </div>
    </div>
  )
}

export default AdminPanel
