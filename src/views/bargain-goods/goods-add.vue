<!-- home -->
<template>
  <div class="app-container">
    <div class="page-bargain">
      <FormMod
        @submit="submit"
        :form-list="formData"
        :configList="configList"
        :rules="rules"
      >
        <template v-slot:goods_image="{val,datakey}">
          <!-- :file-list="formData.l_imgs" -->
          <el-upload
            :action="uplUrl"
            list-type="picture-card"
            :on-success="uplSucc"
            :on-remove="removeImg"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </template>
        <template v-slot:goods_share_logo="{val,datakey}">
          <!-- :file-list="formData.l_imgs" -->
          <el-upload
            :action="uplUrl"
            list-type="picture-card"
            :on-success="uplSucc2"
            :on-remove="removeImg2"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </template>
        <template v-slot:goods_share_describe="{val,datakey}">
          <el-input v-model="val[datakey]"></el-input>
        </template>
        <template v-slot:start_time="{val,datakey}">
          <el-date-picker
            v-model="val.l_date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </template>
        
        <template v-slot:display_order="{val,datakey}">
          <el-input v-model="val.display_order"></el-input>
          <div class="cl-gray font12">序号越小越靠前</div>
        </template>
        <template v-slot:rand_rate="{val,datakey}">
          <div
            v-for="(item, index) in formData.rand_rate"
            :key="index"
            class="mb10"
          >
            <el-input
              placeholder="请输入内容"
              v-model="item.begin"
            >
            </el-input> 元, 至
            <el-input
              placeholder="请输入内容"
              v-model="item.end"
            >
            </el-input> 元, 赔率:
            <el-input
              placeholder="请输入内容"
              v-model="item.rate"
            >
            </el-input>
          </div>
          <div>
            <el-link
              :underline="false"
              type="primary"
              @click="addOddrow"
            >新增分区</el-link>&nbsp;&nbsp;&nbsp;
            <el-link
              :underline="false"
              type="primary"
              @click="delOddrow"
            >删除分区</el-link>&nbsp;&nbsp;
          </div>
          <div class="cl-gray font12">
            最大增加金额用正数表示，例如：6 ， 最大减少金额用负数表示，例如：-6 ，概率相加必须等于100%
          </div>
        </template>
      </FormMod>
    </div>
  </div>
</template>

