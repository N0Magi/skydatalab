<template>
    <div class="mutil-container skyflow-dialog">
        <sdxu-dialog
            title="多实例设置"
            :visible.sync="dialogVisible"
            width="520px"
            custom-class="selfStyle"
            :close-on-click-modal="false"
        >
            <div>
                <el-form
                    label-position="right"
                    label-width="90px"
                    @submit.native.prevent
                    :model="currentData"
                    ref="currentData"
                >
                    <!-- <el-form-item label="定时执行实例数:">
                        <el-input placeholder="请输入"
                                  style="width: 100%;"
                                  v-model='currentData.crontab_instance'
                                  disabled
                                  size='small'></el-input>
                    </el-form-item>
                    <div class='description'>
                        当前工作流中通过定时方式启动的处于“运行中”状态的执行记录数的上限。
                    </div> -->
                    <el-form-item label="执行实例数:">
                        <el-input-number
                            :min="1"
                            v-model="currentData.manual_instance"
                            style="width: 100%;"
                            size="small"
                        />
                    </el-form-item>
                    <div class="description">
                        当前工作流中处于“运行中”状态的执行记录数的上限。
                    </div>
                    <!-- <el-form-item label="重跑实例数:">
                        <el-input-number :min="1"
                                         v-model='currentData.rerun_instance'
                                         style="width: 100%;"
                                         size='small'></el-input-number>
                    </el-form-item> -->
                </el-form>
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
    name: 'MutiInstance',
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
                // rerun_instance: this.executeSetting.rerun_instance,
                manual_instance: this.executeSetting.manual_instance,
                crontab_instance: this.executeSetting.crontab_instance
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
            this.$emit('confirm', { event: 'muti-instance', data: this.currentData });
            this.executeSetting = Object.assign(this.executeSetting, this.currentData);
            this.dialogVisible = false;
        },
        initForm() {
            this.dialogVisible = false;
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" >
.mutil-container {
    .el-input-number {
        line-height: 34px;
    }
    .el-input-number__decrease {
        border-radius: 0;
        background-color: #ced6de;
    }
    .el-input-number__increase {
        border-radius: 0;
        background-color: #ced6de;
    }
    .description {
        position: relative;
        line-height: 20px;
        font-size: 12px;
        color: #576a7d;
        padding-left: 90px;
    }
}
</style>
