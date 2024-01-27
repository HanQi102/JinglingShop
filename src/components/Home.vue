<template>
    <div class="homeBox">
        <el-container>
            <!-- 头部 -->
            <el-header>
                <el-row>
                    <el-col :span="22">
                        <div class="left">
                            <img src="../assets/logo.png" alt="">
                            精灵购物平台管理系统
                        </div>
                    </el-col>
                    <el-col :span="2">
                        <div class="right">
                            <el-popconfirm width="220" confirm-button-text="确定" cancel-button-text="取消" :icon="InfoFilled"
                                @confirm="logout" icon-color="#626AEF" title="确定要退出登录吗?">
                                <template #reference>
                                    <el-button class="btn" type="info">退出</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                    </el-col>
                </el-row>
            </el-header>
            <el-container>
                <!-- 菜单列表 -->
                <el-aside :width="isCollapse ? '60px' : '200px'">
                    <div @click="changeIsCollapse">|||</div>
                    <el-menu active-text-color="#349EFF" router :collapse-transition="false" :collapse="isCollapse"
                        background-color="#303641" text-color="#fff" unique-opened>
                        <el-sub-menu :index="item.id.toString()" v-for="(item, index) in MenusList.data" :key="item.id">
                            <template #title>
                                <el-icon>
                                    <component :is="icons[index]"></component>
                                </el-icon>
                                <span>{{ item.authName }}</span>
                            </template>
                            <el-menu-item :index="itemChild.id.toString()" v-for="(itemChild, index) in item.children"
                                :route="`/home/${itemChild.path}`">
                                <el-icon>
                                    <Menu />
                                </el-icon>
                                {{ itemChild.authName }}</el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
import { InfoFilled, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
const { proxy }: any = getCurrentInstance();

// 退出登录
const logout = () => {
    localStorage.removeItem('token');
    proxy.$router.push('/login');
}
// 菜单列表数据
// let MenusList = ref([])
let MenusList = reactive({ data: [] })
//侧边栏图标数组
const icons = reactive([
    'User',
    'SwitchFilled',
    'MessageBox',
    'Shop',
    'Document'
])
// 获取菜单列表数据
const getMenusList = async () => {
    const res = await proxy.$http.get('/menus');
    if (res.meta.status !== 200) {
        return ElMessage.error("获取菜单列表失败");
    }
    MenusList.data = res.data
}

const isCollapse = ref(false)
// 菜单折叠事件
const changeIsCollapse = () => {
    isCollapse.value = !isCollapse.value;
}
onMounted(() => {
    getMenusList();
})

</script>

<style lang="less" scoped>
.homeBox {
    width: 100%;
    height: 100%;
    background: url(../assets/bj.jpg);

    .el-container {
        height: 100%;

        .el-header {
            background-color: #353C3E;
            padding: 0;

            .el-row {


                .el-col {
                    display: flex;
                    align-items: center;
                    height: 60px;

                    .left {
                        color: white;
                        font-size: 20px;
                        display: flex;
                        // flex-direction: column;
                        align-items: center;
                        letter-spacing: 2px;

                        img {
                            width: 50px;
                            height: 50px;
                            margin-right: 15px;
                        }


                    }

                    .right {
                        .btn {
                            padding: 18px 20px;
                        }
                    }
                }
            }
        }

        .el-container {
            height: 100%;

            .el-aside {
                height: 100%;


                div {
                    width: 100%;
                    height: 30px;
                    background-color: #303641;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    letter-spacing: 3px;

                    &:hover {
                        background-color: #262B34;
                        cursor: pointer;
                    }
                }

                .el-menu {
                    height: calc(100% - 30px);
                    border: none;

                }
            }
        }
    }
}
</style>