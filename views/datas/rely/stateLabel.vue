<template>
    <span
        class="state"
        :class="[type,showBg?'showBg':'']"
    >
        <i
            class="el-icon-loading"
            v-if="showLoading"
        />
        {{ label }}
        <el-tooltip
            class="item"
            v-if="showError"
            :content="errorMsg"
            placement="top"
        >
            <i class="warning el-icon-warning" />
        </el-tooltip>
    </span>
</template>

<script>
export default {
    name: 'StateLabel',
    props: {
        showLoading: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: ''
        },
        showError: {
            type: Boolean,
            default: false
        },
        errorMsg: {
            type: String,
            default: ''
        },
        // 卡片中状态标签显示灰色背景，列表中无背景
        showBg: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style lang="scss" scoped>
	.state {
		display: inline-block;
		font-size: 14px;
        height: 24px;
		line-height: 24px;
		border-radius: 10px;
		padding: 0;
		border: none;
		min-width: 60px;
		text-align: left;
        vertical-align: middle;
        &.showBg {
            background: #f5f6fa;
            text-align: center !important;
            font-size: 12px;
            padding: 0 10px;
        }
		&.created {
			color: #0080cc;;
			// background-color: $c-created-light;
		}
		&.launching {
			color: #0075cc;
			// background-color: $c-starting-light;
		}
		&.running {
			color: #0075cc;
			// background-color: $c-running-light;
		}
		&.killing {
			color: #e5492d;
			// background-color: $c-killing-light;
		}
		&.start_failed {
			color: #e5492d;
			// background-color: $c-failed-light;
		}
		&.run_failed {
			color:#e5492d;
			// background-color: $c-failed-light;
		}
		&.kill_failed {
			color: #e5492d;
			// background-color: $c-failed-light;
		}
		&.killed {
			color: #e5492d;
			// background-color: $c-killed-light;
		}
		&.failed {
			color: #e5492d;
			// background-color: $c-failed-light;
		}
		&.finished {
			color: #00be90;
			// background-color: $c-success-light;
		}
		&.launch_abnormal {
			color:#e5492d;
			// background-color: $c-failed-light;
		}
		&.building {
			color: #0075cc;
		}
		&.builded {
			color: #0075cc;
		}
		&.uploading {
			color: #0075cc;
		}
		.warning {
			color: #d73636;
		}
	}
</style>
