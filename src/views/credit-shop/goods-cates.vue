<template>
  <div class="app-container page-goods-cates">
    <div class="block">
      <!-- <p>使用 scoped slot</p> -->
      <el-tree
        :data="l_data"
        node-key="class_id"
        default-expand-all
        :expand-on-click-node="false"
        :props="{
          label: 'class_name',
          children: 'child'
        }"
        style="width:40%"
      >
        <span
          class="custom-tree-node"
          slot-scope="{ node, data }"
        >
          <span v-show="!data.l_editting">{{ node.label }}</span>
          <div v-show="data.l_editting">
            <el-input
              size="mini"
              placeholder="请输入分类名"
              v-model="data.class_name"
              @keyup.enter.native="updateCate(node, data)"
              style=""
            >
            </el-input>
            <el-button
              type="primary"
              size="mini"
              @click="updateCate(node, data)"
            >确定</el-button>
            <el-button
              type="primary"
              size="mini"
              style="margin-left:0;"
              @click="cancelEditCate(node, data)"
            >取消</el-button>

          </div>

          <span v-show="cateModiStatus==''">
            <el-button
              type="text"
              size="mini"
              @click="() => append(node, data)"
              v-show="node.level != 2"
            >
              <i class="el-icon-plus"></i>
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="handleEditCate(data)"
              v-show="node.level != 1"
            >
              <!-- <i class="el-icon-edit"></i> -->
              编辑
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)"
              v-show="node.level != 1"
            >
              <!-- <i class="el-icon-delete"></i> -->
              删除
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
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
    name: 'goods-cates',
    components: {
      Pagination
    },
    data() {
      // const data = [{
      //   id: 99,
      //   label: '0级',
      //   children: [ {
      //     id: 2,
      //     label: '一级 2',
      //     children: [{
      //       id: 5,
      //       label: '二级 2-1'
      //     }, {
      //       id: 6,
      //       label: '二级 2-2'
      //     }]
      //   }]
      // }]

      // const data = [{
      //   id: 2,
      //   label: '一级 2',
      //   children: [{
      //     id: 5,
      //     label: '二级 2-1'
      //   }, {
      //     id: 6,
      //     label: '二级 2-2'
      //   }]
      // }]
      return {
        data: [],
        l_data: [],
        type: 'basic',
        // cate修改状态, 三种, 'edit', 'add', ''
        cateModiStatus: '',
        oldEditText: ''
      }
    },

    created() {
      this.getList()
    },
    computed: {

    },
    methods: {
      handleEditCate(data) {
        console.log(data, 'handleEditCate');
        this.cateModiStatus = 'edit'
        data.l_editting = true
        this.oldEditText = data.class_name

      },
      cancelEditCate(node, data) {
        if (this.cateModiStatus === 'add') {
          data.l_editting = false
          this.remove(node, data)
        }
        if (this.cateModiStatus === 'edit') {
          data.l_editting = false
        }
        data.class_name = this.oldEditText
        this.oldEditText = ''
        this.cateModiStatus = ''
      },
      updateCate(node, data) {
        if (this.cateModiStatus === 'add') {
          api["class_create|integral"]({
            p_id: node.parent.data.class_id,
            class_name: data.class_name,
            type: this.type
          }).then((res) => {
            this.getList(() => {
              data.l_editting = false
              this.cateModiStatus = ''
            })
          })
        }
        if (this.cateModiStatus === 'edit') {
          api["class_edit|integral"]({
            class_id: data.class_id,
            class_name: data.class_name,
            status: data.status,
            // status: 1
          }).then((res) => {
            this.getList(() => {
              data.l_editting = false
              this.cateModiStatus = ''
            })
          })
        }
        data.l_editting = false
        console.log(data, 'updateCate');
      },
      localizeData() {
        this.l_data = [{
          class_name: '所有分类:',
          class_id: 'root',
          child: this.data,
        }]

        function iterateData(data, level) {
          level = level || 0
          for (let i = 0; i < data.length; i++) {
            let elem = data[i];
            elem.l_level = level
            Vue.set(elem, 'l_editting', false)
            if (elem.child && elem.child.length > 0) {
              iterateData(elem.child, level + 1)
            }
          }
        }
        iterateData(this.l_data)
        console.log(this.l_data, 'this.l_data');
      },
      getList(cb) {
        // api.
        api["class_list|integral"]({}).then((res) => {
          this.data = res.data.list
          if (this.data == null) {
            this.data = []
          }
          this.localizeData()
          cb && cb()
        })
      },
      append(node, data) {
        this.cateModiStatus = 'add'
        const newChild = {
          class_name: '分类',
          child: [],
          l_editting: true
        };
        data.child.push(newChild);
      },

      remove(node, data) {
        console.log(node, 'node');
        const parent = node.parent;
        const child = parent.data.child || parent.data;
        const index = child.findIndex(d => d.class_id === data.class_id);
        if (this.cateModiStatus === 'edit' || this.cateModiStatus === '') {
          api["class_delete|integral"]({
            class_id: data.class_id
          }).then((res) => {
            if (res.code != 9999) {
              this.$message({
                message: res.info,
                type: '',
              })
            } else {
              child.splice(index, 1);
            }
          })
        }
      },
    }
  };
</script>

<style lang="scss">
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }



  .page-goods-cates {
    .el-input {
      width: auto;
    }

    .el-input--mini .el-input__inner {
      height: 26px;
      line-height: 26px;
      width: 150px;
      padding: 0 5px;
    }

    .el-tree-node {
      margin-top: 10px;
    }

    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      height: 31px;
      padding-right: 8px;
      padding-left: 8px;
      border: 1px solid #0003;
    }

    .el-tree-node__content {
      height: auto;
    }


    .el-input {
      width: auto;
    }

    .el-input--mini .el-input__inner {
      height: 26px;
      line-height: 26px;
      width: 150px;
      padding: 0 5px;
    }

  }
</style>