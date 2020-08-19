<template>
  <div class="app-container page-clients">
    <div
      class="filter-container"
      style="line-height: 3.5;"
    >
      客户编号:
      <el-input
        v-model="listQuery.member_code_like"
        placeholder="请输入"
        style="width: 120px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      &nbsp;
      手机号:
      <el-input
        v-model="listQuery.phone_like"
        placeholder="请输入"
        style="width: 120px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      &nbsp;
      联系人:
      <el-input
        v-model="listQuery.contacts_like"
        placeholder="请输入"
        style="width: 120px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      &nbsp;
      客户名:
      <el-input
        v-model="listQuery.member_name_like"
        placeholder="请输入"
        style="width: 120px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      &nbsp;
      其他电话:
      <el-input
        v-model="listQuery.other_phone_like"
        placeholder="请输入"
        style="width: 120px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      &nbsp;
      关键字:
      <el-input
        v-model="listQuery.keywords_like"
        placeholder="请输入"
        style="width: 120px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      &nbsp;
      创建时间:
      <el-date-picker
        v-model="listQuery.l_date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>
      &nbsp;
      性别:
      <el-select
        v-model="listQuery.sex"
        placeholder="性别"
        clearable
        style="width: 120px"
        class="filter-item"
      >
        <el-option
          v-for="item in sex"
          :key="item.val"
          :label="item.label"
          :value="item.val"
        />
      </el-select>
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
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加客户
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-download"
        @click="handleBatchUpl"
      >
        <el-link
          type="primary"
          :underline="false"
          style="color:#fff"
          :href="tempUrl"
        >下载模板</el-link>
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-download"
        @click="handleBatchDld"
      >
        下载客户信息
      </el-button>
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="handleEditTags"
      >
        编辑标签
      </el-button> -->
      <el-upload
        class="upload-demo"
        :action="uplUrl"
        :on-change="handleUplChange"
        :on-success="handleUplDone"
        :file-list="fileList"
      >
        <el-button type="primary">点击上传</el-button>
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
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
      @selection-change="handleSelectionChange"
    >
      >
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        label="客户名称"
        prop="member_name"
        align="center"
        width="80"
      >

      </el-table-column>
      <!-- <el-table-column
        label="Date"
        width="150px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column
        label="请输入"
        min-width="150px"
      >
        <template slot-scope="{row}">
          <span
            class="link-type"
            @click="handleUpdate(row)"
          >{{ row.title }}</span>
          <el-tag>{{ row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column> -->
      <!-- add_time: "2020-04-27 12:01"
address: null
birthday: null
contacts: null
factory_id: "1"
id_card_no: null
is_bound: "2"
member_code: "m00000001"
member_id: "1"
member_name: "小明"
member_name_py: "xm"
other_phone: null
phone: "13917871964"
root_factory_id: "1"
sex: null
tag_list: [] -->
      <el-table-column
        label="联系人"
        prop="contacts"
        width="110px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.contacts }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showReviewer"
        prop="phone"
        label="电话"
        width="110px"
        align="center"
      >
        <template slot-scope="{row}">
          <span style="">{{ row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="客户编号"
        align="center"
        prop="member_code"
        width="120"
      >
        <template slot-scope="{row}">
          <span>
            {{row.member_code}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="添加时间"
        width="200"
        class-name="status-col"
      >
        <template slot-scope="{row}">
          <span>
            {{row.add_time}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="地址"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row,$index}">
          <span>
            {{row.address}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="客户标签"
        align="center"
      >
        <template slot-scope="{row}">
          <el-tag v-for="(item, index) in row.tag_list" :key="index" class="mt10 ml10">{{item.tag_name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="110px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>
            <el-link
              type="primary"
              :underline="false"
            >编辑</el-link>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <div class="mt">
      <el-button
        @click="handleBindTags"
        type="primary"
        :disabled="disHandleTag"
      >
        绑定标签
      </el-button>
      <el-button
        @click="handleUnbindTags"
        type="primary"
        class="ml"
        :disabled="disHandleTag"
      >
        解绑标签
      </el-button>
    </div>

    <pagination
      v-show="total>0"
      :total="+total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.page_size"
      @pagination="getList"
    />

    <el-dialog
      title="客户标签列表"
      class="_tag-list_dial"
      :visible.sync="dialogtagListVisible"
    >
      <div class="clearfix">
        <span class="fl">
          标签列表
        </span>
        <span class="fr">
          <el-link
            type="primary"
            :underline="false"
            @click="handleTogTagEdit"
          >
            {{tagListStatus == 'edit'?'退出编辑':'编辑标签'}}
          </el-link>
        </span>
      </div>
      <div
        v-if="tagListStatus != 'edit'"
        class="mt"
      >
        <div
          class="i-b mr "
          v-for="(item, index) in tagList"
          :key="index"
        >
          <el-checkbox
            v-model="item.l_tagBindChosen"
            v-show="tagListStatus == 'bind'"
            @change="handleTagCheckChange"
          >
            <el-tag>{{item.tag_name}}</el-tag>
          </el-checkbox>
          <el-checkbox
            v-model="item.l_tagUnbindChosen"
            v-show="tagListStatus == 'unbind'"
            @change="handleTagCheckChange"
          >
            <el-tag>{{item.tag_name}}</el-tag>
          </el-checkbox>
        </div>
      </div>
      <vue-tags-input
        style="width:100%;max-width:100%;"
        v-else
        v-model="curTag"
        placeholder="+新增标签"
        @before-adding-tag="onAddTag"
        @before-deleting-tag="onDelTag"
        @before-saving-tag="onSaveTag"
        :allow-edit-tags="true"
        :tags="tagList"
        @tags-changed="newTags => tagList = newTags"
      />

      <div
        v-show="tagListStatus !== 'edit'"
        class="clearfix"
      >
        <div class="fr">

          <el-button @click="dialogtagListVisible = false">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="tagListStatus==='bind'?bindTags():unbindTags()"
          >
            确定
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="下载客户信息"
      :visible.sync="dialogClientDldVisible"
    >
      <span style="vertical-align: middle;">分页:</span> &nbsp;&nbsp;
      <el-link
        type="primary"
        :underline="false"
        v-for="(item, index) in dldPageList"
        @click="handleDldClients(item)"
        :key="index"
      >
        {{item.limit+'~'+item.offset}}
      </el-link>
    </el-dialog>
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
          label="手机号"
          prop="phone"
        >
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item
          label="联系人"
          prop="contacts"
        >
          <el-input v-model="temp.contacts" />
        </el-form-item>
        <el-form-item
          label="客户名"
          prop="member_name"
        >
          <el-input v-model="temp.member_name" />
        </el-form-item>
        <el-form-item
          label="其他手机号"
          prop="other_phone"
        >
          <el-input v-model="temp.other_phone" />
        </el-form-item>
        <el-form-item
          label="生日"
          prop="timestamp"
        >
          <el-date-picker
            v-model="temp.timestamp"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <!-- contacts
member_name
other_phone
birthday
address_info
area_detail -->
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
  import _ from "lodash";
  import Vue from 'vue'
  import VueTagsInput from '@johmun/vue-tags-input';
  import api from '@/api/shopManage'
  import globals from '@/utils/globals'
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
      Pagination,
      VueTagsInput
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
        tagCheckIds: '',
        clientsCheckIds: '',
        disHandleTag: true,
        test: false,
        curTag: '',
        tagListOldStatus: '',
        //3 status: bind unbind edit none
        tagListStatus: 'none',
        dialogtagListVisible: false,
        tagList: [],
        dialogClientDldVisible: false,
        dldPageList: [],
        fileList: [],
        uplUrl: globals.curBaseUrl + '/upload',
        tempUrl: '',
        citysProps: cityData.cityProps,
        citysOptions: cityData.citys,
        area: [],
        areaPlh: '',
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          page_size: 20,
        },
        sex: [{
          val: 1,
          label: '男'
        }, {
          val: 2,
          label: '女'
        }],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          // id: undefined,
          address_info: {}
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          // type: [{
          //   required: true,
          //   message: 'type is required',
          //   trigger: 'change'
          // }],
          // timestamp: [{
          //   type: 'date',
          //   required: true,
          //   message: 'timestamp is required',
          //   trigger: 'change'
          // }],
          // title: [{
          //   required: true,
          //   message: 'title is required',
          //   trigger: 'blur'
          // }],
          phone: [{
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }],
          member_name: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }]
        },
        downloadLoading: false
      }
    },
    created() {
      this.getList()
      api.batch_member_create_excel().then((res) => {
        this.tempUrl = res.data.href
      })

    },
    computed: {
      regroupedTaglist() {

      }
    },
    watch: {
      // 如果 `question` 发生改变，这个函数就会运行
      // tagList(newVal, oldVal) {
      //   this.tagList = = this.tagList.map((item) => {
      //     item.text = item.tag_name
      //     item.l_tagBindChosen = false
      //     item.l_tagUnbindChosen = false
      //     item.classes = 'el-tag'
      //     return item
      // }
    },
    methods: {
      handleTagCheckChange(val) {
        console.log(val, 'handleTagCheckChange');
        let list = this.tagList.filter((item) => {
          if (this.tagListStatus == 'bind') {
            return item.l_tagBindChosen
          } else {
            return item.l_tagUnbindChosen
          }
        })
        let ids = _.map(list, 'tag_id').join(',')
        this.tagCheckIds = ids
        console.log(list, ids, 'handleTagCheckChange');
      },
      getChosenTags() {

      },
      handleSelectionChange(val) {
        if (val.length == 0) {
          this.disHandleTag = true
        } else {
          this.disHandleTag = false
        }
        let ids = _.map(val, 'factory_id').join(',')
        this.clientsCheckIds = ids
        console.log(val, 'handleSelectionChange');
      },
      bindTags() {
        api.tag_member_create({
          tag_id: this.tagCheckIds,
          member_list: this.clientsCheckIds
        }).then((res) => {
          this.$message({
            message: res.info,
            type: '',
          })
          if (res.code == 9999) {
            this.dialogtagListVisible = false
            this.getList()
          }
        })
      },
      unbindTags() {
        api.tag_member_delete({
          tag_id: this.tagCheckIds,
          member_list: this.clientsCheckIds
        }).then((res) => {
          this.$message({
            message: res.info,
            type: '',
          })
          if (res.code == 9999) {
            this.dialogtagListVisible = false
            this.getList()
          }
        })
      },
      onAddTag(obj) {
        console.log('onAddTag');
        if (obj.tag.text.trim() === '') {
          return
        }
        this.regroupTaglistItem(obj.tag, true)
        api.member_tag_create({
          tag_name: obj.tag.text
        }).then((res) => {
          console.log(res, 'member_tag_create');
          this.getTagList(() => {
            this.curTag = ''
            obj.addTag()
          })
        })
      },
      onDelTag(obj) {
        api.tag_delete({
          tag_id: obj.tag.tag_id
        }).then((res) => {
          this.getTagList(() => {
            obj.deleteTag()
          })
        })
      },
      onSaveTag(obj) {
        console.log('onAddTag');
        if (obj.tag.text.trim() === '') {
          return
        }
        this.regroupTaglistItem(obj.tag, true)
        api.member_tag_edit({
          tag_name: obj.tag.text,
          tag_id: obj.tag.tag_id
        }).then((res) => {
          console.log(res, 'member_tag_create');
          this.getTagList(() => {
            obj.saveTag()
          })
        })
      },
      getTagList(cb) {
        api.member_tag_list().then((res) => {
          this.tagList = res.data.list
          this.regroupTaglist()
          cb && cb()
        })
      },

      regroupTaglistItem(item, f_newitem) {
        f_newitem ? item.tag_name = item.text : item.text = item.tag_name
        if (item.l_tagBindChosen === undefined) {
          Vue.set(item, 'l_tagBindChosen', false)
        }
        //  && ()
        if (item.l_tagUnbindChosen === undefined) {
          Vue.set(item, 'l_tagUnbindChosen', false)
        }
        item.classes = 'el-tag'
        return item
      },
      regroupTaglist() {
        this.tagList.map((item) => {
          return this.regroupTaglistItem(item)
        })
      },
      handleTogTagEdit() {
        if (this.tagListStatus == 'edit') {
          this.tagListStatus = this.tagListOldStatus
        } else {
          this.tagListOldStatus = this.tagListStatus

          this.tagListStatus = 'edit'
        }
      },
      handleBindTags() {
        this.getTagList()
        this.dialogtagListVisible = true
        this.tagListStatus = 'bind'
      },
      handleUnbindTags() {
        this.getTagList()
        this.dialogtagListVisible = true
        this.tagListStatus = 'unbind'
      },
      handleEditTags() {
        this.tagListStatus = 'edit'
      },
      handleDldClients(item) {
        api.member_excel_upload({
          ...this.listQuery,
          ...{
            page: item.page,
            page_size: item.page_size,
          }
        }).then((res) => {
          window.open(res.data.href)
        })
      },
      handleBatchDld() {
        this.dialogClientDldVisible = true
        api.member_excel_list(this.listQuery).then((res) => {
          this.dldPageList = res.data
        })
      },
      handleUplDone(res, file, fileList) {
        this.$message({
          message: res.info,
          type: '',
        })
      },
      handleUplChange() {

      },
      handleBatchUpl() {
        api.batch_member_create_excel({

        }).then((res) => {

        })
      },
      getList() {
        this.listLoading = true
        if (this.listQuery.l_date) {
          this.listQuery.start_date = this.listQuery.l_date[0]
          this.listQuery.end_date = this.listQuery.l_date[1]
        }
        api.member_list(this.listQuery).then(response => {
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
          id: undefined,
          timestamp: new Date(),
          address_info: {}
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
            this.temp.address_info = {
              ...this.temp.address_info,
              province_id: this.area[0],
              city_id: this.area[1],
              area_id: this.area[2],
            }
            api.member_create(this.temp).then((res) => {
              this.$message({
                message: res.info,
                type: '',
              })
              this.dialogFormVisible = false
              this.getList()
            })
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData
              .timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateArticle(tempData).then(() => {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
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
  .page-clients ._tag-list_dial {
    .el-checkbox {
      margin-right: 5px;
    }

    .el-tag {
      background-color: #ecf5ff;
      border-color: #d9ecff;
      // display: inline-block;
      height: 32px;
      padding: 0 10px;
      line-height: 30px;
      font-size: 12px;
      color: #409EFF;
      border-width: 1px;
      border-style: solid;
      border-radius: 4px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      white-space: nowrap;
      margin-right: 20px;
      margin-bottom: 10px;
    }

    .ti-input {
      border: none;
    }
  }
</style>