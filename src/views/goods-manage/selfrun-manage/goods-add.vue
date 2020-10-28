<template>
  <div class="app-container page-goods-add">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="120px"
    >
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="基本"
          name="first"
          v-if="tabShow[0]"
        >


          <el-form-item
            label="商品名称"
            prop="goods_name"
          >
            <el-input
              v-model="temp.goods_name"
              class="_w200"
            />
          </el-form-item>
          <el-form-item
            label="市场价"
            prop="market_price"
          >
            <el-input
              v-model="temp.market_price"
              type="number"
              class="_w200"
            />
          </el-form-item>
          <el-form-item
            label="售价"
            prop="price"
          >
            <el-input
              v-model="temp.price"
              type="number"
              class="_w200"
            />
          </el-form-item>
          <el-form-item
            label="开启拼团"
            prop="is_group"
          >
            <div>
              <el-radio
                v-model="temp.is_group"
                label="1"
              >是</el-radio>
              <el-radio
                v-model="temp.is_group"
                label="2"
              >否</el-radio>
            </div>
            <div v-show="temp.is_group==1">
              <div
                class="i-b"
                style="width:300px"
              >
                <el-input
                  placeholder="请输入内容"
                  v-model="temp.group_price"
                >
                  <template slot="prepend">拼团价格</template>
                  <template slot="append">元</template>
                </el-input>
              </div>
              <div
                class="i-b"
                style="width:300px"
              >
                <el-input
                  placeholder="请输入内容"
                  v-model="temp.group_num"
                >
                  <template slot="prepend">开团人数</template>
                  <template slot="append">人</template>
                </el-input>
              </div>
              <div
                class="i-b"
                style="width:300px"
              >
                <el-input
                  placeholder="请输入内容"
                  v-model="temp.group_end_time"
                >
                  <template slot="prepend">组团限时</template>
                  <template slot="append">小时</template>
                </el-input>
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="开启预付"
            prop="is_prepay"
          >
            <div>
              <el-radio
                v-model="temp.is_prepay"
                label="1"
              >是</el-radio>
              <el-radio
                v-model="temp.is_prepay"
                label="2"
              >否</el-radio>
            </div>
            <div v-show="temp.is_prepay==1">
              <el-input
                v-model="temp.prepay_price"
                placeholder="输入预付定金"
                type="number"
                class="_w200"
              />
            </div>
          </el-form-item>
          <el-form-item
            label="客户推广佣金"
            prop="member_commission"
          >
            <el-input
              v-model="temp.member_commission"
              type="number"
              class="_w200"
            />
          </el-form-item>
          <el-form-item
            label="水电工佣金"
            prop="plumber_commission"
          >
            <el-input
              v-model="temp.plumber_commission"
              type="number"
              class="_w200"
            />
          </el-form-item>
          <el-form-item
            label="设计师佣金"
            prop="stylist_commission"
          >
            <el-input
              v-model="temp.stylist_commission"
              type="number"
              class="_w200"
            />
          </el-form-item>

          <el-form-item label="图片上传">
            <el-upload
              class="upload-demo "
              :action="uplUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleUplSucc"
              :file-list="fileList"
              :before-upload="beforeUpload"
              :show-file-list="false"
              accept="image/*"
            >
              <el-button
                size="small"
                type="primary"
              >点击上传</el-button>
              <div
                slot="tip"
                class="el-upload__tip"
              >只能上传图片文件</div>
            </el-upload>
            <div
              class="_prev-list-wra mt"
              v-show="temp.goods_image.length"
            >
              <div
                class="i-b re mr"
                v-for="(item, index) in temp.goods_image"
                :key="index"
              >
                <el-image
                  style="width: 120px; height: 120px;cursor:pointer"
                  :src="item"
                  fit="cover"
                  title="点击查看"
                  @click="openImg(item)"
                ></el-image>
                <span
                  class="_del-btn font16"
                  @click="deletePrevPic"
                >×</span>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="商品分类">
            <el-cascader
              :options="cateList"
              placeholder="搜索"
              filterable
              :filter-method="filterCate"
              v-model="temp.class_id"
            ></el-cascader>
          </el-form-item>

          <el-form-item
            label="商品标签"
            prop="goods_tag"
          >
            <Tag :tag-list="temp.goods_tag"></Tag>
          </el-form-item>

          <el-form-item
            label="商品参数"
            prop="goods_params"
          >
            <div
              class="mb10"
              v-for="(item, index) in temp.goods_params"
              :key="index"
            >
              <el-input
                class="_w200"
                v-model="item.column"
                placeholder="请输入参数名"
              ></el-input> :
              <el-input
                class="_w200"
                v-model="item.value"
                placeholder="请输入参数值"
              ></el-input>
              <span
                class="cl-red c-p"
                @click="temp.goods_params.splice(index, 1)"
              >删除</span>
            </div>
            <div
              class="cl-blue c-p"
              @click="temp.goods_params.push({column:'',value:''})"
            >
              新增参数
            </div>
            <div class="cl-gray font12">
              示例: 产地：中国, 材质：塑料
            </div>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane
          label="规格"
          name="second"
          v-if="tabShow[1]"
        >
          <el-checkbox v-model="f_isSpec">启用商品规格</el-checkbox>
          <div
            class="vue-sku mt"
            v-show="f_isSpec"
          >

            <!-- 规格设置 -->
            <el-card class="box-card">
              <div
                slot="header"
                class="clearfix"
              >
                <span>产品规格设置</span>
              </div>
              <section>
                <div
                  v-for="(item, index) in specification"
                  :key="index"
                  class="spec-line"
                >
                  <div>
                    <span v-if="!cacheSpecification[index].status">{{ item.name }}</span>
                    <el-input
                      size="small"
                      style="width:200px;"
                      v-if="cacheSpecification[index].status"
                      v-model="cacheSpecification[index].name"
                      placeholder="输入产品规格"
                      @keyup.native.enter="saveSpec(index)"
                    >
                      <el-button
                        slot="append"
                        icon="el-icon-check"
                        type="primary"
                        @click="saveSpec(index)"
                      ></el-button>
                    </el-input>
                    <i
                      class="icon el-icon-edit"
                      v-if="!cacheSpecification[index].status"
                      @click="updateSpec(index)"
                    ></i>
                  </div>
                  <div class="mt10">
                    <el-tag
                      class="mr10"
                      v-for="(tag, j) in item.value"
                      :key="j"
                      closable
                      @close="delSpecTag(index, j)"
                    >{{ tag }}</el-tag>
                    <el-input
                      size="small"
                      style="width:260px;"
                      v-model="addValues[index]"
                      placeholder="多个产品属性以空格隔开"
                      @keyup.native.enter="addSpecTag(index)"
                    >
                      <el-button
                        slot="append"
                        icon="el-icon-check"
                        type="primary"
                        @click="addSpecTag(index)"
                      ></el-button>
                    </el-input>
                  </div>
                  <i
                    class="icon el-icon-circle-close spec-deleted"
                    @click="delSpec(index)"
                  ></i>
                  <el-divider></el-divider>
                </div>
                <div class="add-spec">
                  <el-button
                    size="small"
                    type="primary"
                    :disabled="specification.length >= 5"
                    @click="addSpec"
                  >添加规格项目</el-button>
                </div>
              </section>
            </el-card>

            <!-- 规格展示 -->
            <el-card
              class="box-card mt"
              v-show="false"
            >
              <div
                slot="header"
                class="clearfix"
              >
                <span>规格展示</span>
                <el-button
                  style="float: right; padding: 3px 0"
                  type="text"
                  @click="specificationStatus = !specificationStatus"
                >{{ !specificationStatus ? '显示' : '隐藏' }}</el-button>
              </div>
              <section v-if="specificationStatus">
                <el-row>
                  <el-col
                    :span="2"
                    v-for="(item, index) in specification"
                    :key="index"
                    class="text item bold"
                  >{{ item.name }}</el-col>
                </el-row>
                <el-row
                  v-for="(item, index) in countSum(0)"
                  :key="index"
                >
                  <el-col
                    :span="2"
                    class="text item"
                    v-for="(n, specIndex) in specification.length"
                    :key="n"
                  >{{getSpecAttr(specIndex, index)}}</el-col>
                </el-row>
              </section>
            </el-card>

            <!-- 实战DEMO -->
            <!-- <div class="font12 cl-gray mt mb10">
              * 拼团价格, 预付定金在
            </div> -->
            <el-card class="">
              <div
                slot="header"
                class="clearfix"
              >
                <span>规格表格</span>
              </div>
              <table
                class="el-table"
                cellspacing="0"
                cellpadding="0"
              >
                <thead>
                  <tr>
                    <th
                      v-for="(item, index) in specification"
                      :key="index"
                    >
                      {{item.name}}
                    </th>
                    <th style="width: 160px;">* 市场价</th>
                    <th>* 售价（元）</th>
                    <th>拼团价格（元）</th>
                    <th>预付定金（元）</th>
                    <th>客户推广佣金（元）</th>
                    <th>水电工佣金（元）</th>
                    <th>设计师佣金（元）</th>
                    <!-- <th>是否启用</th> -->
                  </tr>
                </thead>
                <tbody v-if="specification[0] && specification[0].value.length">
                  <tr
                    :key="index"
                    v-for="(item, index) in countSum(0)"
                  >
                    <template v-for="(n, specIndex) in specification.length">
                      <td
                        v-if="showTd(specIndex, index)"
                        :key="n"
                        :rowspan="countSum(n)"
                      >
                        {{getSpecAttr(specIndex, index)}}
                      </td>
                    </template>
                    <!-- 使某规格不可用功能: -->
                    <!-- :disabled="!childProductArray[index].isUse" -->
                    <td>
                      <!-- @blur="handleNo(index)" -->
                      <el-input
                        size="small"
                        type="number"
                        v-model="childProductArray[index].market_price"
                        placeholder="输入市场价"
                        style="width:120px;"
                      >
                      </el-input>
                    </td>
                    <td>
                      <el-input
                        size="small"
                        type="number"
                        v-model.number="childProductArray[index].price"
                        placeholder="输入售价"
                        style="width:120px;"
                      >
                      </el-input>
                    </td>
                    <td>
                      <el-input
                        size="small"
                        type="number"
                        v-model.number="childProductArray[index].group_price"
                        placeholder="输入拼团价格"
                        style="width:120px;"
                      >
                      </el-input>
                    </td>
                    <td>
                      <el-input
                        size="small"
                        type="number"
                        v-model.number="childProductArray[index].prepay_price"
                        placeholder="输入预付金额"
                        style="width:120px;"
                      >
                      </el-input>
                    </td>
                    <td>
                      <el-input
                        size="small"
                        type="number"
                        v-model.number="childProductArray[index].member_commission"
                        placeholder="输入客户推广佣金"
                        style="width:120px;"
                      >
                      </el-input>
                    </td>
                    <td>
                      <el-input
                        size="small"
                        type="number"
                        v-model.number="childProductArray[index].plumber_commission"
                        placeholder="输入水电工佣金"
                        style="width:120px;"
                      >
                      </el-input>
                    </td>
                    <td>
                      <el-input
                        size="small"
                        type="number"
                        v-model.number="childProductArray[index].stylist_commission"
                        placeholder="输入设计师佣金"
                        style="width:120px;"
                      >
                      </el-input>
                    </td>
                    <!-- <td>
                      <el-switch
                        v-model="childProductArray[index].isUse"
                        @change="(val) => {handleUserChange(index, val)}"
                      ></el-switch>
                    </td> -->
                  </tr>
                  <tr>
                    <td
                      colspan="8"
                      class="wh-foot"
                    >
                      <span class="label">批量设置：</span>
                      <template v-if="isSetListShow">
                        <el-button
                          @click="openBatch('market_price')"
                          size="mini"
                        >市场价</el-button>
                        <el-button
                          @click="openBatch('price')"
                          size="mini"
                        >销售价</el-button>
                        <el-button
                          @click="openBatch('group_price')"
                          size="mini"
                        >拼团价格</el-button>
                        <el-button
                          @click="openBatch('prepay_price')"
                          size="mini"
                        >预付定金</el-button>
                        <el-button
                          @click="openBatch('member_commission')"
                          size="mini"
                        >客户推广佣金</el-button>
                        <el-button
                          @click="openBatch('plumber_commission')"
                          size="mini"
                        >水电工佣金</el-button>
                        <el-button
                          @click="openBatch('stylist_commission')"
                          size="mini"
                        >设计师佣金</el-button>

                      </template>
                      <template v-else>
                        <el-input
                          size="mini"
                          style="width:200px;"
                          v-model.number="batchValue"
                          placeholder="输入要设置的数量"
