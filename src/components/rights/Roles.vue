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
                        <el-button size="small" type="primary" :icon="Edit">编辑</el-button>
                        <el-button size="small" type="danger" :icon="Delete">删除</el-button>
                        <el-button size="small" type="warning" :icon="Setting">权限分配</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <template #footer>Footer content</template>
        </el-card>
        <!-- 添加角色对话框 -->
        <el-dialog v-model="rolesDialogVisible" title="添加角色" width="50%" @close="handleClose">
            <el-form ref="ruleFormRef" :model="rolesFrom" :rules="rules" label-width="120px">
                <el-form-item label="Activity name" prop="name">
                    <el-input v-model="rolesFrom.name" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="rolesDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="rolesDialogVisible = false">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
import { Edit, Delete, Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
const { proxy }: any = getCurrentInstance();
// 角色列表数据
const rolesList = reactive({ data: [] });
// 获取角色列表数据
const getRolesList = async () => {
    const res = await proxy.$http.get('/roles')
    if (res.meta.status !== 200) return ElMessage.error('获取角色列表数据失败')
    rolesList.data = res.data;
    console.log(rolesList.data);
}
// 添加角色对话框数据
let rolesFrom = reactive({});

const ruleFormRef = ref()

// 显示添加角色对话框
const showAddRoleDialog = () => {
    rolesDialogVisible.value = true
}

const handleClose = () => {

}

// 控制添加角色对话框显示隐藏
const rolesDialogVisible = ref(false)
onMounted(() => {
    getRolesList()
})
</script>

<style lang="less" scoped></style>