<template>
    <el-breadcrumb
        class="app-levelbar"
        separator="/"
    >
        <el-breadcrumb-item
            v-for="(item,index) in levelList"
            :key="index"
        >
            <router-link
                v-if="item.redirect"
                :to="item.redirect"
            >
                {{ item.meta.name }}
            </router-link>
            <router-link
                v-else
                :to="index===levelList.length-1?'':item.path"
            >
                {{ item.meta.name }}
            </router-link>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    created() {
        this.getBreadcrumb();
    },
    data() {
        return {
            levelList: null
        };
    },
    methods: {
        getBreadcrumb() {
            this.levelList = this.$route.matched.filter(item => item.meta.name);
        }
    },
    watch: {
        $route() {
            this.getBreadcrumb();
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.app-levelbar.el-breadcrumb {
    display: inline-block;
    font-size: 16px;
    line-height: 57px;
    margin-left: 10px;
    & /deep/ .el-breadcrumb__inner a{
        color:#fff;
    }
    & /deep/ .el-breadcrumb__inner a:hover{
         color:#fff;
    }
    & /deep/ .no-redirect {
        color: #2683e0;
        cursor: text;
    }
}
</style>
