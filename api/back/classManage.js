var express = require('express');
var router = express.Router();
var hasOwnProperty = require('has-own-property-x'); //支持hasOwnProperty
var Unique = require("../common/Unique")
var CreatTime = require("../common/creatTime")
    // 图片上传的
var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');
//接受form提交的

var {
    sqlHandle, //修改和增加操作
    readHandle, //读取操作
    searchHandle, //检索判断数据库是否有此值(有值为false)
    searchHandleNormal, //检索判断数据库是否有此值(有值为true)
    query // //基本操作
} = require("../../config/db_connect")


// 学院添加
router.post("/insertCollege", function(req, res, next) {
    let { enname, cnname } = req.body
    const testsql = `select id from college where enname='${enname}'`
    const sql = `insert into college(id,cnname,enname,time) values("${Unique()}","${cnname}","${enname}","${CreatTime()}")`
    console.log(sql)
    async function all() {
        await searchHandle(testsql)
        await sqlHandle(sql)
    }
    all(sql).then(() => {
        res.send({
            code: "10101",
            msg: "插入成功"
        })
    }).catch((err) => {
        res.send({
            code: "10102",
            msg: "插入失败"
        })
    })
})

// 学院和科目查询
router.get("/selectClass", function(req, res, next) {
        const sql1 = `select * from college`
        const sql2 = `select * from course`

        async function all() {
            let college = await readHandle(sql1)
            let course = await readHandle(sql2)
            console.log(college, course)
            return {
                college,
                course
            }
        }
        all().then((data) => {
            res.send({
                code: "10121",
                data,
                msg: "读取数据成功"
            })
        }).catch((err) => {
            res.send({
                code: "10122",
                msg: "读取数据失败"
            })
        })
    })
    // 课程插入
router.post("/insertCourse", function(req, res, next) {
    let { parentId, enname, cnname } = req.body
    const testsql = `select id from course where enname='${enname}'`
    const sql = `insert into course(id,parent_id,cnname,enname,article_num,time) values("${Unique()}","${parentId}","${cnname}","${enname}",0,"${CreatTime()}")`
    const createTable = `CREATE TABLE ${enname} (LIST INT(11) UNIQUE NOT NULL AUTO_INCREMENT, id VARCHAR(255) UNIQUE PRIMARY KEY, collegeId VARCHAR(255), courseId VARCHAR(255),unit INT,exam_type VARCHAR(255), time DATETIME, visitors INT,stem_type LONGTEXT,stem LONGTEXT,option_1 LONGTEXT,option_2 LONGTEXT,option_3 LONGTEXT,option_4 LONGTEXT,option_5 LONGTEXT,option_6 LONGTEXT,result LONGTEXT,author LONGTEXT);`
    console.log(sql)

    async function all() {
        //创建文件夹
        fs.mkdirSync(path.join(__dirname, "../../public/file/excel/", enname))
        await searchHandle(testsql)
        await sqlHandle(sql)
        await query(createTable)
    }
    all(sql).then(() => {
        res.send({
            code: "10111",
            msg: "插入成功"
        })
    }).catch((err) => {
        res.send({
            code: "10112",
            msg: "插入失败"
        })
    })
})


//递归删除文件和文件夹
function deleteFolder(path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function(file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}
// 课程删除
router.post("/deleteCourse", function(req, res, next) {
    let { id, enname } = req.body
    const sql = `delete from course where id='${id}'`
    const sqlarticle = `DROP TABLE ${enname}`

    async function all() {
        deleteFolder(path.join(__dirname, "../../public/file/excel/", enname));
        await sqlHandle(sql)
        const dropTable = await query(sqlarticle)
    }
    all(sql).then(() => {
        res.send({
            code: "10131",
            msg: "删除成功"
        })
    }).catch((err) => {
        res.send({
            code: "10132",
            msg: "删除失败"
        })
    })
})


// 学院删除
router.post("/deleteCollege", function(req, res, next) {
    let { id } = req.body
    console.log(id)
    const sqldelete1 = `delete from college where id='${id}'`
    const sqldelete2 = `delete from course where parent_id='${id}'`
    const courseListsql = `select * from course where parent_id='${id}'`
    console.log(courseListsql)
    async function all() {
        let courseList = await readHandle(courseListsql)
        console.log(courseList)
        for (let i = 0; i < courseList.length; i++) {

            deleteFolder(path.join(__dirname, "../../public/file/excel/", courseList[i].enname));
            let dropTable = `drop table ${courseList[i].enname}`
            await query(dropTable)
        }
        await sqlHandle(sqldelete1)
        await sqlHandle(sqldelete2)

    }
    all().then(() => {
        res.send({
            code: "10141",
            msg: "删除成功"
        })
    }).catch((err) => {
        res.send({
            code: "10142",
            msg: "删除失败"
        })
    })
})



// 学院修改
// router.post("/changeCollege", function(req, res, next) {
//     let { id, enname, cnname } = req.body
//     const sqldelete1 = `update college where id='${id}'`
//     const sql = `update college set enname="${enname}",cnname="${cnname}" where id='${id}'`
//     console.log(sqldelete2)
//     async function all() {
//         await sqlHandle(sql)
//     }
//     all(sql).then(() => {
//         res.send({
//             code: "20081",
//             msg: "修改成功"
//         })
//     }).catch((err) => {
//         res.send({
//             code: "20082",
//             msg: "修改失败"
//         })
//     })
// })

// // 课程修改
// router.post("/changeCo", function(req, res, next) {
//     let { id, enname, cnname } = req.body

//     const sql = `update college set enname="${enname}",cnname="${cnname}" where id='${id}'`
//     console.log(sql)
//     async function all() {
//         await sqlHandle(sql)
//     }
//     all(sql).then(() => {
//         res.send({
//             code: "20081",
//             msg: "修改成功"
//         })
//     }).catch((err) => {
//         res.send({
//             code: "20082",
//             msg: "修改失败"
//         })
//     })
// })




module.exports = router