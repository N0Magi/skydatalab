<template>
    <div class="share-container skyflow-dialog">
        <sdxu-dialog
            title="分享设置"
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
                    <el-form-item label="分享设置:">
                        <el-radio
                            v-model="currentData.share_kind"
                            :label="2"
                        >
                            私有
                        </el-radio>
                        <el-radio
                            v-model="currentData.share_kind"
                            :label="1"
                        >
                            组内
                        </el-radio>
                        <el-radio
                            v-model="currentData.share_kind"
                            :label="3"
                            v-if="roleName === &quot;admin&quot;"
                        >
                            公共
                        </el-radio>
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
import { mapState } from 'vuex';

export default {
    name: 'Share',
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
                share_kind: this.node.shareKind
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
                ],
                description: [
                    { max: 200, message: '长度在200个字符以内', trigger: 'blur' }
                ]
            }
        };
    },
    computed: {
        ...mapState({
            roleName: state => state.user.role.name
        }),
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
                    this.$emit('confirm', { event: 'share', data: this.currentData });
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
            this.currentData = {
                share_kind: 2
            };
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss">
</style>
