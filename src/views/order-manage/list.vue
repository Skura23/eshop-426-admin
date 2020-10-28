<!-- home -->
<template>
  <div class="app-container page-shopapply-record">
    <TableList
      @search="searGoods"
      :operation-width="operationWid"
      :list-query="query"
      :table-list="tableData.list"
      :tableMap="tableMap"
      :total="tableData.total"
      :slot-col="['goods', 'status']"
    >

      <template #query="{querylist}">
        <el-input
          v-model="querylist.order_no_like"
          placeholder="输入单号"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="searGoods"
        />
        <el-input
          v-model="querylist.phone_like"
          placeholder="输入手机号"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="searGoods"
        />
        <el-select
          v-model="querylist.status"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="(item,key) in statusOpts"
            :key="key"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </template>

      <template #goods="{row}">
        <div
          class="clearfix"
          v-for="(item, index) in row.goods"
          :key="index"
        >
          <div class="fl">
            <img
              width="80px"
              height="80px"
              fit="cover"
              :src="item.goods_image[0]"
            />
          </div>
          <div class="fl">
            <div class="">{{item.goods_name}}</div>
            <div class="">x{{item.num}}</div>
            <div class="">{{item.price}}￥/个</div>
          </div>
        </div>
      </template>
      <template #status="{row}">
        {{statusOpts.filter(v=>v.value==row.status)[0].label}}
      </template>

      <template #operation="{row}">
        <el-button
          type="primary"
          size="small"
          v-if="row.status==2"
          @click="sendGoods(row)"
        >
          发货
        </el-button>

      </template>
    </TableList>

    <el-dialog
      title="审核"
      :visible.sync="dialogFormVisible"
      class="_dia"
    >
      <el-form :model="form">
        <el-form-item
          label="审核结果"
          :label-width="formLabelWidth"
        >
          <el-radio
            v-model="form.request_status"
            label="3"
          >通过</el-radio>
          <el-radio
            v-model="form.request_status"
            label="4"
          >驳回</el-radio>
        </el-form-item>
        <div v-if="form.request_status==3">
          <el-form-item
            label="分配门店"
            :label-width="formLabelWidth"
          >
            {{form.factory_name}} <el-button
              type="primary"
              @click="chooseShop"
            >选择门店</el-button>

          </el-form-item>

          <el-form-item
            label="分配门店账号"
            required
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="form.allot_account"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="分配门店密码"
            required
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="form.allot_psd"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="cfmCheck"
        >确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="选择门店"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
    >
      <TableList
        @search="searShop"
        :operation-width="operationWid"
        :list-query="query"
        :table-list="shopData.list"
        :tableMap="shopMap"
        :total="shopData.total"
      >

        <template #operation="{row}">
          <el-button
            type="primary"
            size="small"
            @click="cfmShop(row)"
          >
            选择
          </el-button>

        </template>
      </TableList>
    </el-dialog>
  </div>
</template>

<script>
  import TableList from '@/components/TableList'
  import _ from "lodash";
  import Vue from 'vue'
  import api from '@/api/shopManage'
  import cityData from '@/utils/city'
  import {
    editCb
  } from '@/utils'
  import globals from '@/utils/globals'

  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import Cookies from 'js-cookie'

  export default {
    data() {
      return {
        shopData: {
          list: [],
          total: 0,
        },
        shopMap: {
          factory_name: {
            headname: '门店名称',
            width: ''
          },
        },
        curId: '',
        form: {},
        formLabelWidth: '120px',
        dialogTableVisible: false,
        dialogFormVisible: false,
        operationWid: 220,
        statusOpts: [{
            value: 1,
            label: '待付款'
          },
          {
            value: 2,
            label: '已付款'
          },
          {
            value: 3,
            label: '已发货'
          },
          {
            value: 4,
            label: '已完成'
          },
          {
            value: 5,
            label: '已关闭'
          },
        ],
        query: {
          page: 1,
          page_size: 10,
          status: '',
        },
        tableData: {
          list: [],
          total: 0,
        },
        tableMap: {
          order_no: {
            headname: '单号',
            width: ''
          },
          member_name: {
            headname: '客户手机号',
            width: ''
          },
          member_phone: {
            headname: '收货人手机',
            width: ''
          },
          receipt_address: {
            headname: '收货人地址',
            width: ''
          },
          goods: {
            headname: '商品详情',
            width: ''
          },
          status: {
            headname: '订单状态',
            width: ''
          },
        }
      }

    },
    components: {
      TableList
    },
    created() {
      // api.bargain_goods_list({}).then((res) => {

      // })
    },

    computed: {},

    mounted() {},

    methods: {
      sendGoods(data) {
        api.order_send({
          order_no: data.order_no
        }).then((res) => {
          editCb(res, this.searGoods)
        })
      },
      cfmCheck() {
        api.factory_request_check(this.form).then((res) => {
          this.dialogFormVisible = false
        })
      },
      cfmShop(row) {
        this.form.factory_id = row.factory_id
        this.form.factory_name = row.factory_name
        this.dialogTableVisible = false

      },
      chooseShop() {
        this.dialogTableVisible = true
        api.factory_list({}).then((res) => {
          this.shopData = res.data
        })
      },
      searShop(query) {

      },
      searGoods(query) {
        // let res = {
        //   "code": "9999",
        //   "info": "请求成功",
        //   "cache": {
        //     "status": false,
        //     "cacheEndTime": 0
        //   },
        //   "data": {
        //     "total": 1,
        //     "total_pay_amount": "10000.00",
        //     "list": [{
        //       "member_id": "1",
        //       "factory_id": "1",
        //       "order_no": "202005240000011",
        //       "order_type": "normal",
        //       "member_name": "小明",
        //       "member_phone": "13917871964",
        //       "receipt_phone": "13917871964",
        //       "receipt_name": "小明",
        //       "receipt_address": "上海市浦东新区张江路1358号",
        //       "amount": "12001.00",
        //       "yh": "2001.00",
        //       "real_amount": "10000.00",
        //       "pay_amount": "10000.00",
        //       "pay_time": "2020-05-24 20:06",
        //       "add_time": "2020-05-24 19:59",
        //       "status": "2",
        //       "factory_name": "板川%",
        //       "goods": [{
        //         "goods_image": [
        //           "http://api.metujia.com/uploads/images/eurorepar.png",
        //           "http://api.metujia.com/uploads/images/timg.jpg"
        //         ],
        //         "option_name": "黄色;30寸",
        //         "goods_name": "板川集成灶",
        //         "num": "1",
        //         "price": "12001.00"
        //       }]
        //     }]
        //   }
        // }

        // this.tableData = res.data
        // this.query = query

        api.order_list(query).then((res) => {

          this.tableData = res.data
          this.query = query
        })
      },
      reshapeData() {
        for (let i = 0; i < this.tableData.list.length; i++) {
          let element = this.tableData.list[i];
          element.l_address = element.province_name + element.city_name + element
            .area_name + element.area_detail
        }
      },
      checkApply(row) {
        this.curId = row.id
        this.dialogFormVisible = true
      },
      editGoods(row) {
        this.$router.push(`./goods-edit?goods_id=${row.goods_id}`)
      },
      delGoods(row) {

      },
    }
  }
</script>
<style lang="scss">
  .app-container.page-shopapply-record {
    ._dia {
      .el-input {
        width: 200px;
      }
    }
  }
</style>