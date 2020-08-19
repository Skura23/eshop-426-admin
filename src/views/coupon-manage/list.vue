<!-- eshop426admin template -->
<template>
  <div class="app-container page-coupon-manage">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keywords_like"
        placeholder="关键字"
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
        新增优惠券
      </el-button>
    </div>
    <br>

    <!-- coupon_name
discounts_info
num_info
send_num
use_num
display_order
add_time -->
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
        label="优惠券名称"
        prop="coupon_name"
        align="center"
        width="300"
      >
        <template slot-scope="{row}">
          <el-link
            type="primary"
            :underline="false"
            @click="showDetail(row)"
          >{{row.coupon_name}}</el-link>
        </template>
      </el-table-column>

      <el-table-column
        label="优惠"
        width=""
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.discounts_info }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showReviewer"
        label="可发数量"
        width="100px"
        align="center"
      >
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.num_info }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="已发数量"
        class-name="status-col"
        width="100px"
      >
        <template slot-scope="{row}">
          <span>{{ row.send_num }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="已使用数量"
        width="100px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <span>{{ row.use_num }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="排序"
        class-name="status-col"
        width="100"
      >
        <template slot-scope="{row}">
          <span>{{ row.display_order }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width=""
      >
        <template slot-scope="{row}">
          <span>{{ row.status==1 ? '正常':'下架' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        class-name="status-col"
        width=""
      >
        <template slot-scope="{row}">
          <span>{{ row.add_time }}</span>
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
            @click="modiStatus(row, 2)"
          >
            上架
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="modiStatus(row, 1)"
          >下架</el-button>
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
      :class="{'_detail-dia':diaType=='detail'}"
      @close="diaClose"
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
          label="名称"
          prop="coupon_name"
        >
          <el-input v-model="temp.coupon_name" />
        </el-form-item>
        <el-form-item
          label="使用条件"
          prop="enough"
        >
          <el-input v-model="temp.enough" /> <span style="color:#909399">消费满多少可用, 0不限制</span>
        </el-form-item>
        <el-form-item
          label="排序"
          prop="display_order"
        >
          <el-input
            v-model="temp.display_order"
            type="number"
          /> <span style="color:#909399">数字越大越靠前</span>
        </el-form-item>
        <el-form-item
          label="使用时间限制"
          prop="time_limit"
        >
          <div v-show="diaType!=='detail'">
            <div>
              <el-radio
                v-model="temp.time_limit"
                label="1"
              >有效天数</el-radio>
              &nbsp;
              <el-input
                v-model="temp.time_days"
                v-show="temp.time_limit==1"
              />
            </div>

            <div class="">
              <el-radio
                v-model="temp.time_limit"
                label="2"
              >有效日期范围</el-radio>
              &nbsp; <el-date-picker
                v-show="temp.time_limit==2"
                v-model="temp1.l_date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                @change="changeDate"
              >
              </el-date-picker>
            </div>
          </div>
          <div v-show="diaType=='detail'">
            {{temp.time_limit==1?`${temp.time_days} 天`:`${temp.time_start}-${temp.time_end}`}}
          </div>
        </el-form-item>
        <el-form-item
          label="优惠方式"
          prop="discounts_type"
        >
          <div v-show="diaType!=='detail'">
            <el-radio
              v-model="temp.discounts_type"
              label="1"
            >立减</el-radio>
            <el-radio
              v-model="temp.discounts_type"
              label="2"
            >打折</el-radio>
          </div>
          <div v-show="diaType=='detail'">
            {{temp.discounts_type==1? '立减':'打折'}}
          </div>
        </el-form-item>
        <el-form-item
          label="优惠幅度"
          prop="deduct"
        >
          <el-input
            v-model="temp.deduct"
            type="number"
          />
        </el-form-item>
        <el-form-item
          label="发放总数"
          prop="deduct"
        >
          <el-input v-model="temp.num_limit" /> -1为不限制张数
        </el-form-item>
        <el-form-item
          label="适用范围"
          prop="limit_good_type"
        >
          <div v-show="diaType!=='detail'">
            <div>
              <el-radio
                v-model="temp.limit_good_type"
                label="2"
              >全部商品</el-radio>
            </div>
            <div>
              <el-radio
                v-model="temp.limit_good_type"
                label="1"
              >指定商品</el-radio>
              &nbsp;
              <el-select
                v-show="temp.limit_good_type==1"
                style="width:400px;"
                v-model="temp1.l_selGoods"
                multiple
                filterable
                remote
                placeholder="请输入关键词"
                :remote-method="searGoods"
                :loading="searGoodsLoading"
              >
                <el-option
                  v-for="item in searGoodsOptions"
                  :key="item.goods_id"
                  :label="item.goods_name"
                  :value="item.goods_id"
                >
                </el-option>
              </el-select>
            </div>
            <div class="">
              <el-radio
                v-model="temp.limit_good_type"
                label="3"
              >指定商品分类</el-radio>
              <el-cascader
                style="width:400px;"
                v-model="temp1.l_selClasses"
                v-show="temp.limit_good_type==3"
                :options="classList"
                :props="{ multiple: true,value:'class_id',
                label: 'class_name',
                children: 'child',}"
                clearable
              ></el-cascader>
            </div>
          </div>

          <div v-show="diaType=='detail'">
            {{temp.limit_good_type==1? this.detailGoods : temp.limit_good_type==2? '全部商品': this.detailClass
}}
          </div>
        </el-form-item>
        <el-form-item
          label="使用说明"
          prop="content"
        >
          <el-input
            v-model="temp.content"
            type="textarea"
          />
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
        v-show="diaType!=='detail'"
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
  import _ from "lodash";
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
        diaType: 'add',
        searGoodsOptions: [],
        searGoodsLoading: false,
        classList: [],
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          page_size: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        importanceOptions: [1, 2, 3],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          time_limit: 1,
          discounts_type: 1,
          limit_good_type: 2,
        },
        // 表单内 temp外data
        temp1: {
          l_date: '',
          l_selGoods: [],
          l_selClasses: [],
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
          coupon_name: [{
            required: true,
            message: '请输入名称"',
            trigger: 'blur'
          }],
          enough: [{
            required: true,
            message: '请输入使用条件"',
            trigger: 'blur'
          }],
          display_order: [{
            required: true,
            message: '请输入排序"',
            trigger: 'blur'
          }],
          time_limit: [{
            required: true,
            message: '请输入使用时间限制"',
            trigger: 'blur'
          }],

          discounts_type: [{
            required: true,
            message: '请输入优惠方式',
            trigger: 'blur'
          }],
          deduct: [{
            required: true,
            message: '请输入优惠幅度',
            trigger: 'blur'
          }],
          num_limit: [{
            required: true,
            message: '请输入发放总数',
            trigger: 'blur'
          }],
          limit_good_type: [{
            required: true,
            message: '请输入适用范围',
            trigger: 'blur'
          }],
        },
        downloadLoading: false
      }
    },
    created() {
      this.getList()
      api.all_class_list({
        type: 'basic'
      }).then((res) => {
        this.classList = res.data
      })
    },
    // watch适用场景
    watch: {
      'temp1.l_date': function (newval, oldval) {
        this.temp.time_start = newval[0]
        this.temp.time_end = newval[1]
      },
      'temp1.l_selClasses': function (newval, oldval) {
        this.temp.time_start = newval[0]
        this.temp.time_end = newval[1]
        let arr = []
        newval.forEach(elem => {
          elem[1] && arr.push(elem[1])
        });
        this.temp.class_ids = arr.join(',')
      },
      'temp1.l_selGoods': function (newval, oldval) {
        this.temp.goods_share_ids = newval.join(',')
      },

    },
    computed: {
      detailGoods() {
        let arr = []
        this.temp.goods && this.temp.goods.forEach(elem => {
          arr.push(elem.goods_name)
        });
        return arr.join(',')
      },
      detailClass() {
        let arr = ''
        this.temp.class && this.temp.class.forEach(elem => {
          arr.push(elem.class_name)
        });
        return arr.join(',')
      },
      // time_start() {
      //   return this.temp1.l_date[0]
      // },
      // time_end() {
      //   return this.temp1.l_date[1]
      // },
    },
    methods: {
      modiStatus(row, flag) {
        let status = flag
        if (status == 1) {
          status = 2
        } else if (status == 2) {
          status = 1
        }
        api.coupon_change_status({
          status,
          coupon_id: row.coupon_id
        }).then((res) => {
          this.getList()
        })
      },
      diaClose() {
        this.resetTemp()
        this.diaType = 'add'
      },
      showDetail(row) {
        this.diaType = 'detail'
        api.coupon_detail({
          coupon_id: row.coupon_id
        }).then((res) => {
          this.temp = res.data
        })
        this.dialogFormVisible = true
      },
      searGoods(query) {
        this.searGoodsLoading = true;
        api.goods_share_list({
          keywords_like: query,
          page: 1,
          page_size: 30
        }).then((res) => {
          this.searGoodsLoading = false;
          this.searGoodsOptions = res.data.list
        })
      },
      changeDate(val) {
        console.log(val, 'changeDate');
      },
      handleDelte(row) {
        api.coupon_delete(
          _.pick(row, ['coupon_id'])
        ).then((res) => {
          this.getList()
        })
      },
      getList() {
        this.listLoading = true
        api.coupon_list(this.listQuery).then(response => {
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
        this.temp = {
          time_limit: "1",
          discounts_type: "1",
          limit_good_type: "2",
        }
        this.temp1 = {
          l_date: '',
          l_selGoods: [],
          l_selClasses: [],
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
            this.$refs['dataForm'].validate((valid) => {
              if (valid) {
                api.coupon_create(this.temp).then((res) => {
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
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            api.auth_detail(this.temp).then((res) => {
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
  .page-coupon-manage {
    ._detail-dia {
      input {
        all: unset;
        pointer-events: none;
      }
    }
  }
</style>