<template>
    <sdxu-dialog
        title="另存为"
        :visible.sync="dialogVisible"
        @close="dialogClose"
        :append-to-body="false"
    >
        <el-form
            label-width="130px"
            label-position="right"
            :model="currentData"
            :rules="rules"
            ref="saveAsForm"
        >
            <el-form-item
                label="工作流名称："
                prop="name"
            >
                <sdxu-input
                    v-model="currentData.name"
                    placeholder="请输入工作流名称"
                />
            </el-form-item>
            <el-form-item
                label="工作流描述："
                prop="description"
            >
                <sdxu-input
                    type="textarea"
                    v-model="currentData.description"
                    placeholder="请输入工作流描述"
                />
            </el-form-item>
            <el-form-item
                label="是否设置为模板："
            >
                <el-radio
                    v-model="currentData.isTemplate"
                    :label="true"
                >
                    是
                </el-radio>
                <el-radio
                    v-model="currentData.isTemplate"
                    :label="false"
                >
                    否
                </el-radio>
            </el-form-item>
            <el-form-item
                v-if="currentData.isTemplate"
                label="模板种类："
                prop="skyflowTemplate"
            >
                <el-select
                    v-model="currentData.skyflowTemplate"
                    filterable
                    allow-create
                    default-first-option
                >
                    <el-option
                        v-for="(item, i) in templateList"
                        :key="i"
                        :value="item.name"
                    />
                </el-select>
            </el-form-item>
            <el-form-item
                v-else
                label="共享设置："
            >
                <sdxw-select-group-user
                    :users.sync="currentData.users"
                    :groups.sync="currentData.groups"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <SdxuButton
                type="default"
                size="small"
                @click="dialogClose"
            >
                取消
            </SdxuButton>
            <SdxuButton
                type="primary"
                size="small"
                @click="handleConfirm"
            >
                确定
            </SdxuButton>
        </template>
    </sdxu-dialog>
</template>

<script>
import Dialog from '@sdx/ui/lib/dialog';
import SdxwSelectGroupUser from '@sdx/widget/lib/select-group-user';
import SdxuInput from '@sdx/ui/lib/input';
import SdxuButton from '@sdx/ui/lib/button';
import ElForm from 'element-ui/lib/form';
import ElFormItem from 'element-ui/lib/form-item';
import ElRadio from 'element-ui/lib/radio';
import ElSelect from 'element-ui/lib/select';
import ElOption from 'element-ui/lib/option';
import auth from '@sdx/widget/lib/auth';

import { getSkyflowTemplates } from '@sdx/utils/lib/api/skyflow';
import { cNameValidate } from '@sdx/utils/lib/helper/validate';

export default {
    name: 'SaveAs',
    directives: {
        auth
    },
    components: {
        SdxwSelectGroupUser,
        [Dialog.name]: Dialog,
        SdxuButton,
        ElForm,
        ElFormItem,
        ElRadio,
        SdxuInput,
        ElSelect,
        ElOption
    },
    props: {
        detailDialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            currentData: {
                name: '',
                description: '',
                isTemplate: false,
                skyflowTemplate: '',
                users: [],
                groups: []
            },
            templateList: [],
            rules: {
                name: [{
                    required: true,
                    message: '请填写工作流名称',
                    trigger: 'blur',
                    transform(value) {
                        return value && ('' + value).trim();
                    }
                }, {
                    validator: cNameValidate, trigger: 'blur'
                }],
                description: [{
                    required: true,
                    message: '请填写工作流描述',
                    trigger: 'blur',
                    transform(value) {
                        return value && ('' + value).trim();
                    }
                }],
                skyflowTemplate: [{
                    required: true,
                    message: '请选择模板',
                    trigger: 'change'
                }]
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
        dialogClose() {
            this.currentData = {
                name: '',
                description: '',
                isTemplate: false,
                skyflowTemplate: '',
                users: [],
                groups: []
            };
            this.templateList = [];
            this.dialogVisible = false;
        },
        handleConfirm() {
            console.error('before validate');
            this.$refs.saveAsForm.validate(valid => {
                console.error('validate', valid);
                if (valid) {
                    this.$emit('confirm', {
                        event: 'save-as',
                        data: this.currentData
                    });
                    this.dialogVisible = false;
                } else {
                    return false;
                }
            });
        },
        getTemplateList() {
            getSkyflowTemplates().then(data => {
                this.templateList = data.items;
            }).catch(() => {
                this.templateList = [];
            });
        },
        nameExistVaildator(rule, value, callback) {
            // todo: 是否需要
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
        this.getTemplateList();
    },
    watch: {
        'currentData.isTemplate'() {
            this.$refs.saveAsForm.clearValidate(['skyflowTemplate']);
        }
    }
};
</script>
