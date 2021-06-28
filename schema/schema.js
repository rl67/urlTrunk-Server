const graphql = require('graphql');
const TagList = require('../models/tagList.model');
const Tag = require('../models/tag.model');
const Url = require('../models/url.model');
const _ = require('lodash');


const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList
} = graphql;


// Tag list with its tags
const TagListType = new GraphQLObjectType( {
    name: 'TagList',
    description: 'List that holds tags.',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        tags: {
            type: new GraphQLList(TagType),
            resolve(parent, args) {
                return Tag.find({ tagListId: parent.id });
            }
        }
    })
});

// Tag with its parent tagList
const TagType = new GraphQLObjectType({
    name: 'Tag',
    description: 'A tag to be added to a Bookmark. The parent is a tagList.',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        tagList: { 
            type: TagListType, 
            resolve(parent, args) {
                return TagList.findById(parent.tagListId);
            }
        },
        bookmarks: {
            type: new GraphQLList(BookMarkType),
            resolve(parent, args) {
                return Url.find({tags: { $all: parent.id } })
            }
        }
    })
});

// Bookmark
const BookMarkType = new GraphQLObjectType({
    name: 'BookMark',
    description: 'Bookmark with tags.',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        url: { type: GraphQLString },
        note: { type: GraphQLString },
        tagsII: { 
            type: GraphQLList(TagType),
            resolve(parent, args) {
                return Tag.find({ _id: { $in: parent.tags } })
            }
        },
        tags: { 
            type: new GraphQLList(GraphQLID),
            resolve(parent, args) {
                return parent.tags;     // ??hm Returnerar eit array av tag id'ar. "funkar", men kveit ikkje kvifor
            }
         },
         tagLists: {
             type: new GraphQLList(TagListType),
             resolve(parent, args){
                return TagList.find({ _id: { $in: parent.tags } });
             }
         }
    })
});

// Query items in the database
const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        // Return a tagList by id, and all its tags
        tagList: {
            type: TagListType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return TagList.findById(args.id);
            }
        },
        // Return all tagList objects
        tagLists: {
            type: new GraphQLList(TagListType),
            resolve(parent, args) {
                return TagList.find({});

            }
        },
        // Return a tag by id
        tag: {
            type: TagType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Tag.findById(args.id);
            }
        },
        // Return all tags
        tags: {
            type: new GraphQLList(TagType),
            resolve(parent, args) {
                return Tag.find({});
            }
        },
        // Return a bookmark by id
        bookMark: {
            type: BookMarkType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Url.findById(args.id);
            }
        },
        // Return all bookmarks
        bookMarks: {
            type: new GraphQLList(BookMarkType),
            resolve(parent, args) {
                return Url.find({});
            }
        },
        // Find bookmarks by tag(s)
        bookmarksByTags: {
            type: new GraphQLList(BookMarkType),
            args: { tags: { type: GraphQLList(GraphQLID) } },
            resolve(parent, args){               
                return Url.find({ tags: { $all: args.tags } });
            }
        }
    }
});

// To add, update and delete items in the database
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addTagList: {
            type: TagListType,
            args: {
                name: { type: GraphQLString }
            },
            resolve(parent, args){
                // Create DB model object to store received object in the DB
                let taglist = new TagList({
                    name: args.name
                });
                return taglist.save();
            }
        },
        addTag: {
            type: TagType,
            args: {
                name: { type: GraphQLString },
                tagListId: {type: GraphQLID }
            },
            resolve(parent, args){
                // Create DB model object to store received object in the DB
                let tag = new Tag({
                    name: args.name,
                    tagListId: args.tagListId,
                });
                return tag.save();
            }
        },
        addBookmark: {
            type: BookMarkType,
            args: {
                name: { type: GraphQLString },
                url:  { type: GraphQLString },
                note: { type: GraphQLString },
                tags: { type: new GraphQLList(GraphQLID) }
            },
            resolve(parent, args){
                // Create DB model object to store received object in the DB
                let bookmark = new Url({
                    name: args.name,
                    url: args.url,
                    note: args.note,
                    tags: args.tags     // Array 
                });
                return bookmark.save();
            }
        },
        updateBookmark : {
           type: BookMarkType,
           args: {
               id: { type: GraphQLID },
               name: { type: GraphQLString },
               url: { type: GraphQLString },
               note: { type: GraphQLString },
               tags: { type: new GraphQLList(GraphQLID) }
           },
           resolve(parent, args)  {
               console.log(args.tags); //??
               return Url.findOneAndUpdate( 
                   {_id: args.id }, 
                   { name: args.name,
                     url: args.url,
                     note: args.note,
                     tags: args.tags  },
                   { new: true } );     // returns the modified document
           }
        },
        deleteBookmark: {
            type: BookMarkType,
            args: { 
                id: { type: GraphQLID }, 
                name: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Url.findOneAndDelete({ _id: args.id });
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

/*
mutation AddBookmark($name: String, $url: String, $note: String, $tags: [ID]) {
  addBookmark(name: $name, url: $url, note: $note, tags: $tags) {
    id
    name
  }
}
*/