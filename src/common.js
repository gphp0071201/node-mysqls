import {
    getOptToString,
    checkOptType,
    checkOptObjType,
    expressionQuery,
    sortSelectSql
} from './util'

//需要查询的table表  参数：String  案例：table('user')
export function table(opt){
    if (typeof opt === 'string') {
        if(opt&&opt.indexOf('SELECT')!=-1){
            opt = `(${opt})`
        }
        if(opt) this.sqlObj.table = opt
    } else {
        const keys = Object.keys(opt)
        let arr = []
        for (const k of keys) {
            arr.push(`${k} AS ${opt[k]}`)
        }
        this.sqlObj.table = arr.join(', ')
    }
    return this;
} 

/*where条件
  参数为 String | Object | Array
  案例： 
*/
export function where(opt){
    let result = ''
    if(typeof(opt)==='string'){
        result = opt
    }else{
        result = getOptToString(opt)
    }
    if(result) this.sqlObj.where = result
    return this;
}


/**
 * join
 * @param {object | Array<object>} opt
 * opt.dir 连接方向 left | right | inner | outer | left outer | right outer | full outer | cross
 * opt.table 要连接的表名称
 * opt.where 连接条件
 */
export function join(opt) {
    let result = ''
    switch (Object.prototype.toString.call(opt)) {
        case '[object Array]':
            for (let i = 0, len = opt.length; i < len; i++) {
                if (!opt[i].dir || !opt[i].table || !opt[i].where) continue
                result += ` ${opt[i].dir.toUpperCase()} JOIN ${sortSelectSql(opt[i].table, true).result} ON (${getOptToString(opt[i].where)})`
            }
            break;
        case '[object Object]':
            if (!opt.dir || !opt.table || !opt.where) return
            result += ` ${opt.dir.toUpperCase()} JOIN ${sortSelectSql(opt.table, true).result} ON (${getOptToString(opt.where)})`
            break
        default:
            break;
    }
    if (result) this.sqlObj.join = result
    return this
}

/*查询字段
  参数为 String | Array <string|object>
  案例： String field('id,name,age,sex')  | field(['id','name','age','sex'])
        Array<string>  field(['id', 'name, 'age', 'sex', 'remarks'])
        Array<string|object>  field(['id', 'name', 'age', {'user_id': 'userId', 'a.user_name': 'userName', 'b.user_age': 'userAge'}, 'remarks'])

*/
export function field (opt) {
    if (typeof (opt) === 'object') {
        const tempObj = []
        for (const k of opt) {
            if (typeof k === 'string') {
                tempObj.push(k)
            } else {
                const optKeys = Object.keys(k)
                for (const optK of optKeys) {
                    tempObj.push(`${optK} AS ${k[optK]}`)
                }
            }
        }
        opt = tempObj.join(', ')
    }
    this.sqlObj.field = opt
    return this;
}

/*设置别名
  参数为 String
  案例： alias('a')
*/
export function alias(opt){
    this.sqlObj.alias=opt
    return this;
}

/*设置data数据
  参数为 json | string
  案例： {name:'zane',email:'752636052@qq.com'}  |  'name=zane&email=752636052@qq.com'
*/
export function data(opt){
    let newopt  = {}
    if(typeof(opt)==='string'){
        let arr = opt.split('&')
        arr.forEach(item=>{
            let itemarr = item.split('=')
            newopt[itemarr[0]]=itemarr[1]
        })
    }else{
        newopt=opt
    }
    this.sqlObj.data = newopt
    return this
}

/*order排序
  参数为 Array | string
  案例： order(['id','number asc'])  | order('id desc')
*/
export function order(opt){
    let orderby = 'ORDER BY'

    if(typeof(opt) === 'object') {
        opt = opt.join(',')
    }

    this.sqlObj.order = `${orderby} ${opt}`
    return this
}

/*limit 语句
  参数类型 ： Number
  案例 limit(10)  | limit(10,20)
 */
export function limit(){ 
    this.sqlObj.limit = `LIMIT ${Array.prototype.slice.apply(arguments)}` 
    return this
}

