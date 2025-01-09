const ProductScraper = require('./ProductScraper');
const DatabaseHandler = require('./DatabaseHandler');


class MainClass {
    constructor() {
        this.url = 'https://dentalstall.com/shop';//target website
        this.pages = 5;  // Default to scrape 5 pages
        this.proxy = null;  // Proxy string (optional)
        this.token = 'your-static-token';  // Static token for authentication
        this.dbHandler = new DatabaseHandler();
        
    }

    async run() {
        const scraper = new ProductScraper(this.url, this.pages, this.proxy, this.token);

        const { allProducts, scrapedCount } = await scraper.scrapeProducts();
        
        allProducts.forEach(product => {
            const cachedProduct = this.dbHandler.getCachedProduct(product.product_title);
            if (!cachedProduct) {
                this.dbHandler.updateProductInDB(product);
            }
        });

        // we can use SES and third party services to sending out email notifications will need to create a template upload it and trigger emails to recipients
        console.log(`Scraping complete. ${scrapedCount} products scraped and updated.`);


    }
}

const app = new MainClass();
app.run();
