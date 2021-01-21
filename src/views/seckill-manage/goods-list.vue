<!-- home -->
<template>
  <div class="app-container">
    <div class="page-seckill-goods">
      <TableList
        @search="searList"
        :operation-width="operationWid"
        :list-query="query"
        :table-list="tableData.list"
        :tableMap="tableMap"
        :total="+tableData.total"
        :slot-col="['goods_image']"
        :add-btn="true"
        :filtered-list="filteredList"
      >

        <template #button="{querylist}">

          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            icon="el-icon-plus"
            @click="handleCreate"
          >
            创建商品
          </el-button>
        </template>

        <template #query="{querylist}">
          <el-select
            v-model="querylist.status"
            placeholder="商品状态"
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

        <template #goods_image="{row}">
          <img
            :src="row.goods_image[0]"
            width="100"
            height="100"
          >
        </template>

        <template #operation="{row}">
          <el-button
            type="primary"
            size="small"
            @click="updownGoods(row,'seckill_goods_put_away',searList)"
          >
            {{row.status==1?'下架':'上架'}}
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="editGoods(row)"
          >编辑</el-button>
          
        </template>
      </TableList>
    </div>
  </div>
</template>

<script>
  import {toggleUpdownGoods} from '@/mixins/common'
  import TableList from '@/components/TableList'
  console.log(TableList, 'TableList');

  import _ from "lodash";
  import Vue from 'vue'
  import api from '@/api/shopManage'
  import cityData from '@/utils/city'
  import globals from '@/utils/globals'

  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import Cookies from 'js-cookie'

  export default {
    data() {
      return {
        filteredList: {
          status(row){
            return row.status == 1 ? '是' : '否'
          },
        },
        dialogVisible: false,
        operationWid: 220,
        statusOpts: [{
            value: 1,
            label: '已上架'
          },
          {
            value: 2,
            label: '已下架'
          }
        ],
        query: {
          page: 1,
          page_size: 10,
          status: '',
          keywords_like: '',
        },
        tableData: {
          list: [],
          total: 0,
        },
        tableMap: {
          goods_name: {
            headname: '商品名称',
            width: ''
          },
          goods_image: {
            headname: '商品图片',
            width: ''
          },
          market_price: {
            headname: '市场价',
            width: ''
          },
          price: {
            headname: '秒杀价',
            width: ''
          },
          status: {
            headname: '状态',
            width: ''
          },
          stock_num: {
            headname: '秒杀库存',
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
      this.query.seckill_id = this.$route.query.seckill_id
    },
    mixins:[toggleUpdownGoods],
    computed: {},

    mounted() {},

    methods: {
      handleCreate() {
        this.$router.push(`./goods-add?seckill_id=${this.query.seckill_id}`)
      },
      goodsSet(row) {
        this.$router.push(`./goods-list?seckill_id=${row.seckill_id}`)
      },
      searList() {
        api.seckill_goods_list(this.query).then((res) => {
          this.tableData = res.data
        })
      },
      editGoods(row) {
        this.$router.push(`./goods-edit?seckill_id=${this.query.seckill_id}&goods_id=${row.goods_id}`)
      },
      delGoods(row) {
        //   api.integral_goods_detail({}).then((res) => {

        // })
      },
    }
  }
</script>
<style lang="scss">
  .app-container {}
</style>