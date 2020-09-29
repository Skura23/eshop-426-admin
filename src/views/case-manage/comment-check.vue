<!-- home -->
<template>
  <div class="app-container page-comment-check">
    <TableList
      @search="searGoods"
      :has-keyword="false"
      :operation-width="operationWid"
      :list-query="query"
      :table-list="tableData.list"
      :tableMap="tableMap"
      :total="tableData.total"
      :slot-col="['check_status']"
    >

      <template #query="{querylist}">
        <el-select
          v-model="querylist.check_type"
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
      <template #check_status="{row}">
        {{row.check_status=='1'? '申请中':row.check_status=='2'? '审核通过':'驳回'}}
      </template>

      <template #operation="{row}">
        <el-button
          type="primary"
          size="small"
          @click="checkComment(row)"
        >审核</el-button>
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
        statusOpts: [{
            value: 'check_pending',
            label: '待审核'
          },
          {
            value: 'checked',
            label: '已审核'
          }
        ],
        query: {
          page: 1,
          page_size: 10,
          check_type: '',
        },
        tableData: {
          list: [],
          total: 0,
        },
        tableMap: {
          object_name: {
            headname: '评论人',
            width: ''
          },
          comment: {
            headname: '评论内容',
            width: ''
          },
          add_time: {
            headname: '评论时间',
            width: ''
          },
          add_time: {
            headname: '评论时间',
            width: ''
          },
          check_reason: {
            headname: '审核理由',
            width: ''
          },
          check_status: {
            headname: '状态',
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
        api.check_cases_comment_list(query).then((res) => {
          this.tableData = res.data
          this.query = query
        })
      },

      checkComment(row) {

        this.$prompt('输入审核理由(可选)', '审核', {
          confirmButtonText: '通过',
          cancelButtonText: '驳回',
        }).then(({
          value
        }) => {
          api.check_update({
            id: row.id,
            check_status: 2,
            check_reason: value
          }).then((res) => {
            this.searGoods()
          })
        }).catch(() => {
          let val = document.querySelector('.el-message-box input').value
          api.check_update({
            id: row.id,
            check_status: 3,
            check_reason: val
          }).then((res) => {
            this.searGoods()

          })
        });


      },

    }
  }
</script>
<style
  lang="scss"
  scoped
>
  .app-container.page-comment-check {}
</style>