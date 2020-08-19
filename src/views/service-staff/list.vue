<!-- eshop426admin template -->
<template>
  <div class="app-container page-servstaff-list">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keywords_like"
        placeholder="人员名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      &nbsp;
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        新增人员
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
        label="人员名称"
        prop="staff_name"
        align="center"
        width="120"
      >
        <template slot-scope="{row}">
          <span>{{ row.staff_name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="服务项目"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.service_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="服务电话"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.service_phone }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="个人图片"
        width="250px"
        class-name="status-col"
      >
        <template slot-scope="{row}">
          <el-image
            style="width: 100px; height: 100px"
            :src="row.head_image"
            fit="cover"
            @click="prevUplImg(row.head_image)"
            title="点击查看图片"
            class="cp"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
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
            type="danger"
            size="mini"
            @click="handleDelte(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.page_size"
      @pagination="getList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :class="[flagNoupload&&'flag-noupload']"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >

        <el-form-item
          label="服务人员名称"
          prop="staff_name"
        >
          <el-input v-model="temp.staff_name" />
        </el-form-item>
        <el-form-item
          label="服务项目"
          prop="service_name"
        >
          <el-input v-model="temp.service_name" />
        </el-form-item>
        <el-form-item
          label="手机号"
          prop="service_phone"
        >
          <el-input v-model="temp.service_phone" />
        </el-form-item>
        <el-form-item
          label="图片"
          prop="head_image"
        >
          <!-- <el-upload
            ref="upload"
            :limit="1"
            :action="uplUrl"
            :on-exceed="handleExceed"
            :on-success="uplSucc"
            :on-progress="uplStart"
            list-type="picture-card"
            :class="{'_hide-uplbtn':f_hideUplbtn, '_hide-uplimg': !f_hideUplbtn}"
          >
            <i
              slot="default"
              class="el-icon-plus"
            ></i>
            <div
              slot="file"
              slot-scope="{file}"
              v-show="temp.head_image"
              style="width: 100%;height: 100%;"
            >
              
              <el-image
                style="width: 146px; height: 146px"
                class="el-upload-list__item-thumbnail"
                :src="temp.head_image"
                fit="contain"
              ></el-image>
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="prevUplImg"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  class="el-upload-list__item-delete"
                  @click="delUplImg(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
          <el-dialog :visible.sync="uplDialogVisible">
            <img
              width="100%"
              :src="temp.head_image"
              alt=""
            >
          </el-dialog> -->

          <!-- :on-preview="prevUplImg" -->
          <el-upload
            :action="uplUrl"
            list-type="picture-card"
            :limit="1"
            :on-exceed="handleExceed"
            :on-success="uplSucc"
            :on-remove="uplRemove"
            :file-list="fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="详细介绍">
          <el-input
            v-model="temp.content"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import globals from '@/utils/globals'
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
        flagNoupload:false,
        fileList: [],
        uplDialogVisible: false,
        uplUrl: globals.curBaseUrl + '/upload',
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          page_size: 20,
          keywords_like: '',
        },
        importanceOptions: [1, 2, 3],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {

        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          staff_name: [{
            required: true,
            message: '请输入服务人员名称',
            trigger: 'blur'
          }],
          service_name: [{
            required: true,
            message: '请输入服务项目',
            trigger: 'blur'
          }],
          service_phone: [{
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }],
          head_image: [{
            required: true,
            message: '请上传图片',
            trigger: 'blur'
          }]
        },
        downloadLoading: false
      }
    },
    computed: {
      f_hideUplbtn: {
        get() {
          return !!this.temp.head_image
        },
        set(value) {
          // this.temp.head_image
        }
      }
    },
    created() {
      this.getList()
    },
    watch: {
      'temp.head_image': {
        handler: function (val, oldVal) {
          if (val) {
            this.flagNoupload = true
          } else {
            this.flagNoupload = false
          }
        },
      }
    },
    methods: {
      uplRemove() {
        this.temp.head_image = ''
      },
      // handlePictureCardPreview() {
      //   this.dialogVisible = true;
      // },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      prevUplImg(url) {
        if (url) {
          window.open(url)
        } else {
          window.open(this.temp.head_image)
        }
      },
      uplSucc(res, file, fileList) {
        this.$set(this.temp, 'head_image', res.data[0].all_path)
        // this.temp.head_image = res.data[0].all_path
      },

      handleDelte(row) {
        api.services_staff_delete({
          staff_id: row.staff_id
        }).then((res) => {
          this.getList()
        })
      },
      getList() {
        this.listLoading = true
        api.services_staff_list(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false;

        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },

      resetTemp() {
        this.fileList = []
        this.temp = {}
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
            this.$refs['dataForm'].validate((valid) => {
              if (valid) {
                api.services_staff_create(this.temp).then((res) => {
                  if (res.code == 9999) {
                    this.dialogFormVisible = false
                    this.getList()
                  }
                  this.$message({
                    message: res.info,
                    type: '',
                  })
                })
              }
            })
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.fileList = [{
          name: 'img',
          url: this.temp.head_image
        }]
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            api.services_staff_edit(this.temp).then((res) => {
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

<style lang="scss">
  .page-servstaff-list {
    // ._hide-uplbtn {
    //   .el-upload--picture-card {
    //     display: none;
    //   }
    // }

    // ._hide-uplimg {
    //   .el-upload-list__item {
    //     display: none;
    //   }
    // }



    .flag-noupload {
      .el-upload.el-upload--picture-card {
        display: none;
      }
    }
  }
</style>