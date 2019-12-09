const mysql = require('mysql');

var con = mysql.createConnection({
    host : "remotemysql.com:3306",
    user : "dMipY7dpJc",
    password : "09L9Ntzr1M",
    database : "dMipY7dpJc"
});

exports.getByUsername = (username) => {
    con.connect(e => {
        if(e) console.error;
        con.query(`select * from user where username = ${username}`,(e,r)=> {
            if(e) console.error;
            return r;
        });
    });
};

exports.getByCCHandle = (cchandle) => {
    con.connect(e => {
        if(e) console.error;
        con.query(`select * from user where codechef_handle = ${cchandle}`,(e,r)=> {
            if(e) console.error;
            return r;
        });
    });
};

exports.getByCFHandle = (cfhandle) => {
    con.connect(e => {
        if(e) console.error;
        con.query(`select * from user where codeforces_handle = ${cfhandle}`,(e,r)=> {
            if(e) console.error;
            return r;
        });
    });
};

exports.addUser = (data) => {
    /* Data in form of an object :-
        data = {
            user : "Username in discord",
            cc : "codechef handle",
            cf : "codeforces handle"
        }
        if no data pass a blank string ("")
    */

    con.connect(e => {
        if(e) console.error;
        const q = `insert into user (username,codechef_handle,codeforces_handle) values (${data.user},${data.cc},${data.cf}) `;
        con.query(q, (e,r)=> {
            if(e) console.error;
            console.log("user inserted");
        });
    });
};

exports.modifyCCUser = (cchandle,username) => {
    con.connect(e => {
        if(e) console.error;
        const q = `update user set codechef_handle=${cchandle} where username=${username}`;
        con.query(q, (e,r)=> {
            if(e) console.error;
            console.log("user updated");
        });
    });
};

exports.modifyCFUser = (cfhandle,username) => {
    con.connect(e => {
        if(e) console.error;
        const q = `update user set codeforces_handle=${cfhandle} where username=${username}`;
        con.query(q, (e,r)=> {
            if(e) console.error;
            console.log("user updated");
        });
    });
};