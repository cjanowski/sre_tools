import { NextRequest, NextResponse } from 'next/server'
import psutil from 'psutil'

export async function POST(request: NextRequest) {
  try {
    const { tool, config } = await request.json()
    
    switch (tool) {
      case 'error-count':
        return await handleErrorCount(config)
      
      case 'top-errors':
        return await handleTopErrors(config)
      
      case 'collect-metrics':
        return await handleCollectMetrics()
      
      case 'monitor-cpu':
        return await handleMonitorCpu()
      
      case 'create-dashboard':
        return await handleCreateDashboard(config)
      
      default:
        return NextResponse.json({ error: 'Unknown tool' }, { status: 400 })
    }
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
    const metrics = {
      timestamp: new Date().toISOString(),
      cpu_percent: psutil.cpu_percent(),
      memory_percent: psutil.virtual_memory().percent,
      disk_percent: psutil.disk_usage('/').percent
    }
    
    return { metrics, message: 'Metrics collected successfully' }
  } catch (error) {
    return { error: 'Failed to collect metrics' }
  }
}

async function handleMonitorCpu() {
  try {
    const cpu_percent = psutil.cpu_percent()
    const threshold = 80
    
    if (cpu_percent > threshold) {
      return {
        alert: true,
        message: `High CPU usage: ${cpu_percent}% (threshold: ${threshold}%)`,
        severity: 'critical'
      }
    }
    
    return {
      alert: false,
      message: `CPU usage normal: ${cpu_percent}%`,
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
