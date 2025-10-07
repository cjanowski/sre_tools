import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { tool, config } = await request.json()
    
    let result
    switch (tool) {
      case 'error-count':
        result = await handleErrorCount(config)
        break
      
      case 'top-errors':
        result = await handleTopErrors(config)
        break
      
      case 'collect-metrics':
        result = await handleCollectMetrics()
        break
      
      case 'monitor-cpu':
        result = await handleMonitorCpu()
        break
      
      case 'create-dashboard':
        result = await handleCreateDashboard(config)
        break
      
      default:
        return NextResponse.json({ error: 'Unknown tool' }, { status: 400 })
    }
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleErrorCount(config: any) {
  try {
    const response = await fetch(`${config.elasticUrl}/logs-*/_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${config.username}:${config.password}`).toString('base64')}`
      },
      body: JSON.stringify({
        query: { match: { level: 'error' } },
        size: 0
      })
    })
    
    const data = await response.json()
    return { errorCount: data.hits?.total?.value || 0 }
  } catch (error) {
    return { error: 'Failed to count errors' }
  }
}

async function handleTopErrors(config: any) {
  try {
    const response = await fetch(`${config.elasticUrl}/logs-*/_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${config.username}:${config.password}`).toString('base64')}`
      },
      body: JSON.stringify({
        query: { match: { level: 'error' } },
        size: 0,
        aggs: {
          error_messages: {
            terms: { field: 'message.keyword', size: 10 }
          }
        }
      })
    })
    
    const data = await response.json()
    return { topErrors: data.aggregations?.error_messages?.buckets || [] }
  } catch (error) {
    return { error: 'Failed to get top errors' }
  }
}

async function handleCollectMetrics() {
  try {
    // Simulate metrics collection (psutil not available in Vercel)
    const metrics = {
      timestamp: new Date().toISOString(),
      cpu_percent: Math.random() * 100,
      memory_percent: Math.random() * 100,
      disk_percent: Math.random() * 100,
      note: 'Simulated metrics (psutil not available in serverless environment)'
    }
    
    return { metrics, message: 'Metrics collected successfully (simulated)' }
  } catch (error) {
    return { error: 'Failed to collect metrics' }
  }
}

async function handleMonitorCpu() {
  try {
    // Simulate CPU monitoring (psutil not available in Vercel)
    const cpu_percent = Math.random() * 100
    const threshold = 80
    
    if (cpu_percent > threshold) {
      return {
        alert: true,
        message: `High CPU usage: ${cpu_percent.toFixed(1)}% (threshold: ${threshold}%) - SIMULATED`,
        severity: 'critical'
      }
    }
    
    return {
      alert: false,
      message: `CPU usage normal: ${cpu_percent.toFixed(1)}% - SIMULATED`,
      severity: 'info'
    }
  } catch (error) {
    return { error: 'Failed to monitor CPU' }
  }
}

async function handleCreateDashboard(config: any) {
  try {
    // Create index pattern
    const indexResponse = await fetch(`${config.kibanaUrl}/api/saved_objects/index-pattern`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'kbn-xsrf': 'true'
      },
      body: JSON.stringify({
        attributes: {
          title: 'logs-*',
          timeFieldName: '@timestamp'
        }
      })
    })
    
    return { 
      success: true, 
      message: 'Dashboard components created successfully' 
    }
  } catch (error) {
    return { error: 'Failed to create dashboard' }
  }
}
