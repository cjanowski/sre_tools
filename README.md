# 🔧 Elastic SRE Tools

[https://sre-tools-git-main-coryjs-projects.vercel.app/](https://sre-tools-git-main-coryjs-projects.vercel.app/)

A comprehensive collection of SRE tools for Elastic observability, including both standalone Python scripts and a modern web dashboard.

## 📁 Project Structure

```
sre_tools/
├── app/                          # Next.js web dashboard
│   ├── api/run-tool/route.ts     # API endpoints
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # App layout
│   └── page.tsx                  # Main dashboard
├── log_analyzer.py               # Log analysis tool
├── metrics_collector.py          # Metrics collection tool
├── alert_manager.py              # Alert management tool
├── dashboard_generator.py        # Dashboard creation tool
├── package.json                  # Node.js dependencies
├── next.config.js               # Next.js configuration
├── tailwind.config.js            # Tailwind CSS config
├── postcss.config.js             # PostCSS config
├── vercel.json                   # Vercel deployment config
└── README.md                     # This file
```

## 🚀 Quick Start

### Web Dashboard (Recommended)

1. **Install dependencies**:
   ```bash
   cd sre_tools
   npm install
   ```

2. **Run locally**:
   ```bash
   npm run dev
   ```

3. **Deploy to Vercel**:
   ```bash
   npx vercel --prod
   ```

### Standalone Python Tools

Each Python tool can be run independently:

```bash
# Log Analysis
python log_analyzer.py

# Metrics Collection
python metrics_collector.py

# Alert Management
python alert_manager.py

# Dashboard Generation
python dashboard_generator.py
```

## 🛠️ Tools Available

### 1. **Web Dashboard** (Modern UI)
- **Configuration Management**: Easy setup of Elastic connections
- **Log Analysis**: Search logs, count errors, get top errors
- **Metrics Collection**: System monitoring (CPU, memory, disk)
- **Alert Management**: Threshold monitoring with notifications
- **Dashboard Generation**: Create Kibana dashboards programmatically

### 2. **Log Analyzer** (`log_analyzer.py`)
- Search logs with simple queries
- Count errors in time windows
- Get most common error messages
- Quick log analysis and error detection

### 3. **Metrics Collector** (`metrics_collector.py`)
- Collect system metrics (CPU, memory, disk)
- Store metrics in Elasticsearch
- Simple one-call collection
- Real-time performance monitoring

### 4. **Alert Manager** (`alert_manager.py`)
- Check metric thresholds
- Create and send alerts
- Monitor CPU usage with alerts
- Webhook integration for notifications

### 5. **Dashboard Generator** (`dashboard_generator.py`)
- Create Kibana index patterns
- Generate visualizations
- Build comprehensive dashboards
- Programmatic dashboard creation

## 🔧 Configuration

### Web Dashboard
1. Open the dashboard in your browser
2. Go to the "Configuration" tab
3. Enter your Elasticsearch and Kibana URLs
4. Add authentication credentials
5. Optionally configure webhook URLs for alerts

### Python Tools
Update the URLs and credentials in each script:

```python
# Example configuration
elastic_url = "https://your-elastic-instance.com"
kibana_url = "https://your-kibana-instance.com"
username = "elastic"
password = "your-password"
```

## 🚀 Deployment Options

### Vercel (Recommended for Web Dashboard)
- **Zero-config deployment**
- **Serverless functions**
- **Automatic HTTPS**
- **Global CDN**

### Docker (For Python Tools)
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY *.py .
RUN pip install requests psutil
CMD ["python", "log_analyzer.py"]
```

### Local Development
```bash
# Web Dashboard
npm run dev

# Python Tools
python log_analyzer.py
```

## 🔒 Security Notes

- **Web Dashboard**: Credentials stored in browser memory only
- **Python Tools**: Update credentials in each script
- **Production**: Use environment variables for sensitive data
- **Authentication**: All tools support basic auth

## 📊 Features

### Web Dashboard Features
- ✅ Modern, responsive UI
- ✅ Tabbed interface for easy navigation
- ✅ Real-time results display
- ✅ Configuration management
- ✅ Integrated tool execution

### Python Tools Features
- ✅ Lightweight and fast
- ✅ Easy to customize
- ✅ Can be run as cron jobs
- ✅ Simple command-line interface
- ✅ Minimal dependencies

## 🎯 Use Cases

- **SRE Teams**: Monitor Elastic stack health
- **DevOps**: Automated log analysis
- **Operations**: System metrics collection
- **Alerting**: Threshold-based notifications
- **Dashboards**: Programmatic visualization creation

## 📝 Requirements

### Web Dashboard
- Node.js 18+
- npm or yarn
- Modern web browser

### Python Tools
- Python 3.7+
- requests library
- psutil library (for metrics)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use and modify as needed.
