<!-- home -->
<template>
  <div class="app-container">
    <TableList
      @search="searGoods"
      :operation-width="operationWid"
      :list-query="query"
      :table-list="tableData.list"
      :tableMap="tableMap"
      :total="tableData.total"
      :slot-col="['goods_image','status_type','status', 'bargin_time']"
    >

      <template #query="{querylist}">
        <el-select
          v-model="querylist.status"
          placeholder="请选择上下架状态"
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

        <el-select
          v-model="querylist.status_type"
          placeholder="请选择活动状态"
          clearable 
        >
          <el-option
            v-for="(item,key) in status_typeOpts"
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
          width="50"
          alt=""
        >
      </template>
      <template #bargin_time="{row}">
        {{row.start_time +' - '+ row.end_time}}
      </template>
      <template #status_type="{row}">
        {{row.status_type=='not_start'? '未开始':row.status_type=='complete'? '已结束':'进行中'}}
      </template>
      <template #status="{row}">
        {{row.status==1? '已上架':'已下架'}}
      </template>

      <template #operation="{row}">
        
        <el-button
              type="primary"
              size="mini"
              @click="updownGoods(row, row.status)"
            >
              {{row.status==1? '下架':'上架'}}
            </el-button>
            
        <el-button
          type="primary"
          size="small"
          v-if="row.status_type=='not_start'"
          @click="editGoods(row)"
        >编辑</el-button>
        <!-- <el-button
          type="primary"
          size="small"
          @click="delGoods(row)"
        >删除</el-button> -->
      </template>
    </TableList>
  </div>
</template>

<script>
  import TableList from '@/components/TableList'
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
        operationWid: 220,
        status_typeOpts:[
          {
            value:'not_start',
            label: '未开始'
          },
          {
            value:'complete',
            label: '已结束'
          },
          {
            value:'going',
            label: '进行中'
          },
        ],
        statusOpts:[
          {
            value:1,
            label: '上架'
          },
          {
            value:2,
            label: '下架'
          }
        ],
        query: {
          page: 1,
          page_size: 10,
          status: '',
          status_type: '',
        },
        tableData: {
          list: [],
          total: 0,
        },
        tableMap: {
          goods_name: {
            headname: '名称',
            width: ''
          },
          goods_image: {
            headname: '图片',
            width: ''
          },
          market_price: {
            headname: '市场价',
            width: ''
          },
          end_price: {
            headname: '底价',
            width: ''
          },
          sell_num: {
            headname: '已成交数量',
            width: ''
          },
          bargin_time: {
            headname: '活动时间',
            width: ''
          },
          status_type: {
            headname: '活动状态',
            width: ''
          },
          status: {
            headname: '商品状态',
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
      searGoods(query) {
        api.bargain_goods_list(query).then((res) => {
          this.tableData = res.data
          this.query = query
        })
      },
      updownGoods(row, flag) {
        let {
          status,
          goods_id
        } = row
        status = flag == 1 ? 2 : 1;
        api.bargain_goods_put_away({
          goods_id,
          status
        }).then((res) => {
          api.bargain_goods_list(this.query).then((res) => {
            this.tableData = res.data
          })
        })
      },
      editGoods(row) {
        this.$router.push(`./goods-edit?goods_id=${row.goods_id}`)
      },
      delGoods(row) {

      },
    }
  }
</script>
<style
  lang="scss"
  scoped
>
  .app-container {}
</style>