#!/usr/bin/env python3
"""
Simple Elastic Log Analyzer
Quick log analysis and error detection
"""

import requests
import json
from datetime import datetime, timedelta

class LogAnalyzer:
    def __init__(self, elastic_url, index_pattern="logs-*"):
        self.elastic_url = elastic_url.rstrip('/')
        self.index_pattern = index_pattern
    
    def search_logs(self, query, size=100):
        """Search logs with simple query"""
        url = f"{self.elastic_url}/{self.index_pattern}/_search"
        data = {
            "query": {"match": {"message": query}},
            "size": size,
            "sort": [{"@timestamp": {"order": "desc"}}]
        }
        response = requests.post(url, json=data)
        return response.json()
    
    def get_error_count(self, hours=1):
        """Count errors in last N hours"""
        url = f"{self.elastic_url}/{self.index_pattern}/_search"
        since = datetime.now() - timedelta(hours=hours)
        data = {
            "query": {
                "bool": {
                    "must": [
                        {"match": {"level": "error"}},
                        {"range": {"@timestamp": {"gte": since.isoformat()}}}
                    ]
                }
            },
            "size": 0
        }
        response = requests.post(url, json=data)
        return response.json()['hits']['total']['value']
    
    def get_top_errors(self, limit=10):
        """Get most common error messages"""
        url = f"{self.elastic_url}/{self.index_pattern}/_search"
        data = {
            "query": {"match": {"level": "error"}},
            "size": 0,
            "aggs": {
                "error_messages": {
                    "terms": {"field": "message.keyword", "size": limit}
                }
            }
        }
        response = requests.post(url, json=data)
        return response.json()['aggregations']['error_messages']['buckets']

# Usage example
if __name__ == "__main__":
    analyzer = LogAnalyzer("https://your-elastic-instance.com")
    print(f"Errors in last hour: {analyzer.get_error_count()}")
    print("Top errors:", analyzer.get_top_errors())
