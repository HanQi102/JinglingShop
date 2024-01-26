<template>
    <div class="LoginBox">
        123
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';

const { proxy }: any = getCurrentInstance()

const login = async () => {
    let res = await proxy.$http.get('/menus')
    console.log(res);
}

onMounted(() => {
    login();
})



</script>

<style lang="less" scoped>
.LoginBox {
    width: 100%;
    height: 100%;
    // background-color: red;
}
</style>