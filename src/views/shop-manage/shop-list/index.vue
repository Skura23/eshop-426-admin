<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.factory_name_like"
        placeholder="门店名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        placeholder="门店状态"
        clearable
        style=""
        class="filter-item"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <!-- <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
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
        新增门店
      </el-button>
      <!-- <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export -->
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox> -->
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
      @sort-change="sortChange"
    >
      <el-table-column
        label="门店名称"
        prop="id"
        sortable="custom"
        align="center"
        width="200"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.factory_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="联系人名称"
        width="200"
        align="center"
      >
        <template slot-scope="{row}">
          <!-- <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> -->
          <span>{{row.contacts || '/'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="门店联系电话"
        width="200"
        align="center"
      >
        <template slot-scope="{row}">
          <span class="link-type">{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="地址"
        width="200"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.address || '/' }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="状态" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
      <el-table-column label="Readings" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="状态"
        class-name="status-col"
        width="200"
        align="center"
      >
        <template slot-scope="{row}">
          <span>
            {{ row.status | statusFilter }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width=""
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
            size="mini"
            :type="row.status==1?'success':'danger'"
            @click="handleStatus(row)"
          >

            {{row.status | statusBtnFilter}}
          </el-button>
          <!-- <el-button
            v-if="row.status!='draft'"
            size="mini"
            @click="handleModifyStatus(row,'draft')"
          >
            基础设置
          </el-button> -->
          <!-- <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
          >
            Edit
          </el-button>
          <el-button
            v-if="row.status!='published'"
            size="mini"
            type="success"
            @click="handle(row,'published')"
          >
            Publish
          </el-button>
          <el-button
            v-if="row.status!='draft'"
            size="mini"
            @click="handle(row,'draft')"
          >
            Draft
          </el-button>
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row,$index)"
          >
            Delete
          </el-button> -->
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
      title="选择一级门店"
      @close="handleChooseShopPopClose"
      :visible.sync="chooseShopPopVisible"
    >
      <el-input
        v-model="chooseShopListSearTxt"
        placeholder="门店名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="getChooseShopList"
      />&nbsp;
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="getChooseShopList"
      >
        搜索
      </el-button>
      <el-table
        :data="chooseShopList"
        style="width: 100%"
      >
        <el-table-column
          prop="factory_name"
          label="门店名称"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="contacts"
          label="联系人名称"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="操作"
        >
          <template slot-scope="{row}">
            <span>
              <el-link
                type="primary"
                :underline="false"
                @click="handleChooseShop(row)"
              >选择</el-link>
            </span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-show="chooseShopListTotal>0"
        @current-change="getChooseShopList"
        :current-page.sync="chooseShopListPage"
        :total="chooseShopListTotal"
        :page-size="10"
        class="mt"
        layout="total, prev, pager, next"
      >
      </el-pagination>
    </el-dialog>

    <el-dialog
      :title="formPopTitleMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :center="true"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >
        <div v-show="dialogStatus==='create'">
          <el-form-item
            label="选择一级门店"
            prop="chooseShop"
            v-show="dialogStatus==='create' && userInfo.grade==1"
          >
            <span>{{chosenShop}}</span>
            <el-link
              type="primary"
              :underline="false"
              @click="handleChooseShopPop"
            >选择</el-link>
          </el-form-item>
          <!-- username:'',
        user_phone: '',
        user_psd: '', -->
          <el-form-item
            label="用户名"
            prop="username"
          >
            <el-input v-model="temp.username" />
          </el-form-item>

          <el-form-item
            label="密码"
            prop="user_psd"
          >
            <el-input
              v-model="temp.user_psd"
              type="password"
              show-password
            />
          </el-form-item>
        </div>


        <el-form-item
          label="门店名称"
          prop="factory_name"
        >
          <!-- factory_id: '',
          factory_name: '',
          contacts: '',
          phone: '',
          bank_account: '',
          bank_name: '',
          bank_info: '',
          lat: '',
          lng: '',
          address_info: '', -->
          <el-input v-model="temp.factory_name" />
        </el-form-item>
        <el-form-item
          label="联系人"
          prop="contacts"
        >
          <el-input v-model="temp.contacts" />
        </el-form-item>
        <el-form-item
          label="手机号"
          prop="phone"
        >
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item
          label="开户行账户"
          prop="bank_account"
        >
          <el-input v-model="temp.bank_account" />
        </el-form-item>
        <el-form-item
          label="开户用户名"
          prop="bank_name"
        >
          <el-input v-model="temp.bank_name" />
        </el-form-item>
        <el-form-item
          label="开户行"
          prop="bank_info"
        >
          <el-input v-model="temp.bank_info" />
        </el-form-item>
        <el-form-item
          label="纬度"
          prop="lat"
        >
          <el-input v-model="temp.lat" />
        </el-form-item>
        <el-form-item
          label="经度"
          prop="lng"
        >
          <el-input v-model="temp.lng" />
        </el-form-item>

        <el-form-item
          label="省市区"
          prop="address_info[area_detail]"
        >
          <el-cascader
            v-model="area"
            :options="citysOptions"
            :props="citysProps"
            :placeholder="areaPlh"
            style="width: 280px"
            @change="handleCityChange"
            class="area-inp"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="详细地址"
          prop="address_info[area_detail]"
        >
          <el-input v-model="temp.address_info.area_detail" />
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

    <el-dialog
      :visible.sync="dialogPvVisible"
      title="Reading statistics"
    >
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          prop="key"
          label="Channel"
        />
        <el-table-column
          prop="pv"
          label="Pv"
        />
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogPvVisible = false"
        >Confirm</el-button>
      </span>
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


  export default {
    name: 'ComplexTable',
    components: {
      Pagination
    },
    // directives: { waves },
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: '正常',
          2: '冻结',
        }
        return statusMap[status]
      },
      statusBtnFilter(status) {
        const statusMap = {
          1: '冻结',
          2: '恢复',
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
          factory_name_like: undefined,
          status: undefined,
        },
        statusOptions: [{
          value: 1,
          label: '正常'
        }, {
          value: 2,
          label: '冻结'
        }],
        sortOptions: [{
          label: 'ID Ascending',
          key: '+id'
        }, {
          label: 'ID Descending',
          key: '-id'
        }],
        // statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        // 修改门店数据容器
        temp: {
          p_id: '',
          factory_id: '',
          factory_name: '',
          contacts: '',
          phone: '',
          bank_account: '',
          bank_name: '',
          bank_info: '',
          lat: '',
          lng: '',
          address_info: {
            province_id: '',
            city_id: '',
            area_id: '',
            area_detail: '',
          },
        },
        // 新增门店数据容器
        // tempAdd: {
        //   p_id:'',
        //   factory_id: '',
        //   factory_name: '',
        //   contacts: '',
        //   username:'',
        //   user_phone: '',
        //   user_psd: '',
        //   bank_account: '',
        //   bank_name: '',
        //   bank_info: '',
        //   address_info: {
        //     province_id: '',
        //     city_id: '',
        //     area_id: '',
        //     area_detail: '',
        //   },
        // },
        dialogFormVisible: false,
        dialogStatus: '',
        formPopTitleMap: {
          update: '编辑门店',
          create: '新增门店'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          factory_name: [{
            required: true,
            trigger: 'blur',
            message: '请输入门店名称'
          }],
          contacts: [{
            required: true,
            trigger: 'blur',
            message: '请输入联系人'
          }],
          phone: [{
            required: true,
            trigger: 'blur',
            message: '请输入手机号'
          }],
          username: [{
            required: this.dialogStatus=='created',
            trigger: 'blur',
            message: '请输入用户名'
          }],
          user_psd: [{
            required: this.dialogStatus=='created',
            trigger: 'blur',
            message: '请输入密码'
          }],
          'address_info[area_detail]': [{
            required: true,
            trigger: 'blur',
            message: '请输入详细地址'
          }],
          'address_info[area_detail]': [{
            required: true,
            trigger: 'blur',
            message: '请输入详细地址'
          }],
          // area: [{
          //   required: true,
          //   trigger: 'blur',
          //   message: '请输入省市区'
          // }],

          // bank_account: [{
          //   required: true,
          //   trigger: 'blur',
          //   message: '请输入开户账户'
          // }],
          // bank_name: [{
          //   required: true,
          //   trigger: 'blur',
          //   message: '请输入开户用户名'
          // }],
          // bank_info: [{
          //   required: true,
          //   trigger: 'blur',
          //   message: '请输入开户行'
          // }],
          // lat: [{
          //   required: true,
          //   trigger: 'blur',
          //   message: '请输入纬度'
          // }],
          // lng: [{
          //   required: true,
          //   trigger: 'blur',
          //   message: '请输入经度'
          // }],
        },
        downloadLoading: false,
        userInfo: JSON.parse(Cookies.get('eshop-426-admin_userinfo')),
        citysProps: cityData.cityProps,
        citysOptions: cityData.citys,
        area: [],
        areaPlh: '',
        chosenShop: '',
        chooseShopPopVisible: false,
        chooseShopList: [],
        chooseShopListPage: 1,
        chooseShopListTotal: 0,
        chooseShopListSearTxt: '',

      }
    },
    created() {
      this.getList()
    },
    methods: {
      handleCityChange() {

      },
      handleChooseShopPopClose() {
        this.resetChoShopListSear()
      },
      // 重置ShopList搜索信息
      resetChoShopListSear() {
        this.chooseShopListSearTxt = ''
      },
      handleChooseShop(data) {
        this.chosenShop = data.factory_name
        this.temp.p_id = data.factory_id
        this.chooseShopPopVisible = false
      },
      handleShopChoFilter() {
        this.getChooseShopList()
      },
      getChooseShopList() {
        api.first_level_factory_list({
          info: {
            factory_name_like: this.chooseShopListSearTxt,
            page: this.chooseShopListPage,
            page_size: 10,
          }
        }).then((res) => {
          this.chooseShopList = res.data.list
          this.chooseShopListTotal = res.data.total
        })
      },
      handleChooseShopPop() {
        this.chooseShopPopVisible = true
        this.getChooseShopList()
      },
      getList() {
        this.listLoading = true
        api.getShopList({
          info: this.listQuery
        }).then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleStatus(row) {
        api.factory_change_status({
          info: {
            factory_id: row.factory_id,
            status: row.status == 1 ? 2 : 1
          }
        }).then((res) => {
          this.getList()

          this.$message({
            message: res.info,
            type: ''
          })
        })
        // row.status = status
      },
      sortChange(data) {
        const {
          prop,
          order
        } = data
        if (prop === 'id') {
          this.sortByID(order)
        }
      },
      sortByID(order) {
        if (order === 'ascending') {
          this.listQuery.sort = '+id'
        } else {
          this.listQuery.sort = '-id'
        }
        this.handleFilter()
      },
      resetTemp() {
        this.temp = {
          factory_id: '',
          factory_name: '',
          contacts: '',
          phone: '',
          bank_account: '',
          bank_name: '',
          bank_info: '',
          lat: '',
          lng: '',
          username: '',
          user_psd: '',
          address_info: {
            province_id: '',
            city_id: '',
            area_id: '',
            area_detail: '',
          },
        }
        this.area = []
        this.areaPlh = ''
      },
      handleCreate() {
        this.resetTemp()

        // if (this.userInfo.grade != 1) {

        // } else {
        //   // todo
        // }
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })

      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // 修改字段以适应后端
            this.temp.user_phone = this.temp.phone
            this.temp.address_info.province_id = this.area[0]
            this.temp.address_info.city_id = this.area[1]
            this.temp.address_info.area_id = this.area[2]
            // this.temp.author = 'vue-element-admin'
            api.factory_create({
              info: this.temp
            }).then((res) => {
              if (res.code == 9999) {
                this.getList()
                this.dialogFormVisible = false
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.$message({
                  message: res.info,
                  type: '',
                })
              }
            })
          }
        })
      },
      handleUpdate(row) {
        // this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })

        api.factory_detail({
          info: {
            factory_id: row.factory_id
          }
        }).then((res) => {
          this.area = [+res.data.address_info.province, +res.data.address_info.city, +res.data.address_info.area]
          // 处理地址数据
          this.areaPlh = res.data.address_info.province_name + res.data.address_info.city_name + res.data
            .address_info.area_name
          this.temp = Object.assign({}, res.data) // copy obj
          this.temp.address_info = {
            province_id: '',
            city_id: '',
            area_id: '',
            area_detail: res.data.address_info.area_detail,
          }
        })
      },
      updateData() {
        console.log('updateData');
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.address_info.province_id = this.area[0]
            tempData.address_info.city_id = this.area[1]
            tempData.address_info.area_id = this.area[2]
            // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            api.factory_edit({
              info: tempData
            }).then((res) => {
              if (res.code == 9999) {
                const index = this.list.findIndex(v => v.id === this.temp.id)
                this.list.splice(index, 1, this.temp)
                this.dialogFormVisible = false
                this.$notify({
                  title: 'Success',
                  message: '编辑成功',
                  type: 'success',
                  duration: 2000
                })
                this.getList()
              } else {
                this.$notify({
                  type: 'error',
                  title: '失败',
                  message: res.info,
                  duration: 1700
                })
              }
            })
          }
        })
      },
      handleDelete(row, index) {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      },
      handleFetchPv(pv) {
        fetchPv(pv).then(response => {
          this.pvData = response.data.pvData
          this.dialogPvVisible = true
        })
      },
      handleDownload() {
        // this.downloadLoading = true
        // import('@/vendor/Export2Excel').then(excel => {
        //   const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        //   const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        //   const data = this.formatJson(filterVal)
        //   excel.export_json_to_excel({
        //     header: tHeader,
        //     data,
        //     filename: 'table-list'
        //   })
        //   this.downloadLoading = false
        // })
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

<style>
  .app-container .area-inp input::-webkit-input-placeholder {
    /* WebKit, Blink, Edge */
    color: #606266;
  }
</style>