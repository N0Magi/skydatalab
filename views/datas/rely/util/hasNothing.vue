<template>
    <div
        class="has_nothing"
        :class="size"
    >
        <div
            class="dataframe-box nothing"
            v-if="picType === 'dataframe'"
        />
        <div
            class="inner-box nothing"
            v-else
        />
    </div>
</template>

<script>
export default {
    name: 'HasNothing',
    props: {
        size: {
            type: String,
            default: ''
        },
        picType: {
            type: String,
            default: ''
        }
    }
};
</script>

<style lang='scss' scoped>
.has_nothing {
    width: 100%;
    height: 200px;
    font-size: 0;
    text-align: center;
    &.small {
        .nothing {
            width: 250px;
            height: 300px;
            background-size: 100%;
            &::before {
                vertical-align: -150px;
            }
        }
    }
    &.big {
        height: 400px;
    }
    .nothing {
        display: inline-block;
        vertical-align: middle;
        position: relative;
        width: 328px;
        height: 230px;
        text-align: center;
        color: #95a6af;
        // &::before {
        //     font-size: 16px;
        //     content: '暂无结果';
        //     display: inline-block;
        //     vertical-align: -200px;
        // }
    }
    .inner-box {
        background: url(../../../../assets/images/state/empty.png)  center no-repeat;
        background-size: 70% !important;
    }
    .dataframe-box {
        background-size: 90% !important;
        background: url(../../../../assets/images/state/dataframe.png)  center no-repeat;
    }
    &::after {
        content: '';
        height: 100%;
        display: inline-block;
        vertical-align: middle;
    }
}
</style>
