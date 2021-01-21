<!-- home -->
<template>
  <div class="app-container">
    <el-tabs
      v-model="activeName"
      @tab-click="handleTabClick"
    >
      <el-tab-pane
        label="商城菜单"
        name="shop"
      ></el-tab-pane>
      <el-tab-pane
        label="tms菜单"
        name="tms"
      ></el-tab-pane>
    </el-tabs>

    <div class="">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        新增菜单
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="toPush"
      >
        推送菜单
      </el-button>
    </div>

    <el-table
      class="mt"
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'child'}"
    >
      <el-table-column
        prop="pid"
        label="上级菜单id"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="list_order"
        label="菜单排序"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="菜单名称"
      >
      </el-table-column>
      <el-table-column
        prop="url"
        label="url链接"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="small"
            @click="toEdit(row)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="small"
            @click="toDel(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="formStatus=='add'? '新增':'编辑'"
      :visible.sync="dialogFormVisible"
      @close='onClose'
    >
      <el-form
        :model="form"
        label-width="120px"
      >

        <el-form-item
          label="上级菜单"
          v-if="form.pid!=0"
        >
          <el-select
            v-model="form.pid"
            placeholder="请选择上级菜单"
          >
            <el-option
              v-for="item in firstMenus"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="菜单排序">
          <el-input
            v-model="form.list_order"
            autocomplete="off"
          ></el-input>
          <div class="cl-gray">数值大排在前</div>
        </el-form-item>


        <el-form-item label="菜单名称">
          <el-input
            v-model="form.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="url链接">
          <el-input
            v-model="form.url"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submit"
        >确 定</el-button>
      </div>
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
  } from '@/utils/index'
  import globals from '@/utils/globals'

  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import Cookies from 'js-cookie'

  export default {
    data() {
      return {
        operationWid: 220,
        activeName: 'shop',
        tableData: [],
        firstMenus: [],
        dialogFormVisible: false,
        // add edit ''
        formStatus: '',
        form: {}
      }

    },
    components: {
      TableList
    },
    created() {
      // api.bargain_goods_list({}).then((res) => {

      // })
      this.searGoods()
    },

    computed: {},

    mounted() {},

    methods: {
      toPush(row) {
        api.wei_xin_menu_push({
          menu_type: this.activeName
        }).then((res) => {
          editCb(res)
        })
      },
      toDel(row) {
        this.$confirm('确定删除此菜单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.wei_xin_menu_delete({
            id: row.id
          }).then((res) => {
            editCb(res, () => {
              this.searGoods()
            })
          })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      onClose() {
        this.form = {}
      },
      toEdit(row) {
        this.formStatus = 'edit'
        this.dialogFormVisible = true
        api.parent_wei_xin_menu_list({
          menu_type: this.activeName
        }).then((res) => {
          this.firstMenus = res.data.list
        })
        this.form = row
      },
      handleCreate() {
        this.formStatus = 'add'
        this.dialogFormVisible = true
        api.parent_wei_xin_menu_list({
          menu_type: this.activeName
        }).then((res) => {
          this.firstMenus = res.data.list
        })
      },
      searGoods(query) {
        api.wei_xin_menu_list({
          menu_type: this.activeName
        }).then((res) => {
          this.tableData = res.data.list
        })
      },
      handleTabClick(tab, event) {
        this.searGoods()
      },
      submit() {
        // this.dialogFormVisible = false;
        if (this.formStatus == 'add') {
          api.wei_xin_menu_create({
            ...this.form,
            menu_type: this.activeName
          }).then((res) => {
            editCb(res, () => {
              this.dialogFormVisible = false;
              this.form = {}
              this.searGoods()
            })
          })
        } else if (this.formStatus == 'edit') {
          api.wei_xin_menu_edit({
            ...this.form,
            menu_type: this.activeName
          }).then((res) => {
            editCb(res, () => {
              this.dialogFormVisible = false;
              this.form = {}
              this.searGoods()
            })
          })
        }

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
  .app-container {
    .el-input {
      width: 200px;
    }
  }
</style>