type="number"
                        ></el-input>
                        <el-button
                          type="primary"
                          size="mini"
                          @click="setBatch"
                        ><i class="set-btn blue el-icon-check"></i></el-button>
                        <el-button
                          type="danger"
                          size="mini"
                          @click="cancelBatch"
                        ><i class="set-btn blue el-icon-close"></i></el-button>
                      </template>
                    </td>
                  </tr>
                </tbody>

              </table>
            </el-card>

            <!-- 数据格式 -->
            <el-card
              class="box-card mt"
              v-show="false"
            >
              <div
                slot="header"
                class="clearfix"
              >
                <span>数据格式</span>
              </div>
              <section>
                <div
                  v-for="(item, index) in childProductArray"
                  :key="index"
                >
                  {{ item }}
                  <el-divider></el-divider>
                </div>
              </section>
            </el-card>
          </div>
        </el-tab-pane>

        <el-tab-pane
          label="文本编辑器"
          name="third"
          v-if="tabShow[2]"
        >
          <veditor
            :value="temp.goods_text"
            :uploadUrl="uplUrl"
            @input="getGoodText"
          >

          </veditor>
          <!-- <quill-editor
            ref="myQuillEditor"
            v-model="temp.goods_text"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"
            @change="onEditorChange($event)"
          >
          </quill-editor>

          <el-upload class="upload-demo" :action="qnLocation" :before-upload='beforeUpload' :data="uploadData" :on-success='upScuccess'
            ref="upload" style="display:none">
            <el-button size="small" type="primary" id="imgInput" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="插入中,请稍候">点击上传</el-button>
          </el-upload> -->

        </el-tab-pane>
      </el-tabs>
    </el-form>
    <el-divider></el-divider>
    <div class="tc">
      <el-button
        type="primary"
        class="ml"
        @click="submit"
      >提交</el-button>
      <!-- <el-button>取消</el-button> -->
    </div>
  </div>
