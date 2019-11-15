<template>
    <div class="environment-group">
        <div class="setting-type">
            <hr class="setting-line">
            <span>运行环境</span>
        </div>
        <div class="setting-options">
            <label>运行环境</label>
            <span>
                {{ dockerImage && dockerImage.name }}
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'EnvironmentSetting',
    props: {
        dockerImage: {
            type: Object,
            default: null
        }
    }
};
</script>

<style lang="scss" scoped>
    .environment-group {
        .setting-options {
            margin: 10px 12px 14px 20px;
            width: 220px;
            span {
                display: block;
                font-size: 12px;
                color: #6f8396;
                word-break: break-all;
                width: 210px;
            }
            label {
                font-size: 14px;
                color: #3f5973;
                line-height: 26px;
                display: inline;
            }
        }

    }
</style>
