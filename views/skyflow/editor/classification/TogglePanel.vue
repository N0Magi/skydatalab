<template>
    <div class="skyflow-toggle-panel">
        <div class="skyflow-toggle-panel_header">
            <div v-show="!panelExpand">
                {{ label }}
            </div>
            <div class="flex-placeholder" />
            <div class="run-params_header-action">
                <div class="action-item_icon">
                    <i
                        v-if="removable"
                        class="delete-group-icon sf-icon sf-shanchu"
                        @click.stop.prevent="$emit('delete')"
                    />
                </div>
                <div
                    class="action-item_icon"
                    :class="{close: !panelExpand}"
                >
                    <i
                        class="el-icon-arrow-down"
                        @click.stop="panelExpand=!panelExpand"
                        style="font-size: 18px;color:#333;"
                    />
                </div>
            </div>
        </div>
        <div
            class="skyflow-toggle-panel_body"
            v-show="panelExpand"
        >
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: 'TogglePanel',
    props: {
        expand: {
            type: Boolean,
            default: false
        },
        label: {
            type: String,
            default: ''
        },
        removable: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        panelExpand: {
            get() {
                return this.expand;
            },
            set(val) {
                this.$emit('update:expand', val);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
    .skyflow-toggle-panel {
        border: 1px solid #dedede;
        padding: 5px 15px 5px;
        margin-left: -15px;
        margin-right: -15px;
        position: relative;
        .skyflow-toggle-panel_header {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 18px;
            line-height: 1;
            height: 24px;
            .flex-placeholder {
                flex: 1;
            }
            .run-params_header-action {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                .action-item_icon {
                    transition: transform ease-in .2s;
                    i {
                        font-size: 24px;
                        color: #DEE4EC;
                        cursor: pointer;
                    }
                    & + .action-item_icon {
                        margin-left: 10px;
                    }
                    &.close {
                        transform: rotate(-90deg);
                    }
                }
            }

        }
        .skyflow-toggle-panel_body {
            margin-top: 10px;
        }
    }
</style>
