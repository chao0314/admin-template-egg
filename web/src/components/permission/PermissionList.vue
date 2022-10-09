<template>

  <table-pagination :table-data="tableData"
                    :total="100"
  >
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
          <el-button type="primary"
                     @click="handleCreatePermission"
          >
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
        <el-button type="primary"
                   @click="handleEditPermission(scope.$index,scope.row)"
        >
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
  <form-dialog :form-data="form" ref="permissionCreateDialogRef">
    <template #default="scope">
      <!--      {{ scope.form }}-->
      <el-form-item :label="locale.requestMethod" :disabled="scope.form.permissionType !==2">
        <el-select v-model="requestMethod">
          <el-option v-for="option in options"
                     :key="option.label"
                     :label="option.label"
                     :value="option.value"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="locale.permissionParent" :disabled="scope.form.permissionLevel ===0">
        <el-select v-model="permissionParent">
          <el-option v-for="option in options"
                     :key="option.label"
                     :label="option.label"
                     :value="option.value"/>
        </el-select>
      </el-form-item>
    </template>

  </form-dialog>
</template>

<script setup lang="ts">
import TablePagination from '../common/TablePagination.vue';
import {FormData} from "@/components/common";
//@ts-ignore
import FormDialog from '../common/FormDialog.vue';
import {inject, reactive, ref} from "vue";
import type {Locale} from "@/locale/zh-cn";
import {Delete, Edit} from '@element-plus/icons-vue';
import {Types} from "@/components/common";

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
      permissionLevel: 1,
      state: true,
      operation: 'del edit'
    },
    {
      permissionName: 'permission name',
      permissionDes: 'permission des',
      permissionLevel: 2,
      state: false,
      operation: 'del edit'
    },
    {
      permissionName: 'permission name',
      permissionDes: 'permission des',
      permissionLevel: 3,
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
  }
]

const form: FormData = {

  items: [
    {
      type: Types.input,
      prop: 'permissionName',
      label: locale?.permissionName
    },
    {

      type: Types.input,
      prop: 'permissionDes',
      label: locale?.permissionDes

    },
    {
      type: Types.select,
      prop: 'permissionType',
      label: locale?.permissionType,
      //系统初始化时 参数表设置
      options: [
        {
          label: '菜单权限',
          value: '菜单权限'
        },
        {
          label: '路由权限',
          value: '路由权限'
        }, {
          label: '数据权限',
          value: '数据权限'
        }
      ]

    },
    {
      type: Types.select,
      prop: 'permissionLevel',
      label: locale?.permissionLevel,
      options: [
        {label: '一级权限', value: 1},
        {label: '二级权限', value: 2},
        {label: '三级权限', value: 3}
      ]
    },
    {

      type: Types.input,
      prop: 'permissionPath',
      label: locale?.permissionPath
    }


  ]

}
const value = ref('');
const input = ref('');

const requestMethod = reactive({label: '', value: ''});
const permissionParent = reactive({label: '', value: ''});

const permissionCreateDialogRef = ref<InstanceType<typeof FormDialog> | null>(null);
const handleCreatePermission = () => {

  console.log('handle create permission')
  permissionCreateDialogRef.value.showDialog()
}

const handleEditPermission = (index: number, row: any) => {

  console.log('handle edit permission', index, row)
  permissionCreateDialogRef.value.showDialog(row)
}
</script>

<style scoped>

.permission-list__header {
  margin: 10px 0;
}
</style>