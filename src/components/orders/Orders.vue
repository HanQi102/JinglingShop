<template>
    <div class="">
        <!-- 面包屑 -->
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <el-row>
                        <el-col>
                            <!-- <el-input placeholder="请输入内容" @change="getGoodsList" clearable v-model="params.query">
                                <template #append>
                                    <el-button :icon="Search" @click="getGoodsList" />
                                </template>
                            </el-input> -->
                        </el-col>
                    </el-row>
                </div>
            </template>
            <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>
            <template #footer>
                Footer content
            </template>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
import { ArrowRight, Edit, Delete, Search } from '@element-plus/icons-vue'
import { ElTable, ElMessage, ElMessageBox } from 'element-plus'

const { proxy }: any = getCurrentInstance();
// 订单数据列表数据
const ordersList = reactive([])
// 请求参数
const params = reactive({
    query: '',
    pagenum: 1,
    pagesize: 10,
    user_id: '',
    pay_status: '',
    is_send: '',
    order_fapiao_title: '',
    order_fapiao_company: '',
    order_fapiao_content: '',
    consignee_addr: '',
})

// 获取订单数据列表数据
const getOrdersList = async () => {
    const res = await proxy.$http.get(`/orders`)
    if (res.meta.status !== 200) return ElMessage.error('获取订单数据列表数据失败', params)
    console.log(res);

}

onMounted(() => {
    getOrdersList()
})
</script>

<style lang="less" scoped></style>