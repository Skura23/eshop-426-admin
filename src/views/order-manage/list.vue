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
        <span
          class="cl-blue c-p mr"
          @click="showDia(row)"
        >详情 </span>

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

    <el-dialog
      title="详情"
      class="_detail-dia"
      :visible.sync="dialogDetailVisible"
      width="50%"
    >
      <!-- 详情不封装单个写太麻烦了, 有时间封装 -->
      <el-form :model="form">
        <el-form-item
          :label="typeof val=='string'?val:val.text"
          :label-width="formLabelWidth"
          v-for="(val, k, idx) in detailMap"
          :key="idx"
        >
          <div
            class=""
            v-if="typeof val == 'object'"
          >
            <div
              class="mb"
              v-for="(val2, k2, idx2) in detailData[k]"
              :key="idx2"
              v-if="k=='goods'|| k=='order_fund_assign'"
            >
              <div
                class=""
                v-for="(val3, k3, idx3) in val2"
                :key="idx3"
                v-if="val[k3]"
              >
                <div
                  class=""
                  v-if="k3=='assign_type'"
                >
                  {{val[k3]}} : {{detialAssigntypeMap[detailData[k][k2][k3]]}}
                </div>
                <div
                  class=""
                  v-else-if="k3!='goods_image'"
                >
                  {{val[k3]}} : {{val3}}
                </div>

                <div
                  class=""
                  v-else
                >
                  {{val[k3]}} : <img
                    :src="val3[0]"
                    width="150"
                    alt=""
                  >
                </div>




              </div>
            </div>

            <!-- <div
              class=""
              v-for="(val2, k2, idx2) in val"
              :key="idx2"
              v-if="k!='audit_detail'"
            >

              <div
                class=""
                v-if="k2!='text' && (k=='goods'|| k=='order_fund_assign') "
              >{{val2}}:
                <img
                  :src="val2[0]"
                  width="150"
                  alt=""
                  v-if="k2=='goods_image'"
                >
                <span
                  class=""
                  v-if="k2=='assign_type'"
                >
                  {{detailData[k] && detialAssigntypeMap[detailData[k][k2]]}}
                </span>



                <span
                  class=""
                  v-else
                >
                  {{detailData[k] && detailData[k][k2]}}
                </span>

              </div>

            </div> -->
          </div>

          <div
            class=""
            v-else
          >


            <span v-if="k=='status'">
              {{detailData[k] && detailStatusMap[detailData[k]]}}
            </span>
            <span v-if="k=='can_send'">
              {{detailData[k] && detailCan_sendMap[detailData[k]]}}
            </span>

            <span v-else>
              {{detailData[k]}}
            </span>
          </div>
        </el-form-item>


      </el-form>
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
        dialogDetailVisible: false,
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
        },
        detailMap: {
          member_id: '客户id',
          factory_id: '门店id',
          order_no: '单号',
          member_name: '客户名称',
          member_phone: '客户手机号',
          receipt_phone: '收货人手机',
          receipt_name: '收货人名称',
          receipt_address: '收货人地址',
          amount: '订单金额',
          yh: '优惠金额',
          real_amount: '实际金额',
          pay_amount: '实付金额',
          pay_time: '支付时间',
          add_time: '下单时间',
          status_desc: '订单状态',
          can_send: '是否可发货',
          order_type_name: '订单类型',
          goods: {
            text: '商品详情',
            goods_image: '商品图片',
            option_name: '商品规格',
            goods_name: '商品名称',
            num: '数量',
            price: '单价',
          },
          order_fund_assign: {
            text: '订单金额分配',
            amount: '金额',
            to_object_id: '分配对象ID',
            to_object_type_name: '分配对象类型名称',
            to_object_name: '分配对象名称',
            assign_type: '类型',
            remark: '备注',
          }
        },
        detailData: {},
        detailStatusMap: {
          '-1': '预付订单',
          1: '待付款',
          2: '已付款',
          3: '已发货',
          4: '已完成',
          5: '已关闭'
        },
        detailCan_sendMap: {
          true: '可以发货',
          false: '不可'
        },
        detialAssigntypeMap: {
          fee: '费用',
          business: '营业额',
          commission: '推广提成',
        },
        
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
      showDia(data) {
        // this.dialogDetailVisible = true
        // api.pc_order_detail({
        //   order_no: data.order_no
        // }).then((res) => {
        //   this.detailData = res.data
        // })
        this.$router.push(`/order-manage/detail?order_no=${data.order_no}`)
      },
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