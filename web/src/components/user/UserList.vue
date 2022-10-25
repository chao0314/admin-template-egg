<template>
  <table-pagination :table-data="tableData"
                    :total="userTotalRef"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
  >
    <template #header>
      <el-row :gutter="4" class="user-list__header">
        <el-col :span="3">
          <el-select v-model="filter.state" :placeholder="locale.state" clearable>
            <el-option
                v-for="item in stateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="filter.origin" :placeholder="locale.origin" clearable>
            <el-option
                v-for="item in originOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="filter.role" :placeholder="locale.role" clearable>
            <el-option
                v-for="item in roleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input v-model="filter.keyword" :placeholder="locale.keyword" clearable/>
        </el-col>
        <el-col :span="2" @click="handleQueryUsers">
          <el-button type="primary">{{ locale.query }}</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary">{{ locale.exportSearchResult }}</el-button>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-button type="primary"
                     @click="handleCreateUser"
          >{{ locale.createUser }}
          </el-button>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-button type="primary"
                     @click="handleImportUser"
          >{{ locale.importUser }}
          </el-button>
        </el-col>
      </el-row>
    </template>
    <template #roles="{row}">
      <el-tag class="user-list__tag" v-if="row.roles.length >0"
              v-for="role in row.roles"
              :key="role.roleId"
              closable
              type="success"
              @close="handleDelRole(row,role)"
      >
        {{ role.roleName }}
      </el-tag>
      <span v-else></span>
    </template>
    <template #state="{row}">
      <el-switch
          v-model="row.state"
          :active-value="1"
          :inactive-value="0"
          @change="handleSwitchChange(row)"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
      />
    </template>
    <template #operation="scope">
      <el-tooltip
          effect="dark"
          :content="locale.edit"
          placement="top"
      >
        <el-button
            size="small"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
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
        <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
        >
          <el-icon>
            <Edit></Edit>
          </el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip
          effect="dark"
          :content="locale.roleSetting"
          placement="top"
      >
        <el-button
            size="small"
            type="warning"
            @click="handleSettings(scope.$index, scope.row)"
        >
          <el-icon>
            <Setting></Setting>
          </el-icon>
        </el-button>
      </el-tooltip>
    </template>
  </table-pagination>
  <form-dialog :form-data="userData" ref="createUserDialogRef" @confirm="handleConfirmUser"></form-dialog>
  <upload-file-dialog ref="importDialogRef"></upload-file-dialog>
  <form-dialog :form-data="rolesData" ref="setRoleDialogRef" @confirm="handleConfirmRole"></form-dialog>
</template>

<script setup lang="ts">
import TablePagination from '../common/TablePagination.vue';
import {TableData, FormData, Types} from "../common/index";
import UploadFileDialog from '../common/UploadFileDialog.vue';
import FormDialog from '../common/FormDialog.vue';
import {inject, onMounted, reactive, ref, shallowReactive, toRaw} from 'vue';
import {Edit, Lock, Message, Phone, Setting, User} from '@element-plus/icons-vue';
import type {Locale} from "@/locale/zh-cn";
import useRules from "@/rules";
import {useUser, UserRow, UserInfo, UserFilter} from "@/stores/user";
import {exclude} from "@/utils";
import {useRole} from "@/stores/role";


type UserWithOperation = UserRow & { operation: ['edit', 'del', 'setting'] };
// const props = withDefaults(defineProps<{}>(), {})
const userStore = useUser();
const roleStore = useRole();
const {username, password, email, phone} = useRules();
const rules = {
  username, password, email: {
    ...email,
    required: false
  }, phone: {
    ...phone,
    required: false
  }
}
const locale = inject<Locale>('locale');
const stateOptions = [
  {value: '1', label: '启用'},
  {value: '0', label: '禁用'}
]
const originOptions = [
  {value: 'local', label: '本地'},
  {value: 'github', label: 'github'}
]
const roleOptions = ref<{ value: number, label: string }[]>();

const filter: UserFilter = reactive({});
const tableData: TableData = shallowReactive({
  showIndex: true,
  columns: [
    {prop: 'username', label: locale?.username, width: '100'},
    {prop: 'email', label: locale?.email, width: '280'},
    {prop: 'phone', label: locale?.phone},
    {prop: 'roles', label: locale?.role, slotName: 'roles'},
    {prop: 'state', label: locale?.state, width: '100', slotName: 'state'},
    {prop: 'operation', label: locale?.operation, slotName: 'operation'}
  ],
  data: []

})

