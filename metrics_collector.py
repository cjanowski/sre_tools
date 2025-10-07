#!/usr/bin/env python3
"""
Simple Metrics Collector
Collect and store system metrics in Elasticsearch
"""

import psutil
import requests
import json
from datetime import datetime

class MetricsCollector:
    def __init__(self, elastic_url, index_name="metrics"):
        self.elastic_url = elastic_url.rstrip('/')
        self.index_name = index_name
    
    def collect_system_metrics(self):
        """Collect basic system metrics"""
        return {
            "timestamp": datetime.now().isoformat(),
            "cpu_percent": psutil.cpu_percent(),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent,
            "load_average": psutil.getloadavg()[0] if hasattr(psutil, 'getloadavg') else 0
        }
    
    def store_metrics(self, metrics):
        """Store metrics in Elasticsearch"""
        url = f"{self.elastic_url}/{self.index_name}/_doc"
        response = requests.post(url, json=metrics)
        return response.status_code == 201
    
    def collect_and_store(self):
        """Collect and store metrics in one call"""
        metrics = self.collect_system_metrics()
        return self.store_metrics(metrics)

# Usage example
if __name__ == "__main__":
    collector = MetricsCollector("https://your-elastic-instance.com")
    if collector.collect_and_store():
        print("Metrics stored successfully")
    else:
        print("Failed to store metrics")
