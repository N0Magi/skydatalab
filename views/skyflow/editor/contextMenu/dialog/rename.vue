<template>
    <div class="rename-container skyflow-dialog">
        <sdxu-dialog
            title="重命名"
            :visible.sync="dialogVisible"
            custom-class="selfStyle"
            width="520px"
            :close-on-click-modal="false"
        >
            <div>
                <el-form
                    label-position="right"
                    label-width="86px"
                    @submit.native.prevent
                    :hide-required-asterisk="true"
                    :model="currentData"
                    ref="currentData"
                    :rules="rules"
                >
                    <el-form-item
                        label="组件名称:"
                        prop="name"
                    >
                        <el-input
                            placeholder="请输入"
                            style="width: 100%;"
                            v-model="currentData.name"
                            size="small"
                        />
                    </el-form-item>
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
    name: 'Rename',
    props: {
        contextDialogVisible: {
            type: Boolean,
            default: true
        },
        node: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            currentData: {
                name: this.node.label
            },
            rules: {
                name: [
                    {
                        required: true, message: '请填写组件名称', trigger: 'blur', transform(value) {
                            return value && ('' + value).trim();
                        }
                    },
                    {
                        validator(rule, value, cb) {
                            if (value.replace(/[\u0391-\uFFE5]/g, 'aa').length > 15) {
                                cb('组件名称长度在15个字符以内');
                            } else {
                                cb();
                            }
                        }, trigger: 'blur'
                    }
                ]
            }
        };
    },
    computed: {
        dialogVisible: {
            get() {
                return this.contextDialogVisible;
            },
            set(nval) {
                this.$emit('update:contextDialogVisible', nval);
            }
        }
    },
    methods: {
        handleSaveModel(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$emit('confirm', { event: 'rename', data: { name: this.currentData.name, id: this.node.id } });
                    this.dialogVisible = false;
                } else {
                    return false;
                }
            });
        },
        initForm() {
            this.dialogVisible = false;
        }
    },
    watch: {
        node() {
            this.currentData.name = this.node.label;
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss">
</style>