const userTotalRef = ref(0);
const createUserDialogRef = ref<InstanceType<typeof FormDialog> | null>(null);
const setRoleDialogRef = ref<InstanceType<typeof FormDialog> | null>(null);

const userData: FormData = {
  rules,
  items: [
    {
      type: Types.input,
      prop: 'username',
      label: locale?.username,
      props: {
        'prefix-icon': User
      }
    },
    {
      type: Types.input,
      prop: 'email',
      label: locale?.email,
      props: {
        'prefix-icon': Message
      }
    },
    {
      type: Types.input,
      prop: 'phone',
      label: locale?.phone,
      props: {
        'prefix-icon': Phone
      }
    },
    {
      type: Types.input,
      prop: 'password',
      label: locale?.password,
      props: {
        'prefix-icon': Lock
      }
    },

  ]
}
const rolesData: FormData = reactive({
  items: [
    {
      type: Types.select,
      prop: 'role',
      label: locale?.role,
      options: []
    }
  ]

})

let currentUser: UserRow;
onMounted(() => {

  roleStore.getRolesAction().then(({list: roles}) => {

    roleOptions.value = roles.map(({id, name}) => ({value: id, label: name}));

    rolesData.items[0].options = roleOptions.value

  })

  handleQueryUsers();


})

const handleQueryUsers = () => {


  userStore.getUsersAction(toRaw(filter)).then((data) => {

    const {total, list} = data;
    const users: UserWithOperation[] = list.map(item => ({
          ...item,
          operation: ['edit', 'del', 'setting']
        })
    )

    userTotalRef.value = total;
    tableData.data = users;

  })

}


const handleCreateUser = () => {
  createUserDialogRef.value?.showDialog();

}

const handleConfirmUser = (form: UserInfo) => {

  if (form.id) {
    const oldValIndex = tableData.data.findIndex(item => item.id == form.id);

    const payload = exclude(form, tableData.data[oldValIndex]);

    userStore.updateUserAction(payload).then(() => {

          const users = tableData.data;
          users[oldValIndex] = Object.assign({}, users[oldValIndex], form);
          tableData.data = [...users];

        }
    )
  } else userStore.createUserAction(form).then(() => handleQueryUsers());

}


const handleSwitchChange = (row: UserRow) => {

  const {id, state} = row;

  if (id) userStore.updateUserStateAction({id, state});

}

const handleSizeChange = (val: number) => {

  filter.pageSize = val;
  handleQueryUsers();

}
const handleCurrentChange = (val: number) => {

  filter.page = val;
  handleQueryUsers();
}


const handleEdit = (index: number, row: UserInfo) => {
  // console.log(index, row)
  createUserDialogRef.value?.showDialog(row);

}
const handleDelete = (index: number, row: UserInfo) => {

  const {id} = row;

  // 最好设置为假删除
  if (id) userStore.deleteUserAction({id}).then(() => handleQueryUsers());

}


const handleDelRole = (row: UserRow, tag: { roleId: number, roleName: string }) => {

  const {id} = row;
  const {roleId} = tag;

  id && userStore.deleteUserRoleAction({id, roleId}).then(() => {

    const users = tableData.data;
    const index = users.findIndex((item) => item.id === id);
    const roles: { roleId: number, roleName: string }[] = users[index].roles;
    users[index].roles = roles.filter(role => role.roleId !== roleId)
    tableData.data = [...users];

  })


}


const handleSettings = (index: number, row: UserRow) => {

  currentUser = row;
  setRoleDialogRef.value.showDialog()

}

const handleConfirmRole = (form: { role: number }) => {

  const {id} = currentUser || {};
  const {role: roleId} = form;
  if (id && roleId) userStore.createUserRoleAction({id, roleId}).then(() => {

    const oRole = roleOptions.value?.find(({value}) => value === roleId);

    if (oRole) {

      const users = tableData.data;
      const userIndex = users.findIndex(user => user.id === id);

      users[userIndex].roles.push({roleId: oRole.value, roleName: oRole.label});

      tableData.data = [...users];

    }

  })


}
const importDialogRef = ref<InstanceType<typeof UploadFileDialog> | null>(null);
const handleImportUser = () => {

  importDialogRef.value?.showDialog()
}


</script>

<style scoped>

.user-list__header {
  margin: 10px 0;
}

.user-list__tag {
  margin: 0 1px;

}
</style>
