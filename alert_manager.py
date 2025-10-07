#!/usr/bin/env python3
"""
Simple Alert Manager
Basic alerting system for SRE monitoring
"""

import requests
import json
from datetime import datetime

class AlertManager:
    def __init__(self, elastic_url, webhook_url=None):
        self.elastic_url = elastic_url.rstrip('/')
        self.webhook_url = webhook_url
    
    def check_threshold(self, metric, threshold, operator="gt"):
        """Check if metric exceeds threshold"""
        if operator == "gt":
            return metric > threshold
        elif operator == "lt":
            return metric < threshold
        elif operator == "eq":
            return metric == threshold
        return False
    
    def create_alert(self, title, message, severity="warning"):
        """Create and send alert"""
        alert = {
            "timestamp": datetime.now().isoformat(),
            "title": title,
            "message": message,
            "severity": severity
        }
        
        # Store in Elasticsearch
        url = f"{self.elastic_url}/alerts/_doc"
        requests.post(url, json=alert)
        
        # Send webhook if configured
        if self.webhook_url:
            requests.post(self.webhook_url, json=alert)
        
        return alert
    
    def monitor_cpu(self, threshold=80):
        """Monitor CPU usage and alert if high"""
        import psutil
        cpu_percent = psutil.cpu_percent()
        if self.check_threshold(cpu_percent, threshold):
            return self.create_alert(
                "High CPU Usage",
                f"CPU usage is {cpu_percent}% (threshold: {threshold}%)",
                "critical"
            )
        return None

# Usage example
if __name__ == "__main__":
    alert_manager = AlertManager("https://your-elastic-instance.com")
    alert = alert_manager.monitor_cpu(threshold=90)
    if alert:
        print(f"Alert created: {alert['title']}")
