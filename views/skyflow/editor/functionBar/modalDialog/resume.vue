<template>
    <div class="resume-container skyflow-dialog">
        <sdxu-dialog
            title="恢复运行"
            :visible.sync="dialogVisible"
            width="420px"
            custom-class="selfStyle"
        >
            <div class="content">
                <table>
                    <tr>
                        <td><i class="sf-icon sf-gantanhaowenti sf-tips" /></td>
                        <td><span>恢复运行会从失败或被终止的组件开始执行</span></td>
                    </tr>
                    <tr>
                        <td />
                        <td><span>点击确认继续</span></td>
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
                    @click="handleResumeModel()"
                >
                    确 认
                </el-button>
            </span>
        </sdxu-dialog>
    </div>
</template>
<script>
export default {
    name: 'Resume',
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
        handleResumeModel() {
            this.$emit('confirm', { event: 'resume' });
            this.dialogVisible = false;
        },
        closeDialog() {
            this.dialogVisible = false;
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" >
.resume-container {
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
