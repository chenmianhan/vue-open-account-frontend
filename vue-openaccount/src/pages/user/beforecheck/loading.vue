<template>
<div>
    <!-- 面包屑 -->
    <div class="bread">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>开户</el-breadcrumb-item>
            <el-breadcrumb-item>账户状态</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <img src="../../../assets/image/wait.gif" class="image">
    <h1>您的资料待审核......</h1>
    <h3>如有问题，请联系客服：xxx-xxxx-xxxx</h3>
</div>
</template>

<script>
export default {
    data(){
        return{

        }
    }
}
</script>

<style scoped>
.image{
    width: 30%;
}
.bread{
    margin: 10px;
}
</style>
