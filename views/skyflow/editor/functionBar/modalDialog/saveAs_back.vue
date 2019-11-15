<template>
    <div class="saveas-container skyflow-dialog">
        <sdxu-dialog
            title="另存为"
            :visible.sync="dialogVisible"
            custom-class="selfStyle"
            width="520px"
            :close-on-click-modal="false"
        >
            <div>
                <el-form
                    label-position="right"
                    label-width="110px"
                    @submit.native.prevent
                    :model="currentData"
                    ref="currentData"
                    :rules="rules"
                >
                    <el-form-item
                        label="另存至:"
                        prop="skyflow_project_id"
                    >
                        <el-select
                            placeholder="请选择"
                            style="width: 100%;"
                            v-model="currentData.skyflow_project_id"
                            size="small"
                        >
                            <el-option
                                v-for="(item, i) in skyflowProjectList"
                                :key="i"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="工作流名称:"
                        prop="name"
                    >
                        <el-input
                            placeholder="请输入"
                            style="width: 100%;"
                            v-model="currentData.name"
                            :disabled="!currentData.skyflow_project_id"
                            size="small"
                        />
                    </el-form-item>
                    <el-form-item
                        label="工作流描述:"
                        prop="description"
                    >
                        <el-input
                            type="textarea"
                            placeholder="请输入"
                            style="width: 100%;"
                            v-model="currentData.description"
                            :disabled="!currentData.skyflow_project_id"
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
import {
    getSkyflowOptions,
    testSkyflowNameExist
} from '@sdx/utils/lib/api/skyflow';
import { cNameValidate } from 'utils/validate';

export default {
    name: 'SavaAs',
    props: {
        detailDialogVisible: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            currentData: {
                name: '',
                description: '',
                skyflow_project_id: ''
            },
            skyflowProjectList: [],
            rules: {
                name: [
                    {
                        required: true,
                        message: '请填写工作流名称',
                        trigger: 'blur',
                        transform(value) {
                            return value && ('' + value).trim();
                        }
                    },
                    { validator: cNameValidate, trigger: 'blur' },
                    { validator: this.nameExistVaildator, trigger: 'blur' }
                ],
                description: [
                    {
                        required: true,
                        message: '请填写工作流描述',
                        trigger: 'blur',
                        transform(value) {
                            return value && ('' + value).trim();
                        }
                    }
                ],
                skyflow_project_id: [
                    {
                        required: true,
                        message: '请选择需要保存到的项目',
                        trigger: 'change'
                    }
                ]
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
        handleSaveModel(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$emit('confirm', { event: 'save-as', data: this.currentData });
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
            testSkyflowNameExist({
                skyflow_project_id: this.currentData.skyflow_project_id,
                name: value
            })
                .then(data => {
                    if (data.exist) {
                        callback(new Error('输入的名称已经存在'));
                    } else {
                        callback();
                    }
                })
                .catch(e => {
                    console.error(e);
                    callback(new Error('验证异常'));
                });
        }
    },
    created() {
    // 请求另存至列表
        getSkyflowOptions()
            .then(data => {
                console.log(data);
                this.skyflowProjectList = data;
            })
            .catch(e => {
                console.error(e);
                this.skyflowProjectList = [];
            });
    }
};
</script>
<style rel="stylesheet/scss" lang="scss">
</style>
