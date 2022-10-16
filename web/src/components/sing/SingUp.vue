<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
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
        <el-form-item :label="locale.password2" prop="password2">
          <el-input type="password" v-model="formData.password2"/>
        </el-form-item>
        <el-form-item :label="locale.verificationCode" prop="verificationCode">
          <el-row :gutter="4">
            <el-col :span="10">
              <el-input v-model="formData.verificationCode"/>
            </el-col>
            <el-col :span="10">
              <captcha :src="captchaRef" @captcha="handleCaptcha"></captcha>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane :label="locale.emailOrPhone" name="emailOrPhone">
      <el-form :rules="rules"
               label-position="left"
               label-width="100px"
               :model="formData"
               style="max-width: 460px"
      >
        <el-form-item :label="locale.account" prop="account">
          <el-input v-model="emailOrPhoneFromData.account"/>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="mode" label="model control">
            <el-radio-button label="password">{{ locale?.password }}</el-radio-button>
            <el-radio-button label="dynamicCode">{{ locale?.dynamicCode }}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <template v-if="mode==='password'">
          <el-form-item :label="locale.password" prop="password">
            <el-input type="password" v-model="emailOrPhoneFromData.password"/>
          </el-form-item>
          <el-form-item :label="locale.password2" prop="password">
            <el-input type="password" v-model="emailOrPhoneFromData.password2"/>
          </el-form-item>
          <el-form-item :label="locale.verificationCode" prop="verificationCode">
            <el-row :gutter="4">
              <el-col :span="14">
                <el-input v-model="formData.verificationCode"/>
              </el-col>
              <el-col :span="6">
                <img src="../../assets/logo.svg" alt="123" height="24">
              </el-col>
            </el-row>
          </el-form-item>
        </template>
        <el-form-item v-else :label="locale.dynamicCode" prop="dynamicCode">
          <el-row :gutter="4">
            <el-col :span="14">
              <el-input v-model="emailOrPhoneFromData.dynamicCode"/>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" plain>发送/60</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
  <div class="sing-in__button">
    <el-button type="primary" @click="handleSingUp">
      {{ locale.singUp }}
    </el-button>
  </div>

</template>

<script setup lang="ts">
// const props = withDefaults(defineProps<{}>(), {})
import {inject, onMounted, reactive, ref} from "vue";
import type {Locale} from "@/locale/zh-cn";
import useRules from "@/rules";

import {useHomeStore} from "@/stores/home";
import Captcha from '../common/Captcha.vue';

const homeStore = useHomeStore();
const rules = useRules();
const locale = inject<Locale>('locale');
const activeName = 'username';
const mode = ref('password');
const formData = reactive({
  username: '',
  password: '',
  password2: '',
  verificationCode: ''
})

const emailOrPhoneFromData = reactive({
  account: '',
  password: '',
  password2: '',
  dynamicCode: ''
})

const handleClick = () => {

}


const handleSingUp = () => {
  console.log('sing up');
  //
  // homeStore.getCaptchaAction().then(data=>console.log(data))

}

const captchaRef = ref('');

const handleCaptcha = () => homeStore.getCaptchaAction().then(({data}) => captchaRef.value = data);


</script>

<style scoped>

.sing-in__button {
  margin-top: 14px;
  display: flex;
  justify-content: center;
}

</style>