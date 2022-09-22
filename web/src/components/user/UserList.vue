<template>
  <el-card class="main__card">
    <template #header>
      <el-row :gutter="4">
        <el-col :span="3">
          <el-select v-model="value" class="m-2" placeholder="Select">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="value" class="m-2" placeholder="Select">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="value" class="m-2" placeholder="Select">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input v-model="input" placeholder="Please input" clearable/>
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
          <el-button type="primary">{{ locale.importUser }}</el-button>
        </el-col>
      </el-row>
    </template>
    <el-table :data="tableData" stripe border highlight-current-row
              style="width: 100%;"
              height="600"
              :cell-style="{height:'56px',padding:0}"

    >
      <el-table-column type="index" width="48"/>
      <el-table-column prop="username" :label="locale.username" width="100"/>
      <el-table-column prop="email" :label="locale.email" width="280"/>
      <el-table-column prop="phone" :label="locale.phone"/>
      <el-table-column prop="role" :label="locale.role"/>
      <el-table-column prop="state" :label="locale.state" width="100">
        <template #default="scope">
          <el-switch
              v-model="scope.row.state"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          />
        </template>
      </el-table-column>
      <el-table-column prop="operation" :label="locale.operation">
        <template #default="scope">
          <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
          >
            <el-icon>
              <Edit/>
            </el-icon>
          </el-button
          >
          <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
          >
            <el-icon>
              <Delete/>
            </el-icon>
          </el-button>
          <el-button
              size="small"
              type="warning"
              @click="handleDelete(scope.$index, scope.row)"
          >
            <el-icon>
              <Setting/>
            </el-icon>
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <el-pagination class="main__card-pagination"
                 v-model:currentPage="currentPage2"
                 v-model:page-size="pageSize2"
                 :page-sizes="[100, 200, 300, 400]"
                 :small="small"
                 :disabled="disabled"
                 :background="background"
                 layout="total, sizes, prev, pager, next, jumper"
                 :total="1000"
                 @size-change="handleSizeChange"
                 @current-change="handleCurrentChange"
  />

  <el-dialog width="40%" top="10vh" v-model="dialogVisibleRef" title="添加">
    <el-form
        label-position="top"
        :model="form"
        :rules=rules
    >
      <el-form-item :label="locale.username" prop="username">
        <el-input :prefix-icon="User" v-model="form.username" autocomplete="off"/>
      </el-form-item>
      <el-form-item :label="locale.email" prop="email">
        <el-input :prefix-icon="Message" v-model="form.email" autocomplete="off"/>
      </el-form-item>
      <el-form-item :label="locale.phone" prop="phone">
        <el-input :prefix-icon="Phone" v-model="form.phone" autocomplete="off"/>
      </el-form-item>
      <el-form-item :label="locale.password" prop="password">
        <el-input :prefix-icon="Lock" v-model="form.password" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisibleRef = false">{{ locale.cancel }}</el-button>
        <el-button type="primary" @click="dialogVisibleRef = false"
        >{{ locale.confirm }}</el-button
        >
      </span>
    </template>
  </el-dialog>

  <upload-file-dialog></upload-file-dialog>
</template>

<script setup lang="ts">
import UploadFileDialog from '../common/UploadFileDialog.vue';
import {ref, inject, reactive} from 'vue';
// @ts-ignore
import {
  Edit, Delete, Setting, User, Phone, Message, Lock
} from '@element-plus/icons-vue';
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


const dialogVisibleRef = ref(false);
const form = reactive({
  username: '',
  email: '',
  phone: '',
  password: ''
})
const handleCreateUser = () => {
  dialogVisibleRef.value = true;

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
const tableData = [
  {
    username: 'it666',
    email: 'zhichao0314@126.comzhichao0314@126.com',
    phone: '18258414234',
    role: 'admin',
    state: true,
    operation: ['edit', 'del', 'setting']
  },
  {
    username: 'it888',
    email: 'zhichao0314@126.com',
    phone: '18258414234',
    role: 'admin',
    state: false,
    operation: ['edit', 'del', 'setting']
  },
  {
    username: 'it666',
    email: 'zhichao0314@126.com',
    phone: '18258414234',
    role: 'admin',
    state: true,
    operation: ['edit', 'del', 'setting']
  },
  {
    username: 'it888',
    email: 'zhichao0314@126.com',
    phone: '18258414234',
    role: 'admin',
    state: false,
    operation: ['edit', 'del', 'setting']
  }, {
    username: 'it666',
    email: 'zhichao0314@126.com',
    phone: '18258414234',
    role: 'admin',
    state: true,
    operation: ['edit', 'del', 'setting']
  },
  {
    username: 'it888',
    email: 'zhichao0314@126.com',
    phone: '18258414234',
    role: 'admin',
    state: false,
    operation: ['edit', 'del', 'setting']
  }, {
    username: 'it666',
    email: 'zhichao0314@126.com',
    phone: '18258414234',
    role: 'admin',
    state: true,
    operation: ['edit', 'del', 'setting']
  },
  {
    username: 'it888',
    email: 'zhichao0314@126.com',
    phone: '18258414234',
    role: 'admin',
    state: false,
    operation: ['edit', 'del', 'setting']
  }, {
    username: 'it666',
    email: 'zhichao0314@126.com',
    phone: '18258414234',
    role: 'admin',
    state: true,
    operation: ['edit', 'del', 'setting']
  },
  {
    username: 'it888',
    email: 'zhichao0314@126.com',
    phone: '18258414234',
    role: 'admin',
    state: false,
    operation: ['edit', 'del', 'setting']
  }, {
    username: 'it888',
    email: 'zhichao0314@126.com',
    phone: '18258414234',
    role: 'admin',
    state: false,
    operation: ['edit', 'del', 'setting']
  }

]


const currentPage2 = ref(5)

const pageSize2 = ref(100)

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
}
const handleDelete = (index: number, row: User) => {
  console.log(index, row)
}
</script>

<style scoped>


.main__card {

  margin-top: 20px;

}

.main__card-pagination {
  margin-top: 10px;

}


</style>
