<template>
    <div class="exec-container skyflow-dialog">
        <sdxu-dialog
            title="执行设置"
            :visible.sync="dialogVisible"
            width="520px"
            custom-class="selfStyle"
            :close-on-click-modal="false"
        >
            <div>
                <el-form
                    label-position="right"
                    @submit.native.prevent
                    :model="currentData"
                    ref="currentData"
                >
                    <el-form-item>
                        <el-radio
                            v-model="currentData.execute_type"
                            :label="0"
                        >
                            顺序执行
                        </el-radio>
                        <el-radio
                            v-model="currentData.execute_type"
                            :label="1"
                        >
                            并行执行
                        </el-radio>
                    </el-form-item>
                </el-form>
                <div class="explain">
                    <div>
                        说明：
                    </div>
                    <div>
                        顺序执行：执行完前一个分支所有组件后，再执行后一个分支；
                    </div>
                    <div>
                        并行执行：所有的分支同时执行。
                    </div>
                </div>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    @click="initForm"
                    size="small"
                >
                    取 消
                </el-button>
                <el-button
                    type="primary"
                    size="small"
                    @click="handleSaveModel('currentData')"
                >
                    确 认
                </el-button>
            </span>
        </sdxu-dialog>
    </div>
</template>
<script>
export default {
    name: 'ExecSetting',
    props: {
        detailDialogVisible: {
            type: Boolean,
            default: true
        },
        executeSetting: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            currentData: {
                execute_type: this.executeSetting.execute_type
            }
        };
    },
    computed: {
        dialogVisible: {
            get() {
                return this.detailDialogVisible;
            },
            set(nval) {
                this.$emit('update:detailDialogVisible', nval);
            }
        }
    },
    methods: {
        handleSaveModel() {
            this.$emit('confirm', { event: 'exec-setting', data: this.currentData });
            this.executeSetting.execute_type = this.currentData.execute_type;
            this.dialogVisible = false;
        },
        initForm() {
            this.dialogVisible = false;
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.exec-container {
    .el-form-item {
        text-align: center;
    }
    .explain {
        height: 106px;
        border: 1px solid #c0cdd9;
        margin: 0 30px;
        padding: 12px;

        div:first-child {
            color: rgba(63, 89, 115, 1);
            line-height: 24px;
        }
        div:nth-child(n + 2) {
            color: rgba(63, 89, 115, 1);
            font-size: 12px;
            color: rgba(87, 106, 125, 1);
            line-height: 30px;
        }
    }
    .el-radio {
        margin: 0px 60px;
    }
}
</style>
