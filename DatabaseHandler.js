const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');
class DatabaseHandler {
    constructor() {
        this.cache = new NodeCache();  // In-memory cache
        this.dbFilePath = path.join(__dirname, 'database.json');
    }

    // Load database from JSON file
    loadDatabase() {
        if (fs.existsSync(this.dbFilePath)) {
            const data = fs.readFileSync(this.dbFilePath);
            return JSON.parse(data);
        }
        return [];
    }

    // Save database to JSON file
    saveDatabase(data) {
        fs.writeFileSync(this.dbFilePath, JSON.stringify(data, null, 2));
    }

    // Update or add new product to the database
    updateProductInDB(product) {
        let db = this.loadDatabase();
        const existingProductIndex = db.findIndex(p => p.product_title === product.product_title);

        if (existingProductIndex >= 0) {
            const existingProduct = db[existingProductIndex];
            if (existingProduct.product_price !== product.product_price) {
                db[existingProductIndex] = product;
            }
        } else {
            db.push(product);
        }

        this.saveDatabase(db);
    }

    // Cache the product data to avoid redundant database updates
    cacheProduct(product) {
        this.cache.set(product.product_title, product);
    }

    // Retrieve product from cache
    getCachedProduct(productTitle) {
        return this.cache.get(productTitle);
    }
}

module.exports = DatabaseHandler;