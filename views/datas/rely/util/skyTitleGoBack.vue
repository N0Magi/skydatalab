<template>
    <div class="skyBack">
        <div
            class="goBack"
            tag="div"
            @click="handleGoBack"
        >
            返回
        </div>
    <!-- <div class="title">{{title}}</div> -->
    </div>
</template>
<script>
export default {
    props: ['title'],
    methods: {
        handleGoBack() {
            this.$router.go(-1);
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.skyBack {
    height: 50px;
    line-height: 50px;
    // padding-top: 18px;
    /*margin-left: 20px;*/
    .goBack {
        display: inline-block;
        font-size: 14px;
        color: #2683e0;
        position: relative;
        padding-left: 20px;
        top:-10px;
        &:before {
            content: '';
            margin: 0 3px;
            width: 9px;
            height: 9px;
            border-bottom: 1px solid currentColor;
            border-left: 1px solid currentColor;
            transform: rotate(45deg);
            left: 5px;
            top: 21px;
            position: absolute;
        }

        &:hover {
            color: #33bcee;
            cursor: pointer;
        }
    }

    .title {
        display: inline-block;
        font-size: 14px;
        color: #666666;
        font-weight: bold;
        margin-left: 10px;
    }
}
</style>