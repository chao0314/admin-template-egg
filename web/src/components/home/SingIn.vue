<template>
  <el-tabs v-model="activeName" @tab-click="handleClick" class="demo">
    <el-tab-pane :label="locale.username" name="username">
      <el-form :rules="rules"
          label-position="left"
          label-width="100px"
          :model="formData"
          style="max-width: 460px"
      >
        <el-form-item :label="locale.username" prop="username">
          <el-input v-model="formData.username"/>
        </el-form-item>
        <el-form-item :label="locale.password" prop="password">
          <el-input type="password" v-model="formData.password"/>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane :label="locale.emailOrPhone" name="emailOrPhone">
      email or phone
    </el-tab-pane>
  </el-tabs>
<div  class="sing-in__button">
  <el-button type="primary">
    {{locale.singIn}}
  </el-button>
</div>
</template>

<script setup lang="ts">
import {inject, reactive, ref} from "vue";
import type {FormRules, TabsPaneContext} from "element-plus";
import type {Locale} from "@/locale/zh-cn";

// const props = withDefaults(defineProps<{}>(), {})
const locale = inject<Locale>('locale');
const activeName = ref('username');
const handleClick = (tab: TabsPaneContext, event: Event) => {

  console.log(tab, event)
};

const formData = reactive({
  username: '',
  password: ''
});

const rules: FormRules = {
  username: {
    type: 'string',
    required: true,
    message: locale?.checkUsername
  },
  password: {
    type: "string",
    required: true,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\w{6,10}$/g,
    message:locale?.checkPassword

  }

}
</script>

<style scoped>
.demo {
  background: pink;
}
.sing-in__button{
  margin-top: 10px;
  display: flex;
  justify-content: center;
}


</style>