<template>
  <table-pagination :table-data="tableData"
                    :total="100"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
  >
    <template #header>
      <el-row :gutter="4" class="user-list__header">
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
        <el-col :span="4">
          <el-input v-model="input" :placeholder="locale.select" clearable/>
        </el-col>
        <el-col :span="2">
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
    <template #role={row}>
      <el-tag class="user-list__tag"
              v-for="tag in row.role"
              :key="tag"
              closable
              type="success"
              @close="handleDelRole(row,tag)"
      >
        {{ tag }}
      </el-tag>
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
  <form-dialog :form-data="formData" ref="createUserDialogRef"></form-dialog>
  <upload-file-dialog ref="importDialogRef"></upload-file-dialog>
  <form-dialog :form-data="rolesData" ref="setRoleDialogRef"></form-dialog>
</template>

<script setup lang="ts">
import TablePagination from '../common/TablePagination.vue';
import {TableData, FormData, Types} from "@/components/common/index";
import UploadFileDialog from '../common/UploadFileDialog.vue';
import FormDialog from '../common/FormDialog.vue';
import {inject, reactive, ref} from 'vue';
import {Delete, Edit, Lock, Message, Phone, Setting, User} from '@element-plus/icons-vue';
import type {Locale} from "@/locale/zh-cn";
import useRules from "@/rules";

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
// const props = withDefaults(defineProps<{}>(), {})
const formData: FormData = {
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

const rolesData: FormData = {

  items: [

    {
      type: Types.select,
      prop: 'role',
      label: locale?.role,
      options: [
        {
          value: 'role 1',
          label: 'role 1'
        },
        {
          value: 'role 2',
          label: 'role 2'
        }
      ]
    }

  ]

}
const createUserDialogRef = ref<InstanceType<typeof FormDialog> | null>(null);
const setRoleDialogRef = ref<InstanceType<typeof FormDialog> | null>(null);
const handleCreateUser = () => {
  createUserDialogRef.value?.showDialog();

}
const value = ref('');
const input = ref('')
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
];
const tableData: TableData = {
  showIndex: true,
  columns: [
    {prop: 'username', label: locale?.username, width: '100'},
    {prop: 'email', label: locale?.email, width: '280'},
    {prop: 'phone', label: locale?.phone},
    {prop: 'role', label: locale?.role, slotName: 'role'},
    {prop: 'state', label: locale?.state, width: '100', slotName: 'state'},
    {prop: 'operation', label: locale?.operation, slotName: 'operation'}
  ],
  data: [
    {
      username: 'it666',
      email: 'zhichao0314@126.comzhichao0314@126.com',
      phone: '18258414234',
      role: ['admin'],
      state: true,
      operation: ['edit', 'del', 'setting']
    },
    {
      username: 'it888',
      email: 'zhichao0314@126.com',
      phone: '18258414234',
      role: ['admin'],
      state: false,
      operation: ['edit', 'del', 'setting']
    },
    {
      username: 'it666',
      email: 'zhichao0314@126.com',
      phone: '18258414234',
      role: ['admin'],
      state: true,
      operation: ['edit', 'del', 'setting']
    },
    {
      username: 'it888',
      email: 'zhichao0314@126.com',
      phone: '18258414234',
      role: ['admin'],
      state: false,
      operation: ['edit', 'del', 'setting']
    },
    {
      username: 'it666',
      email: 'zhichao0314@126.com',
      phone: '18258414234',
      role: ['admin'],
      state: true,
      operation: ['edit', 'del', 'setting']
    },
    {
      username: 'it888',
      email: 'zhichao0314@126.com',
      phone: '18258414234',
      role: ['admin', 'user'],
      state: false,
      operation: ['edit', 'del', 'setting']
    },
    {
      username: 'it666',
      email: 'zhichao0314@126.com',
      phone: '18258414234',
      role: ['admin'],
      state: true,
      operation: ['edit', 'del', 'setting']
    },
    {
      username: 'it888',
      email: 'zhichao0314@126.com',
      phone: '18258414234',
      role: ['admin'],
      state: false,
      operation: ['edit', 'del', 'setting']
    },
    {
      username: 'it666',
      email: 'zhichao0314@126.com',
      phone: '18258414234',
      role: ['admin'],
      state: true,
      operation: ['edit', 'del', 'setting']
    },
    {
      username: 'it888',
      email: 'zhichao0314@126.com',
      phone: '18258414234',
      role: ['admin'],
      state: false,
      operation: ['edit', 'del', 'setting']
    },
    {
      username: 'it888',
      email: 'zhichao0314@126.com',
      phone: '18258414234',
      role: ['admin'],
      state: false,
      operation: ['edit', 'del', 'setting']
    }

  ]

}


const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

interface User {
  date: string
  name: string
  address: string
}

const handleEdit = (index: number, row: User) => {
  console.log(index, row)
  createUserDialogRef.value?.showDialog(row);

}
const handleDelete = (index: number, row: User) => {
  console.log(index, row)

}

const handleSettings = (index: number, row: User) => {

  setRoleDialogRef.value.showDialog()

}
const importDialogRef = ref<InstanceType<typeof UploadFileDialog> | null>(null);
const handleImportUser = () => {

  importDialogRef.value?.showDialog()
}

const tags = ref([
  {name: 'Tag 1', type: ''},
  {name: 'Tag 2', type: 'success'},
  {name: 'Tag 3', type: 'info'},
  {name: 'Tag 4', type: 'warning'},
  {name: 'Tag 5', type: 'danger'},
])

const handleDelRole = (row: any, tag: string) => {

  console.log('handle del role', row, tag)
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