<script>
  import {submitDisToggle} from '@/mixins/common'

  import TableList from '@/components/TableList'
  import FormMod from '@/components/FormMod'
  import _ from "lodash";
  import Vue from 'vue'
  import api from '@/api/shopManage'
  import cityData from '@/utils/city'
  import globals from '@/utils/globals'

  import Cookies from 'js-cookie'

  export default {
    mixins:[submitDisToggle],

    components: {
      FormMod
    },
    data() {
      return {
        uplUrl: globals.curBaseUrl + '/upload',
        l_imgs: [],
        formData: {
          "factory_id": '',
          "market_price": '',
          "end_price": '',
          "display": '1',
          "start_time": '',
          "end_time": '',
          "time_limit": '',
          "goods_image": [],
          "goods_share_logo": [],
          "total_time": '',
          "each_time": '',
          "goods_share_title": '',
          "goods_share_describe": '',
          "stock_num": '',
          "rand_rate": [],
          l_date: '',
        },
        // {
        //     //表单类型
        //     type: 'radio',
        //     opts: [{
        //       value: '',
        //       label: '',
        //     }],
        //     label: '时间',
        //     // 提示
        //     tip: '',
        //     // 插槽名
        //     slot: '',
        //     // 表单项配置
        //     configData: {}
        //   },
        configList: {
          "factory_id": {
            label: '门店名称',
          },
          "organization_type": {
            label: '主体类型',
            type: 'select',
            opts: [{
              value: '2401',
              label: '小微商户',
            }, {
              value: '2500',
              label: '个人卖家',
            }, {
              value: '4',
              label: '个体工商户',
            }, {
              value: '2',
              label: '企业',
            }, {
              value: '3',
              label: '党政、机关及事业单位',
            }, {
              value: '1708',
              label: '其他组织',
            }],
          },
          "end_price": {
            label: '底价',
          },
          "display": {
            label: '显示底价',
            type: 'radio',
            opts: [{
              value: '1',
              label: '是',
            }, {
              value: '2',
              label: '否',
            }],
          },
          "display_order": {
            label: '序号',
            slot: "display_order"
          },
          "start_time": {
            label: "活动时间",
            slot: "start_time"
          },
          "time_limit": {
            label: '砍价时限(小时)',
            configData: {
              type: 'number',
            }
          },
          goods_image: {
            label: '商品图片',
            slot: 'goods_image'
          },
          
          total_time: {
            label: '可砍价总次数',
          },
          each_time: {
            label: '每人可砍次数',
          },
          goods_share_logo: {
            label: '分享图片',
            slot: 'goods_share_logo'
          },
          goods_share_title: {
            label: '分享标题',
          },
          goods_share_describe: {
            label: '分享描述',
            slot: 'goods_share_describe'
          },
          stock_num: {
            label: '库存数量',
          },
          rand_rate: {
            label: '砍价概率',
            slot: 'rand_rate'
          },
          // "goods_image": '',
          // "total_time": '',
          // "each_time": '',
          // "goods_share_title": '',
          // "goods_share_describe": '',
          // "stock_num": '',
          // "rand_rate": '',
        },
        rules: {
          // goods_name: [{
          //   required: true,
          //   message: '请输入商品名称',
          //   trigger: 'blur'
          // }],
        }
      }

    },
    watch: {

    },

    computed: {

    },
    created() {
      console.log(this.$route, 'created');
      if (this.$route.name === 'bargain-goods-add') {
        this.modiType = 'add'
      } else {
        this.modiType = 'edit'
        this.formData.goods_id = this.$route.query.goods_id
        api.bargain_goods_detail({
          goods_id: this.formData.goods_id
        }).then((res) => {
          this.formData = res.data
          this.dateToArr()
        })
      }
    },

    mounted() {
      // this.formData.goods_name = '456'
    },

    methods: {
      addOddrow() {
        this.formData.rand_rate.push({
          begin: '',
          end: '',
          rate: '',
        })
      },
      delOddrow() {
        // this.
        this.formData.rand_rate.pop()
      },
      removeImg(file, fileList) {
        console.log(fileList, 'fileList');
        this.imgArrRegroup2(fileList)
      },
      uplSucc(res, file, fileList) {
        fileList[fileList.length - 1].url = res.data[0].all_path
        // console.log(fileList, file, 'fileList');
        this.imgArrRegroup2(fileList)
      },
      removeImg2(file, fileList) {
        console.log(fileList, 'fileList');
        this.shareimgArrRegroup(fileList)
      },
      uplSucc2(res, file, fileList) {
        fileList[fileList.length - 1].url = res.data[0].all_path
        // console.log(fileList, file, 'fileList');
        this.shareimgArrRegroup(fileList)
      },
      dateToArr() {
        this.formData.l_date = [this.formData.start_time, this.formData.end_time]
      },
      dateToStr(data) {
        if (data.l_date) {
          this.formData.start_time = data.l_date[0]
          this.formData.end_time = data.l_date[1]
        }
      },
      // imgArrRegroup() {
      //   let arr = []
      //   this.goods_image.forEach((elem, idx) => {
      //     let obj = {}
      //     obj.name = idx
      //     obj.url = elem
      //     arr.push(obj)
      //   });
      //   this.formData.l_imgs = arr
      // },
      imgArrRegroup2(data) {
        let arr = []
        arr = data.map(v => v.url)
        this.formData.goods_image = arr
      },
      shareimgArrRegroup(data) {
        let arr = []
        arr = data.map(v => v.url)
        this.formData.goods_share_logo = arr
      },
      submit(data) {
        console.log(data, 'submit');
        this.dateToStr(data)
        if (this.modiType == 'add') {
          api.bargain_goods_create(data).then((res) => {
            this.$message({
              message: res.info,
              type: '',
              duration: 1300,
              onClose: () => {
                if (res.code == 9999) {
                  this.$router.push('/bargain-goods/list')
                }
              }
            })

          })

        } else {
          api.bargain_goods_edit(data).then((res) => {
            this.$message({
              message: res.info,
              type: '',
              duration: 1300,
              onClose: () => {
                if (res.code == 9999) {
                  this.$router.push('/bargain-goods/list')
                }
              }
            })

          })
        }
      },
    }
  }
</script>

<style lang="scss">
  .page-bargain {
    .el-input {
      width: 200px;
    }
  }
</style>