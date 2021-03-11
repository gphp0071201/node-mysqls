// import "babel-polyfill"
require('babel-polyfill')
require('babel-register')

// let sql = require('./build/main.js')
// import sql from './build/main.js'
// console.log(sql)

import mysql,{sql, exec} from './src/main'

const content = document.querySelector('#content')

// select语句
const selectSql = sql.table('user').field(['id', 'name', 'age', 'sex', 'DATE_FORMAT(last_login_time, "%Y-%m-%d %H:%i:%s")', {
	'create_time': 'createTime',
	'DATE_FORMAT(last_login_time, "%Y-%m-%d %H:%i:%s")': 'lastLoginTime'
}, 'status', 'remarks']).where({id: 1}).select()

// insert语句
const insertSql = sql.table('user').data([
	{user_no: 1, name: '张三', sex: 1, create_time: '2020-12-12 12:12:12'},
	{user_no: 2, name: '李四', sex: 2, create_time: ['NOW()']}
]).insert()

// update语句
const updateSql = sql.table('user').data({ id: 1, name: '张三', age: 25 }).where({id: 1, name: {like: '%hell%'}, sex: 1}).update()

// delete语句
const deletSql = sql.table('user').where({id: 1}).delet()
let fdsafs;
let xxx = sql
xxx = usePaging(sql)
xxx = xxx.table('user')
xxx = xxx.where({id: 1, name: 2})
console.log(xxx.select())
// console.log(fdsafs)

content.innerHTML = `${selectSql} <br/> ${insertSql} <br/> ${updateSql} <br/> ${deletSql}`;

// 使用分页
function usePaging (sqs, pageNo = 1, pageSize = 10) {
	sqs = sqs.page(pageNo, pageSize)
	return sqs
}
