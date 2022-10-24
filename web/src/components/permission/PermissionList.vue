<template>

  <table-pagination :table-data="tableData"
                    :total="totalRef"
  >
    <template #header>
      <el-row :gutter="4" class="permission-list__header">
        <el-col :span="3">
          <el-select v-model="filter.type" :placeholder="locale.permissionType" clearable>
            <el-option
                v-for="item in permTypeOptionsRef"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="14">
          <el-input v-model="filter.keyword" :placeholder="locale.keyword" clearable/>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="handleQueryPermissions">
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
      <el-tag :type="types[row.level-1]">{{ row.level }}级</el-tag>
    </template>
    <template #state="{row}">
      <el-switch @change="handleSwitchChange(row)"
                 v-if="row.level!==0"
                 v-model="row.state"
                 :active-value="1"
                 :inactive-value="0"
                 style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
      />
      <span v-else></span>
    </template>
    <template #operation="scope">
      <el-tooltip v-if="scope.row.operation.includes('edit')&&scope.row.level !==0"
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
      <span v-else></span>
      <el-tooltip v-if="scope.row.operation.includes('del')&&scope.row.level !==0"
                  effect="dark"
                  :content="locale.del"
                  placement="top"
      >
        <el-button type="danger"
                   @click="handleDeletePermission(scope.$index,scope.row)">
          <el-icon>
            <Delete></Delete>
          </el-icon>
        </el-button>
      </el-tooltip>
      <span v-else></span>
    </template>
  </table-pagination>
  <form-dialog :form-data="form" ref="permissionCreateDialogRef"
               @confirm="handleConfirmPermission"
  >
    <template #default="{form}">
      <el-form-item :label="locale.permissionParent" prop="pid"
                    :rules="[{required:true,message:locale.required}]">
        <el-select v-model="form.pid">
          <el-option v-for="option in parentOptionsRef"
                     :key="option.label"
                     :label="option.label"
                     :value="option.value"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="locale.requestMethod" prop="method">
        <el-select v-model="form.method" :disabled="form.type !== 'api'">
          <el-option v-for="option in methodOptions"
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
import {FormData, TableData} from "@/components/common";
import FormDialog from '../common/FormDialog.vue';
import {inject, onMounted, reactive, ref, shallowReactive, watch} from "vue";
import type {Locale} from "@/locale/zh-cn";
import {Delete, Edit} from '@element-plus/icons-vue';
import {Types} from "@/components/common";
import {PermissionFilter, PermissionNode, PermissionRow, userPermission} from "@/stores/permission";
import {methods} from "@/stores/network";

type Option = { value: string | number, label: string };
const types = ['danger', 'warning', 'success'];
const methodOptions: Option[] = methods.map(method => ({value: method, label: method}))
const locale = inject<Locale>('locale');
// const props = withDefaults(defineProps<{}>(), {})
const permissionStore = userPermission();
const filter: PermissionFilter = reactive({page: 1, pageSize: 10})
const permTypeOptionsRef = ref<Option[]>([]);
const parentOptionsRef = ref<Option[]>();
const totalRef = ref<number>(0);
const permissions = reactive({});

let levelPermissionMap: Map<number, PermissionNode[]>;


onMounted(() => {

  permissionStore.getPermissionTypesAction({level: 0}).then((data: PermissionRow[]) => {

    permTypeOptionsRef.value = data.map(({name, type}) => ({value: type, label: name}));
    form.items[3].options = permTypeOptionsRef.value;

  })

  handleQueryPermissions();

  permissionStore.getAllPermissionsAction().then(([, map]) => levelPermissionMap = map);

  const dialogForm = permissionCreateDialogRef.value.form;
  watch([() => dialogForm.type, () => dialogForm.level], (newVal) => {

    const [type, level] = newVal;
    const parentPermissions = levelPermissionMap.get(level - 1);

    console.log('watch', type, parentPermissions)
    if (parentPermissions)
      parentOptionsRef.value = parentPermissions.filter(item => item.type === type).map(item => ({
        label: item.label,
        value: item.id

      }))
    else parentOptionsRef.value = [];


  })


})

const tableData: TableData = shallowReactive({

  columns: [
    {
      prop: 'name',
      label: locale?.permissionName
    },
    {
      prop: 'des',
      label: locale?.permissionDes
    },
    {
      prop: 'level',
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
  data: []
})

const handleQueryPermissions = () => {


  permissionStore.getPermissionsAction(filter).then(({total, list}) => {

    console.log('permissions', total, list);
    totalRef.value = total;

    const permissions = list.map(item => ({...item, operation: ['del', 'edit']}))

    tableData.data = [...permissions];

  })


}

const handleDeletePermission = (index: number, row: PermissionRow) => {

  const {id} = row;

  if (id) permissionStore.deletePermissionAction({id}).then(handleQueryPermissions);

}

const handleSwitchChange = (row: PermissionRow) => {

  const {id, state} = row;
  if (id) permissionStore.updatePermissionStateAction({id, state});

}


const form: FormData = reactive({
  rules: {
    name: {required: true, message: locale?.required},
    type: {required: true, message: locale?.required},
    level: {required: true, message: locale?.required}
  },
  items: [
    {
      type: Types.input,
      prop: 'name',
      label: locale?.permissionName
    },
    {

      type: Types.input,
      prop: 'des',
      label: locale?.permissionDes

    },
    {

      type: Types.input,
      prop: 'path',
      label: locale?.permissionPath
    },
    {
      type: Types.select,
      prop: 'type',
      label: locale?.permissionType,
      //系统初始化时 参数表设置
      options: []

    },
    {
      type: Types.select,
      prop: 'level',
      label: locale?.permissionLevel,
      options: [
        {label: '一级权限', value: 1},
        {label: '二级权限', value: 2},
        {label: '三级权限', value: 3}
      ]
    }


  ]

})


const handleConfirmPermission = (form: PermissionRow) => {

  console.log(form);
}

const handleEditPermission = (index: number, row: any) => {

  console.log('handle edit permission', index, row)
  permissionCreateDialogRef.value.showDialog(row)
}


const permissionCreateDialogRef = ref<InstanceType<typeof FormDialog> | null>(null);


const handleCreatePermission = () => {

  console.log('handle create permission')
  permissionCreateDialogRef.value.showDialog()
}


</script>

<style scoped>

.permission-list__header {
  margin: 10px 0;
}
</style>