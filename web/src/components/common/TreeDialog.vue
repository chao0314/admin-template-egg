<template>
  <el-dialog width="30%" top="10vh"
             v-model="dialogVisibleRef"
             :title="props.title">


    <el-tree
        ref="treeRef"
        :data="data"
        show-checkbox
        default-expand-all
        node-key="id"
        highlight-current
        :props="defaultProps"
        :default-checked-keys="defaultCheckedKeys"
    />

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisibleRef = false">{{ locale.cancel }}</el-button>
        <el-button type="primary" @click="handleConfirm"
        >{{ locale.confirm }}</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">

import {defineEmits, inject, isReactive, ref} from "vue";
import type {Locale} from "@/locale/zh-cn";
//@ts-ignore
import {ElTree} from 'element-plus';
import type Node from 'element-plus/es/components/tree/src/model/node'

export interface TreeNode {
  id: number
  label: string
  children?: TreeNode[]
}

export type CheckedNode = Omit<TreeNode, 'children'>;

const props = withDefaults(defineProps<{
  data: TreeNode[],
  title: string
}>(), {
  title: ''
})

const emits = defineEmits<{
  (e: 'confirm', payload: CheckedNode[]): void

}>()
const locale = inject<Locale>('locale');
const dialogVisibleRef = ref(false);

const defaultCheckedKeys = ref<number[] | string[]>([]);

const treeRef = ref<InstanceType<typeof ElTree> | null>(null)

const getCheckedNodes = () => {
  return treeRef.value!.getCheckedNodes(false, false);
}

const setCheckedNodes = (nodes: CheckedNode[]) => {
  treeRef.value!.setCheckedNodes(nodes as Node[], false);
}
const setCheckedKeys = () => {
  treeRef.value!.setCheckedKeys([3], false)
}
const getCheckedKeys = () => {
  console.log(treeRef.value!.getCheckedKeys(false))
}
const resetChecked = () => {
  treeRef.value!.setCheckedKeys([], false)
}

const defaultProps = {
  children: 'children',
  label: 'label',
}


const handleConfirm = () => {

  const nodes: CheckedNode[] = getCheckedNodes().map(({id, label}) => ({id, label}));
  emits("confirm", nodes);
  dialogVisibleRef.value = false;

}
defineExpose<{ showDialog: (checkedKeys?: number[] | string[]) => void }>({
  showDialog(checkedKeys?: number[] | string[]) {

    defaultCheckedKeys.value = checkedKeys ?? [];
    dialogVisibleRef.value = true;


  }

})


</script>

<style scoped>

</style>