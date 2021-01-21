/**
 * Created by PanJiaChen on 16/11/18.
 */
//1.首先引入`vue`
import Vue from 'vue'
//2.创建vue的实例
let v = new Vue()

// import {
//   MessageBox,
//   Message
// } from 'element-ui'
// import api from '@/api/shopManage'


/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"')
    .replace(/\+/g, ' ') +
    '"}'
  )
}

// app 相关
/**
 * @param  {} row
 * @param  {} apiname 接口名
 * @param  {} idname id名
 * @param  {} cb
 */
export function deleteLinePop(row, apiname, idname, cb) {
  v.$confirm('确定删除数据?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api[apiname](
      _.pick(row, [idname])
    ).then((res) => {
      if (res.code == 9999) {
        v.$message({
          type: 'success',
          message: '删除成功!',
          duration:1200,
          onClose: () => {
            cb()
          }
        });
      } else {
        v.$message({
          type: 'success',
          message: res.info
        });
      }

    })

  }).catch(() => {
    v.$message({
      type: 'info',
      message: '已取消删除'
    });
  });
}

export function editCb(res, cb) {
  if (res.code == 9999) {
    v.$message({
      message: res.info,
      duration:1200,
      onClose() {
        cb && cb()
      },
    })
  } else {
    v.$message({
      message: res.info,
    })
  }
}