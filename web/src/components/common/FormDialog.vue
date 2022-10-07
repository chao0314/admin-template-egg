<template>
  <el-dialog width="35%" top="10vh"
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
        <slot :form="form"></slot>
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
import {Types, Mode,FormData} from "@/components/common/index";
import {inject, reactive, ref, toRaw} from 'vue'

const props = withDefaults(defineProps<{
  formData: FormData
}>(), {})


const emits = defineEmits<{
  (e: 'confirm', payload: Record<string, any>): void

}>()
const locale = inject<Locale>('locale');
const dialogVisibleRef = ref(false);
let mode = ref(Mode.create);

const form = reactive<Record<string, any>>({});


const handleConfirm = () => {

  dialogVisibleRef.value = false;
  console.log(toRaw(form));
  emits('confirm', toRaw(form));
}

defineExpose<{

  showDialog(initData?: Record<string, any>): void

}>({
  showDialog: (initData?: Record<string, any>) => {


    if (initData) mode.value = Mode.edit;

    props.formData.items.forEach(item => {
      //todo...初始化 checkbox可能有数组等,还需完善
      form[item.prop] = initData === void 0 ? '' : initData[item.prop]
    });

    dialogVisibleRef.value = true;

  }
})

</script>

<style scoped>

</style>