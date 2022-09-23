<template>
  <el-dialog width="40%" top="10vh"
             v-model="dialogVisibleRef"
             :title="mode === Mode.create?locale.create:locale.edit">
    <el-form :model="form"
             :rules="formData.rules"
             label-width="120px"
             label-position="top"
    >

      <template v-for="item in formData.items">

        <el-form-item :prop="item.prop" :label="item.label">
          <el-input v-if="item.type === Types.input"
                    v-model="form[item.prop]"
                    v-bind="item.props">
          </el-input>
          <el-select v-else-if="item.type === Types.select"
                     v-model="form[item.prop]"
                     v-bind="item.props"
          >
            <el-option v-for="option in item.options"
                       :label="option.label"
                       :value="option.value"/>

          </el-select>
        </el-form-item>

      </template>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisibleRef = false">{{ locale.cancel }}</el-button>
        <el-button type="primary" @click="handleConfirm"
        >{{ locale.confirm }}</el-button
        >
      </span>
    </template>
  </el-dialog>

</template>

<script setup lang="ts">
import type {Locale} from "@/locale/zh-cn";
import type {FormRules} from "element-plus";
import type {Types as ItemTypes} from "@/components/common/index";
import {Types} from "@/components/common/index";

const props = withDefaults(defineProps<{
  formData: FormData
}>(), {})
import {inject, reactive, ref, toRaw} from 'vue'


const enum Mode {
  create = 'create',
  edit = 'edit'
}

export type Item = {
  type: ItemTypes,
  prop: string,
  label?: string,
  options?: {
    value: string,
    label: string
  } [],
  props?: Record<string, any>
}

export type FormData = {
  rules?: FormRules,
  items: Item[],
  data?: Record<string, any>
}

const locale = inject<Locale>('locale');
const dialogVisibleRef = ref(false);
let mode = ref(Mode.create);

const form = reactive<Record<string, any>>({});

const handleConfirm = () => {

  dialogVisibleRef.value = false;
  console.log(toRaw(form));
}

defineExpose({
  showDialog: (initData?: Record<string, any>) => {


    if (initData === void 0) {

      props.formData.items.forEach(item => {
        //todo...初始化 可能有数组等
        form[item.prop] = ''
      });

    } else {
      mode.value = Mode.edit;
      Object.assign(form, initData);
    }

    dialogVisibleRef.value = true;

  }
})

const onSubmit = () => {
  console.log('submit!')
}
</script>

<style scoped>

</style>