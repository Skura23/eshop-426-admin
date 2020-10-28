<!-- home -->
<template>
  <div class="app-container">
    <TableList
      @search="searGoods"
      :operation-width="operationWid"
      :list-query="query"
      :table-list="tableData.list"
      :tableMap="tableMap"
      :total="tableData.total"
    >
      <template #button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="$router.push('/shop-manage/wechatshop-add')"
        >新增商户</el-button>
      </template>

      <!-- <template #query="{querylist}">
        <el-select
          v-model="querylist.status"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="(item,key) in statusOpts"
            :key="key"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <el-select
          v-model="querylist.status_type"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="(item,key) in status_typeOpts"
            :key="key"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </template>
      <template #goods_image="{row}">
        <img
          :src="row.goods_image[0]"
          width="50"
          alt=""
        >
      </template>
      <template #bargin_time="{row}">
        {{row.start_time +' - '+ row.end_time}}
      </template>
      <template #status_type="{row}">
        {{row.status_type=='not_start'? '未开始':row.status_type=='complete'? '已结束':'进行中'}}
      </template> -->

      <template #operation="{row}">
        <span
          class="cl-blue c-p"
          @click="showDia(row)"
        >详情</span>
      </template>
    </TableList>

    <el-dialog
      title="详情"
      class="_detail-dia"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form :model="form">
        <el-form-item
          :label="typeof val=='string'?val:val.text"
          :label-width="formLabelWidth"
          v-for="(val, k, idx) in detailMap"
          :key="idx"
        >
          <div
            class=""
            v-if="typeof val == 'object'"
          >

            <div
              class=""
              v-for="(val2, k2, idx2) in detailData[k]"
              :key="idx2"
              v-if="k=='audit_detail'"
            >
              <div class="">驳回原因: {{val2.reject_reason}}:</div>
            </div>

            <div
              class=""
              v-for="(val2, k2, idx2) in val"
              :key="idx2"
              v-if="k!='audit_detail'"
            >

              <div
                class=""
                v-if="k2!='text'"
              >{{val2}}:
                <img
                  :src="detailData[k] && detailData[k][k2]"
                  alt=""
                  v-if="k2=='business_license_copy_url'||k2=='id_card_copy_url'||k2=='id_card_national_url'||k2=='id_doc_copy_url'"
                >

                <span
                  class=""
                  v-else
                >
                  {{detailData[k] && detailData[k][k2]}}
                </span>

              </div>

            </div>
          </div>

          <div
            class=""
            v-else
          >
            <qrcode-vue
              v-if="(k=='legal_validation_url'||k=='sign_url')&& detailData[k]"
              :value="detailData[k]"
              level="H"
            ></qrcode-vue>
            <span v-if="k=='organization_type'">
              {{orgTypeMap[detailData[k]]}}
            </span>

            <span v-else>
              {{detailData[k]}}
            </span>
          </div>
        </el-form-item>

        <div class="tc">
          <el-button
            type="primary"
            @click="bindShop(detailData)"
          >绑定店铺</el-button>
        </div>

      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import QrcodeVue from 'qrcode.vue'

  import TableList from '@/components/TableList'
  import _ from "lodash";
  import Vue from 'vue'
  import api from '@/api/shopManage'
  import cityData from '@/utils/city'
  import globals from '@/utils/globals'

  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import Cookies from 'js-cookie'

  export default {
    data() {
      return {
        dialogVisible: false,
        detailData: {},
        form: '',
        formLabelWidth: '150px',
        operationWid: 220,
        status_typeOpts: [{
            value: 'not_start',
            label: '未开始'
          },
          {
            value: 'complete',
            label: '已结束'
          },
          {
            value: 'going',
            label: '进行中'
          },
        ],
        statusOpts: [{
            value: 1,
            label: '上架'
          },
          {
            value: 2,
            label: '下架'
          }
        ],
        query: {
          page: 1,
          page_size: 10,
          status: '',
          status_type: '',
        },
        tableData: {
          list: [],
          total: 0,
        },
        tableMap: {
          out_request_no: {
            headname: '申请单号',
            width: ''
          },
          factory_name: {
            headname: '门店名称',
            width: ''
          },
          merchant_shortname: {
            headname: '商户简称',
            width: ''
          },
          add_time: {
            headname: '申请时间',
            width: ''
          },
        },
        orgTypeMap: {
          2401: '小微商户',
          2500: '个人卖家',
          4: '个体工商户',
          2: '企业',
          3: '党政、机关及事业单位',
          1708: '其他组织',
        },
        detailMap: {
          // factory_id: '门店ID',
          factory_name: '门店名称',
          out_request_no: '业务申请单号',
          organization_type: '主体类型 ',
          business_license_info: {
            text: '营业执照/登记证书信息',
            business_license_copy_url: '证件扫描件',
            business_license_number: '证件注册号',
            merchant_name: '商户名称',
            legal_person: '经营者/法定代表人姓名',
            company_address: '注册地址',
            business_time: '营业期限 ',
          },
          id_doc_type_name: '经营者/法人证件类型',
          id_card_info: {
            text: '法人身份证信息',
            id_card_name: '身份证姓名',
            id_card_number: '身份证号码',
            id_card_valid_time: '身份证有效期限',
            id_card_copy_url: '身份证正面',
            id_card_national_url: '身份证反面',
          },
          id_doc_info: {
            text: '经营者/法人其他类型证件信息',
            id_doc_name: '证件姓名',
            id_doc_number: '证件号码',
            id_doc_copy_url: '证件照片',
            doc_period_end: '证件结束日期',
          },
          contact_info: {
            mobile_phone: '超级管理员手机',
            contact_name: '超级管理员姓名',
            contact_id_card_number: '超级管理员身份证件号码',
            text: '超级管理员信息',
          },
          sales_scene_info: {
            text: '店铺信息',
            store_name: '店铺名称',
          },
          merchant_shortname: '商户简称',
          business_addition_desc: '补充说明',
          applyment_state: '申请状态 ',
          applyment_state_desc: '申请状态描述',
          legal_validation_url: '法人验证链接',
          add_time: '申请时间',
          sign_url: '签约链接 ',
          sub_mchid: '电商平台二级商户号',
          audit_detail: {
            param_name: '提交申请单的资料项名称',
            reject_reason: '驳回原因',
            text: '驳回原因详情',
          }
        }
      }

    },
    components: {
      TableList,
      QrcodeVue
    },
    created() {
      // api.bargain_goods_list({}).then((res) => {

      // })
    },

    computed: {},

    mounted() {},

    methods: {
      bindShop(data) {
        this.$prompt('请填写平台抽成费率', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({
          value
        }) => {
          api.apply_bound({
            out_request_no: data.out_request_no,
            fee_rate: value
          }).then((res) => {
            this.$message({
              message: res.info,
              type: '',
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消填写'
          });
        });
      },
      showDia(data) {
        this.dialogVisible = true
        api.apply_detail({
          out_request_no: data.out_request_no
        }).then((res) => {
          this.detailData = res.data
        })
      },
      searGoods(query) {
        api.apply_list(query).then((res) => {
          this.tableData = res.data
          this.query = query
        })
      },
      updownGoods(row) {
        let {
          status,
          goods_id
        } = row
        status = status == 1 ? 2 : 1;
        api.bargain_goods_put_away({
          goods_id,
          status
        }).then((res) => {
          if (res.code == 9999) {
            this.$message(`商品${status==1?'上架':'下架'}成功`);
          } else {
            this.$message.error('操作失败');
          }
          api.bargain_goods_list(this.query).then((res) => {
            this.tableData = res.data
          })
        })
      },
      editGoods(row) {
        this.$router.push(`./goods-edit?goods_id=${row.goods_id}`)
      },
      delGoods(row) {

      },
    }
  }
</script>
<style
  lang="scss"
  scoped
>
  .app-container {
    ._detail-dia {
      img {
        width: 200px;
      }
    }
  }
</style>