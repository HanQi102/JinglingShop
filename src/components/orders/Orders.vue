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
                        <el-col :span="8">
                            <el-input placeholder="请输入内容" @change="getOrdersList" clearable v-model="params.query">
                                <template #append>
                                    <el-button :icon="Search" @click="getOrdersList" />
                                </template>
                            </el-input>
                        </el-col>
                    </el-row>
                </div>
            </template>
            <el-table :data="ordersList.data" border stripe style="width: 100%">
                <el-table-column type="index" />
                <el-table-column prop="order_number" label="订单编号" min-width="120" />
                <el-table-column prop="order_price" label="订单价格" width="80" />
                <el-table-column prop="order_pay" label="是否付款" width="80" />
                <el-table-column prop="is_send" label="是否发货" width="80" />
                <el-table-column prop="create_time" label="下单时间">
                    <template #default="scope">
                        {{ timesTamp(scope.row.update_time) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template #default='scope'>
                        <el-button type="primary" :icon="Edit" @click="showEditDialog(scope.row)" />
                        <el-button type="success" :icon="Location" @click="showScheduleDialog" />
                    </template>
                </el-table-column>
            </el-table>
            <template #footer>
                Footer content
            </template>
        </el-card>
        <!-- 修改地址对话框 -->
        <el-dialog v-model="orderDialogVisible" title="修改地址" width="50%" @close="handleClose">
            <el-form ref="orderFormRef" :model="orderForm" :rules="Rules" label-width="120px">
                <el-form-item label="省市区/县" prop="name">
                    <el-cascader :options="cityOptions_" placeholder="请选择省市区/县" change-on-select>
                    </el-cascader>

                </el-form-item>
                <el-form-item label="详细地址" prop="consignee_addr">
                    <el-input v-model="orderForm.consignee_addr" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="orderDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="orderDialogVisible = false">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 物流进度对话框 -->
        <el-dialog v-model="scheduleDialogVisible" title="物流进度" width="60%" @close="handleClose">
            <el-timeline>
                <el-timeline-item v-for="(activity, index) in schedule" :key="index" :timestamp="activity.ftime">
                    {{ activity.context }}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import timesTamp from '../../utils/timesTamp.ts'
import cityOptions from '../../utils/city_data2017_element.js'
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
import { ArrowRight, Edit, Location, Search } from '@element-plus/icons-vue'
import { ElTable, ElMessage, ElMessageBox } from 'element-plus'

const { proxy }: any = getCurrentInstance();
// 订单数据列表数据
const ordersList = reactive({ data: [] })
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
    const res = await proxy.$http.get(`/orders`, {
        params: params
    })
    if (res.meta.status !== 200) return ElMessage.error('获取订单数据列表数据失败')
    ordersList.data = res.data.goods
    console.log(ordersList);
}
// 控制修改地址对话框显示隐藏
const orderDialogVisible = ref(false)

let orderForm = reactive({
    consignee_addr: '',
})
const Rules = reactive({
    consignee_addr: [
        { required: true, message: '请输入详细地址', trigger: 'blur' },
    ],
})

// data中绑定数据
const cityOptions_ = ref(cityOptions)

const showEditDialog = (row) => {

    orderForm = row
    console.log(orderForm);

    orderDialogVisible.value = true
}



// 控制物流进度对话框显示隐藏
const scheduleDialogVisible = ref(false)
// 物流进度数据
const schedule = reactive([
    {
        "time": "2018-05-10 09:39:00",
        "ftime": "2018-05-10 09:39:00",
        "context": "已签收,感谢使用顺丰,期待再次为您服务",
        "location": ""
    },
    {
        "time": "2018-05-10 08:23:00",
        "ftime": "2018-05-10 08:23:00",
        "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
        "location": ""
    },
    {
        "time": "2018-05-10 07:32:00",
        "ftime": "2018-05-10 07:32:00",
        "context": "快件到达 [北京海淀育新小区营业点]",
        "location": ""
    },
    {
        "time": "2018-05-10 02:03:00",
        "ftime": "2018-05-10 02:03:00",
        "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
        "location": ""
    },
    {
        "time": "2018-05-09 23:05:00",
        "ftime": "2018-05-09 23:05:00",
        "context": "快件到达 [北京顺义集散中心]",
        "location": ""
    },
    {
        "time": "2018-05-09 21:21:00",
        "ftime": "2018-05-09 21:21:00",
        "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
        "location": ""
    },
    {
        "time": "2018-05-09 13:07:00",
        "ftime": "2018-05-09 13:07:00",
        "context": "顺丰速运 已收取快件",
        "location": ""
    },
    {
        "time": "2018-05-09 12:25:03",
        "ftime": "2018-05-09 12:25:03",
        "context": "卖家发货",
        "location": ""
    },
    {
        "time": "2018-05-09 12:22:24",
        "ftime": "2018-05-09 12:22:24",
        "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
        "location": ""
    },
    {
        "time": "2018-05-08 21:36:04",
        "ftime": "2018-05-08 21:36:04",
        "context": "商品已经下单",
        "location": ""
    }
])
// 显示物流进度对话框
const showScheduleDialog = () => {
    scheduleDialogVisible.value = true
}
// 关闭弹窗对话框回调函数
const handleClose = () => {
    orderDialogVisible.value = false

}

onMounted(() => {
    getOrdersList()
})
</script>

<style lang="less" scoped>
.el-cascader {
    width: 100%;
}
</style>