<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown
        class="avatar-container"
        trigger="click"
        @command="handleCommand"
      >
        <div class="avatar-wrapper">
          <img
            src="@/assets/imgs/0.jpg"
            class="user-avatar"
          >
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu
          slot="dropdown"
          class="user-dropdown"
        >
          <el-dropdown-item command="a">
            切换门店
          </el-dropdown-item>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item
            divided
            @click.native="logout"
          >
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog
      title="切换门店"
      :visible.sync="dialogVisible"
    >
      <el-table
        :data="list"
        style="width: 100%"
      >
        <el-table-column
          prop="factory_name"
          label="门店名称"
          width=""
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作"
          width="180"
        >
          <template
            slot-scope="scope"
          >
            <el-button type="primary" @click="handleSwitch(scope.row)">切换</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- todo -->
      <el-pagination
        v-show="listTotal>0"
        @current-change="getList"
        :current-page.sync="listPage"
        :total="listTotal"
        :page-size="10"
        class="mt"
        layout="total, prev, pager, next"
      >
      </el-pagination>
    </el-dialog>


  </div>
</template>

<script>
  import api from '@/api/shopManage'
  import {
    mapGetters
  } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    data() {
      return {
        dialogVisible: false,
        listPage: 1,
        listTotal: 0,
        list: []
      }
    },
    components: {
      Breadcrumb,
      Hamburger,
      Pagination
    },
    computed: {
      // 从store获取相关数据
      ...mapGetters([
        'sidebar',
        'avatar'
      ])
    },
    methods: {
      getList() {
        api.switch_factory_list({
          info: {
            page: this.listPage,
            page_size: 10
          }
        }).then((res) => {
          this.list = res.data.list
          this.listTotal = res.data.total
        })
      },
      handleCommand(command) {
        if (command == 'a') {
          this.getList()
          this.dialogVisible = true
        }
      },
      handleSwitch(data) {
        api.switch_factory({info:{
          switch_factory_id: data.factory_id
        }}).then((res) => {
          this.$message({
            message: res.info,
            type: '',
          })
          this.dialogVisible = false
        })
      },
      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
      },
      async logout() {
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }
    }
  }
</script>

<style
  lang="scss"
  scoped
>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>