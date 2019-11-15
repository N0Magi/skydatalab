<template>
    <div class="sky-panel shadow">
        <div
            class="sky-panel_header"
            v-if="$slots['header-right'] || $slots['header-left']"
        >
            <div class="sky-panel_header_left">
                <slot name="header-left" />
            </div>
            <div class="sky-panel_header_right">
                <slot name="header-right" />
            </div>
        </div>
        <div class="sky-panel_body">
            <slot />
        </div>
        <div
            class="sky-panel_footer"
            v-if="$slots.footer"
        >
            <slot name="footer" />
        </div>
    </div>
</template>
<script>
export default {
    name: 'SkyPanel',
    data() {
        return {};
    }
};
</script>

<style lang="scss" scoped>
	.sky-panel {
		width: 100%;
		background: #fff;
		.sky-panel_header {
			width: 100%;
			height: 61px;
			padding: 0 20px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid #e6eaf2;
			font-size: 16px;
			color: #45474c;
		}
		.sky-panel_body {
			width: 100%;
			height: calc(100% - 61px);
		}
		.sky-panel_footer {
			background: #fafbfc;
			padding: 10px 20px;
			text-align: right;
			border-top: 1px solid #e6eaf2;
		}
	}
</style>