</template>

<script>
  // import 'quill/dist/quill.core.css'
  // import 'quill/dist/quill.snow.css'
  // import 'quill/dist/quill.bubble.css'
  // import {
  //   quillEditor
  // } from 'vue-quill-editor'
  // import {
  //   addQuillTitle,
  //   editorOption
  // } from '@/utils/quill-utils.js'

  import veditor from '@/components/configedQuill'
  import _ from "lodash";
  import Vue from 'vue'
  import api from '@/api/shopManage'
  import cityData from '@/utils/city'
  import globals from '@/utils/globals'
  // import waves from '@/directive/waves' // waves directive
  import {
    parseTime
  } from '@/utils'

  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import Tag from '@/components/Tag' // secondary package based on el-pagination
  import Cookies from 'js-cookie'
  // arr to obj, such as { CN : "China", US : "USA" }

  // 为Object添加一个原型方法，判断两个对象是否相等
  function objEquals(object1, object2) {
    // For the first loop, we only check for types
    for (let propName in object1) {
      // Check for inherited methods and properties - like .equals itself
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
      // Return false if the return value is different
      if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
        return false
        // Check instance type
      } else if (typeof object1[propName] !== typeof object2[propName]) {
        // Different types => not equal
        return false
      }
    }
    // Now a deeper check using other objects property names
    for (let propName in object2) {
      // We must check instances anyway, there may be a property that only exists in object2
      // I wonder, if remembering the checked values from the first loop would be faster or not
      if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
        return false
      } else if (typeof object1[propName] !== typeof object2[propName]) {
        return false
      }
      // If the property is inherited, do not check any more (it must be equa if both objects inherit it)
      if (!object1.hasOwnProperty(propName)) {
        continue
      }
      // Now the detail check and recursion
      // This returns the script back to the array comparing
      /** REQUIRES Array.equals**/
      if (object1[propName] instanceof Array && object2[propName] instanceof Array) {
        // recurse into the nested arrays
        if (objEquals(!object1[propName], object2[propName])) {
          return false
        }
      } else if (object1[propName] instanceof Object && object2[propName] instanceof Object) {
        // recurse into another objects
        // console.log("Recursing to compare ", this[propName],"with",object2[propName], " both named \""+propName+"\"");
        if (objEquals(!object1[propName], object2[propName])) {
          return false
        }
        // Normal value comparison for strings and numbers
      } else if (object1[propName] !== object2[propName]) {
        return false
      }
    }
    // If everything passed, let's say YES
    return true
  }

  export default {
    data() {
      return {
        tabShow: [true, true, true],
        basicEditType: '',
        editsData: {},
        // 文本编辑
        // editorOption,

        //规格编辑数据
        specificationStatus: false, // 显示规格列表
        // 规格
        specification: [],
        // 子规格
        childProductArray: [],
        // 用来存储要添加的规格属性
        addValues: [],
        // 默认商品编号
        defaultProductNo: 'PRODUCTNO_',
        // 批量设置相关
        isSetListShow: true,
        batchValue: '', // 批量设置所绑定的值
        currentType: '', // 要批量设置的类型
        cacheSpecification: [], // 缓存规格名称

        // 基本信息
        cateList: [],
        fileList: [],
        uplUrl: globals.curBaseUrl + '/upload',
        activeName: 'first',
        // modi有两种类型, add 与 edit
        modiType: 'add',
        temp: {
          type: '',
          is_spec: 2,
          is_group: '2',
          is_prepay: '2',
          goods_image: [],
          goods_text: '',
          goods_tag: [],
          goods_params: []
        },
        rules: {
          goods_name: [{
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }],
          market_price: [{
            required: true,
            message: '请输入市场价',
            trigger: 'blur'
          }],
          price: [{
            required: true,
            message: '请输入售价',
            trigger: 'blur'
          }],
        }
      }
    },
    components: {
      veditor,
      Tag
    },
    mounted() {
      // addQuillTitle();
      // // 为图片ICON绑定事件  getModule 为编辑器的内部属性
      // this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler)
    },

    computed: {
      // 所有sku的id
      stockSpecArr() {
        return this.childProductArray.map(item => item.childProductSpec)
      },
      f_isSpec: {
        get: function () {
          return this.temp.is_spec == 1
        },
        set: function (v) {
          this.temp.is_spec = v ? 1 : 2
        }
      },
    },
    created() {
      this.type = this.$route.meta['type']
      this.modiType = this.$route.query['operation'] || 'add'
      this.editsData.goods_id = this.$route.query['goods_id']

      if (this.modiType == 'edit') {
        this.handleEdit()
      }
      api.cascader_cache_class_list({
        type: 'basic'
      }).then((res) => {
        this.cateList = res.data
      })


    },
    methods: {
      hadleEditSpecData(data) {
        // let toSendData = _.cloneDeep(this.temp);
        let specs = _.cloneDeep(data.spec);
        let opts = _.cloneDeep(data.option_list);

        Object.keys(specs).forEach(function (key) {
          specs[key].name = specs[key].spec_name
          specs[key].value = specs[key].item_list
          delete specs[key].spec_name;
          delete specs[key].item_list;
        });

        Object.keys(opts).forEach(function (key) {
          opts[key].childProductSpec = opts[key].option_name_combine
          delete opts[key].option_name_combine;
        });

        let arr = []
        let arr2 = []
        specs.forEach(function (val, key) {
          arr.push(val.name)
          arr2.push(val.value.join(' '))
        });
        // 规格编辑
        // this.createData()
        this.createData(arr, arr2)

        this.specification = specs
        this.childProductArray = opts
        // return toSendData
      },
      handleEdit() {
        if (this.type === 'store') {
          api.factory_goods_detail({
            goods_id: this.editsData.goods_id
          }).then((res) => {
            this.temp = res.data
            this.temp.class_id = [this.temp.class_1, this.temp.class_2]
            this.temp.goods_tag = this.temp.goods_tag ? this.temp.goods_tag.split(',') : []
            this.temp.goods_params = this.temp.goods_params || []

            this.hadleEditSpecData(res.data)
          })
        } else if (this.type === 'basic') {
          api.basic_goods_detail({
            goods_id: this.editsData.goods_id
          }).then((res) => {
            this.temp = res.data
            this.temp.goods_tag = this.temp.goods_tag ? this.temp.goods_tag.split(',') : []
            this.temp.goods_params = this.temp.goods_params || []

            this.hadleEditSpecData(res.data)
          })
        }
      },
      // 文本编辑
      getGoodText(txt) {
        this.temp.goods_text = txt
      },
      onEditorBlur() {
        // 失去焦点事件
      },
      onEditorFocus() {
        // 获得焦点事件
      },
      onEditorChange() {
        // 内容改变事件
      },
      onEditorReady() {

      },
      // #region 规格编辑
      submit() {
        if (this.modiType === 'add') {
          api.store_goods_create(this.modiTosendData()).then((res) => {
            this.$message({
              message: res.info,
              type: '',
              duration: 1300,
              onClose: () => {
                if (res.code == 9999) {
                  this.$router.push('/goods-manage/selfrun-manage/list')
                }
              }

            })
            
          })
        } else {
          if (this.type === 'basic') {
            if (this.basicEditType === 'basicEdit') {
              api.basic_goods_edit(this.modiTosendData()).then((res) => {
                this.$message({
                  message: res.info,
                  type: '',
                  duration: 1300,
                  onClose: () => {
                    if (res.code == 9999) {
                      this.$router.push('/goods-manage/selfrun-manage/list')
                    }
                  }
                })
                
              })
            } else if (this.basicEditType === 'specEdit') {
              api.goods_items_edit(this.modiTosendData()).then((res) => {
                this.$message({
                  message: res.info,
                  type: '',
                  duration: 1300,
                  onClose: () => {
                    if (res.code == 9999) {
                      this.$router.push('/goods-manage/selfrun-manage/list')
                    }
                  }
                })
                
              })
            }
          } else if (this.type === 'store') {
            api.goods_store_edit(this.modiTosendData()).then((res) => {
              this.$message({
                message: res.info,
                type: '',
              })
            })
          }
        }
      },
      modiTosendData() {
        let toSendData = _.cloneDeep(this.temp);
        let specs = _.cloneDeep(this.specification);
        let opts = _.cloneDeep(this.childProductArray);

        Object.keys(specs).forEach(function (key) {
          specs[key].spec_name = specs[key].name;
          specs[key].item_list = specs[key].value;
          delete specs[key].name;
          delete specs[key].value;
        });

        for (let i = 0; i < opts.length; i++) {
          let elem = opts[i];
          let childSpec = elem.childProductSpec
          let arr = []
          for (const key in childSpec) {
            if (childSpec.hasOwnProperty(key)) {
              let elem = childSpec[key];
              arr.push(elem)
            }
          }
          elem.childProductSpec = arr
        }
        Object.keys(opts).forEach(function (key) {
          opts[key].option_name_combine = opts[key].childProductSpec;
          delete opts[key].childProductSpec;

          delete opts[key].childProductId
          delete opts[key].childProductNo
        });
        toSendData.class_id = toSendData.class_id && toSendData.class_id[1]
        toSendData = {
          ...toSendData,
          spec_list: specs,
          option_list: opts,
        }
        return toSendData
      },
      // 创建模拟数据
      createData(arr, arr2) {
        // const arr = ['颜色', '尺寸']
        // const arr2 = ['黑色 白色 蓝色', 's m xl']
        for (let i = 0; i < 2; i++) {
          // 添加数据
          this.addSpec()
          // 数据
          this.specification[i].name = arr[i]
          this.addValues[i] = arr2[i]
          // 缓存按钮键值
          this.cacheSpecification[i].status = false
          this.cacheSpecification[i].name = arr[i]
          // 构建
          this.addSpecTag(i)
        }
      },
      // 添加规格项目
      addSpec() {
        if (this.specification.length < 5) {
          this.cacheSpecification.push({
            status: true,
            name: ''
          })
          this.specification.push({
            name: '',
            value: []
          })
        }
      },
      // 修改状态
      updateSpec(index) {
        this.cacheSpecification[index].status = true
        this.cacheSpecification[index].name = this.specification[index].name
      },
      // 保存规格名
      saveSpec(index) {
        if (!this.cacheSpecification[index].name.trim()) {
          this.$message.error('名称不能为空，请注意修改')
          return
        }
        // 保存需要验证名称是否重复
        if (this.specification[index].name === this.cacheSpecification[index].name) {
          this.cacheSpecification[index].status = false
        } else {
          if (this.verifyRepeat(index)) {
            // 如果有重复的，禁止修改
            this.$message.error('名称重复，请注意修改')
          } else {
            this.specification[index].name = this.cacheSpecification[index].name
            this.cacheSpecification[index].status = false
          }
        }
      },
      // 删除规格项目
      delSpec(index) {
        this.specification.splice(index, 1)
        this.handleSpecChange('del')
      },
      verifyRepeat(index) {
        let flag = false
        this.specification.forEach((value, j) => {
          // 检查除了当前选项以外的值是否和新的值想等，如果相等，则禁止修改
          if (index !== j) {
            if (this.specification[j].name === this.cacheSpecification[index].name) {
              flag = true
            }
          }
        })
        return flag
      },
      // 添加规格属性
      addSpecTag(index) {
        let str = this.addValues[index] || ''
        if (!str.trim() || !this.cacheSpecification[index].name.trim()) {
          this.$message.error('名称不能为空，请注意修改')
          return
        } // 判空
        str = str.trim()
        let arr = str.split(/\s+/) // 使用空格分割成数组
        let newArr = this.specification[index].value.concat(arr)
        newArr = Array.from(new Set(newArr)) // 去重
        this.$set(this.specification[index], 'value', newArr)
        this.clearAddValues(index)
        this.handleSpecChange('add')
        this.specification[index].name = this.cacheSpecification[index].name
        this.cacheSpecification[index].status = false
      },
      // 删除规格属性
      delSpecTag(index, num) {
        this.specification[index].value.splice(num, 1)
        this.handleSpecChange('del')
      },
      // 清空 addValues
      clearAddValues(index) {
        this.$set(this.addValues, index, '')
      },
      /*
        根据传入的属性值，拿到相应规格的属性
        @params
          specIndex 规格项目在 advancedSpecification 中的序号
          index 所有属性在遍历时的序号
      */
      getSpecAttr(specIndex, index) {
        // 获取当前规格项目下的属性值
        const currentValues = this.specification[specIndex].value
        let indexCopy
        // 判断是否是最后一个规格项目
        if (this.specification[specIndex + 1] && this.specification[specIndex + 1].value.length) {
          indexCopy = index / this.countSum(specIndex + 1)
        } else {
          indexCopy = index
        }
        const i = Math.floor(indexCopy % currentValues.length)
        if (i.toString() !== 'NaN') {
          return currentValues[i]
        } else {
          return ''
        }
      },
      /*
        计算属性的乘积
        @params
          specIndex 规格项目在 advancedSpecification 中的序号
      */
      countSum(specIndex) {
        let num = 1
        this.specification.forEach((item, index) => {
          if (index >= specIndex && item.value.length) {
            num *= item.value.length
          }
        })
        return num
      },
      // 根据传入的条件，来判断是否显示该td
      showTd(specIndex, index) {
        // 如果当前项目下没有属性，则不显示
        if (!this.specification[specIndex]) {
          return false
          // 自己悟一下吧
        } else if (index % this.countSum(specIndex + 1) === 0) {
          return true
        } else {
          return false
        }
      },
      /**
       * [handleSpecChange 监听标签的变化,当添加标签时；求出每一行的hash id，再动态变更库存信息；当删除标签时，先清空已有库存信息，然后将原有库存信息暂存到stockCopy中，方便后面调用]
       * @param  {[string]} option ['add'|'del' 操作类型，添加或删除]
       * @return {[type]}        [description]
       */
      handleSpecChange(option) {
        const stockCopy = JSON.parse(JSON.stringify(this.childProductArray))
        if (option === 'del') {
          this.childProductArray = []
        }
        for (let i = 0; i < this.countSum(0); i++) {
          this.changeStock(option, i, stockCopy)
        }
      },
      /**
       * [根据规格，动态改变库存相关信息]
       * @param  {[string]} option    ['add'|'del' 操作类型，添加或删除]
       * @param  {[array]} stockCopy [库存信息的拷贝]
       * @return {[type]}           [description]
       */
      changeStock(option, index, stockCopy) {
        let childProduct = {
          childProductId: 0,
          childProductSpec: this.getChildProductSpec(index),
          childProductNo: this.defaultProductNo + index,
          market_price: 0,
          price: 0,
          member_commission: 0,
          plumber_commission: 0,
          stylist_commission: 0,
          // isUse: true
        }
        const spec = childProduct.childProductSpec
        if (option === 'add') {
          // 如果此id不存在，说明为新增属性，则向 childProductArray 中添加一条数据
          if (this.stockSpecArr.findIndex((item) => objEquals(spec, item)) === -1) {
            this.$set(this.childProductArray, index, childProduct)
          }
        } else if (option === 'del') {
          // 因为是删除操作，理论上所有数据都能从stockCopy中获取到
          let origin = ''
          stockCopy.forEach(item => {
            if (objEquals(spec, item.childProductSpec)) {
              origin = item
              return false
            }
          })
          this.childProductArray.push(origin || childProduct)
        }
      },
      // 获取childProductArray的childProductSpec属性
      getChildProductSpec(index) {
        let obj = {}
        this.specification.forEach((item, specIndex) => {
          obj[item.name] = this.getSpecAttr(specIndex, index)
        })
        return obj
      },
      // 监听规格启用操作
      handleUserChange(index, value) {
        // 启用规格时，生成不重复的商品编号；关闭规格时，清空商品编号
        if (value) {
          let No = this.makeProductNoNotRepet(index)
          this.$set(this.childProductArray[index], 'childProductNo', No)
        } else {
          this.$set(this.childProductArray[index], 'childProductNo', '')
        }
      },
      // 监听商品编号的blur事件
      handleNo(index) {
        // 1.当用户输入完商品编号时，判断是否重复，如有重复，则提示客户并自动修改为不重复的商品编号
        const value = this.childProductArray[index].childProductNo
        let isRepet
        this.childProductArray.forEach((item, i) => {
          if (item.childProductNo === value && i !== index) {
            isRepet = true
          }
        })
        if (isRepet) {
          this.$message({
            type: 'warning',
            message: '不允许输入重复的商品编号'
          })
          this.$set(this.childProductArray[index], 'childProductNo', this.makeProductNoNotRepet(index))
        }
      },
      // 生成不重复的商品编号
      makeProductNoNotRepet(index) {
        let No
        let i = index
        let isRepet = true
        while (isRepet) {
          No = this.defaultProductNo + i
          isRepet = this.isProductNoRepet(No)
          i++
        }
        return No
      },
      // 商品编号判重
      isProductNoRepet(No) {
        const result = this.childProductArray.findIndex((item) => {
          return item.childProductNo === No
        })
        return result > -1
      },
      // 打开设置框
      openBatch(type) {
        this.currentType = type
        this.isSetListShow = false
      },
      // 批量设置
      setBatch() {
        if (typeof this.batchValue === 'string') {
          this.$message({
            type: 'warning',
            message: '请输入正确的值'
          })
          return
        }
        this.childProductArray.forEach(item => {
          // if (item.isUse) {
          item[this.currentType] = this.batchValue
          // }
        })
        this.cancelBatch()
      },
      // 取消批量设置
      cancelBatch() {
        this.batchValue = ''
        this.currentType = ''
        this.isSetListShow = true
      },
      // #endregion 规格编辑

      // #region 基础信息
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
      openImg(item) {
        window.open(item)
      },
      deletePrevPic(index) {
        console.log('deletePrevPic');
        this.temp.goods_image.splice(index, 1)
      },
      handleUplSucc(res, file, fileList) {
        this.temp.goods_image.push(res.data[0].all_path)
      },
      handlePreview() {

      },
      handleRemove() {

      },
      beforeUpload(file) {
        console.log(file, 'file');
        var reg = /\.(png|jpg|gif|jpeg|webp)$/;
        // if (reg.test(str)) {

        // }
      },
      handleClick(tab, event) {
        console.log(tab, event);
      }
    },
    // #endregion 基础信息

  }
