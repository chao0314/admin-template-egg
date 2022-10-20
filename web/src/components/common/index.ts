import type {FormRules} from "element-plus";

export const enum Types {
    input = 'input',
    select = 'select'
}


export const enum Mode {
    create = 'create',
    edit = 'edit'
}


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

export interface TableConfig {

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


export type FormItem = {
    type: Types,
    prop: string,
    label?: string,
    options?: {
        value: string | number | boolean,
        label: string
    } [],
    props?: Record<string, any>
}

export type FormData = {
    rules?: FormRules,
    items: FormItem[]
}


export interface TreeNode {
    id: number
    label: string
    children?: TreeNode[]
}

export type CheckedNode = Omit<TreeNode, 'children'>;