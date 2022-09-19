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
            <el-col :span="14">
              <el-input v-model="formData.verificationCode"/>
            </el-col>
            <el-col :span="6">
              <img src="../../assets/logo.svg" alt="123" height="24">
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
          <el-form-item :label="locale.password2" prop="password">
            <el-input type="password" v-model="otherFormData.password2"/>
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
              <el-input v-model="otherFormData.dynamicCode"/>
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
    <el-button type="primary">
      {{ locale.singUp }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
// const props = withDefaults(defineProps<{}>(), {})
import {inject, reactive, ref} from "vue";
import type {Locale} from "@/locale/zh-cn";
import useRules from "@/rules";

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

const otherFormData = reactive({
  account: '',
  password: '',
  password2: '',
  dynamicCode: ''
})

const handleClick = () => {

}


</script>

<style scoped>

.sing-in__button {
  margin-top: 14px;
  display: flex;
  justify-content: center;
}

</style>