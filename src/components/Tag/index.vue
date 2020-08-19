<!-- home -->
<template>
  <div class="comp-tag">
    <el-tag
      :key="index"
      v-for="(tag, index) in tagList"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{tag}}
    </el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="handleInputConfirm"
    >
    </el-input>
    <el-button
      v-else
      class="button-new-tag"
      size="small"
      @click="showInput"
    >+ 新标签</el-button>
  </div>
</template>

<script>
  // import TableList from '@/components/TableList'
  import _ from "lodash";
  import Vue from 'vue'
  import api from '@/api/shopManage'
  import globals from '@/utils/globals'

  export default {
    name: 'Tag',
    data() {
      return {
        inputVisible: false,
        inputValue: ''
      }

    },
    props: {
      // 以引用形式使用
      tagList: {
        required: true,
        type: Array,
        // 对象或数组默认值必须从一个工厂函数获取
        default: function () {
          return []
        }
      }
    },
    components: {

    },
    computed: {},

    mounted() {},

    methods: {
      handleClose(tag) {
        this.tagList.splice(this.tagList.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.tagList.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';

        // this.$emit('onUpdateTags', this.tagList)
      }
    }
  }
</script>
<style
  lang="scss"
  scoped
>
  .comp-tag {
    .el-tag+.el-tag {
      margin-left: 10px;
    }

    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }

    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
  }
</style>