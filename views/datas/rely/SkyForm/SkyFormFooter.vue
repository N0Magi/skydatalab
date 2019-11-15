<template>
    <div class="sky-form-footer">
        <slot>
            <el-button
                size="small"
                @click="$emit('cancel')"
            >
                取消
            </el-button>
            <el-button
                v-if="resetable"
                size="small"
                @click="$emit('reset')"
            >
                重置
            </el-button>
            <el-button
                size="small"
                type="primary"
                @click="$emit('confirm')"
            >
                确定
            </el-button>
        </slot>
    </div>
</template>

<script>
export default {
    name: 'SkyFormFooter',
    data() {
        return {};
    },
    props: {
        resetable: {
            default: false,
            type: Boolean
        }
    }
};
</script>

<style lang="scss" scoped>
    .sky-form-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 15px 20px;
        background: #fafbfc;
        border-top: 1px solid #e6eaf2;
    }
</style>
