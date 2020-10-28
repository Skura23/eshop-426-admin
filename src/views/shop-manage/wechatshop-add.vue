<!-- home -->
<template>
  <div class="app-container page-wechatshop-add">
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
    >
      <el-form-item
        label="门店名称"
        required
      >
        <span>{{chosenShop}}</span>
        <span
          class="cl-blue c-p"
          @click="chooseShopPopVisible = true;getChooseShopList()"
        >选择</span>
      </el-form-item>
      <el-form-item
        label="主体类型"
        required
      >
        <el-select
          v-model="form.organization_type"
          placeholder="请选择主体类型"
        >
          <el-option
            label="小微商户"
            value="2401"
          ></el-option>
          <el-option
            label="个人卖家"
            value="2500"
          ></el-option>
          <el-option
            label="个体工商户"
            value="4"
          ></el-option>
          <el-option
            label="企业"
            value="2"
          ></el-option>
          <el-option
            label="党政、机关及事业单位"
            value="3"
          ></el-option>
          <el-option
            label="其他组织"
            value="1708"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="营业执照信息"
        v-show="form.organization_type!=2401 && form.organization_type!=2500"
      >
        <div class="font12 cl-gray">
          1, 主体为“小微/个人卖家”时，不填。2, 主体为“个体工商户/企业”时，请上传营业执照。3, 主体为“党政、机关及事业单位/其他组织”时，请上传登记证书。
        </div>
        <div class="">
          <div class="_req">证件扫描件:</div>
          <el-upload
            limit="1"
            :action="uplUrl"
            list-type="picture-card"
            :on-success="bussiScanUplSucc"
            :on-remove="bussiScanUplRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
        <div class="">
          <div class="_req">证件注册号:</div>
          <el-input v-model="form.business_license_info.business_license_number"></el-input>
        </div>
        <div class="">
          <div class="_req">商户名称:</div>
          <el-input v-model="form.business_license_info.merchant_name"></el-input>
        </div>
        <div class="">
          <div class="_req">经营者/法定代表人姓名:</div>
          <el-input v-model="form.business_license_info.legal_person"></el-input>
        </div>
        <div class="">
          <div class="">注册地址:</div>
          <el-input v-model="form.business_license_info.company_address"></el-input>
        </div>
        <div class="">
          <div class="">营业期限:</div>
          <el-input v-model="l_data.runTime0"></el-input> - <el-input v-model="l_data.runTime1"></el-input>
          <div class="cl-gray font12">
            1、主体为“党政、机关及事业单位/其他组织”时必填，请填写证件有效期。2、若证件有效期为长期，请在第二个输入框填写：长期。3、结束时间需大于开始时间。4、有效期必须大于60天，即结束时间距当前时间需超过60天。示例：2014-01-01
            长期
          </div>
        </div>
      </el-form-item>

      <el-form-item label="经营者/法人证件类型">
        <el-select
          v-model="form.id_doc_type"
          placeholder="请选择证件类型"
        >
          <el-option
            v-for="item in id_doc_typeOpts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="经营者/法人身份证信息"
        v-show="form.id_doc_type=='IDENTIFICATION_TYPE_MAINLAND_IDCARD'"
      >
        <div class="">
          <div class="_req">身份证人像面照片:</div>
          <el-upload
            limit="1"
            :action="uplUrl"
            list-type="picture-card"
            :on-success="idFrontUplSucc"
            :on-remove="idFrontUplRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
        <div class="">
          <div class="_req">身份证国徽面照片:</div>
          <el-upload
            limit="1"
            :action="uplUrl"
            list-type="picture-card"
            :on-success="idBackUplSucc"
            :on-remove="idBackUplRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
        <div class="">
          <div class="_req">身份证姓名:</div>
          <el-input v-model="form.id_card_info.id_card_name"></el-input>
        </div>
        <div class="">
          <div class="_req">身份证号码:</div>
          <el-input v-model="form.id_card_info.id_card_number"></el-input>
        </div>
        <div class="">
          <div class="_req">身份证有效期限:</div>
          <el-input v-model="form.id_card_info.id_card_valid_time"></el-input>
        </div>
      </el-form-item>

      <el-form-item
        label="其他类型证件信息"
        v-show="form.id_doc_type!='IDENTIFICATION_TYPE_MAINLAND_IDCARD'"
      >
        <div class="">
          <div class="">证件照片:</div>
          <el-upload
            limit="1"
            :action="uplUrl"
            list-type="picture-card"
            :on-success="otherIdUplSucc"
            :on-remove="otherIdUplRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
        <div class="">
          <div class="">证件姓名:</div>
          <el-input v-model="form.id_doc_info.id_doc_name"></el-input>
        </div>
        <div class="">
          <div class="">证件号码:</div>
          <el-input v-model="form.id_doc_info.id_doc_number"></el-input>
        </div>
        <div class="">
          <div class="">证件结束日期:</div>
          <el-input v-model="form.id_doc_info.doc_period_end"></el-input>
        </div>
      </el-form-item>

      <el-form-item
        label="超级管理员信息"
        required
      >
        <div class="">
          <div class="_req">超级管理员类型:</div>
          <el-select
            v-model="form.contact_info.contact_type"
            placeholder="请选择证件类型"
          >
            <el-option
              v-for="item in contact_typeOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="">
          <div class="_req">超管姓名:</div>
          <el-input v-model="form.contact_info.contact_name"></el-input>
          <div class="font12 cl-gray">超级管理员姓名 1、若管理员类型为“法人”，则该姓名需与法人身份证姓名一致。2、若管理员类型为“经办人”，则可填写实际经办人的姓名。</div>
        </div>
        <div class="">
          <div class="_req">超管身份证号码:</div>
          <el-input v-model="form.contact_info.contact_id_card_number"></el-input>
          <div class="font12 cl-gray">超级管理员身份证件号码
            1、若管理员类型为法人，则该身份证号码需与法人身份证号码一致。若管理员类型为经办人，则可填写实际经办人的身份证号码。2、可传身份证、来往内地通行证、来往大陆通行证、护照等证件号码。</div>
        </div>
        <div class="">
          <div class="_req">超管手机:</div>
          <el-input v-model="form.contact_info.mobile_phone"></el-input>
        </div>
        <div class="">
          <div class="">超管邮箱:</div>
          <el-input v-model="form.contact_info.contact_email"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="店铺信息">
        <div class="">
          <div class="">店铺名称:</div>
          <el-input v-model="form.sales_scene_info.store_name"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="商户简称">
        <el-input v-model="form.merchant_shortname"></el-input>
      </el-form-item>

      <el-form-item label="补充说明">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="form.business_addition_desc"
        >
        </el-input>
        <div class="font12 cl-gray">若主体为“个人卖家”，该字段必传，则需填写描述“ 该商户已持续从事电子商务经营活动满6个月，且期间经营收入累计超过20万元。”</div>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
        >提交</el-button>
      </el-form-item>

    </el-form>

    <el-dialog
      title="选择门店"
      @close="this.chooseShopListSearTxt = ''"
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
          <template slot-scope="{row}">
            {{row.status==1?'正常':'冻结'}}
          </template>

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

  </div>
