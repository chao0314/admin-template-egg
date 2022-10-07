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
            <slot :name="column.slotName" :row="scope.row" :$index="scope.$index">
              {{ scope.row[column.prop] }}
            </slot>
          </template>
        </el-table-column>
      </template>
      <!--      <el-table-column prop="username" :label="locale.username" width="100"/>-->
    </el-table>
  </el-card>
  <el-pagination class="main__card-pagination"
                 :page-sizes="props.pageSizes"
                 :small="props.small"
                 :disabled="props.disabled"
                 :background="props.background"
                 :layout="props.layout"
                 :total="props.total"
                 v-model:currentPage="currentPageRef"
                 v-model:page-size="pageSizeRef"
                 @size-change="handleSizeChange"
                 @current-change="handleCurrentChange"
  />
</template>

<script setup lang="ts">
import {ref} from "vue";
import {TableData} from "@/components/common/index";


interface TableConfig {

  tableData: Partial<TableData>,
  total: number,
  currentPage?: number,
  pageSize?: number,
  pageSizes?: number[],
  layout?: string,
  small?: boolean,
  background?: boolean,
  disabled?: boolean

}

const props = withDefaults(defineProps<TableConfig>(), {

  tableData: () => ({
    showIndex: true,
    tableSettings: {},
    columns: [],
    data: []
  }),
  currentPage: 1,
  pageSize: 10,
  pageSizes: () => [10, 20, 50, 100],
  layout: "total, sizes, prev, pager, next, jumper",
  small: false,
  background: false,
  disabled: false
})

type Emits = {
  (e: 'size-change', currentSize: number): void
  (e: 'current-change', currentPage: number): void
}
const emits = defineEmits<Emits>();
const currentPageRef = ref(props.currentPage);
const pageSizeRef = ref(props.pageSize);

const handleSizeChange = (val: number) => {

  emits("size-change", val);
}
const handleCurrentChange = (val: number) => {
  emits("current-change", val);
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