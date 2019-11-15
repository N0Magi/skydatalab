<template>
    <div
        class="card-btn"
        v-loading="loading"
        element-loading-spinner="el-icon-loading"
        :class="{isloading: loading}"
    >
        <template v-if="theme === 'simple'">
            <i
                class="tooltip-btn iconfont"
                :class="icon"
                :title="label"
            />
        </template>
        <template v-else>
            <i
                class="btn-item iconfont"
                :class="icon"
            />
            <span class="btn-item label">
                {{ label }}
            </span>
        </template>
    </div>
</template>

<script>
const TYPE_CONF = {
    start: { icon: 'iconicon-yunxing', label: '启动' },
    kill: { icon: 'icontingzhi', label: '停止' },
    remove: { icon: 'iconicon-delete1', label: '删除' },
    restart: { icon: 'icon-restart', label: '重启' },
    detail: { icon: 'iconicon-yanjing', label: '详情' },
    edit: { icon: 'iconicon-edit1', label: '编辑' },
    copy: { icon: 'iconkaobei', label: '拷贝' },
    canvas: { icon: 'iconhuabu', label: '画布' }
};
export default {
    name: 'CardBtn',
    props: {
        type: {
            type: String,
            default: ''
        },
        theme: {
            type: String,
            // 目前仅有simple和其他任意，用于展示两种风格的按钮，simple为tooltip形式，其他则在鼠标移入时显示动画效果
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            TYPE_CONF
        };
    },
    computed: {
        icon() {
            return this.TYPE_CONF[this.type] && this.TYPE_CONF[this.type].icon;
        },
        label() {
            return this.TYPE_CONF[this.type] && this.TYPE_CONF[this.type].label;
        }
    }
};
</script>
<style lang="scss">
    @import "../../../assets/styles/base/constants";
    @import "../../../assets/styles/base/colors";
.card-btn {
    display: inline-block;
    height: 100%;
    overflow: hidden;
    position: relative;
    font-size: $fs-h2;
    &.isloading {
        pointer-events: none;
        cursor: default;
    }
    .tooltip-btn {
        display: inline-block;
        text-align: center;
        // height: 100%;
        width: 100%;
        // line-height: 36px;
        font-size: 14px;
        // color: $gray;
        cursor: pointer;
        &.disabled {
            cursor: not-allowed;
            color: $gray;
            opacity: 0.5;
        }
    }
    .btn-item {
        display: inline-block;
        text-align: center;
        height: 100%;
        width: 100%;
        line-height: 36px;
        font-size: $fs-h2;
        color: #409EFF;
        cursor: pointer;
        transition: all ease-in-out 0.3s;
    }
    .iconfont{
        color: #409EFF;
    }
    .label {
        font-size: $fs-content;
    }
    &:hover {
        .btn-item {
            transform: translate(0, -100%);
            color: #409EFF;
            transition: all ease-in-out 0.3s;
        }
    }
}
</style>