/*page 语句
  参数类型 ： Number | String
  案例 page(1,10)  | page(2,10) | page('3,10')
 */
export function page(option){
    let opt     = []
    if(arguments.length === 1){
        opt     = option.split(',');
    }else{
        opt     = Array.prototype.slice.apply(arguments)
    }
    if(opt.length==2){
        let begin   = parseInt(opt[0]-1) * parseInt(opt[1]);
        let end     = parseInt(opt[1])
        this.sqlObj.limit = `LIMIT ${begin},${end}` 
    }
    return this
}

/*group 语句
  参数类型 ： String
  案例        group('id,name')
 */
export function group(opt){
    this.sqlObj.group = `GROUP BY ${opt}`
    return this
}

/*having 语句
    参数类型： String
    案例：    having('count(number)>3')
 */
export function having(opt){
    this.sqlObj.having = `HAVING ${opt}`
    return this
}

/*union 语句
    参数类型： String | Array
    案例： union('SELECT name FROM node_user_1') | union(['SELECT name FROM node_user_1','SELECT name FROM node_user_2'])
 */
export function union(opt,type=false){
    if(typeof(opt) === 'string'){
        if(this.sqlObj.union){
            this.sqlObj.union =`${this.sqlObj.union} (${opt}) ${type?'UNION ALL':'UNION'}`
        }else{
            this.sqlObj.union =`(${opt}) ${type?'UNION ALL':'UNION'} `
        }
    }else if(typeof(opt)==='object'){
        if(this.sqlObj.union){
            this.sqlObj.union =`${this.sqlObj.union} (${opt.join( type?') UNION ALL (':') UNION (' )})  ${type?'UNION ALL':'UNION'} `
        }else{
            this.sqlObj.union =`(${opt.join( type?') UNION ALL (':') UNION (' )}) ${type?'UNION ALL':'UNION'} `
        }
    }
    return this
}

/*distinct 语句
    参数类型： Boolean
    案例： distinct(true)
 */
export function distinct(opt){
    if(opt){
        this.sqlObj.distinct = 'DISTINCT'
    }
    return this
}

/* lock 锁语法
    参数类型： Boolean
    案例：  lock(true)
 */
export function lock(opt){
    if(opt){
        this.sqlObj.lock = 'FOR UPDATE'
    }
    return this
}

/* comment 为sql语句添加注释
    参数类型： String
    案例：  comment('查询用户的姓名')
 */
export function comment(opt){
    if(opt){
        this.sqlObj.comment = `/* ${opt} */`
    }
    return this
}

/**
 * 总数
 * @param {string} opt 字段名
 * @param {string} alias 字段别名
 */
export function count(opt, alias){
    let optvalue = opt || 1
    this.sqlObj.count = `COUNT(${optvalue})` + (alias ? ` AS ${alias}` : '')
    return this
}

/**
 * 最大值
 * @param {string} opt 字段名
 * @param {string} alias 字段别名
 */
export function max(opt, alias){
    if(opt) {
        this.sqlObj.max = `MAX(${opt})` + (alias ? ` AS ${alias}` : '')
    }
    return this
}

/**
 * 最小值
 * @param {string} opt 字段名
 * @param {string} alias 字段别名
 */
export function min(opt, alias){
    if(opt) {
        this.sqlObj.min = `MIN(${opt})` + (alias ? ` AS ${alias}` : '')
    }
    return this
}

/**
 * 求平均数
 * @param {string} opt 字段名
 * @param {string} alias 字段别名
 */
export function avg(opt, alias){
    if(opt) {
        this.sqlObj.avg = `AVG(${opt})` + (alias ? ` AS ${alias}` : '')
    }
    return this
}
/**
 * 求和
 * @param {string} opt 字段名
 * @param {string} alias 字段别名
 */
export function sum(opt, alias){
    if(opt) {
        this.sqlObj.sum = `SUM(${opt})` + (alias ? ` AS ${alias}` : '')
    }
    return this
}
