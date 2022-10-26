<template>
  <table-pagination :table-data="tableData"
                    :total="totalRef"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
  >
    <template #header>
      <el-row :gutter="2"
              class="permission-role__header">
        <el-col :span="16">
          <el-input v-model="filter.keyword" :placeholder="locale.keyword" clearable/>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" @click="handleQueryRoles">{{ locale.query }}</el-button>
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
          :inactive-value="0"
          :active-value="1"
          @change="handleStateChange(scope.row)"
      />
    </template>
    <template #operation="scope">
      <el-tooltip v-if="scope.row.operation.includes('edit')"
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
      <el-tooltip v-if="scope.row.operation.includes('del')"
                  effect="dark"
                  :content="locale.del"
                  placement="top"
      >
        <el-button type="danger"
                   @click="handleDelete(scope.row)"
        >
          <el-icon>
            <Delete></Delete>
          </el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip v-if="scope.row.operation.includes('setting')"
                  effect="dark"
                  :content="locale.permissionRoleSetting"
                  placement="top"
      >
        <el-button type="warning"
                   @click="handleSetting(scope.row)"
        >
          <el-icon>
            <Setting></Setting>
          </el-icon>
        </el-button>
      </el-tooltip>
    </template>
  </table-pagination>
  <form-dialog :form-data="formData" ref="formDialogRef" @confirm="handleRoleConfirm"></form-dialog>
  <tree-dialog :data="permissionTree" ref="treeDialogRef" :title="locale.permissionRoleSetting"
               @confirm="handlePermissionConfirm"

  ></tree-dialog>
</template>

<script setup lang="ts">
import TablePagination from '../common/TablePagination.vue';
import {FormData, TableData, CheckedNode} from "@/components/common";
import TreeDialog from '../common/TreeDialog.vue';
import FormDialog from '../common/FormDialog.vue';
import {inject, onMounted, reactive, ref} from "vue";
import type {Locale} from "@/locale/zh-cn";
import {Delete, Edit, Setting} from '@element-plus/icons-vue';
import {Types} from "@/components/common";
import type {RoleFilter, Role} from "@/stores/role";
import {useRole} from "@/stores/role";
import {exclude, filterObj} from "@/utils";
import type {PermissionNode} from "@/stores/permission";
import {usePermission} from "@/stores/permission";
// const props = withDefaults(defineProps<{}>(), {})
const locale = inject<Locale>('locale');
const roleStore = useRole();
const permissionStore = usePermission();
const tableData: TableData = reactive({
  showIndex: true,
  columns: [{
    prop: 'name',
    label: locale?.roleName
  }, {
    prop: 'des',
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
  data: []

})
const formData: FormData = {
  items: [
    {
      type: Types.input,
      prop: 'name',
      label: locale?.roleName
    }, {

      type: Types.input,
      prop: 'des',
      label: locale?.roleDes
    }

  ]
}

const formDialogRef = ref<InstanceType<typeof FormDialog> | null>(null);
const treeDialogRef = ref<InstanceType<typeof TreeDialog> | null>(null);

const filter = reactive<RoleFilter>({});
const totalRef = ref<number>(0);
const permissionTree = ref<PermissionNode[]>([]);
let permissionCheckedNodes: number[] = [];
let currentRole: Role;
onMounted(() => {

  handleQueryRoles();

  permissionStore.getAllPermissionsAction().then(([tree]) => permissionTree.value = tree);


})

const handleQueryRoles = () => {

  roleStore.getRolesAction(filterObj(filter)).then(({total, list}) => {

    totalRef.value = total;
    tableData.data = list.map(item => ({
      operation: ['edit', 'del', 'setting'],
      ...item
    }))

  })

}
const handleSizeChange = (size: number) => filter.pageSize = size;

const handleCurrentChange = (current: number) => {
  filter.page = current;
  handleQueryRoles();
}

const handleCreateUser = () => formDialogRef.value.showDialog();


const handleEdit = (index: number, row: Role) => {

  formDialogRef.value.showDialog(row);
}

const handleRoleConfirm = (payload: { id?: number, name: string, des: string }) => {

  const {id} = payload;

  if (id) {

    const roles = tableData.data;

    const index = roles.findIndex(role => role.id === id);

    const temp = exclude(payload, roles[index]);

    roleStore.updateRoleAction(temp).then(() => {

      roles[index] = {...roles[index], ...temp};

      tableData.data = [...roles];
    })


  } else {

    roleStore.createRoleAction(payload).then(handleQueryRoles);

  }


}

const handleStateChange = (row: Role) => {

  const {id, state} = row;

  if (id && state !== undefined) roleStore.updateRoleStateAction({id, state});

}

const handleDelete = (row: Role) => {

  const {id} = row;

  if (id) roleStore.deleteRoleAction({id}).then(handleQueryRoles);
}

const handleSetting = (row: Role) => {

  const {id} = row;
  if (id) {
    currentRole = row;
    roleStore.getRolePermissionsAction({id}).then(permissions => {
      permissionCheckedNodes = [];
      permissions.forEach(({id}) => {

        permissionCheckedNodes.push(id)
      });

      treeDialogRef.value.showDialog(permissionCheckedNodes);
    });

  }

}

const handlePermissionConfirm = (permissions: CheckedNode[]) => {

  const {id} = currentRole;
  if (id) {

    const permissIdList = permissions.map(({id}) => id);

    roleStore.updateRolePermissionsAction({id, permissIdList});

  }
}


</script>

<style scoped>

.permission-role__header {
  margin: 10px 0;
}
</style>