<!-- home -->
<template>
  <div class="app-container">
    <TableList
      @search="searGoods"
      :operation-width="operationWid"
      :hasOperation="false"
      :hasKeyword="false"
      :list-query="query"
      :table-list="tableData.list"
      :tableMap="tableMap"
      :total="tableData.total"
    >

      <template #query="{querylist}">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="dateData"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
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
        query: {
          page: 1,
          page_size: 10,
          start_date: '',
          end_date: '',
        },
        tableData: {
          list: [],
          total: 0,
        },
        tableMap: {
          available_amount: {
            headname: '可用余额',
            width: ''
          },
          pending_amount: {
            headname: '不可用余额',
            width: ''
          },
          s_day: {
            headname: '	日期',
            width: ''
          },
        },
        dateData: []
      }

    },
    components: {
      TableList
    },
    created() {
      // api.factory_balance_list({}).then((res) => {

      // })
    },
    watch: {
      dateData(newData, oldData) {
        if (newData == null) {
          this.query.start_date = ''
          this.query.end_date = ''
          return
        }
        this.query.start_date = this.dateData[0]
        this.query.end_date = this.dateData[1]

      }
    },

    computed: {},

    mounted() {},

    methods: {
      searGoods(query) {
        api.factory_balance_list(query).then((res) => {
          this.tableData = res.data
          this.query = query
        })
      },
      updownGoods(row) {
        let {
          status,
          goods_id
        } = row
        status = status == 1 ? 2 : 1;
        api.bargain_goods_put_away({
          goods_id,
          status
        }).then((res) => {
          if (res.code == 9999) {
            this.$message(`商品${status==1?'上架':'下架'}成功`);
          } else {
            this.$message.error('操作失败');
          }
          api.factory_balance_list(this.query).then((res) => {
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