"""Minimal example: run the deautos-cars-scraper Actor and print the results.

Usage: APIFY_TOKEN=... python run.py   (pip install apify-client)
"""
import os
import sys

from apify_client import ApifyClient

token = os.environ.get("APIFY_TOKEN")
if not token:
    sys.exit("Set the APIFY_TOKEN environment variable first.")

client = ApifyClient(token)

run_input = {
    "make": "Toyota",
    "province": "Cordoba",
    "currency": "USD",
    "maxPrice": 30000,
    "minYear": 2018,
    "maxItems": 100,
}

run = client.actor("bibian/deautos-cars-scraper").call(run_input=run_input)

count = 0
for item in client.dataset(run.default_dataset_id).iterate_items():
    count += 1
    print(f"{item['title']} | {item.get('version')} | {item.get('mileageKm')} km | {item['price']} {item['currency']} | {item.get('province')}")
print(f"{count} results")
