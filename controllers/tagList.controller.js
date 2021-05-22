const TagList = require('../models/tagList.model');

// POST a tag list
exports.create = (req, res) => {
    console.log('CREATING NEW TAG LIST')
    // Create a tag list item
    const tagList = new TagList({
        name: req.body.name
    });

    // Save tag list item in the MongoDB
    tagList.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

// FETCH all tag lists
exports.findAll = (req, res) => {
    TagList.find()
    .then(tagList => {
        console.log('READ tag lists.')
        res.send(tagList);
        // res.render('tagList', { title: 'Tag Lists', tagList: tagList});
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};