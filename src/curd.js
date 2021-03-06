import {
    sortSelectSql,
    checkOptType,
    handleInsertData,
} from './util'

export function select(type=false){
    let result = ''
    if(this.sqlObj.union){
        result = this.sqlObj.union
        if(result.substr(-10).indexOf('ALL')!=-1){
            result=result.replace(/\sUNION\sALL\s*$/,'')
        }else{
            result=result.replace(/\sUNION\s*$/,'')
        }
        this.sqlObj = {}
        return result
    }
    let newSqlObj = sortSelectSql(this.sqlObj)
    newSqlObj.sortkeys.forEach(item=>{
        if(newSqlObj.result[item]){
            result = `${result} ${newSqlObj.result[item]}`
        }
    })
    const sqlStr = `SELECT ${result.replace(/'/g, '\'').replace(/`/g, '\'')} `;
    if (type){
        this.sqlObj.sqlStr = sqlStr; return this;
    } else {
        this.sqlObj = {}; return sqlStr;
    }
}

export function update(type = false, bol = false){
    let result      = ''
    let datastr     = ''
    let newopt      = this.sqlObj.data

    let keys        = Object.keys(newopt)

    keys.forEach((item,index)=>{
        datastr =  `${datastr}${item}=${checkOptType(newopt[item], item, type, bol)}` + (index==keys.length-1 ? '' : ' , ')
    })
    result  = `UPDATE ${this.sqlObj.table} SET ${datastr}` +  (this.sqlObj.where ? ` WHERE ${this.sqlObj.where}` : '')
    const sqlStr = result.replace(/'/g, '\'').replace(/`/g, '\'');
    if (type && !bol) {
        this.sqlObj.sqlStr = sqlStr; return this;
    } else {
        this.sqlObj = {}; return sqlStr;
    }
}   

export function insert(type = false){
    let newopt  = this.sqlObj.data
    const datastr = handleInsertData(newopt);
    let result = `INSERT INTO ${this.sqlObj.table} ${datastr}`
    const sqlStr = result.replace(/'/g, '\'').replace(/`/g, '\'')
    if (type) {
        this.sqlObj.sqlStr = sqlStr; return this;
    } else {
        this.sqlObj = {}; return sqlStr;
    }
}

export function delet(type = false){
    let result = `DELETE FROM ${this.sqlObj.table}` + (this.sqlObj.where ? ` WHERE ${this.sqlObj.where}` : '')
    const sqlStr = result.replace(/'/g, '\'').replace(/`/g, '\'')
    if (type) {
        this.sqlObj.sqlStr = sqlStr; return this;
    } else {
        this.sqlObj = {}; return sqlStr;
    }
}

/*query??????sql??????
  ????????? String
  ????????? query('SELECT * FROM user_name')
*/
export function query(opt, type = false){
    opt = opt ? opt : '';
    if (type) {
        this.sqlObj.sqlStr = opt; return this;
    } else {
        return opt;
    }
}
 





