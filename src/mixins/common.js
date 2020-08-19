import api from '@/api/shopManage'

// 商品上下架
let toggleUpdownGoods = {
  methods: {
    updownGoods(row, url, cb) {
      let {
        status,
        goods_id
      } = row
      status = status == 1 ? 2 : 1;
      api[url]({
        goods_id,
        status
      }).then((res) => {
        cb(res)
      })
    }
  }
}

// 数据提交
let submitDisToggle = {
  data(){
    return {
      m_disSubmit: false,
    }
  },
  methods: {
    /**
     * @param  {} data
     * @param  {} url
     * @param  {} cb 回调
     * @param  {} succcb 成功回调
     */
    m_submits(data, url, cb, succcb){
      this.m_disSubmit = true
      api[url](data).then((res) => {
        this.m_disSubmit = false
        cb && cb(res)
        if (res.code == 9999) {
          succcb && succcb(res)
        }
      })
    },
  }
}

export {
  toggleUpdownGoods,
  submitDisToggle
}