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
              <el-button type="primary" plain>60</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
  <el-divider class="sing-in__divider">{{ locale?.otherSingIn }}</el-divider>
  <el-row justify="center">
    <img src="../../assets/wx.png" alt="" class="sing-in__wx">
  </el-row>
  <div class="sing-in__button">
    <el-button type="primary">
      {{ locale.singIn }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import {inject, reactive, ref} from "vue";
import type {FormRules, TabsPaneContext} from "element-plus";
import type {Locale} from "@/locale/zh-cn";
// const props = withDefaults(defineProps<{}>(), {});
import useRules from "@/rules/index";

const rules = useRules();
const locale = inject<Locale>('locale');
const activeName = ref('username');
const handleClick = (tab: TabsPaneContext, event: Event) => {

  console.log(tab, event)
};

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

const mode = ref('password')

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

.sing-in__wx {

  cursor: pointer;
}

</style>