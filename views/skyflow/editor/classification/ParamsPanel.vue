<template>
    <div class="params-panel">
        <div
            class="params-panel_header"
            v-if="title"
        >
            <span class="params-panel_header_title">
                {{ title }}
            </span>
            <div class="params-panel_header_action">
                <slot name="action" />
            </div>
        </div>
        <div class="params-panel_body">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: 'ParamsPanel',
    props: {
        title: {
            type: String,
            default: ''
        }
    }
};
</script>

<style lang="scss" scoped>
    .params-panel {
        width: 100%;
        padding: 20px 10px 10px;
        .params-panel_header {
            font-size: 14px;
            font-family: siyuan-rg;
            color: rgba(39, 63, 88, 1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            line-height: 1;
            margin-bottom: 20px;
            .params-panel_header_title {
                font-weight: bold !important;
            }
            .params-panel_header_action {
                display: flex;
                align-items: center;
                justify-content: flex-start;
            }
        }
        & + .params-panel {
            border-top: 1px solid rgba(222, 228, 236, 1);
        }
        .params-panel {
            border-top: 1px solid rgba(222, 228, 236, 1);
        }
    }
</style>
