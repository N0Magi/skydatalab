<template>
    <div class="clear-container skyflow-dialog">
        <sdxu-dialog
            title="清空项目"
            :visible.sync="dialogVisible"
            width="420px"
            custom-class="selfStyle"
        >
            <div class="content">
                <table>
                    <tr>
                        <td><i class="sf-icon sf-gantanhaowenti icon-tips" /></td>
                        <td><span>确认清除当前画布吗？</span></td>
                    </tr>
                </table>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    @click="closeDialog"
                    size="small"
                >
                    取 消
                </el-button>
                <el-button
                    type="primary"
                    size="small"
                    @click="handleClearModel()"
                >
                    确 认
                </el-button>
            </span>
        </sdxu-dialog>
    </div>
</template>
<script>
export default {
    name: 'Clear',
    props: {
        detailDialogVisible: {
            type: Boolean,
            default: true
        }
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
        handleClearModel() {
            this.$emit('confirm', { event: 'clear' });
            this.dialogVisible = false;
        },
        closeDialog() {
            this.dialogVisible = false;
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" >
.clear-container {
    .el-dialog__body {
        padding: 40px 20px;
        .content {
            color: #3F5973;
            table {
                margin: 0 auto 0;
                .icon-tips {
                    color: #ffc500;
                    font-size: 26px;
                    margin-right: 16px;
                }
            }
        }
    }
}
</style>
