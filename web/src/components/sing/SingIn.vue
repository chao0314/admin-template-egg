<template>
  <el-tabs v-model="activeName">
    <el-tab-pane :label="locale.username" name="username">
      <el-form :rules="rules" ref="formRef"
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
        <el-form-item :label="locale.verificationCode" prop="verificationCode">
          <el-row :gutter="4">
            <el-col :span="14">
              <el-input v-model="formData.verificationCode"/>
            </el-col>
            <el-col :span="6">
              <captcha :src="captchaRef" @captcha="handleCaptcha"></captcha>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane :label="locale.emailOrPhone" name="emailOrPhone">
      <el-form :rules="rules" ref="otherFormRef"
               label-position="left"
               label-width="100px"
               :model="otherFormData"
               style="max-width: 460px"
      >
        <el-form-item :label="locale.account" prop="account">
          <el-input v-model="otherFormData.account"/>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="mode" label="model control">
            <el-radio-button label="password">{{ locale?.password }}</el-radio-button>
            <el-radio-button label="dynamicCode">{{ locale?.dynamicCode }}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <template v-if="mode==='password'">
          <el-form-item :label="locale.password" prop="password">
            <el-input type="password" v-model="otherFormData.password"/>
          </el-form-item>
          <el-form-item :label="locale.verificationCode" prop="verificationCode">
            <el-row :gutter="4">
              <el-col :span="14">
                <el-input v-model="otherFormData.verificationCode"/>
              </el-col>
              <el-col :span="6">
                <captcha :src="captchaRef" @captcha="handleCaptcha"></captcha>
              </el-col>
            </el-row>
          </el-form-item>
        </template>
        <el-form-item v-else :label="locale.dynamicCode" prop="dynamicCode">
          <el-row :gutter="4">
            <el-col :span="14">
              <el-input v-model="otherFormData.dynamicCode"/>
            </el-col>
            <el-col :span="6">
              <dynamic-code :countdown="300" @send-code="handleSendCode"></dynamic-code>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
  <el-divider class="sing-in__divider">{{ locale?.otherSingIn }}</el-divider>
  <el-row justify="center">
    <img src="../../assets/wx.png" alt="" class="sing-in__icon">
    <img src="../../assets/github.png" alt="" class="sing-in__icon">
  </el-row>
  <div class="sing-in__button">
    <el-button type="primary" @click="handleSingIn">
      {{ locale.singIn }}
    </el-button>
  </div>
  <p class="sing-up" @click="handleToSingUp">去注册</p>
</template>

<script setup lang="ts">
import {inject, reactive, ref, watch} from "vue";
import type {Locale} from "@/locale/zh-cn";
// const props = withDefaults(defineProps<{}>(), {});
import useRules from "@/rules/index";
import {useHomeStore} from "@/stores/home";
import Captcha from '../common/Captcha.vue';
import DynamicCode from '../common/DynamicCode.vue';
import {ElMessage, FormInstance} from "element-plus";
import router from "@/router";

const rules = useRules();
const locale = inject<Locale>('locale');
const homeStore = useHomeStore();
const activeName = ref('username');
const mode = ref('password');
const captchaRef = ref('')
const formRef = ref<FormInstance>();
const otherFormRef = ref<FormInstance>();

const formData = reactive({
  username: '',
  password: '',
  verificationCode: ''
});

const otherFormData = reactive({
  account: '',
  password: '',
  dynamicCode: '',
  verificationCode: ''
});

watch(activeName, (newVal) => {

  captchaRef.value = '';

})

const handleCaptcha = () => {

  homeStore.getCaptchaAction().then(({data}) => captchaRef.value = data);
}


const handleSendCode = () => {

  const {account} = otherFormData;

  if (account) {
    const isPhone = /^(\+86|86)?\d{11}$/.test(account);
    if (isPhone) homeStore.sendSmsAction({phone: account});
    else homeStore.sendMailAction({to: account});

  }

}

const handleSingIn = () => {

  if (activeName.value === 'username') {

    formRef.value?.validate(async isValid => {

      if (isValid) {

        const {username, password, verificationCode} = formData;

        const {data} = await homeStore.verifyCaptchaAction({captcha: verificationCode});

        if (data) {

          homeStore.singInAction({username, password}).then((data) => router.push('/'));

        } else ElMessage({
          type: 'error',
          message: locale?.captchaError,
          offset: 100
        })


      }


    })

  } else {

    otherFormRef.value?.validate(async isValid => {

      if (isValid) {

        const {account, password, verificationCode, dynamicCode: code} = otherFormData;
        const isPhone = /^(\+86|86)?\d{11}$/.test(account);

        if (mode.value === 'password') {

          const {data} = await homeStore.verifyCaptchaAction({captcha: verificationCode});

          if (data) {

            if (isPhone) {

              homeStore.singInPhoneAction({phone: account, password}).then(() => router.push('/'));

            } else {

              homeStore.singInEmailAction({email: account, password}).then(() => router.push('/'));

            }


          }


        } else {

          // dynamic code

          if (isPhone) {

            homeStore.singInPhoneAction({phone: account, password, code}).then(() => router.push('/'));

          } else {

            homeStore.singInEmailAction({email: account, password, code}).then(() => router.push('/'));

          }

        }


      }


    })


  }

}

const handleToSingUp = () => {

  router.push('/sing/up');
}

</script>

<style scoped>

.sing-in__button {
  margin-top: 14px;
  display: flex;
  justify-content: center;
}

.sing-in__divider:deep(.el-divider__text ) {
  font-size: 12px;
}

.sing-in__icon {

  cursor: pointer;
  margin-right: 5px;
}


.sing-up {

  margin: 2px 0 0;
  text-align: center;
  font-size: 12px;
  cursor: pointer;

}

</style>