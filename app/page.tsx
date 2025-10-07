'use client'

import { useState } from 'react'
import { Search, Activity, AlertTriangle, BarChart3, Settings } from 'lucide-react'

interface Config {
  elasticUrl: string
  kibanaUrl: string
  username: string
  password: string
  webhookUrl: string
}

export default function Dashboard() {
  const [config, setConfig] = useState<Config>({
    elasticUrl: '',
    kibanaUrl: '',
    username: '',
    password: '',
    webhookUrl: ''
  })
  
  const [activeTab, setActiveTab] = useState('config')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleConfigChange = (field: keyof Config, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }

  const runTool = async (tool: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/run-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool, config })
      })
      const data = await response.json()
      setResults(data)
    } catch (error) {
      setResults({ error: 'Failed to run tool' })
    }
    setLoading(false)
  }

  const tabs = [
    { id: 'config', label: 'Configuration', icon: Settings },
    { id: 'logs', label: 'Log Analysis', icon: Search },
    { id: 'metrics', label: 'Metrics', icon: Activity },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 }
  ]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Configuration Tab */}
      {activeTab === 'config' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Elastic Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Elasticsearch URL
              </label>
              <input
                type="url"
                value={config.elasticUrl}
                onChange={(e) => handleConfigChange('elasticUrl', e.target.value)}
                placeholder="https://your-elastic-instance.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kibana URL
              </label>
              <input
                type="url"
                value={config.kibanaUrl}
                onChange={(e) => handleConfigChange('kibanaUrl', e.target.value)}
                placeholder="https://your-kibana-instance.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={config.username}
                onChange={(e) => handleConfigChange('username', e.target.value)}
                placeholder="elastic"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={config.password}
                onChange={(e) => handleConfigChange('password', e.target.value)}
                placeholder="••••••••"
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL (optional)
              </label>
              <input
                type="url"
                value={config.webhookUrl}
                onChange={(e) => handleConfigChange('webhookUrl', e.target.value)}
                placeholder="https://hooks.slack.com/..."
                className="input-field"
              />
            </div>
          </div>
        </div>
      )}

      {/* Log Analysis Tab */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Log Analysis</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Query
                </label>
                <input
                  type="text"
                  placeholder="error OR warning"
                  className="input-field"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => runTool('error-count')}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Running...' : 'Count Errors'}
                </button>
                <button
                  onClick={() => runTool('top-errors')}
                  disabled={loading}
                  className="btn-secondary"
                >
                  Top Errors
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Tab */}
      {activeTab === 'metrics' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">System Metrics</h2>
          <button
            onClick={() => runTool('collect-metrics')}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Collecting...' : 'Collect Metrics'}
          </button>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Alert Management</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPU Threshold (%)
              </label>
              <input
                type="number"
                placeholder="80"
                className="input-field w-32"
              />
            </div>
            <button
              onClick={() => runTool('monitor-cpu')}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Monitoring...' : 'Monitor CPU'}
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Dashboard Generator</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Index Pattern
              </label>
              <input
                type="text"
                placeholder="logs-*"
                className="input-field"
              />
            </div>
            <button
              onClick={() => runTool('create-dashboard')}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Creating...' : 'Create Dashboard'}
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Results</h3>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
