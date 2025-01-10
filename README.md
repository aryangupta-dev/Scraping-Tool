# Product Scraper API

## Overview

The Product Scraper API is a Node.js application designed to scrape product data from a specified e-commerce website and store the data in a local database. The API supports authentication via a token and allows dynamic configuration of the number of pages to scrape.


## Dependencies

express: HTTP server framework.

axios: For making HTTP requests.

cheerio: For HTML parsing and data extraction.

joi: For schema validation.

node-cache: For caching product data.

fs and path: For handling local file operations.

## Installations

1. Clone repository- https://github.com/aryangupta-dev/Scraping-Tool.git
2. Install dependencies - npm install
3. Start Server - node MainClass.js

## API Endpoint
### POST /scrape
Scrape product data from the target website.
### Request Body:
`
{
  "page": 3,
  "token": "your-static-token"
}
`

page: The number of pages to scrape (integer, required).

token: Authentication token (string, required).