</script>

<style lang="scss">
  .page-goods-add {
    ._w200 {
      width: 200px;
    }

    .el-tabs__content {
      width: 80%;
    }

    ._prev-list-wra {
      ._del-btn {
        color: #fff;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        background-color: red;
        position: absolute;
        right: -10px;
        top: -10px;
        border-radius: 99px;
        cursor: pointer;
      }
    }

    .vue-sku {
      .spec-line {
        position: relative;

        .spec-deleted {
          position: absolute;
          right: 0;
          top: 0;
          display: none;
          cursor: pointer;
        }

        &:hover {
          .spec-deleted {
            display: inline;
          }
        }
      }
    }


    .ql-editor {
      line-height: normal !important;
      height: 500px;
    }

    .ql-snow .ql-tooltip[data-mode=link]::before {
      content: "请输入链接地址:";
    }

    .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
      border-right: 0px;
      content: '保存';
      padding-right: 0px;
    }

    .ql-snow .ql-tooltip[data-mode=video]::before {
      content: "请输入视频地址:";
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item::before {
      content: '14px';
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
      content: '10px';
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
      content: '18px';
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
      content: '32px';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item::before {
      content: '文本';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
      content: '标题1';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
      content: '标题2';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
      content: '标题3';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
      content: '标题4';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
      content: '标题5';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
      content: '标题6';
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item::before {
      content: '标准字体';
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
      content: '衬线字体';
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
      content: '等宽字体';
    }

  }
</style>