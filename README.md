# How to Scrape DeAutos: Used Cars Prices in Argentina (Make, Model, Mileage, ARS or USD)

> **Run it now, no code: [deautos-cars-scraper on the Apify Store](https://apify.com/bibian/deautos-cars-scraper)** &nbsp;|&nbsp; $2.00 per 1,000 car listings &nbsp;|&nbsp; no browser, no proxy

DeAutos.com is an Argentine used car site that aggregates ads from Mercado Libre, Autocosmos, Kavak and DeRuedas (about 1,400 cars live at any time). It has no public export and no official API for third parties. This guide shows how to get its listings as clean structured data: make, model, year, mileage, price in ARS or USD and province, with a free Apify Actor, from the console or from code.

Searches this page answers: deautos scraper, used cars Argentina scraper, Argentina car prices API, Mercado Libre cars Argentina data.

## What you get from the DeAutos scraper

- Every used car listing on DeAutos, with make, model, version, year and mileage in kilometres.
- Price in the currency the seller chose (`ARS` or `USD`), with no conversion applied.
- Province, city and a readable location label, plus body type (hatch, SUV, pickup, sedan, family) when the site states it.
- The site's own "great price" / "good price" rating when shown, the source platform (Mercado Libre, Autocosmos, Kavak or DeRuedas) and a link to both the DeAutos page and the original ad.

Export the dataset as JSON, CSV or Excel, or read it through the Apify API. A real sample (five results) is in [`sample-output.json`](sample-output.json).

## Output fields

| Field | What it is |
|---|---|
| `id`, `url` | DeAutos listing id and public link |
| `sourceUrl`, `source` | Link to the original ad and the platform that published it (Mercado Libre, Autocosmos, Kavak, DeRuedas) |
| `title`, `make`, `model`, `version` | Listing title and the car's make, model and trim |
| `year`, `mileageKm` | Model year and mileage in kilometres |
| `price`, `currency` | Price as listed, in `ARS` or `USD` (no conversion) |
| `province`, `city`, `location` | Where the car is advertised |
| `fuel`, `transmission`, `color`, `drive` | The site's own classification, empty when the source ad does not state them |
| `bodyType` | `hatch`, `suv`, `pickup`, `sedan` or `family` |
| `priceRating` | DeAutos' own `"good price"` / `"great price"` flag, when shown |
| `imageUrl` | First listing photo |

## Use cases

- **Price used cars in Argentina.** Group `price` by `make`, `model`, `year` and `province` to see what a given car is worth across the country, in ARS or USD as sellers listed it.
- **Find deals.** Filter on `priceRating` to surface the ads DeAutos itself already flags as good or great prices.
- **Watch stock by province or source.** Schedule the run and follow how many listings a make, a province or a platform (Mercado Libre, Autocosmos, Kavak, DeRuedas) carries over time.
- **Feed a pricing tool or a newsletter.** Use the structured fields and `sourceUrl` to power a car-valuation tool or a classifieds digest for the Argentine market.

## Input

| Field | What it does |
|---|---|
| `make`, `model`, `province` | Text filters, accents and case are ignored (`cordoba` matches Córdoba). |
| `bodyType` | One of `hatch`, `suv`, `pickup`, `sedan`, `family`. |
| `source` | Keep only one platform: `Mercado Libre`, `Autocosmos`, `Kavak`, `DeRuedas`. |
| `currency`, `minPrice`, `maxPrice` | Each ad is priced in the currency its seller chose, so set `currency` whenever you filter by price. |
| `minYear`, `maxMileage` | Numeric limits. Ads without a mileage are kept. |
| `maxItems` | The run stops once this many listings are saved (default 50). |

Example input:

```json
{
  "make": "Toyota",
  "province": "Cordoba",
  "currency": "USD",
  "maxPrice": 30000,
  "minYear": 2018,
  "maxItems": 100
}
```

## Three ways to use it

### 1. Apify console, no code

1. Open [the Actor page](https://apify.com/bibian/deautos-cars-scraper) and click **Try for free** (a free Apify account is enough).
2. Fill in the input form (make, model, province, price range) and click **Start**.
3. When the run finishes, open the **Output** tab, check the table, then **Export** as CSV, Excel or JSON.
4. For a daily watch, open **Schedules**, create a daily schedule for the Actor and, optionally, add an integration that sends new results to Slack, e-mail or Google Sheets.

### 2. Apify API with JavaScript

```bash
npm install apify-client
export APIFY_TOKEN="your token from Apify console, Settings, Integrations"
node examples/run.js
```

```js
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const run = await client.actor('bibian/deautos-cars-scraper').call({
    "make": "Toyota",
    "province": "Cordoba",
    "currency": "USD",
    "maxPrice": 30000,
    "minYear": 2018,
    "maxItems": 100
});

const { items } = await client.dataset(run.defaultDatasetId).listItems();
for (const item of items) {
    console.log(`${item.title} | ${item.version ?? '-'} | ${item.mileageKm ?? '-'} km | ${item.price} ${item.currency} | ${item.province}`);
}
```

The complete file is [`examples/run.js`](examples/run.js) (ES module, Node 18 or later).

### 3. Apify API with Python

```bash
pip install apify-client
export APIFY_TOKEN="your token from Apify console, Settings, Integrations"
python examples/run.py
```

```python
import os
from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run = client.actor("bibian/deautos-cars-scraper").call(run_input={
    "make": "Toyota",
    "province": "Cordoba",
    "currency": "USD",
    "maxPrice": 30000,
    "minYear": 2018,
    "maxItems": 100,
})

for item in client.dataset(run.default_dataset_id).iterate_items():
    print(f"{item['title']} | {item.get('version')} | {item.get('mileageKm')} km | {item['price']} {item['currency']} | {item.get('province')}")
```

The complete file is [`examples/run.py`](examples/run.py). Never put your token in the code: read it from the `APIFY_TOKEN` environment variable as above.

## Pricing

Pay per result: **$2.00 per 1,000 car listings** (that is $0.002 per listing), plus a tiny start fee of $0.00005 per run. You pay only for the results saved to the dataset. Apify's free plan includes monthly credits, enough to try it on a few hundred results. Prices are those shown on the [Store page](https://apify.com/bibian/deautos-cars-scraper) when this guide was written; the Store page is the reference.

## Why this one

- **Single-request catalogue.** DeAutos' whole stock (about 1,400 cars) is read without a browser or a proxy, so runs stay fast and cheap.
- **Multi-platform in one call.** One run covers ads aggregated from four platforms (Mercado Libre, Autocosmos, Kavak, DeRuedas) instead of scraping each separately.
- **Both currencies kept as listed.** `price` and `currency` are never converted, so ARS and USD listings stay comparable to what the seller actually typed.

## Limits and honest notes

- Only what DeAutos publishes is collected. `fuel`, `transmission`, `color`, `drive` and `priceRating` are often `null` when the source ad or DeAutos itself does not state them (visible in `sample-output.json`).
- The dataset contains car listings only. Private sellers' names and phone numbers are never exported.
- This is an unofficial tool, not affiliated with DeAutos. Check the site terms and the data protection rules that apply to your use.

## FAQ

**Does it need a browser or a proxy?**
No. The Actor reads the data directly, so runs are fast and cheap.

**Are prices in ARS or USD?**
Both exist on DeAutos: each ad keeps the currency its seller chose. Set `currency` whenever you filter by `minPrice` or `maxPrice`.

**Can I filter by platform (Mercado Libre, Autocosmos, Kavak, DeRuedas)?**
Yes, set `source` to one of them.

**Can I get the data in Excel or Google Sheets?**
Yes. Export the dataset as CSV, Excel or JSON from the Apify console, or connect the Apify Google Sheets integration.

## Try it

**[Open deautos-cars-scraper on the Apify Store](https://apify.com/bibian/deautos-cars-scraper)**

The code in `examples/` is released under the MIT license (see [LICENSE](LICENSE)). The data belongs to its original publishers.
