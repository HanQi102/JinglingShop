<template>
    <div class="usersBox">
        <!-- 面包屑 -->
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <el-row>
                        <el-col :span="8">
                            <el-input placeholder="请输入内容" @change="getUsersList" clearable v-model="param.query">
                                <template #append>
                                    <el-button :icon="Search" @click="getUsersList" />
                                </template>
                            </el-input>
                        </el-col>
                        <el-col :span="15">
                            <el-button type="primary" @click="showAddDialog">添加用户</el-button>
                        </el-col>
                    </el-row>
                </div>
            </template>
            <el-table :data="usersList.users" border stripe style="width: 100%">
                <el-table-column type="index" min-width="50" />
                <el-table-column prop="username" label="姓名" min-width="100" />
                <el-table-column prop="email" label="邮箱" min-width="180" />
                <el-table-column prop="mobile" label="电话" min-width="120" />
                <el-table-column prop="role_name" label="角色" min-width="100" />
                <el-table-column label="状态" min-width="80">
                    <template v-slot="{ row }">
                        <el-switch v-model="row.mg_state" @change="changeStatus(row)" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="260">
                    <template v-slot="{ row }">
                        <el-button type="primary" :icon="Edit" @click="showEditDialog(row)" />
                        <el-button type="danger" :icon="Delete" @click="deleteUser(row.id)" />
                        <el-button type="warning" :icon="Setting" @click="showAssignUser(row)" />
                    </template>
                </el-table-column>
            </el-table>
            <template #footer>
                <!-- 分页器 -->
                <el-pagination v-model:current-page="param.pagenum" v-model:page-size="param.pagesize"
                    :page-sizes="[1, 2, 5, 10]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </template>
        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog v-if="dialogTitle == '添加用户'" v-model="dialogVisible" :title="dialogTitle" width="50%">
            <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="120px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email" />
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="addForm.mobile" />
                </el-form-item>
            </el-form>
            <!-- 修改用户对话框 -->
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitForm(addFormRef)">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog v-if="dialogTitle == '修改用户'" v-model="dialogVisible" :title="dialogTitle" width="50%"
            @close="closeDialog">
            <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="120px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username" disabled />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email" />
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="addForm.mobile" />
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitForm(addFormRef)">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <!--分配角色对话框 -->
        <el-dialog v-if="dialogTitle == '分配角色'" v-model="dialogVisible" :title="dialogTitle" width="50%"
            @close="closeDialog">
            <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="120px">
                <el-form-item label="当前的用户：">
                    <p>{{ addForm.username }}</p>
                </el-form-item>
                <el-form-item label="当前的角色：">
                    <p>{{ addForm.role_name }}</p>
                </el-form-item>
                <el-form-item label="分配新角色：">
                    <el-select v-model="valueId" placeholder="请选择" size="large" style="width: 240px">
                        <el-option v-for="item in rolesList.data" :key="item.id" :label="item.roleName" :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitForm(addFormRef)">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
import { ArrowRight, Search, Setting, Delete, Edit } from '@element-plus/icons-vue'
import { ElTable, ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'

const { proxy }: any = getCurrentInstance()

// 请求参数
const param = reactive({
    query: '',
    pagenum: 1,
    pagesize: 2
})
// 用户列表数据
const usersList = reactive({ users: [] })
// 获取用户列表数据
const getUsersList = async () => {
    const res = await proxy.$http.get('/users', {
        params: param
    })
    if (res.meta.status !== 200) return ElMessage.error('获取用户列表数据失败')

    usersList.users = res.data.users
    total.value = res.data.total
}
// 分页器
const total = ref(0)
const handleSizeChange = (val: number) => {
    param.pagesize = val
    getUsersList()
}
const handleCurrentChange = (val: number) => {
    param.pagenum = val
    getUsersList()
}

// 控制添加对话框显示隐藏
const dialogVisible = ref(false)
// 对话框标题
const dialogTitle = ref()
// 对话框数据
let addForm = reactive({
    username: '',
    password: '',
    email: '',
    mobile: '',
    role_name: '',
    id: 0
})
const addFormRef = ref()
// 添加用户表单验证规则
const addRules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
    ],
    mobile: [
        { required: true, message: '请输入电话', trigger: 'blur' },
    ],
})
// 显示添加用户对话框
const showAddDialog = () => {
    dialogVisible.value = true
    dialogTitle.value = '添加用户'
}
// 显示修改用户对话框
const showEditDialog = async (v) => {
    dialogVisible.value = true
    addForm = v
    dialogTitle.value = '修改用户'
}
// 添加用户事件
const addUser = async () => {
    const res = await proxy.$http.post('/users', addForm)
    if (res.meta.status !== 201) return ElMessage.error('添加用户失败')

    ElMessage.success('添加用户成功')
    dialogVisible.value = false
    getUsersList()
}
// 修改用户事件
const editUser = async () => {
    const res = await proxy.$http.put(`users/${addForm.id}`, addForm)
    if (res.meta.status !== 200) return ElMessage.error('修改用户失败')

    ElMessage.success('修改成功')
    dialogVisible.value = false
    getUsersList()
}

// 对话框提交事件
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            if (dialogTitle.value == '添加用户') {
                addUser()
            }
            if (dialogTitle.value == '修改用户') {
                editUser()
            }
            if (dialogTitle.value == '分配角色') {
                assignUser()
            }

        } else {
            ElMessage.error('表单验证失败请重新输入！')
        }
    })
}

// 关闭对话框的回调函数
const closeDialog = () => {
    Object.keys(addForm).forEach((key) => {
        addForm[key] = ''
    })
    getUsersList()
}

// 删除用户
const deleteUser = (id) => {
    ElMessageBox.confirm(
        '确定要删除该用户吗?',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            const res = await proxy.$http.delete(`/users/${id}`)
            if (res.meta.status !== 200) return ElMessage.error('删除失败')
            ElMessage.success('删除成功')
            getUsersList()
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '删除取消',
            })
        })
}
// 角色列表数据
let rolesList = reactive({ data: [] })
const valueId = ref('')
// 获取角色列表数据
const getRolesList = async () => {
    const res = await proxy.$http.get('/roles')
    if (res.meta.status !== 200) return ElMessage.error('获取角色列表失败')
    rolesList.data = res.data
}

// --分配角色对话框
const showAssignUser = (v) => {
    dialogVisible.value = true
    dialogTitle.value = '分配角色'
    addForm = v
    getRolesList()
}

const assignUser = async () => {
    const res = await proxy.$http.put(`users/${addForm.id}/role`,
        {
            rid: valueId.value
        })
    console.log(res);
    if (res.meta.status !== 200) return ElMessage.error('设置角色失败')
    ElMessage.success('设置角色成功')
    dialogVisible.value = false
    getUsersList()
}
// 修改状态
const changeStatus = async (row) => {
    const res = await proxy.$http.put(`/users/${row.id}/state/${row.mg_state}`)
    if (res.meta.status !== 200) return ElMessage.error('修改用户状态失败')
    ElMessage.success('修改用户状态成功')
    getUsersList()
}


onMounted(() => {
    getUsersList()
})
</script>

<style lang="less" scoped>
.usersBox {
    width: 100%;
    height: 100%;

    .box-card {
        .card-header {
            .el-row {
                .el-col {
                    margin-right: 10px;

                    .el-input {
                        height: 40px;
                    }

                    .el-button {
                        height: 40px;
                    }
                }
            }
        }
    }

}
</style>