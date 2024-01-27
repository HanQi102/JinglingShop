<template>
    <div class="welcomeBox">
        <img src="../../assets/jinglingBg2.png" alt="">

        <p>欢迎来到<span>精灵购物</span>平台管理系统</p>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

</script>

<style lang="less" scoped>
.welcomeBox {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
        width: 50%;
        flex: 3;
    }

    p {
        font-size: 60px;
        font-weight: 600;
        color: white;
        flex: 2;

        span {
            font-size: 80px;
            color: #3cd6e3;
        }
    }
}
</style>