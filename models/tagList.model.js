const mongoose = require('mongoose');

const tagListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
}, {timestamps: true});

const TagList = mongoose.model('TagList', tagListSchema);
module.exports = TagList;
