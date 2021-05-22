const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    tagListId: {
        // type: mongoose.Schema.Types.Objectid,
        // ref: "TagList",
        type: String,
        required: true,
    },
}, {timestamp: true});

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;