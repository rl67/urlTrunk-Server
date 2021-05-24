const Tag = require('./tag.model');

const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    note: {
        type: String
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }]
    // tags: [{
    //     type: String,
    // }]
}, {timestamp: true});

const Url = mongoose.model('Url', urlSchema);
module.exports = Url;