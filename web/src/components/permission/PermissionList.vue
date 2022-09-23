<template>

  <table-pagination :table-data="tableData">
    <template #header>

      <el-row :gutter="4" class="permission-list__header">
        <el-col :span="3">
          <el-select v-model="value" :placeholder="locale.select">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="14">
          <el-input v-model="input" :placeholder="locale.keyword" clearable/>
        </el-col>
        <el-col :span="2">
          <el-button type="primary">
            {{ locale.query }}
          </el-button>
        </el-col>
        <el-col :span="1" :offset="4">
          <el-button type="primary">
            {{ locale.create }}
          </el-button>
        </el-col>
      </el-row>

    </template>
    <template #permissionLevel="{row}">
      <el-tag :type="types[row.permissionLevel-1]">{{ row.permissionLevel }}级</el-tag>
    </template>
    <template #state="{row}">
      <el-switch
          v-model="row.state"
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
    </template>
  </table-pagination>
</template>

<script setup lang="ts">
import TablePagination from '../common/TablePagination.vue';
import {inject, ref} from "vue";
import type {Locale} from "@/locale/zh-cn";
import {Edit, Delete} from '@element-plus/icons-vue';

const types = ['danger', 'warning', 'success']
const locale = inject<Locale>('locale');
// const props = withDefaults(defineProps<{}>(), {})

const tableData = {

  columns: [
    {
      prop: 'permissionName',
      label: locale?.permissionName
    },
    {
      prop: 'permissionDes',
      label: locale?.permissionDes
    },
    {
      prop: 'permissionLevel',
      label: locale?.permissionLevel,
      slotName: 'permissionLevel'
    },
    {
      prop: 'state',
      label: locale?.state,
      slotName: 'state'
    },
    {
      prop: 'operation',
      label: locale?.operation,
      slotName: "operation"
    }
  ],
  data: [
    {
      permissionName: 'permission name',
      permissionDes: 'permission des',
      permissionLevel: '1',
      state: true,
      operation: 'del edit'
    },
    {
      permissionName: 'permission name',
      permissionDes: 'permission des',
      permissionLevel: '2',
      state: false,
      operation: 'del edit'
    },
    {
      permissionName: 'permission name',
      permissionDes: 'permission des',
      permissionLevel: '3',
      state: true,
      operation: 'del edit'
    }
  ]
}

const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]

const value = ref('');
const input = ref('');
</script>

<style scoped>

.permission-list__header {
  margin: 10px 0;
}
</style>