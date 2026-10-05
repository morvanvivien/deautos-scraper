// Minimal example: run the deautos-cars-scraper Actor and print the results.
// Usage: APIFY_TOKEN=... node run.js   (Node 18 or later, npm install apify-client)
import { ApifyClient } from 'apify-client';

const token = process.env.APIFY_TOKEN;
if (!token) {
    console.error('Set the APIFY_TOKEN environment variable first.');
    process.exit(1);
}

const client = new ApifyClient({ token });

const input = {
    "make": "Toyota",
    "province": "Cordoba",
    "currency": "USD",
    "maxPrice": 30000,
    "minYear": 2018,
    "maxItems": 100
};

const run = await client.actor('bibian/deautos-cars-scraper').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();

console.log(`${items.length} results`);
for (const item of items) {
    console.log(`${item.title} | ${item.version ?? '-'} | ${item.mileageKm ?? '-'} km | ${item.price} ${item.currency} | ${item.province}`);
}
