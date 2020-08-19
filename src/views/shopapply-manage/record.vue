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
      :list-loading="listLoading"
    >

      <template #query="{querylist}">
        <el-input
          v-model="querylist.factory_name_like"
          placeholder="门店名称"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="searGoods"
        />
        <el-input
          v-model="querylist.phone_like"
          placeholder="手机号"
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

      <!-- <template #bargin_time="{row}">
        {{row.start_time +' - '+ row.end_time}}
      </template>
      <template #status_type="{row}">
        {{row.status_type=='not_start'? '未开始':row.status_type=='complete'? '已结束':'进行中'}}
      </template> -->

      <template #operation="{row}">
        <el-button
          type="primary"
          size="small"
          @click="checkApply(row)"
        >
          审核
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
  import globals from '@/utils/globals'

  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import Cookies from 'js-cookie'

  export default {
    data() {
      return {
        listLoading: true,
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
            label: '正常'
          },
          {
            value: 2,
            label: '冻结'
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
          request_name: {
            headname: '申请人',
            width: ''
          },
          phone: {
            headname: '手机号',
            width: ''
          },
          reason: {
            headname: '申请理由',
            width: ''
          },
          factory_name: {
            headname: '门店名',
            width: ''
          },
          add_time: {
            headname: '添加时间',
            width: ''
          },
          l_address: {
            headname: '地址',
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
        api.admin_factory_request_list(query).then((res) => {
          if (res.code == 9999) {
            this.tableData = res.data
            this.query = query
            this.reshapeData()
          } else {
            this.listLoading = false
            this.$message({
              message: res.info,
              type: 'warning',
            })
          }

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