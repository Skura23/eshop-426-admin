<!-- home -->
<template>
  <div class="app-container page-clients-detail">
    <div class="_d0">
      <div class="">
        <el-card class="box-card">
          <div
            slot="header"
            class="clearfix"
          >
            <span>客户信息</span>
          </div>
          <div>
            <el-col
              :span="6"
              class="tc"
            >
              <img
                :src="detailData.headimgurl"
                style="border-radius: 99px;"
                alt=""
              >

            </el-col>
            <el-col :span="18">
              <div class="font18 bold">{{detailData.member_name}}</div>
              <div class="">
                <el-row
                  :gutter="20"
                  class="mb10"
                >
                  <el-col
                    :span="6"
                    class="mt10"
                    v-for="(item, index) in detailMap"
                    :key="index"
                  >
                    <!-- <div
                      class=""
                      v-if="index=='referrer_type'"
                    >
                      {{item}}: {{detailReferrertypeMap[detailData[index]]}}
                    </div> -->
                    <div
                      class=""
                      v-if="index=='tag_list'"
                    >
                      {{item}}: 
                      <span v-for="(item, index) in detailData.tag_list" :key="index">
{{item}} 
                      </span>
                    </div>
                    <div
                      class=""
                      v-else
                    >
                      {{item}}: {{detailData[index]}}
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </div>
        </el-card>
      </div>

    </div>


  </div>
</template>

<script>
  // import TableList from '@/components/TableList'
  import _ from "lodash";
  import Vue from 'vue'
  import api from '@/api/shopManage'
  import globals from '@/utils/globals'

  export default {
    data() {
      return {
        detailData: {},

        detailMap: {
          member_id: '客户id',
          root_factory_id: '总店id',
          member_code: '客户编号',
          // member_name: '客户名称',
          phone: '手机号',
          contacts: '联系人',
          other_phone: '其他电话',
          sex: '性别',
          birthday: '生日',
          address: '地址',
          id_card_no: '身份证号码',
          add_time: '创建时间',
          integral: '积分',
          tag_list: '客户标签',
          all_commission: '累计获得佣金',
          referrer_id: '推荐人id',
          referrer_type_name: '推荐人类别',
          referrer_name: '推荐人名称',
          // headimgurl: '头像',
        },
        detailReferrertypeMap: {
          auth: '员工推荐',
          factory: '店铺推荐',
          member: '客户推荐',
        },
      }

    },
    components: {

    },
    created() {
      let member_id = this.$route.query.member_id
      api.member_detail({
        member_id
      }).then((res) => {
        this.detailData = res.data
      })
    },
    computed: {},

    mounted() {},

    methods: {}
  }
</script>
<style lang="scss">
  .app-container.page-order-detail {
    .el-form-item {
      margin-bottom: 10px;

      .el-form-item__label,
      .el-form-item__content {
        line-height: 20px;
      }
    }
  }
</style>