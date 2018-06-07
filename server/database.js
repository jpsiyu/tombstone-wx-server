const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const mongoose = require('mongoose')

class Database {

    constructor(){
        this.db = null
    }

    err(err, errCallback){
        if(errCallback)
            errCallback()
        console.log('Err', err)
    }

    // connect to database
    connect(callback){
        //mongoose.connect('mongodb://localhost/tombstone-wx')
        mongoose.connect('mongodb://jpsiyu:123456Tombstone@ds151530.mlab.com:51530/tombstone')
        this.db = mongoose.connection
        this.db.on('error', err => this.err(err))
        this.db.on('open', () => {
            callback()
        })
    }

    // find user by name
    findUserByName(username, callback, errCallback){
        User.findOne({username}, (err, user) => {
            if(err)
                this.err(err, errCallback)
            else
                callback(user)
        })
    }

    // find user by name or email
    findUserByNameOrEmail(username, email, callback, errCallback){
        User.findOne({$or: [
            {username},
            {email},
        ]}, (err, user) => {
            if(err)
                this.err(err, errCallback)
            else
                callback(user)
        })
    }

    // insert user
    insertUser(user, callback, errCallback){
        user.save( (err, user) => {
            if (err)
                this.err(err, errCallback)
            else
                callback(user)
        })
    }

    // fetch stones
    fetchStones(owner, callback, errCallback){
        Stone.find({owner}, (err, stones) => {
            if(err)
                this.err(err, errCallback)
            else
                callback(stones)
        } )
    }

    // insert stone
    insertStone(stone, callback, errCallback){
        stone.save( (err, stone) => {
            if(err)
                this.err(err, errCallback)
            else
                callback(stone)
        })
    }

    // find stone by id
    findStoneById(id, callback, errCallback){
        Stone.findById(id, (err, stone) => {
            if(err)
                this.err(err, errCallback)
            else
                callback(stone)
        })
    }

    //delte stone by id
    deleteStoneById(id, owner, callback, errCallback){
        const objId = ObjectId(id)
        Stone.remove({_id: id, owner}, (err) => {
            if(err)
                this.err(err, errCallback)
            else
                callback()

        })
    }
}

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
})

const stoneSchema = mongoose.Schema({
    owner: Object,
    name: String,
    age: Number,
    location: [Number],
    locationName: String,
})
const User = mongoose.model('User', userSchema)
const Stone = mongoose.model('Stone', stoneSchema)

module.exports = {
    Database,
    User,
    Stone,
}