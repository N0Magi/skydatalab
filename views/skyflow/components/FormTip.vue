<template>
    <div
        class="form-tip"
        :style="{color: color}"
    >
        <slot />
    </div>
</template>

<script>
export default {
    name: 'FormTip',
    props: {
        color: {
            type: String,
            default: '#C9D2E1'
        }
    }
};
</script>

<style scoped>
    .form-tip {
        line-height: 1.5;
        font-size: 12px;
        color: #C9D2E1;
        display: block;
        padding: 10px 0 5px;
    }
</style>