</template>

<script>
  import {
    submitDisToggle
  } from '@/mixins/common'

  import TableList from '@/components/TableList'
  import FormMod from '@/components/FormMod'
  import _ from "lodash";
  import Vue from 'vue'
  import api from '@/api/shopManage'
  import cityData from '@/utils/city'
  import {
    editCb
  } from '@/utils'
  import globals from '@/utils/globals'

  import Cookies from 'js-cookie'

  export default {
    mixins: [submitDisToggle],

    components: {
      FormMod
    },
    data() {
      return {
        l_data: {
          runTime0: '',
          runTime1: ''
        },
        chooseShopPopVisible: false,
        chooseShopList: [],
        chooseShopListPage: 1,
        chooseShopListTotal: 0,
        chooseShopListSearTxt: '',
        form: {
          factory_id: '',
          organization_type: '',
          business_license_info: {
            business_license_copy: '',
            business_license_number: '',
            merchant_name: '',
            legal_person: '',
            company_address: '',
            business_time: '',
          },
          id_doc_type: '',
          id_card_info: {
            id_card_copy: '',
            id_card_national: '',
            id_card_name: '',
            id_card_number: '',
            id_card_valid_time: '',
          },
          id_doc_info: {
            id_doc_name: '',
            id_doc_number: '',
            id_doc_copy: '',
            doc_period_end: '',
          },
          contact_info: {
            contact_type: '',
            contact_name: '',
            contact_id_card_number: '',
            mobile_phone: '',
            contact_email: '',
          },
          sales_scene_info: {
            store_name: '',
          },
          merchant_shortname: '',
          business_addition_desc: '',
        },
        id_doc_typeOpts: [

        ],
        contact_typeOpts: [

        ],
        chosenShop: '',
        uplUrl: globals.curBaseUrl + '/media_upload',
      }

    },
    watch: {
      "form.organization_type"(newVal, oldVal) {
        if (newVal == 2401 || newVal == 2500) {
          this.id_doc_typeOpts = [{
            value: 'IDENTIFICATION_TYPE_MAINLAND_IDCARD',
            label: '中国大陆居民-身份证'
          }]
          this.contact_typeOpts = [{
            value: '65',
            label: '经营者/法人'
          }]


        } else {
          this.id_doc_typeOpts = [{
              value: 'IDENTIFICATION_TYPE_MAINLAND_IDCARD',
              label: '中国大陆居民-身份证'
            },
            {
              value: 'IDENTIFICATION_TYPE_OVERSEA_PASSPORT',
              label: '其他国家或地区居民-护照'
            },
            {
              value: 'IDENTIFICATION_TYPE_HONGKONG',
              label: '中国香港居民–来往内地通行证'
            },
            {
              value: 'IDENTIFICATION_TYPE_MACAO',
              label: '中国澳门居民–来往内地通行证'
            },
            {
              value: 'IDENTIFICATION_TYPE_TAIWAN',
              label: '中国台湾居民–来往大陆通行证'
            },
            // IDENTIFICATION_TYPE_MAINLAND_IDCARD: '中国大陆居民-身份证'
            // IDENTIFICATION_TYPE_OVERSEA_PASSPORT: '其他国家或地区居民-护照'
            // IDENTIFICATION_TYPE_HONGKONG: '中国香港居民–来往内地通行证'
            // IDENTIFICATION_TYPE_MACAO: '中国澳门居民–来往内地通行证'
            // IDENTIFICATION_TYPE_TAIWAN: '中国台湾居民–来往大陆通行证'
          ]

          this.contact_typeOpts = [{
            value: '65',
            label: '经营者/法人'
          }, {
            value: '66',
            label: '负责人'
          }]
        }

        this.form.id_card_info.id_doc_type = ''
        this.form.contact_info.contact_type = ''
      },
    },

    computed: {

    },
    created() {
      console.log(this.chosenShop, 'chosenShop');

    },

    mounted() {
      // this.formData.goods_name = '456'
    },

    methods: {
      bussiScanUplSucc(res, file, fileList) {
        this.form.business_license_info.business_license_copy = res.data[0].media_id
      },
      bussiScanUplRemove(file, fileList) {
        this.form.business_license_info.business_license_copy = ''
      },
      idFrontUplSucc(res, file, fileList) {
        this.form.id_card_info.id_card_copy = res.data[0].media_id
      },
      idFrontUplRemove(file, fileList) {
        this.form.id_card_info.id_card_copy = ''
      },
      idBackUplSucc(res, file, fileList) {
        this.form.id_card_info.id_card_national = res.data[0].media_id
      },
      idBackUplRemove(file, fileList) {
        this.form.id_card_info.id_card_national = ''
      },
      otherIdUplSucc(res, file, fileList) {
        this.form.id_doc_info.id_doc_copy = res.data[0].media_id
      },
      otherIdUplRemove(file, fileList) {
        this.form.id_doc_info.id_doc_copy = ''
      },
      // imgArrRegroup(data) {
      //   let arr = []
      //   arr = data.map(v => v.url)
      //   this.form.goods_image = arr
      // },

      handleChooseShop(data) {
        this.chosenShop = data.factory_name
        this.form.factory_id = data.factory_id
        this.chooseShopPopVisible = false
      },
      getChooseShopList() {
        api.factory_list({
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
      onSubmit() {
        console.log('submit!');
        this.form.business_license_info.business_time = [this.l_data.runTime0, this.l_data.runTime1]
        api.apply_create(this.form).then((res) => {
          editCb(res, () => {
            this.$router.replace('/shop-manage/wechatshop-list')
          })
        })
      },
    }
  }
</script>

<style lang="scss">
  .page-wechatshop-add {

    .el-input,
    .el-textarea {
      width: 200px;
    }

    .el-form-item__label {
      width: 120px !important;
    }

    .el-form-item__content {
      margin-left: 120px !important;
    }

    ._req::before {
      content: '*';
      color: #F56C6C;
      margin-right: 4px;
    }

    .cl-gray.font12 {
      width: 400px;
      line-height: 1.5;
    }
  }
</style>