<template>
  <table-pagination :table-data="tableData">
    <template #operation="scope">
      <p>
        {{ scope.row }}
      </p>
    </template>
  </table-pagination>
</template>

<script setup lang="ts">
import TablePagination from '../common/TablePagination.vue';
// const props = withDefaults(defineProps<{}>(), {})

const tableData = {

  columns: [
    {
      prop: 'name',
      label: '姓名'
    },
    {
      prop: 'operation',
      label: '操作',
      slotName: "operation"
    }
  ],
  data: [

    {
      "name": 'hello',
      "operation": 'del edit'
    },
    {
      "name": 'hello1',
      "operation": 'del edit1'
    }, {
      "name": 'hello2',
      "operation": 'del edit2'
    }
  ]
}
</script>

<style scoped>

</style>