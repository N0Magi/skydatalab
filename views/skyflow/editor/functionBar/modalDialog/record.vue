<template>
    <div class="record-container skyflow-dialog">
        <sdxu-dialog
            title="执行记录"
            :visible.sync="dialogVisible"
            width="80%"
            custom-class="selfStyle"
            :close-on-click-modal="false"
        >
            <div>
                <el-form
                    label-width="86px"
                    @submit.native.prevent
                    :model="currentData"
                    ref="currentData"
                >
                    <el-form-item label="执行时间:">
                        <el-date-picker
                            v-model="value4"
                            size="small"
                            type="datetimerange"
                            range-separator="～"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        />
                    </el-form-item>
                    <el-form-item label="执行方式:">
                        <el-select
                            placeholder="请选择"
                            size="small"
                        >
                            <el-option />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态:">
                        <el-select
                            placeholder="请选择"
                            size="small"
                        >
                            <el-option />
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </sdxu-dialog>
    </div>
</template>
<script>
export default {
    name: 'Record',
    props: {
        detailDialogVisible: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            currentData: {

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
            this.dialogVisible = false;
        },
        initForm() {
            this.dialogVisible = false;
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.record-container {
    .el-form {
        display: flex;
        justify-content: space-between;
    }
    .el-dialog {
        max-width: 1400px;
    }
}
</style>
