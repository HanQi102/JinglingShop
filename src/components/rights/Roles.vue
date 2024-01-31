<template>
    <div class="">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <el-row>
                        <el-col :span="8">
                            <!-- <el-button :icon="Search" @click="getOrdersList" /> -->
                            <el-button type="primary" @click="showAddRoleDialog">添加角色</el-button>
                        </el-col>
                    </el-row>
                </div>
            </template>
            <el-table :data="rolesList.data" border stripe style="width: 100%">
                <el-table-column type="expand">
                    <template #default="scope">

                    </template>
                </el-table-column>
                <el-table-column type="index" />
                <el-table-column label="角色名称" prop="roleName" />
                <el-table-column label="角色描述" prop="roleDesc" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button size="small" type="primary" :icon="Edit"
                            @click="showEditRoleDialog(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" :icon="Delete"
                            @click="deleteRole(scope.row.id)">删除</el-button>
                        <el-button size="small" type="warning" :icon="Setting"
                            @click="showPermissionDialog(scope.row)">权限分配</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加修改角色对话框 -->
        <el-dialog v-model="rolesDialogVisible" :title="rolesTitle" width="50%" @close="handleClose">
            <el-form ref="ruleFormRef" :model="rolesFrom" :rules="rolesRules" label-width="120px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="rolesFrom.roleName" />
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="rolesFrom.roleDesc" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="rolesDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitForm(ruleFormRef)">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 分配权限对话框 -->
        <el-dialog v-model="PermissionDialogVisible" title="分配权限" width="50%" @close="handleClose">
            <el-tree :data="roleTreeList.data" ref="roleTreeRef" :default-checked-keys="defKeys.id" show-checkbox
                node-key="id" :props="defaultProps" default-expand-all />
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="PermissionDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitFormPermission()">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted, computed } from 'vue';
import { Edit, Delete, Setting } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
const { proxy }: any = getCurrentInstance();
// 角色列表数据
const rolesList = reactive({ data: [] });
// 获取角色列表数据
const getRolesList = async () => {
    const res = await proxy.$http.get('/roles')
    if (res.meta.status !== 200) return ElMessage.error('获取角色列表数据失败')
    rolesList.data = res.data;
}
// 添加修改角色对话框数据
let rolesFrom = reactive({
    roleName: '',
    roleDesc: '',
    id: 0
});

// 控制添加修改角色对话框显示隐藏
const rolesDialogVisible = ref(false)

// 添加修改角色对话框标题
const rolesTitle = ref()
// 添加修改角色对话框实例
const ruleFormRef = ref()
// 添加修改角色对话框数据验证规则
const rolesRules = reactive({
    roleName: [
        { required: true, message: '请输入角色名称', trigger: 'blur' },
    ],
    roleDesc: [
        { required: true, message: '请输入角色描述', trigger: 'blur' },
    ]
})
// 显示添加角色对话框
const showAddRoleDialog = () => {
    rolesDialogVisible.value = true
    rolesTitle.value = '添加角色'
}

// 显示修改角色对话框
const showEditRoleDialog = (row) => {
    rolesTitle.value = '修改角色'
    rolesFrom = row
    rolesDialogVisible.value = true
    console.log(rolesFrom);
}
// 添加角色事件
const addRoleDialog = async () => {
    const res = await proxy.$http.post('/roles', rolesFrom)
    if (res.meta.status !== 201) return ElMessage.error('添加角色失败')
    ElMessage.success('添加角色成功')
    rolesDialogVisible.value = false
    getRolesList()
}
// 修改角色事件
const editRoleDialog = async () => {
    const res = await proxy.$http.put(`/roles/${rolesFrom.id}`, rolesFrom)
    if (res.meta.status !== 200) return ElMessage.error('修改角色失败')
    ElMessage.success('修改角色成功')
    rolesDialogVisible.value = false
    getRolesList()
}
// 提交请求
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            if (rolesTitle.value == '添加角色') {
                addRoleDialog()
            }
            if (rolesTitle.value == '修改角色') {
                editRoleDialog()
            }
        } else {
            ElMessage.error('请完善信息')
        }
    })
}

// 关闭角色对话框回调函数
const handleClose = () => {
    rolesDialogVisible.value = false
    Object.keys(rolesFrom).forEach(key => {
        rolesFrom[key] = ''
    })
    getRolesList()
    defKeys.id = []
}

// 删除角色
const deleteRole = (id) => {

    ElMessageBox.confirm(
        '确定要删除该角色吗?',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            const res = await proxy.$http.delete(`/roles/${id}`)
            if (res.meta.status !== 200) return ElMessage.success('删除失败')
            ElMessage.success('删除成功')
            getRolesList()
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}

// 控制分配权限对话框显示隐藏
const PermissionDialogVisible = ref(false)

const defaultProps = {
    children: 'children',
    label: 'authName',
}
// 树形控件数据列表
const roleTreeList = reactive({ data: [] })

// 默认选中节点id数组
const defKeys = reactive({ id: [] })
// 显示添加角色对话框
// id
const roleId = ref(0)

const showPermissionDialog = async (row) => {
    roleId.value = row.id
    const res = await proxy.$http.get(`rights/tree`)
    roleTreeList.data = res.data
    PermissionDialogVisible.value = true
    getLeafKeys(row, defKeys.id)
}

// 递归获取三级权限id
const getLeafKeys = (row, arr) => {
    if (!row.children) {
        arr.push(row.id);
        return
    }
    row.children.forEach(item =>
        getLeafKeys(item, arr));
}

// 分配权限事件
const submitFormPermission = async () => {
    const tree = proxy.$refs['roleTreeRef']// 获取 Tree 控件实例

    // tree.getCheckedKeys();
    // tree.getHalfCheckedKeys();
    let keys = [
        //     tree.getCheckedKeys()
        // tree.getHalfCheckedKeys()
    ]
    keys = tree.getCheckedKeys().concat(tree.getHalfCheckedKeys())
    // keys = tree.getCheckedKeys()
    // keys = tree.getHalfCheckedKeys()
    // console.log(tree.getHalfCheckedKeys());
    console.log(keys);
    const idStr = keys.join(',');
    const res = await proxy.$http.post(`roles/${roleId.value}/rights`, {
        rids: idStr
    })
    if (res.meta.status !== 200) return ElMessage.error('分配权限失败')
    ElMessage.success('分配权限成功')
    PermissionDialogVisible.value = false
    getRolesList()
}


onMounted(() => {
    getRolesList()
})

</script>

<style lang="less" scoped></style>