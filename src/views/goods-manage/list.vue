<!-- eshop426admin template -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keywords_like"
        placeholder="商品名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.putaway"
        v-show="type !== 'basic'"
        placeholder="上下架状态"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option
          v-for="item in putawayArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-cascader
        :options="cateList"
        placeholder="选择分类"
        filterable
        :filter-method="filterCate"
        v-model="listQuery.class_id"
        clearable
      ></el-cascader>
      <!-- class_id -->

      &nbsp;
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
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
        label="名称"
        prop="id"
        align="center"
        width="300px"
      >
        <template slot-scope="{row}">
          <span>{{ row.goods_name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="价格"
        width="190px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.price_show }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="图片"
        width=""
        align="center"
      >
        <template slot-scope="{row}">
          <div
            v-for="(item, index) in row.goods_image"
            :key="index"
          >
            <el-image
              style="width: 100px; height: 100px"
              :src="item"
              fit="cover"
            ></el-image>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="是否上架"
        class-name="status-col"
        width=""
      >
        <template slot-scope="{row}">
          <span>{{ row.putaway==1 ? '已上架':'已下架' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="分类"
        class-name="status-col"
        width=""
      >
        <template slot-scope="{row}">
          <span>{{row.class_name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row,$index}">
          <div v-if="type=='store'">
            <el-button
              type="primary"
              size="mini"
              @click="handleUpdate(row)"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="upDownShelf(row, 2)"
            >
              <!-- {{ row.putaway==1 ? '下架':'上架' }} -->
              上架
            </el-button>

            <el-button
              type="danger"
              size="mini"
              @click="upDownShelf(row, 1)"
            >下架</el-button>

          </div>
          <div v-if="type=='store_banchuan'">
            <el-button
              type="primary"
              size="mini"
              @click="updPrice(row)"
            >
              更新价格
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="upDownShelf(row, 2)"
            >
              上架
            </el-button>
            <el-button
              type="danger"
              size="mini"
              @click="upDownShelf(row, 1)"
            >下架</el-button>
          </div>
          <div v-if="type=='basic'">
            <el-button
              type="primary"
              size="mini"
              @click="handleUpdate(row, 'basicEdit')"
            >
              商品编辑
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="handleUpdate(row, 'specEdit')"
            >
              规格编辑
            </el-button>
          </div>


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

    <!-- <el-dialog
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
          label="Date"
          prop="timestamp"
        >
          <el-date-picker
            v-model="temp.timestamp"
            type="datetime"
            placeholder="Please pick a date"
          />
        </el-form-item>
        <el-form-item
          label="Title"
          prop="title"
        >
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select
            v-model="temp.status"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Imp">
          <el-rate
            v-model="temp.importance"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            :max="3"
            style="margin-top:8px;"
          />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input
            v-model="temp.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Please input"
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
    </el-dialog> -->


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
        cateList: [],
        type: '',
        putawayArr: [{
          value: 1,
          label: '已上架',
        }, {
          value: 2,
          label: '已下架',
        }],
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          page_size: 20,
          putaway: '',
          class_id: [],
          keywords_like: ''
        },
        importanceOptions: [1, 2, 3],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          type: '',
          status: 'published'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{
            required: true,
            message: 'type is required',
            trigger: 'change'
          }],
          timestamp: [{
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }],
          title: [{
            required: true,
            message: 'title is required',
            trigger: 'blur'
          }]
        },
        downloadLoading: false
      }
    },
    created() {
      // 通过meta判断列表类型
      this.type = this.$route.meta['type']
      console.log(this.$route, 'this.$route');
      this.getList()
      api.cascader_cache_class_list({
        type: 'basic'
      }).then((res) => {
        this.cateList = res.data
      })
    },
    methods: {
      updPrice(row) {
        api.factory_goods_detail({
          goods_id: 6
        }).then((res) => {
          api.factory_basic_goods_price_update(res.data).then((res) => {
            if (res.code == 9999) {
              this.$message('更新成功');
            }
          })
        })


      },
      filterCate(node, keyword) {
        // if (node.data.label == '分类') {
        //   debugger;
        // }

        // console.log(node.data.pinyin,node.data.label,node, 'filterCate');
        // 注意一级项目不会被搜索, 二级会被搜, 所以用node.parent
        // 无二级的一级项目则没法获取node.parent, 目前需求不需要, 后面需要的话给children填充上占位数据
        // 目前只适用于两个层级
        let flag0 = false
        let flag1 = false
        let flag = false
        flag0 = node.data.pinyin && node.data.pinyin.indexOf(keyword) != -1 || node.data.label && node.data.label
          .indexOf(keyword) != -1
        if (node.parent) {
          let parent = node.parent
          flag1 = parent.data.pinyin && parent.data.pinyin.indexOf(keyword) != -1 || parent.data.label && parent.data
            .label.indexOf(keyword) != -1
        }

        return flag = flag0 || flag1
      },
      upDownShelf(row, flag) {
        let putaway = ''
        if (flag == 1) {
          putaway = 2
        } else {
          putaway = 1
        }
        if (this.type === 'store_banchuan') {
          api.factory_basic_goods_putaway({
            goods_id: row.goods_id,
            putaway
          }).then((res) => {
            if (res.code==9999) {
              this.$message(`商品${putaway==1?'上架':'下架'}成功`);
            } else {
              this.$message.error('操作失败');
            }
            this.getList()
          })
        } else if (this.type === 'store') {
          api.factory_store_goods_putaway({
            goods_id: row.goods_id,
            putaway
          }).then((res) => {
            if (res.code==9999) {
              this.$message(`商品${putaway==1?'上架':'下架'}成功`);
            } else {
              this.$message.error('操作失败');
            }
            this.getList()
          })
        }
      },
      getList() {
        this.listLoading = true
        // 级联控件初始化后class_id变为undefined, 故使其变为[]
        if (!this.listQuery.class_id) {
          this.listQuery.class_id = []
        }
        this.listQuery.class_id = this.listQuery.class_id[1]
        let cb = response => {
          if (response.code == 9999) {
            this.list = response.data.list
            this.total = response.data.total
            this.listLoading = false;
          } else {
            this.$message({
              message: response.info,
              type: 'warning'
            });
            this.list = []
            this.total = 0
            this.listLoading = false;
          }
        }
        if (this.type == 'store') {
          api.factory_store_goods_list(this.listQuery).then(cb)
        } else if (this.type == 'basic') {
          api.basic_goods_list(this.listQuery).then(cb)
        } else if (this.type == 'store_banchuan') {
          api.factory_basic_goods_list(this.listQuery).then(cb)
        }

      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },

      resetTemp() {
        this.temp = {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          status: 'published',
          type: ''
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
                api.auth_create(this.temp).then((res) => {
                  if (res.code == 9999) {
                    this.dialogFormVisible = false
                    this.getList()
                  }
                })
              }
            })
          }
        })
      },
      handleUpdate(row, flag) {
        // flag 两个值
        // 'basicEdit'
        // 'specEdit'
        if (this.type === 'store') {
          this.$router.push(
            `./goods-edit?operation=edit&goods_id=${row.goods_id}${flag ? `&basicEditType=${flag}`:'' }`)
        } else if (this.type === 'basic') {
          this.$router.push(
            `../banchuan-manage/goods-edit?operation=edit&goods_id=${row.goods_id}${flag ? `&basicEditType=${flag}`:'' }`
          )
        }
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