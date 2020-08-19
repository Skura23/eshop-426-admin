<!-- eshop426admin template -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        新增岗位
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="danger"
        @click="handleClearCache"
      >
        清除岗位缓存
      </el-button>
    </div>
    <br>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="岗位名称"
        prop="group_name"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.group_name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row,$index}">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <el-button
            class="ml"
            type="primary"
            size="mini"
            @click="handleUpdateAuth(row)"
          >
            修改权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
      v-if="false"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        v-show="dialogStatus!=='editAuth'"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          label="岗位名称"
          prop="group_name"
        >
          <el-input v-model="temp.group_name" />
        </el-form-item>
      </el-form>

      <el-tree
        :data="authTreeData"
        ref="tree"
        show-checkbox
        node-key="rule_id"
        :check-on-click-node="true"
        :default-expanded-keys="treeChosenId"
        :default-checked-keys="treeChosenId"
        :props="authTreeProps"
        v-show="dialogStatus==='editAuth'"
        @check-change="treeChosenChange"
      >

      </el-tree>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():dialogStatus==='update'?updateData():updateTree()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import api from '@/api/shopManage'
  import cityData from '@/utils/city'
  // import waves from '@/directive/waves' // waves directive
  import {
    parseTime
  } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import Cookies from 'js-cookie'
  // arr to obj, such as { CN : "China", US : "USA" }

  export default {
    name: 'ComplexTable',
    components: {
      Pagination
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },

    },
    data() {
      return {
        curGroupId: '',
        treeIds: '',
        treeChosenId: [],
        authTreeData: [],
        authTreeProps: {
          label: 'rule_name',
          children: 'child'
        },
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        importanceOptions: [1, 2, 3],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {},
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          group_name: [{
            required: true,
            message: '请输入岗位名称',
            trigger: 'blur'
          }]
        },
        downloadLoading: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      updateTree() {
        api.group_auth_edit({
          group_id: this.curGroupId,
          rule_list: this.treeIds
        }).then((res) => {
          this.$message({
            message: res.info,
            type: '',
          })
          if (res.code == 9999) {
            this.dialogFormVisible = false
          }
        })
      },
      treeChosenChange() {
        let arr1 = this.$refs.tree.getCheckedKeys()
        let arr2 = this.$refs.tree.getHalfCheckedKeys()
        console.log(arr1, arr2, 'treeChosenChange');
        let ids = arr1.concat(arr2).join(',')
        this.treeIds = ids
      },
      getTreeChosenId() {
        let list = this.authTreeData

        function iterateList(list) {
          let arr = []
          list.forEach(elem => {
            if (elem.child) {
              arr = arr.concat(iterateList(elem.child))
            } else {
              if (elem.is_choose) {
                arr.push(elem.rule_id)
              }
            }
          });
          return arr
        }
        return iterateList(list)
      },
      handleUpdateAuth(row) {
        this.curGroupId = row.group_id
        this.dialogFormVisible = true
        this.dialogStatus = 'editAuth'
        api.group_auth_rule({
          group_id: row.group_id
        }).then((res) => {
          this.authTreeData = res.data
          this.treeChosenId = this.getTreeChosenId()
          console.log(this.treeChosenId, 'this.treeChosenId');
        })
      },
      handleClearCache() {
        api.group_auth_cache_delete().then((res) => {
          this.$message({
            message: res.info,
            type: '',
          })
        })
      },
      getList() {
        this.listLoading = true
        api.group_list().then(response => {
          this.list = response.data.list
          this.listLoading = false;
          // this.total = response.data.total
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },

      resetTemp() {
        this.temp = {

        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            api.group_create(this.temp).then((res) => {
              if (res.code == 9999) {
                this.dialogFormVisible = false
                this.getList()
              }
            })
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            api.group_edit(this.temp).then((res) => {
              if (res.code == 9999) {
                this.dialogFormVisible = false
                this.getList()
              }
            })
          }
        })
      },
      handleDownload() {

      },
      formatJson(filterVal) {
        return this.list.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      getSortClass: function (key) {
        const sort = this.listQuery.sort
        return sort === `+${key}` ? 'ascending' : 'descending'
      }
    }
  }
</script>