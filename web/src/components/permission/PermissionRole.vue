<template>
  <table-pagination :table-data="tableData"
                    :total="100"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
  >
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
          <el-button type="primary" @click="handleCreateUser">{{ locale.create }}</el-button>
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
        <el-button type="primary"
                   @click="handleEdit(scope.$index,scope.row)"
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
        <el-button type="danger"
                   @click="handleDel"
        >
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
        <el-button type="warning"
                   @click="handleSetting"
        >
          <el-icon>
            <Setting></Setting>
          </el-icon>
        </el-button>
      </el-tooltip>
    </template>
  </table-pagination>
  <form-dialog :form-data="formData" ref="formDialogRef"></form-dialog>
  <tree-dialog :data="data" ref="treeDialogRef" :title="locale.permissionRoleSetting"
               @confirm="handlePermissionConfirm"

  ></tree-dialog>
</template>

<script setup lang="ts">
import TablePagination from '../common/TablePagination.vue';
import type {FormData} from '../common/FormDialog.vue';
//@ts-ignore
import TreeDialog from '../common/TreeDialog.vue';
//@ts-ignore
import FormDialog from '../common/FormDialog.vue';
import type {TableData} from "@/components/common/TablePagination.vue";
import {inject, ref} from "vue";
import type {Locale} from "@/locale/zh-cn";
import {Delete, Edit, Setting} from '@element-plus/icons-vue';
import {Types} from "@/components/common";
import type {TreeNode, CheckedNode} from "@/components/common/TreeDialog.vue";
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
const formData: FormData = {
  items: [
    {
      type: Types.input,
      prop: 'roleName',
      label: locale?.roleName
    }, {

      type: Types.input,
      prop: 'roleDes',
      label: locale?.roleDes
    }

  ]
}

const formDialogRef = ref<InstanceType<typeof FormDialog> | null>(null);
const treeDialogRef = ref<InstanceType<typeof TreeDialog> | null>(null);
const handleSizeChange = (size: number) => {

  console.log('size change', size);
}
const handleCurrentChange = (current: number) => {
  console.log('current change', current);
}

const handleCreateUser = () => {
  console.log('handle create user');
  formDialogRef.value.showDialog();
}

const handleEdit = (index:number,row:any) => {

  formDialogRef.value.showDialog(row)
}
const handleDel = () => {

}

const handleSetting = () => {


  treeDialogRef.value.showDialog(checkedNodes);

}

const handlePermissionConfirm = (permissions: CheckedNode[]) => {

  console.log('permission', permissions)
}

const checkedNodes = [5, 9];
const data = [
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 4,
        label: 'Level two 1-1',
        children: [
          {
            id: 9,
            label: 'Level three 1-1-1',
          },
          {
            id: 10,
            label: 'Level three 1-1-2',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: 'Level one 2',
    children: [
      {
        id: 5,
        label: 'Level two 2-1',
      },
      {
        id: 6,
        label: 'Level two 2-2',
      },
    ],
  },
  {
    id: 3,
    label: 'Level one 3',
    children: [
      {
        id: 7,
        label: 'Level two 3-1',
      },
      {
        id: 8,
        label: 'Level two 3-2',
      },
    ],
  },
]
</script>

<style scoped>

.permission-role__header {
  margin: 10px 0;
}
</style>