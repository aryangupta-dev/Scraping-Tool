const axios = require('axios');
const cheerio = require('cheerio');
const Joi = require('joi');

const productSchema = Joi.object({
    product_title: Joi.string().min(1).required(),
    product_price: Joi.number().min(1).required(),
    path_to_image: Joi.string().uri().required()
});


class ProductScraper {
    constructor(url, pages = 1, proxy = null, token = '') {
        this.url = url;
        this.pages = pages;
        this.proxy = proxy;
        this.token = token;
    }
    // Validate the scraped product data
    async validateProductData(product) {
    const { error } = productSchema.validate(product);
    if (error) {
        console.error('Data validation error');
        return false;
    }
    return true;
    }

    // Method to handle HTTP requests, including proxy and authentication
    async fetchPage(url) {
        try {
            const headers = {};
            if (this.token) {
                headers['Authorization'] = `Bearer ${this.token}`;
            }
            if(!this.token) {
               console.error('AUTH token is required');
               return;
            }

            const response = await axios.get(url, {
                headers: headers,
                proxy: this.proxy ? {
                    host: this.proxy.host,
                    port: this.proxy.port,
                    auth: this.proxy.auth,
                } : null,
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching page ${url}:`, error.message);
            return null;
        }
    }

    // Method to scrape product information from a page
    async scrapePage(html) {
        const $ = cheerio.load(html);
        const products = [];
    
        // Use for...of loop to handle asynchronous validation
        const productElements = $('div.product-inner');
        
        for (let element of productElements.toArray()) {
            const title = $(element).find('h2.woo-loop-product__title').text().trim();
            const price = $(element).find('span.amount').text().replace('₹', '').split('₹')[0];
            const image = $(element).find('img.attachment-woocommerce_thumbnail').attr('data-lazy-src') ||
                $(element).find('img.attachment-woocommerce_thumbnail').attr('src');
    
            const product = {
                product_title: title,
                product_price: parseFloat(price),  // Ensure price is a number
                path_to_image: image, // Saving locally
            };
    
            // Validate product asynchronously
            const validProduct = await this.validateProductData(product);
    
            if (validProduct) {
                products.push(product);
            } else {
                console.log('Skipping invalid product:', { title, price, image });
            }
        }
    
        return products;
    }
    // Main function to scrape products across multiple pages
    async scrapeProducts() {
        let allProducts = [];
        let scrapedCount = 0;

        for (let page = 1; page <= this.pages; page++) {
            const pageUrl = `${this.url}/page/${page}`;
            const pageHtml = await this.fetchPage(pageUrl);

            if (pageHtml) {
                const products = await this.scrapePage(pageHtml);
                allProducts = [...allProducts, ...products];
                scrapedCount += products.length;
            }

            // Optional: Retry logic on failure
            if (!pageHtml) {
                console.log(`Retrying page ${page} after a short delay...`);
                await new Promise(resolve => setTimeout(resolve, 5000));
                page--;
            }
        }

        return { allProducts, scrapedCount };
    }

}
module.exports =ProductScraper