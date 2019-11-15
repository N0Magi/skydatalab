<template>
    <div class="star-container skyflow-dialog">
        <sdxu-dialog
            title="组件收藏"
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
import { testFavoriteExist } from '@sdx/utils/lib/api/skyflow';

export default {
    name: 'Star',
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
                    },
                    { validator: this.nameExistVaildator, trigger: 'blur' }
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
                    this.$emit('confirm', { event: 'star', data: this.currentData });
                    this.dialogVisible = false;
                } else {
                    return false;
                }
            });
        },
        initForm() {
            this.dialogVisible = false;
        },
        nameExistVaildator(rule, value, callback) {
            testFavoriteExist(value).then(data => {
                if (data.exist) {
                    callback(new Error('输入的名称已经存在'));
                } else {
                    callback();
                }
            }).catch(e => {
                console.error(e);
                callback(new Error('验证异常'));
            });
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
