//can't control duplicacy if it has to happen
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('main_db.json');
const db = low(adapter);

db.defaults({user : []}).write();

exports.getUser = (user) => {
    return db.get('user').find({username : user}).value();
}

exports.getUserByCCHandle = (cchandle) => {
    return db.get('user').find({codechef_handle : cchandle}).value();
}

exports.getUserByCFHandle = (cfhandle) => {
    return db.get('user').find({codeforces_handle : cfhandle}).value();
}

exports.updateCCHandle = (user,cchandle) => {
    db.get('user').find({username : user}).assign({codechef_handle : cchandle}).write();
}

exports.updateCCHandle = (user,cfhandle) => {
    db.get('user').find({username : user}).assign({codeforces_handle : cfhandle}).write();
}

exports.addUser = (data) => {
    /* 
        Passing data means a sophisticated object
        data = {
            username : user,
            codechef_handle : cchandle,
            codeforces_handle : cfhandle
        }
    */
    let u = db.get('user').find({username : data.username}).value();
    if(u) return;
    db.get('user').push(data).write();    
}