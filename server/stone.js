const common = require('./common.js')
const {Stone} = require('./database.js')

const getStones = (req, res, database) => {
    const fetchSucc = stones => res.json(stones)
    const owner = req.user._id
    database.fetchStones(owner, fetchSucc, () => common.serverErrMsg(res))
}

const checkStone = (req) => {
    req.check('name', 'name len [1, 20]').isLength({min:1, max:20})
    req.check('owner', 'owner should set').isEmpty()
    req.check('age', 'age between 1 and 130').isInt({min:1, max:130})
    const err = req.validationErrors()
    if(err){
        let msg = ''
        err.map( e => msg = `${msg}\n${e.msg}`)
        return {res:false, msg:msg}
    }
    return {res:true, msg:'ok'}
}

const addStone = (req, res, database) => {
    const checkRes = checkStone(req)
    if(!checkRes.res){
        common.serverMsg(res, 200, false, checkRes.msg, null)
        return
    }
    const stone = new Stone({
        owner: req.user._id, 
        name: req.body.name,
        location: req.body.location,
        age: req.body.age,
    })
    const insertCallback = stone => {
        if(stone)
            common.serverMsg(res, 200, true, 'ok', stone)
    }
    database.insertStone(stone, insertCallback, ()=>common.serverErrMsg(res))
}

const deleteStone = (req, res, database) => {
    const id = req.query._id
    const owner = req.user._id
    const deleteSucc = () => common.serverMsg(res, 200, true, {message: 'ok'}, null)
    database.deleteStoneById(id, owner, deleteSucc, ()=>common.serverErrMsg(res))
}

module.exports = {
    getStones,
    addStone,
    deleteStone,
}