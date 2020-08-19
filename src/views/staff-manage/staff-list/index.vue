<!-- eshop426admin template -->
<template>
  <div class="app-container page-staff-list">
    <div class="filter-container">
      <el-input
        v-model="listQuery.phone_like"
        placeholder="手机号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.username_like"
        placeholder="员工名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <!-- <el-select
        v-model="listQuery.importance"
        placeholder="Imp"
        clearable
        style="width: 90px"
        class="filter-item"
      >
        <el-option
          v-for="item in importanceOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select> -->
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
        新增员工
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
      <!-- username
phone
status
add_time
urgency_contacts
urgency_contacts_phone
address
birth_date
factory_auth -->
      <el-table-column
        label="员工名称"
        prop="id"
        align="center"
        width="80"
      >
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="电话"
        width="150px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="150px"
      >
        <template slot-scope="{row}">
          <span>{{ row.status==1 ? '正常':'冻结'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="210px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.add_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showReviewer"
        label="紧急联系人"
        width="110px"
        align="center"
      >
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.urgency_contacts }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="员工类型"
        width="110px"
        align="center"
      >
        <template slot-scope="{row}">
          <span style="">{{ authTypeMap[row.auth_type] }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="紧急联系电话"
        align="center"
        width="95"
      >
        <template slot-scope="{row}">
          <span>{{ row.urgency_contacts_phone}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="地址"
        class-name="status-col"
      >
        <template slot-scope="{row}">
          {{ row.address }}
        </template>
      </el-table-column>
      <el-table-column
        label="生日"
        class-name="status-col"
        width="100"
      >
        <template slot-scope="{row}">
          {{ row.birth_date }}
        </template>
      </el-table-column>
      <el-table-column
        label="岗位名称"
        class-name="status-col"
        width="200"
      >
        <template slot-scope="{row}">
          <!-- <span
            v-for="(item, index) in row.factory_auth"
            :key="index"
          >
            {{ item.factory_name }}
            <span v-if="index != row.factory_auth.length-1">, </span>
          </span> -->

          <span>
            {{ row.group_name }}
          </span>

        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="130"
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
          label="员工岗位"
          prop="group_id"
        >
          <el-select
            v-model="temp.group_id"
            placeholder="请选择"
          >
            <el-option
              v-for="item in groupOpts"
              :key="item.value"
              :label="item.group_name"
              :value="item.group_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="员工名称"
          prop="username"
        >
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item
          label="手机号"
          prop="phone"
        >
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="psd"
          v-if="dialogStatus==='create'"
        >
          <el-input
            v-model="temp.psd"
            type="password"
          />
        </el-form-item>
        <el-form-item
          label="紧急联系人"
          prop=""
        >
          <el-input v-model="temp.urgency_contacts" />
        </el-form-item>
        <el-form-item
          label="紧急联系电话"
          prop=""
        >
          <el-input v-model="temp.urgency_contacts_phone" />
        </el-form-item>
        <el-form-item
          label="员工类型"
          prop="auth_type"
        >
          <el-select
            v-model="temp.auth_type"
            placeholder="请选择"
          >
            <el-option
              v-for="item in authtypeOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="地址"
          prop=""
        >
          <el-input v-model="temp.address" />
        </el-form-item>
        <el-form-item
          label="生日"
          prop=""
        >
          <el-date-picker
            v-model="temp.birth_date"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <!-- birth_date -->
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
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          page_size: 10,
          phone_like: undefined,
          username_like: undefined,
        },
        importanceOptions: [1, 2, 3],
        statusOptions: ['published', 'draft', 'deleted'],
        groupOpts: [],
        authtypeOpts: [{
          label: "正常员工",
          value: 'normal'
        }, {  
          label: '水电工',
          value: 'plumber'
        }, {  
          label: '设计师',
          value: 'stylist'
        }],
        showReviewer: false,
        temp: {

        },
        dialogFormVisible: false,
        dialogStatus: '',
        authTypeMap: {
          normal: '正常员工',
          plumber: '水电工',
          stylist: '设计师',
        },
        textMap: {
          update: '编辑',
          create: '新增'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          phone: [{
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }],
          username: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
          psd: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }],
          auth_type: [{
            required: true,
            message: '请选择员工类型',
            trigger: 'blur'
          }],
          group_id: [{
            required: true,
            message: '请选择员工岗位',
            trigger: 'blur',
          }],
        },
        downloadLoading: false
      }
    },
    created() {
      this.getList()
      api.group_list({}).then((res) => {
        this.groupOpts = res.data.list
      })

    },
    methods: {
      getList() {
        this.listLoading = true
        api.this_auth_list(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
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
            api.auth_create(this.temp).then((res) => {
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
            api.auth_edit(this.temp).then((res) => {
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