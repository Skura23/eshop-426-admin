<!-- home -->
<template>
  <div class="app-container page-order-detail">
    <div class="_d0">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="">
            <el-card class="box-card">
              <div
                slot="header"
                class="clearfix"
              >
                <span>订单信息</span>
              </div>
              <div>
                <el-form
                  :label-position="'left'"
                  label-width="100px"
                >
                  <el-form-item
                    :label="detailMap[item]"
                    v-for="(item, index) in ['order_no','status_desc', 'real_amount', 'yh', 'order_type_name', 'real_amount', 'factory_name']"
                    :key="index"
                  >
                    {{detailData[item]}}
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="">
            <el-card class="box-card">
              <div
                slot="header"
                class="clearfix"
              >
                <span>收件人信息</span>
              </div>
              <div>
                <el-form
                  :label-position="'left'"
                  label-width="100px"
                >
                  <el-form-item
                    :label="detailMap[item]"
                    v-for="(item, index) in ['receipt_name','receipt_address', 'receipt_phone']"
                    :key="index"
                  >
                    {{detailData[item]}}
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="8">
          <div class=""></div>
        </el-col>
      </el-row>
    </div>

    <div class="_d1 mt">
      <el-card class="box-card">
        <div
          slot="header"
          class="clearfix"
        >
          <span>商品信息</span>
        </div>
        <div class="">
          <el-table
            :data="detailData.goods"
            style="width: 100%"
          >
            <el-table-column
              :prop="index"
              :label="item"
              width="180"
              v-for="(item, index) in detailMap.goods"
              :key="index"
              v-if="index!= 'goods_image'"
            >

            </el-table-column>

            <el-table-column
              :prop="index"
              :label="item"
              width="180"
              v-for="(item, index) in detailMap.goods"
              :key="index"
              v-if="index== 'goods_image'"
            >
              <template
                v-if="index== 'goods_image'"
                slot-scope="{row}"
              >
                <div class="">
                  <img
                    width="100"
                    height="100"
                    :src="row.goods_image[0]"
                    alt=""
                  >
                </div>
              </template>

            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>

    <div class="_d2 mt">
      <el-card class="box-card">
        <div
          slot="header"
          class="clearfix"
        >
          <span>金额分配</span>
        </div>
        <div class="">
          <el-table
            :data="detailData.order_fund_assign"
            style="width: 100%"
          >
            <el-table-column
              :prop="index"
              :label="item"
              width="180"
              v-for="(item, index) in detailMap.order_fund_assign"
              :key="index"
              v-if="index!='assign_type'"
            >
              <template slot-scope="{row}">
                {{row[index]}}
              </template>
            </el-table-column>

            <el-table-column
              prop="assign_type"
              :label="detailMap.order_fund_assign['assign_type']"
              width="180"
            >
              <template slot-scope="{row}">
                {{detialAssigntypeMap[row['assign_type']]}}
              </template>

            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  // import TableList from '@/components/TableList'
  import _ from "lodash";
  import Vue from 'vue'
  import api from '@/api/shopManage'
  import globals from '@/utils/globals'

  export default {
    data() {
      return {
        detailData: {},

        detailMap: {
          member_id: '客户id',
          factory_id: '门店id',
          order_no: '单号',
          member_name: '客户名称',
          member_phone: '客户手机号',
          receipt_phone: '收货人手机',
          receipt_name: '收货人名称',
          receipt_address: '收货人地址',
          factory_name: '商家名称',
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
            // text: '商品详情',
            goods_id: '商品id',
            goods_image: '商品图片',
            goods_name: '商品名称',
            option_name: '商品规格',
            num: '数量',
            price: '单价',
          },
          order_fund_assign: {
            // text: '订单金额分配',
            amount: '金额',
            // to_object_id: '分配对象ID',
            to_object_type_name: '分配对象类型',
            to_object_name: '分配对象',
            assign_type: '类型',
            remark: '备注',
          }
        },
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

    },
    created() {
      let order_no = this.$route.query.order_no
      api.pc_order_detail({
        order_no
      }).then((res) => {
        this.detailData = res.data
      })
    },
    computed: {},

    mounted() {},

    methods: {}
  }
</script>
<style lang="scss">
  .app-container.page-order-detail {
    .el-form-item {
      margin-bottom: 10px;

      .el-form-item__label,
      .el-form-item__content {
        line-height: 20px;
      }
    }
  }
</style>