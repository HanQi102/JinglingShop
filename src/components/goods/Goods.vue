<template>
    <div class="">
        <!-- 面包屑 -->
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <el-row>
                        <el-col :span="8">
                            <el-input placeholder="请输入内容" @change="getGoodsList" clearable v-model="params.query">
                                <template #append>
                                    <el-button :icon="Search" @click="getGoodsList" />
                                </template>
                            </el-input>
                        </el-col>
                        <el-col :span="15">
                            <!-- <el-button type="primary" @click="showAddDialog">添加用户</el-button> -->
                        </el-col>
                    </el-row>
                </div>
            </template>
            <el-table :data="goodsList.data" border stripe style="width: 100%">
                <el-table-column type="index" />
                <el-table-column prop="goods_name" label="名称" min-width="520" />
                <el-table-column prop="goods_price" label="商品价格(元)" min-width="95" />
                <el-table-column prop="goods_number" label="商品重量" min-width="80" />
                <el-table-column label="创建时间" min-width="120">
                    <template #default="scope">
                        {{ timesTamp(scope.row.add_time) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="130">
                    <template #default="scope">
                        <el-button type="primary" :icon="Edit" @click="showEditGoods(scope.row.goods_id)" />
                        <el-button type="danger" :icon="Delete" @click="deleteGoods(scope.row)" />
                    </template>
                </el-table-column>
            </el-table>
            <template #footer>
                <!-- // 分页器 -->
                <el-pagination v-model:current-page="params.pagenum" v-model:page-size="params.pagesize"
                    :page-sizes="[5, 10, 20, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </template>
        </el-card>
        <!-- 修改商品信息对话框 -->
        <el-dialog v-model="editDialogVisible" title="修改商品信息" width="50%" @close="handleClose">
            <el-form ref="editFormRef" :model="editRuleForm" :rules="editRules" label-width="120px">
                <el-form-item label="商品名称" prop="goods_name">
                    <el-input v-model="editRuleForm.goods_name" />
                    <p>{{ editRuleForm.goods_name }}</p>
                </el-form-item>
                <el-form-item label="商品价格(元)" prop="goods_price">
                    <el-input v-model="editRuleForm.goods_price" />
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_number">
                    <el-input v-model="editRuleForm.goods_number" />
                </el-form-item>
                <el-form-item label="创建时间" prop="add_time">
                    <el-input v-model="editRuleForm.add_time" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitForm(editFormRef)">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
import { ArrowRight, Edit, Delete, Search } from '@element-plus/icons-vue'
import { ElTable, ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
const { proxy }: any = getCurrentInstance()
// 商品列表数据
const goodsList = reactive({ data: [] })
// 请求参数
const params = reactive({
    query: '',
    pagenum: 1,
    pagesize: 10
})
// 获取商品列表数据
const getGoodsList = async () => {
    const res = await proxy.$http.get('/goods', {
        params: params
    })
    if (res.meta.status !== 200) return ElMessage.error('获取商品列表数据失败')
    goodsList.data = res.data.goods
    total.value = res.data.total
}
// 分页器
const total = ref(0)
const handleSizeChange = (val: number) => {
    params.pagesize = val
    getGoodsList()
}
const handleCurrentChange = (val: number) => {
    params.pagenum = val
    getGoodsList()
}

// 时间戳
const timesTamp = (time: any) => {
    let date = new Date(time * 1000);
    // 获取各个时间组件
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // 格式化时间
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
// 控制修改对话框显示隐藏
const editDialogVisible = ref(false)

// 修改商品信息对话框 表单数据
let editRuleForm = reactive({
    goods_id: 0,
    goods_name: '',
    goods_price: '',
    goods_number: '',
    // goods_weight: '',
    // goods_introduce: 0,
    // pics: 0,
    // attrs: [],
    add_time: ''
})
// 表单实例
const editFormRef = ref()
// 根据id查找并展示对话框
const showEditGoods = async (id) => {
    const res = await proxy.$http.get(`/goods/${id}`)
    if (res.meta.status !== 200) return ElMessage.error('获取商品信息失败')

    editRuleForm = res.data
    editDialogVisible.value = true
}
// 表单验证规则
const editRules = reactive({
    goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
    goods_price: [{ required: true, message: '请输入商品价格（元）', trigger: 'blur' }],
    goods_number: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
    add_time: [{ required: true, message: '请输入创建时间', trigger: 'blur' }]
})

// 修改商品事件
const editGoods = async () => {
    const res = await proxy.$http.put(`/goods/${editRuleForm.goods_id}`, editRuleForm)
    if (res.meta.status !== 200) return ElMessage.error('修改失败')
    ElMessage.success('修改成功')
    editDialogVisible.value = false
    getGoodsList()
}

// 提交事件
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            editGoods()
        } else {
            console.log('error submit!', fields)
        }
    })
}


// 关闭弹窗对话框回调函数
const handleClose = () => {
    // editDialogVisible.value = false
    Object.keys(editRuleForm).forEach(key => {
        editRuleForm[key] = ''
    })
    getGoodsList()
}

// 删除商品
const deleteGoods = async (row) => {
    ElMessageBox.confirm(
        '确定要删除该商品吗？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            const res = await proxy.$http.delete(`/goods/${row.goods_id}`)
            if (res.meta.status !== 200) return ElMessage.error('删除失败')
            ElMessage.success('删除成功')
            getGoodsList()
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}

onMounted(() => {
    getGoodsList()
})
</script>

<style lang="less" scoped></style>