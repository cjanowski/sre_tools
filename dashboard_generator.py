#!/usr/bin/env python3
"""
Simple Dashboard Generator
Generate basic Kibana dashboards programmatically
"""

import requests
import json

class DashboardGenerator:
    def __init__(self, kibana_url, elastic_url):
        self.kibana_url = kibana_url.rstrip('/')
        self.elastic_url = elastic_url.rstrip('/')
    
    def create_index_pattern(self, pattern, time_field="@timestamp"):
        """Create index pattern for dashboard"""
        url = f"{self.kibana_url}/api/saved_objects/index-pattern"
        data = {
            "attributes": {
                "title": pattern,
                "timeFieldName": time_field
            }
        }
        response = requests.post(url, json=data)
        return response.status_code == 200
    
    def create_visualization(self, title, index_pattern, agg_type="count"):
        """Create simple visualization"""
        url = f"{self.kibana_url}/api/saved_objects/visualization"
        data = {
            "attributes": {
                "title": title,
                "visState": json.dumps({
                    "type": "histogram",
                    "aggs": [{"id": "1", "type": agg_type, "schema": "metric"}]
                }),
                "kibanaSavedObjectMeta": {
                    "searchSourceJSON": json.dumps({
                        "index": index_pattern
                    })
                }
            }
        }
        response = requests.post(url, json=data)
        return response.status_code == 200
    
    def create_dashboard(self, title, visualization_ids):
        """Create dashboard with visualizations"""
        url = f"{self.kibana_url}/api/saved_objects/dashboard"
        data = {
            "attributes": {
                "title": title,
                "panelsJSON": json.dumps([
                    {"id": vid, "type": "visualization"} 
                    for vid in visualization_ids
                ])
            }
        }
        response = requests.post(url, json=data)
        return response.status_code == 200

# Usage example
if __name__ == "__main__":
    generator = DashboardGenerator("https://kibana-instance.com", "https://elastic-instance.com")
    generator.create_index_pattern("logs-*")
    print("Dashboard components created")
