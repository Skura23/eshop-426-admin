<!-- home -->
<template>
  <div class="app-container">
    <div class="page-seckill">
      <TableList
        @search="searList"
        :operation-width="operationWid"
        :list-query="query"
        :table-list="tableData.list"
        :tableMap="tableMap"
        :total="tableData.total"
        :slot-col="['is_show','status_type', 'time']"
        :add-btn="true"
      >
        <template #button="{querylist}">

          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            icon="el-icon-plus"
            @click="handleCreate"
          >
            创建秒杀
          </el-button>
        </template>
        <template #query="{querylist}">
          <el-select
            v-model="querylist.is_show"
            placeholder="开始前是否展示"
            clearable
          >
            <el-option
              v-for="(item,key) in is_showOpts"
              :key="key"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <el-select
            v-model="querylist.status_type"
            placeholder="活动状态"
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

        <template #is_show="{row}">
          {{row.is_show==1?'是':'否'}}
        </template>
        <template #time="{row}">
          {{row.start_time +' - '+ row.end_time}}
        </template>
        <template #status_type="{row}">
          {{row.status_type=='not_start'? '未开始':row.status_type=='complete'? '已结束':'进行中'}}
        </template>

        <template #operation="{row}">
          <el-button
            type="primary"
            size="small"
            v-if="row.status_type!='complete'"
            @click="goodsSet(row)"
          >
            商品设置
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="editGoods(row)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="small"
            @click="delGoods(row)"
          >删除</el-button>
        </template>
      </TableList>
    </div>



    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <div>
        <el-form
          ref="form"
          label-width="120px"
        >
          <el-form-item label="活动名称">
            <el-date-picker
              v-model="createData.date"
              type="datetimerange"
              range-separator="至"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="开始前是否展示">
            <el-radio
              v-model="createData.is_show"
              label="1"
            >是</el-radio>
            <el-radio
              v-model="createData.is_show"
              label="2"
            >否</el-radio>
          </el-form-item>
        </el-form>

      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitCreate"
        >确 定</el-button>
      </span>
    </el-dialog>
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
        curId: '',
        dialogVisible: false,
        createData: {
          date: [],
          is_show: '1'
        },
        operationWid: 250,
        status_typeOpts: [{
            value: 'not_start',
            label: '未开始'
          },
          {
            value: 'complete',
            label: '已结束'
          },
          {
            value: 'going',
            label: '进行中'
          },
        ],
        is_showOpts: [{
            value: 1,
            label: '是'
          },
          {
            value: 2,
            label: '否'
          }
        ],
        query: {
          page: 1,
          page_size: 10,
          is_show: '',
          status_type: '',
        },
        tableData: {
          list: [],
          total: 0,
        },
        tableMap: {
          time: {
            headname: '活动时间',
            width: ''
          },
          is_show: {
            headname: '开始前是否展示',
            width: ''
          },
          status_type: {
            headname: '活动状态',
            width: ''
          },
          goods_num: {
            headname: '商品数量',
            width: ''
          }
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
      goodsSet(row) {
        // if (row.status_type == 'complete') {
        //   this.$message({
        //     message: '活动已结束, 无法修改商品',
        //     type: 'warning'
        //   });
        //   return
        // }
        this.$router.push(`./goods-list?seckill_id=${row.seckill_id}`)
      },
      submitCreate() {
        if (this.modiType == 'add') {
          api.seckill_create({
            start_time: this.createData.date[0],
            end_time: this.createData.date[1],
            is_show: this.createData.is_show,
          }).then((res) => {
            this.$message({
              message: res.info,
              type: '',
            })
            if (res.code == 9999) {
              this.dialogVisible = false
              this.searList(this.query)
            }
          })
        } else {
          api.seckill_edit({
            start_time: this.createData.date[0],
            end_time: this.createData.date[1],
            is_show: this.createData.is_show,
            seckill_id: this.curId
          }).then((res) => {
            this.$message({
              message: res.info,
              type: '',
            })
            if (res.code == 9999) {
              this.dialogVisible = false
              this.searList(this.query)
            }
          })
        }
      },
      handleCreate(query) {
        this.createData = {}
        this.modiType = 'add'
        this.dialogVisible = true
      },
      searList() {
        api.seckill_list(this.query).then((res) => {
          this.tableData = res.data
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
          api.bargain_goods_list(this.query).then((res) => {
            this.tableData = res.data
          })
        })
      },
      editGoods(row) {
        this.dialogVisible = true
        this.modiType = 'edit'
        this.curId = row.seckill_id
      },
      delGoods(row) {
        api.seckill_delete({
          seckill_id: row.seckill_id
        }).then((res) => {
          this.searList()
        })
      },
    }
  }
</script>
<style lang="scss">
  .app-container {
    .filter-container {
      >.el-input:first-child {
        display: none;
      }
    }
  }
</style>