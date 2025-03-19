// controllers/adminController.js
const { default: mongoose } = require('mongoose');
const { saveImages } = require('../helpers/fileUploadHelper');
const { paginate, configurePagination } = require('../helpers/pagninateHelper');
const Product = require('../models/Product');
const ApiResponse = require('../response/ApiResponse');
const ErrorRespnse = require('../response/error_response');

// Add a new product
exports.addProduct = async (req, res) => {
    try {
        console.log('req.body', req.body);

        // Handle file uploads (if any)
        if (req.files) {
            if (req.files.image) {
                const image = saveImages(req.files.image);
                req.body.image = image[0];
            }

            if (req.files.imageModel) {
                const imageModel = saveImages(req.files.imageModel);
                req.body.imageModel = imageModel[0];
            }

            if (req.files.gallery) {
                const galleryImages = saveImages(req.files.gallery);
                req.body.gallery = galleryImages;
            }
        }

        // Validate and parse country-specific prices
        const { prices, countryCode } = req.body;
        
        if (!countryCode || typeof countryCode !== 'string') {
            return res.status(400).json(new ErrorResponse(400, 'Country code is required and should be a string.'));
        }

        if (!prices || typeof prices !== 'object') {
            return res.status(400).json(new ErrorResponse(400, 'Prices must be provided as an object with country codes as keys.'));
        }

        // Ensure all prices are valid numbers
        const parsedPrices = {};
        for (const [code, price] of Object.entries(prices)) {
            if (isNaN(price) || price < 0) {
                return res.status(400).json(new ErrorResponse(400, `Invalid price for country: ${code}`));
            }
            parsedPrices[code] = Number(price);
        }

        // Set parsed prices in the request body
        req.body.prices = parsedPrices;
        req.body.countryCode = countryCode;

        // Create the product
        const product = new Product(req.body);
        const data = await product.save();

        res.status(201).json(new ApiResponse(201, 'Product has been created successfully', data));
    } catch (error) {
        console.log('Error creating product:', error);
        res.status(500).json(new ErrorResponse(500, 'Something went wrong. Please try again.', error));
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
        if (req.params.id === undefined) {
            return res.status(400).json(new ErrorResponse(400, 'Product id is required'));
        }

        // Find the product by ID
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Handle file uploads for images (only update if provided)
        if (req.files) {
            if (req.files.image) {
                const image = saveImages(req.files.image);
                req.body.image = image[0];
            }

            if (req.files.imageModel) {
                const imageModel = saveImages(req.files.imageModel);
                req.body.imageModel = imageModel[0];
            }

            if (req.files.gallery) {
                const gallery = saveImages(req.files.gallery);
                req.body.gallery = gallery;
            }
        }

        // Validate and parse country-specific prices if provided
        if (req.body.prices) {
            const { prices } = req.body;
            
            // Ensure that prices is an object
            if (typeof prices !== 'object') {
                return res.status(400).json(new ErrorResponse(400, 'Prices must be provided as an object with country codes as keys.'));
            }

            // Ensure all prices are valid numbers
            const parsedPrices = {};
            for (const [countryCode, price] of Object.entries(prices)) {
                if (isNaN(price) || price < 0) {
                    return res.status(400).json(new ErrorResponse(400, `Invalid price for country: ${countryCode}. Price must be a positive number.`));
                }
                parsedPrices[countryCode] = Number(price);
            }

            // Set parsed prices in the request body
            req.body.prices = parsedPrices;
        } else {
            // If no prices are provided, keep the existing prices
            req.body.prices = product.prices;
        }

        // If countryCode is provided, update it; otherwise, retain the existing one
        if (req.body.countryCode) {
            req.body.countryCode = req.body.countryCode;
        } else {
            req.body.countryCode = product.countryCode;
        }

        // Update the product with the new data
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(new ApiResponse(200, 'Product updated successfully', updatedProduct));
    } catch (error) {
        console.error("Error updating product:", error); // Log the error for debugging purposes
        res.status(500).json(new ErrorResponse(500, 'Something went wrong, please try again.', error));
    }
};





// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        if (req.params.id === undefined) {
            return res.status(400).json(new ErrorRespnse(400, 'Product id is required'));
        }
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // res.json({ message: 'Product deleted successfully' });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        // res.status(400).json({ error: error.message });
        res.status(500).json(new ErrorRespnse(500, 'Something went wrong please try again', error));

    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const query = {
            deletedAt: null
        }
        const options = configurePagination(req, query);
        options.populate = { path: 'category' };
        const products = await paginate(Product, options);
        res.status(200).json(new ApiResponse(200, 'Products fetched successfully', products));
        log(options);
    } catch (error) {
        // res.status(500).json({ error: error.message });
        console.log('fjfjaaaaaaaa', error);
        res.status(500).json(new ErrorRespnse(500, 'Something went wrong please try again', error));
    }
};

// Get a single product
exports.getProduct = async (req, res) => {
    try {
        if (req.params.id === undefined) {
            return res.status(400).json(new ErrorRespnse(400, 'Product id is required'));
        }
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(new ApiResponse(200, 'Product fetched successfully', product));
    } catch (error) {
        res.status(500).json(new ErrorRespnse(500, 'Something went wrong please try again', error));
    }

}


exports.trashMany = async (req, res, next) => {
    try {
        if (req.body.ids === undefined && req.body.ids.length === 0) {
            return res.status(400).json(new ErrorRespnse(400, 'product id is required'));
        }
        const product = await Product.updateMany({ _id: { $in: req.body.ids } }, { deletedAt: Date.now() });
        res.status(200).json(new ApiResponse(200, 'Products deleted successfully', product));
    } catch (error) {
        res.status(500).json(new ErrorRespnse(500, 'Something went wrong please try again', error));
    }
}

exports.getTrash = async (req, res, next) => {
    try {

        // const customers = await User.find({ deletedAt: { $ne: null } });
        // use pagination
        const query = {
            deletedAt: { $ne: null }
        }
        const options = configurePagination(req, query);
        const products = await paginate(Product, options);
        res.status(200).json(new ApiResponse(200, 'Products fetched successfully', products));
    } catch (error) {
        res.status(500).json(new ErrorRespnse(500, 'Something went wrong please try again', error));
    }
}

exports.deleteMany = async (req, res, next) => {
    try {
        if (req.body.ids === undefined && req.body.ids.length === 0) {
            return res.status(400).json(new ErrorRespnse(400, 'product id is required'));
        }



        const product = await Product.findByIdAndDelete(req.body.ids);

        res.status(200).json(new ApiResponse(200, 'Product deleted successfully', product));
    } catch (error) {
        console.log('error', error);

        res.status(500).json(new ErrorRespnse(500, 'Something went wrong please try again', error));
    }
}


exports.restoreMany = async (req, res, next) => {
    try {
        if (req.body.ids === undefined && req.body.ids.length === 0) {
            return res.status(400).json(new ErrorRespnse(400, 'Product id is required'));
        }
        const products = await Product.updateMany({ _id: { $in: req.body.ids } }, { deletedAt: null });
        res.status(200).json(new ApiResponse(200, 'Product restored successfully', products));
    } catch (error) {
        res.status(500).json(new ErrorRespnse(500, 'Something went wrong please try again', error));
    }
}



exports.getByCountry = async (req, res) => {
    try {
        if (req.params.code === undefined) {
            return res.status(400).json(new ErrorResponse(400, 'Country code is required'));
        }

        // use pagination
        const query = {
            deletedAt: null,
            countryCode: req.params.code  // Filter by country code
        };
        const options = configurePagination(req, query);
        const products = await paginate(Product, options);
        res.status(200).json(new ApiResponse(200, 'Products fetched successfully', products));
    } catch (error) {
        console.log('error', error);
        res.status(500).json(new ErrorResponse(500, 'Something went wrong please try again', error));
    }
};

