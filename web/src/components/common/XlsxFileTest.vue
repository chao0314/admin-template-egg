<template>

  <form enctype="multipart/form-data">
    <input type="file" name="file" ref="inputDomRef">
  </form>
  <el-button @click="handleFrontExport">前端导出</el-button>
  <el-button @click="handleFrontImport">前端导入</el-button>
</template>

<script setup lang="ts">
import {exportXlsxFile, importXlsxFile} from "@/utils";

const props = withDefaults(defineProps<{
  columns?: { value: string, label: string }[],
  rows?: any[][]
}>(), {
  columns: () => [{value: 'name', label: '账户'}, {value: 'email', label: '邮箱'}],
  rows: () => [['wzc', 'zhichao0314@126.com']]
});
import {ref} from "vue";

const inputDomRef = ref<HTMLInputElement>();

const handleFrontImport = () => {

  const files = inputDomRef.value?.files;

  if (files && files[0]) importXlsxFile(files[0]);
}


const handleFrontExport = () => {


  exportXlsxFile(props.columns, props.rows);

}
</script>

<style scoped>

</style>