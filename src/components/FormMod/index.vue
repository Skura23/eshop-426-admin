<!-- home -->
<template>
  <div class="">
    <el-form
      ref="form"
      label-width="120px"
      :rules="rules"
    >
      <!-- <template v-if=""></template> -->
      <el-form-item
        :label="val.label"
        v-for="(val, name, index) in configList"
        :prop="name"
        :key="index"
      >
        <template v-if="!val.slot">
          <el-input
            v-model="formList[name]"
            v-if="!val.type||val.type=='input'"
            v-bind="val.configData"
            placeholder=""
          ></el-input>

          <el-radio-group
            v-model="formList[name]"
            v-if="val.type=='radio'"
            v-bind="val.configData"
          >
            <el-radio
              :label="item.value"
              v-for="(item, index) in val.opts"
              :key="index"
            >{{item.label}}</el-radio>
          </el-radio-group>

          <el-select
            v-model="formList[name]"
            v-bind="val.configData"
            v-if="val.type=='select'"
          >
            <el-option
              v-for="(item, index) in val.opts"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </template>
        <slot
          :name="val.slot"
          v-if="val.slot"
          :val="formList"
          :config='val'
          :datakey='name'
        ></slot>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('form')"
        >提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    name: 'FormMod',
    props: {
      // {
      //   key: val
      // }
      formList: {
        type: Object,
        required: true,
      },
      // 数据格式:
      // {
      //   key:{
      //      //表单类型
      //     type: 'radio',
      //     opts:[{
      //       value: '',
      //       label: '',
      //     }],
      //     label: '时间',
      //     // 提示
      //     tip: '',
      //     // 插槽名
      //     slot: '',
      //     // 表单项配置
      //     configData:{}
      //   }
      // }
      configList: {
        type: Object,
        required: true,
      },
      rules: {
        type: Object,
      }
    },
    data() {
      return {
        l_formList: {}
      }
    },

    computed: {

    },
    watch: {
      // formList: {
      //   deep: true,
      //   handler(newval, oldval) {
      //     console.log('watch formList');
      //     this.l_formList = _.cloneDeep(newval)
      //   }
      // }
    },
    mounted() {},

    methods: {
      // deepCloneData() {
      //   return _.cloneDeep(this.formList)
      // },
      submitForm(formName) {
        this.$emit('submit', this.formList)

        // this.$refs[formName].validate((valid) => {
        //   if (valid) {
        //     // alert('submit!');
        //   } else {
        //     console.log('error submit!!');
        //     return false;
        //   }
        // });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style
  lang="scss"
  scoped
>
  .app-container {}
</style>