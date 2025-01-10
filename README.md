
Product Scraper API

Overview

The Product Scraper API is a Node.js application designed to scrape product data from a specified e-commerce website and store the data in a local database. The API supports authentication via a token and allows dynamic configuration of the number of pages to scrape.

Features

Scrape product details (title, price, and image) from the target website.

Validate and filter product data using Joi schema validation.

Cache product data to avoid redundant updates.

Store data in a local JSON file-based database.

Expose an HTTP API endpoint for interacting with the scraper programmatically.

Dependencies

express: HTTP server framework.

axios: For making HTTP requests.

cheerio: For HTML parsing and data extraction.

joi: For schema validation.

node-cache: For caching product data.

fs and path: For handling local file operations.