const express = require('express');
const bodyParser = require('body-parser');
const ProductScraper = require('./ProductScraper');
const DatabaseHandler = require('./DatabaseHandler');

const STATIC_TOKEN = 'static-token';

const app = express();
const PORT = 3000;


app.use(bodyParser.json());


const dbHandler = new DatabaseHandler();

// API Endpoint
app.post('/scrape', async (req, res) => {
    const { page, token } = req.body;

    // Validate input
    if (!page || !token) {
        return res.status(400).json({ error: 'Page and auth token are required.' });
    }
    if(token!=STATIC_TOKEN){
        return res.status(401).json({ error: 'Invalid auth token.' });
    }

    try {
        const url = 'https://dentalstall.com/shop'; 
        const pages = parseInt(page, 10);

        
        const scraper = new ProductScraper(url, pages, null, token);

        
        const { allProducts, scrapedCount } = await scraper.scrapeProducts();

        
        allProducts.forEach(product => {
            const cachedProduct = dbHandler.getCachedProduct(product.product_title);
            if (!cachedProduct) {
                dbHandler.updateProductInDB(product);
                dbHandler.cacheProduct(product);
            }
        });

        res.json({
            message: `Scraping complete. ${scrapedCount} products scraped and updated.`,
            products: allProducts
        });
    } catch (error) {
        console.error('Error during scraping:', error);
        res.status(500).json({ error: 'An error occurred while scraping products.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
