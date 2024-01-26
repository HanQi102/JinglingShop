<template>
    <div class="LoginBox">
        <!-- 登录表单 -->
        <el-form ref="loginFormRef" :model="loginRuleForm" :rules="LoginRules">
            <el-form-item prop="username">
                <el-input :prefix-icon="Search" v-model="loginRuleForm.username" clearable placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item prop="password">
                <el-input :prefix-icon="Search" v-model="loginRuleForm.password" clearable show-password
                    placeholder="请输入密码" />
            </el-form-item>
            <div class="LoginBtn">
                <el-button type="primary" @click="submitForm(loginFormRef)">
                    登录
                </el-button>
                <el-button type="info" @click="resetForm(loginFormRef)">重置</el-button>
            </div>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
import { FormInstance, ElMessage } from 'element-plus'
import { Calendar, Search } from '@element-plus/icons-vue'
const { proxy }: any = getCurrentInstance()


// 用户名密码
const loginRuleForm = reactive({
    username: 'admin',
    password: '123456',
})

const loginFormRef = ref<FormInstance>()
// 表单验证规则
const LoginRules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 8, message: '用户名为5到8位', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 8, message: '密码为5到8位', trigger: 'blur' },
    ],
})
// 登录事件
const login = async () => {
    let res = await proxy.$http.post('/login', {
        username: loginRuleForm.username,
        password: loginRuleForm.password,
    })
    if (res.meta.status !== 200) {
        return ElMessage.error(res.meta.msg)
    }
    const token = res.data.token
    localStorage.setItem('token', token)
    ElMessage({
        type: 'success',
        message: res.meta.msg,
        duration: 700,
        onClose: () => {
            proxy.$router.push('/home')
        }
    })
    console.log(res);
}

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            login()
        } else {
            ElMessage.error('验证不通过请重新输入！')
        }
    })
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}







</script>

<style lang="less" scoped>
.LoginBox {
    width: 100%;
    height: 100%;
    background: url(../assets/bj.jpg);
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;

    .el-form {
        width: 300px;
        height: 160px;
        background-color: white;
        border-radius: 5px;
        padding: 80px 30px 0;
        // box-sizing: border-box;

        .LoginBtn {
            display: flex;
            justify-content: flex-end;

        }

    }
}
</style>