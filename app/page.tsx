'use client'

import { useState, useEffect } from 'react'
import { Search, Activity, AlertTriangle, BarChart3, Settings, Moon, Sun, Copy, CheckCircle, FileText } from 'lucide-react'

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
  const [darkMode, setDarkMode] = useState(true)
  const [copied, setCopied] = useState(false)
  const [k8sConfig, setK8sConfig] = useState({
    appName: '',
    namespace: 'default',
    image: '',
    replicas: '3',
    port: '8080',
    cpu: '100m',
    memory: '128Mi'
  })
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleConfigChange = (field: keyof Config, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }

  const handleK8sConfigChange = (field: string, value: string) => {
    setK8sConfig(prev => ({ ...prev, [field]: value }))
  }

  const generateK8sTemplate = () => {
    return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${k8sConfig.appName || 'my-app'}
  namespace: ${k8sConfig.namespace}
spec:
  replicas: ${k8sConfig.replicas}
  selector:
    matchLabels:
      app: ${k8sConfig.appName || 'my-app'}
  template:
    metadata:
      labels:
        app: ${k8sConfig.appName || 'my-app'}
    spec:
      containers:
      - name: ${k8sConfig.appName || 'my-app'}
        image: ${k8sConfig.image || 'nginx:latest'}
        ports:
        - containerPort: ${k8sConfig.port}
        resources:
          requests:
            memory: "${k8sConfig.memory}"
            cpu: "${k8sConfig.cpu}"
          limits:
            memory: "${k8sConfig.memory}"
            cpu: "${k8sConfig.cpu}"
---
apiVersion: v1
kind: Service
metadata:
  name: ${k8sConfig.appName || 'my-app'}-service
  namespace: ${k8sConfig.namespace}
spec:
  selector:
    app: ${k8sConfig.appName || 'my-app'}
  ports:
  - protocol: TCP
    port: ${k8sConfig.port}
    targetPort: ${k8sConfig.port}
  type: ClusterIP`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'k8s', label: 'K8s Templates', icon: FileText }
  ]

  return (
    <div className="space-y-6">
      {/* Header with Dark Mode Toggle */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            SRE Tools Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor and manage your Elastic stack
          </p>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Configuration Tab */}
      {activeTab === 'config' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-500" />
            Elastic Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
              <Search className="w-5 h-5 mr-2 text-blue-500" />
              Log Analysis
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Query
                </label>
                <input
                  type="text"
                  placeholder="error OR warning"
                  className="input-field"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => runTool('error-count')}
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Running...' : '📊 Count Errors'}
                </button>
                <button
                  onClick={() => runTool('top-errors')}
                  disabled={loading}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🔍 Top Errors
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Tab */}
      {activeTab === 'metrics' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-500" />
            System Metrics
          </h2>
          <button
            onClick={() => runTool('collect-metrics')}
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Collecting...' : '📊 Collect Metrics'}
          </button>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-blue-500" />
            Alert Management
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Monitoring...' : '🚨 Monitor CPU'}
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            Dashboard Generator
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Creating...' : '📊 Create Dashboard'}
            </button>
          </div>
        </div>
      )}

      {/* Kubernetes Templates Tab */}
      {activeTab === 'k8s' && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Kubernetes Templates
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  App Name *
                </label>
                <input
                  type="text"
                  value={k8sConfig.appName}
                  onChange={(e) => handleK8sConfigChange('appName', e.target.value)}
                  placeholder="my-app"
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Namespace
                </label>
                <input
                  type="text"
                  value={k8sConfig.namespace}
                  onChange={(e) => handleK8sConfigChange('namespace', e.target.value)}
                  placeholder="default"
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Docker Image *
                </label>
                <input
                  type="text"
                  value={k8sConfig.image}
                  onChange={(e) => handleK8sConfigChange('image', e.target.value)}
                  placeholder="nginx:latest"
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Replicas
                </label>
                <input
                  type="number"
                  value={k8sConfig.replicas}
                  onChange={(e) => handleK8sConfigChange('replicas', e.target.value)}
                  placeholder="3"
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Container Port
                </label>
                <input
                  type="number"
                  value={k8sConfig.port}
                  onChange={(e) => handleK8sConfigChange('port', e.target.value)}
                  placeholder="8080"
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CPU Request
                </label>
                <input
                  type="text"
                  value={k8sConfig.cpu}
                  onChange={(e) => handleK8sConfigChange('cpu', e.target.value)}
                  placeholder="100m"
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Memory Request
                </label>
                <input
                  type="text"
                  value={k8sConfig.memory}
                  onChange={(e) => handleK8sConfigChange('memory', e.target.value)}
                  placeholder="128Mi"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Generated Template */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Generated Manifest
              </h3>
              <button
                onClick={() => copyToClipboard(generateK8sTemplate())}
                className="btn-secondary flex items-center space-x-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>
            </div>
            
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto text-sm border border-gray-300 dark:border-gray-700">
              <code className="text-gray-800 dark:text-gray-200">{generateK8sTemplate()}</code>
            </pre>
            
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                💡 <strong>Quick Deploy:</strong> Copy the manifest and run: <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">kubectl apply -f manifest.yaml</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Results</h3>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto text-sm border border-gray-300 dark:border-gray-700">
            <code className="text-gray-800 dark:text-gray-200">{JSON.stringify(results, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
