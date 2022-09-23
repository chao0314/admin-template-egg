<template>
  <table-pagination :table-data="tableData">
    <template #header>
      <el-row :gutter="2"
              class="permission-role__header">
        <el-col :span="16">
          <el-input v-model="input" :placeholder="locale.keyword" clearable/>
        </el-col>
        <el-col :span="1">
          <el-button type="primary">{{ locale.query }}</el-button>
        </el-col>
        <el-col :span="1" :offset="6">
          <el-button type="primary">{{ locale.create }}</el-button>
        </el-col>
      </el-row>
    </template>
    <template #state="scope">
      <el-switch
          v-model="scope.row.state"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
      />
    </template>
    <template #operation="scope">
      <el-tooltip
          effect="dark"
          :content="locale.edit"
          placement="top"
      >
        <el-button type="primary">
          <el-icon>
            <Edit></Edit>
          </el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip
          effect="dark"
          :content="locale.del"
          placement="top"
      >
        <el-button type="danger">
          <el-icon>
            <Delete></Delete>
          </el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip
          effect="dark"
          :content="locale.permissionRoleSetting"
          placement="top"
      >
        <el-button type="warning">
          <el-icon>
            <Setting></Setting>
          </el-icon>
        </el-button>
      </el-tooltip>
    </template>
  </table-pagination>
</template>

<script setup lang="ts">
import TablePagination from '../common/TablePagination.vue';
import type {TableData} from "@/components/common/TablePagination.vue";
import {ref, inject} from "vue";
import type {Locale} from "@/locale/zh-cn";
import {Edit, Delete, Setting} from '@element-plus/icons-vue';
// const props = withDefaults(defineProps<{}>(), {})
const locale = inject<Locale>('locale');
const input = ref('');
const tableData: TableData = {
  showIndex: true,
  columns: [{
    prop: 'roleName',
    label: locale?.roleName
  }, {
    prop: 'roleDes',
    label: locale?.roleDes
  }, {
    prop: 'state',
    label: locale?.state,
    slotName: 'state'
  }, {
    prop: 'operation',
    label: locale?.operation,
    slotName: 'operation'
  }],
  data: [
    {
      roleName: 'role name',
      roleDes: 'role des',
      state: 'sate',
      operation: 'del edit'

    },
    {
      roleName: 'role name',
      roleDes: 'role des',
      state: true,
      operation: 'del edit'

    },
    {
      roleName: 'role name',
      roleDes: 'role des',
      state: 'sate',
      operation: 'del edit'

    }
  ]

}
</script>

<style scoped>

.permission-role__header {
  margin: 10px 0;
}
</style>