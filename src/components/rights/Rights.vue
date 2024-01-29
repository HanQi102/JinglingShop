<template>
    <div class="rightBox">
        <!-- 面包屑 -->
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-table :data="rightsList.data" border stripe style="width: 100%">
                <el-table-column type="index" />
                <el-table-column prop="authName" label="权限名称" />
                <el-table-column prop="path" label="路径" />
                <el-table-column prop="level" label="权限等级">
                    <template #default="scope">
                        <el-tag size="large" v-if="scope.row.level == '0'">一级</el-tag>
                        <el-tag size="large" v-else-if="scope.row.level == '1'" type="success">二级</el-tag>
                        <el-tag size="large" v-else type="warning">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
import { ArrowRight } from '@element-plus/icons-vue'
import { ElTable, ElMessage } from 'element-plus'


const { proxy }: any = getCurrentInstance();
// 权限列表数据
const rightsList = reactive({ data: [] })
// 获取权限列表数据
const getRightsList = async () => {
    const res = await proxy.$http.get(`/rights/list`)
    if (res.meta.status !== 200) return ElMessage.error("获取权限列表失败")
    rightsList.data = res.data;
    console.log(rightsList.data);
}
onMounted(() => {
    getRightsList()
})
</script>

<style lang="less" scoped></style>