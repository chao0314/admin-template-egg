<template>
  <el-card class="main__card">
    <slot name="header"></slot>
    <el-table :data="tableData.data" stripe border highlight-current-row show
              style="width: 100%;"
              height="600"
              :cell-style="{height:'56px',padding:0}"
              v-bind="tableData.tableSettings"

    >
      <el-table-column v-if="tableData.showIndex" type="index" width="48"/>
      <template v-for="column in tableData.columns">
        <el-table-column show-overflow-tooltip v-bind="column">
          <template v-if="column.slotName" #default="scope">
            <slot :name="column.slotName" :row="scope.row">
              {{ scope.row[column.prop] }}
            </slot>
          </template>
        </el-table-column>
      </template>
      <!--      <el-table-column prop="username" :label="locale.username" width="100"/>-->
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
</template>

<script setup lang="ts">
import {ref} from "_vue@3.2.39@vue";

export type Column = {

  prop: string,
  label?: string,
  width?: string,
  slotName?: string
  [key: string]: any
}

export interface TableData {

  showIndex?: boolean,
  tableSettings?: Record<string, string>,
  columns: Column[],
  data: any[]

}

export interface Config {

  tableData: Partial<TableData>,
  currentPage?:number,
  pageSize?:number

}

const props = withDefaults(defineProps<Config>(), {

  tableData: () => ({
    showIndex: true,
    tableSettings: {},
    columns: [],
    data: []
  }),
  currentPage:1,
  pageSize:1
})

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
</script>

<style scoped>
.main__card {

  margin-top: 20px;

}

.main__card-pagination {
  margin-top: 10px;

}

</style>