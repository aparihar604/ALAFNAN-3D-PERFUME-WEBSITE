const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
    },
    prices: {
        type: Map,
        of: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        min: 0,
        default: 0,
    },
    quantity: {
        type: Number,
        min: 0,
    },
    imageModel: {
        type: String
    },
    image: {
        type: String,
    },
    gallery: {
        type: [String],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        required: true
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'country'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

productSchema.pre(['find', 'findOne'], function () {
    this.populate('category');
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
