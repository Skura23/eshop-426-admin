<!-- eshop426admin template -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery[keywordsKey]"
        placeholder="输入关键字"
        style="width: 200px;"
        @keyup.enter.native="handleFilter"
      />
      &nbsp;
      <slot
        name="query"
        :querylist="listQuery"
      ></slot>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>

      <slot
        name="button"
        :querylist="listQuery"
      >
      </slot>

    </div>
    <br>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tableList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        v-for="(val, name) in tableMap"
        :key="name"
        :label="val.headname"
        :prop="name"
        align="center"
        :width="val.width"
      >
        <template slot-scope="{row}">

          <span v-if="!slotCol.includes(name)">{{ filteredList[name]? filteredList[name](row): row[name] }}</span>

          <slot
            :name="name"
            v-if="slotCol.includes(name)"
            :row="row"
          ></slot>

        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        :width="operationWidth"
      >
        <template slot-scope="{row}">
          <slot
            name='operation'
            :row="row"
          ></slot>
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

  </div>
</template>

<script>
  import _ from 'lodash'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'TableList',
    components: {
      Pagination
    },
    props: {
      filteredList: {
        type: Object,
        default () {
          return {}
        },
      },
      // 查询关键字的对象键名
      keywordsKey: {
        type: String,
        default: 'keywords_like'
      },
      tableList: {
        type: Array,
      },
      listQuery: {
        type: Object,
        default () {
          return {
            page: 1,
            page_size: 10
          }
        }
      },
      // ajaxFunc: {
      //   type: Function,
      // },

      // 表格的key与表头名映射关系, eg:
      // {
      //   keyname: {
      //     headname:'',
      //     width:''
      //   }
      // }
      tableMap: {
        type: Object,
        required: true
      },
      slotCol: {
        type: Array,
        default: () => {
          return []
        }
      },
      operationWidth: {
        type: Number,
      },
      total: {
        type: Number,
        default: 0
      },
      listLoading: {
        type: Boolean,
      },

      // resdataMap: {
      //   type: Object,
      //   default: {
      //     list: 'list',
      //     total: 'total'
      //   }
      // },
      // querydataMap: {
      //   type: Object,
      //   default: {
      //     page: 'page',
      //     page_size: 'page_size'
      //   }
      // },

    },
    data() {
      return {
        tableKey: 0,
      }
    },
    created() {
      this.getList()
    },
    watch: {
      // 每次检测到tablelist数据变动隐藏loading
      tableList(newval, oldval) {
        console.log(newval, oldval, 'tableList');
        this.listLoading = false
      },
      listQuery(newval, oldval) {
        // this.$emit('update:list-query', e.target.value);
      },
    },
    computed: {

    },
    methods: {
      getList() {
        this.listLoading = true
        this.$emit('search', this.listQuery)
        // this.$emit('update:operation-width', 200+Math.random()*100);
        // this.ajaxFunc((res) => {

        // })
        // fetchList(this.listQuery).then(response => {
        //   this.list = response.data.list
        //   this.total = response.data.total
        //   this.listLoading = false;
        // })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
    }
  }
</script>