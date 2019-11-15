<template>
    <sdxu-dialog
        :visible.sync="dialogVisible"
        @close="dialogClose"
        title="模型部署"
    >
        <el-form
            label-width="110px"
            label-position="right"
            :model="modelInfoForm"
            ref="modelInfoForm"
            :rules="modelInfoFormRule"
        >
            <el-form-item
                label="模型名称："
                prop="modelName"
            >
                <el-select
                    v-model="modelInfoForm.modelName"
                    filterable
                    allow-create
                    placeholder="请输入或选择模型"
                >
                    <el-option
                        v-for="item in nameOptions"
                        :key="item.uuid"
                        :label="item.name"
                        :value="item.uuid"
                    />
                </el-select>
            </el-form-item>
            <el-form-item
                label="版本名称："
                prop="versionName"
            >
                <sdxu-input
                    v-model="modelInfoForm.versionName"
                    placeholder="请输入版本名称"
                />
            </el-form-item>
            <el-form-item
                label="版本类型："
                prop="framework"
            >
                <el-select
                    v-model="modelInfoForm.framework"
                    placeholder="请选择版本类型"
                    @change="frameworkChange"
                >
                    <el-option
                        v-for="item in frameworkOptions"
                        :key="item"
                        :label="item"
                        :value="item"
                    />
                </el-select>
            </el-form-item>
            <el-form-item
                label="版本描述："
                prop="description"
            >
                <sdxu-input
                    v-model="modelInfoForm.description"
                    type="textarea"
                    placeholder="请输入版本描述，最多可输入256个字符"
                    :rows="3"
                />
            </el-form-item>
            <el-form-item
                label="发布环境："
                prop="runtimeImage"
            >
                <el-select
                    v-model="modelInfoForm.runtimeImage"
                    placeholder="请选择发布环境"
                    :disabled="!modelInfoForm.framework"
                >
                    <el-option
                        v-for="item in runtimeImageOptions"
                        :key="item.label"
                        :label="item.label"
                        :value="item.label"
                    />
                </el-select>
            </el-form-item>
            <el-form-item
                label="资源配置："
                prop="runtimeResource"
            >
                <ResourceConfig
                    v-model="modelInfoForm.runtimeResource.cpuObj"
                    type="cpu"
                />
                <ResourceConfig
                    v-model="modelInfoForm.runtimeResource.gpuObj"
                    type="gpu"
                    v-if="isGpuEnt"
                />
            </el-form-item>
        </el-form>
        <div
            slot="footer"
        >
            <SdxuButton
                type="default"
                size="small"
                @click="cancel"
            >
                取消
            </SdxuButton>
            <SdxuButton
                type="primary"
                size="small"
                @click="confirm"
            >
                确认
            </SdxuButton>
        </div>
    </sdxu-dialog>
</template>

<script>
import { getModelList, getFrameworks, deployModel } from '@sdx/utils/lib/api/model';
import { getImageList } from '@sdx/utils/lib/api/image';
import { getCompOutputPreview } from '@sdx/utils/lib/api/skyflow';
export default {
    name: 'DeployModel',
    data() {
        return {
            dialogVisible: this.contextDialogVisible,
            nameOptions: [],
            frameworkOptions: [],
            runtimeImageOptions: [],
            modelInfoForm: {
                modelId: '',
                modelName: '',
                framework: '',
                description: '',
                versionName: '',
                runtimeImage: '',
                runtimeResource: {
                    cpuObj: {},
                    gpuObj: {}
                },
                modelPath: ''
            },
            modelInfoFormRule: {
                modelName: [
                    { required: true, message: '请选择或输入模型', trigger: 'change' }
                ],
                versionName: [
                    { required: true, message: '请输入版本名称', trigger: 'blur' }
                ],
                framework: [
                    { required: true, message: '请选择版本类型', trigger: 'change' }
                ],
                runtimeImage: [
                    { required: true, message: '请选择发布环境', trigger: 'change' }
                ],
                runtimeResource: [
                    { required: true, message: '请选择资源配置', trigger: 'change' },
                    { validator: this.validateResource, trigger: 'change' }
                ],
                description: [
                    {
                        max: 256,
                        message: '最多输入256个字符',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    props: {
        contextDialogVisible: {
            type: Boolean,
            default: false
        },
        node: {
            type: Object,
            default: null
        },
        executeId: {
            type: String,
            default: ''
        }
    },
    watch: {
        contextDialogVisible(nVal) {
            this.dialogVisible = nVal;
        }
    },
    created() {
        this.init();
    },
    computed: {
        isGpuEnt() {
            if (!this.runtimeImageOptions.length) return false;
            let item = this.runtimeImageOptions.find(item => item.value === this.modelInfoForm.runtimeImage);
            return item && item.label.includes('gpu');
        }
    },
    methods: {
        init() {
            getModelList({
                start: 1,
                count: -1
            }).then(res => {
                this.nameOptions = res.items;
            });
            getFrameworks().then(res => {
                this.frameworkOptions = res;
            });
            if (!this.node.nodeState || !this.executeId) return;
            getCompOutputPreview(this.node.nodeState.node_id, this.executeId).then(data => {
                this.modelInfoForm.modelPath = data.path;
            });
        },
        frameworkChange(nVal) {
            this.modelInfoForm.runtimeImage = '';
            const params = {
                imageType: nVal + '_DEPLOYMENT',
                start: 1,
                count: -1
            };
            getImageList(params).then(res => {
                res.data.forEach(item => this.runtimeImageOptions.push({
                    label: item.name,
                    value: item.name + ':' + item.version
                }));
            });
        },
        validateResource(rule, value, callback) {
            if (value && (!Object.keys(value.cpuObj).length || (this.isGpuEnt && !Object.keys(value.gpuObj).length))) {
                callback(new Error('请选择资源环境'));
            } else {
                callback();
            }
        },
        dialogClose() {
            this.modelInfoForm = {};
            this.$refs.modelInfoForm.clearValidate();
            this.$emit('update:contextDialogVisible', false);
        },
        cancel() {
            this.dialogVisible = false;
        },
        confirm() {
            this.$refs.modelInfoForm.validate(valid => {
                if (!valid) {
                    this.$message.error('请输入必填信息');
                } else {
                    this.modelInfoForm.runtimeResource.cpu = this.modelInfoForm.runtimeResource.cpuObj.cpu * 1000;
                    this.modelInfoForm.runtimeResource.memory = this.modelInfoForm.runtimeResource.cpuObj.memory * 1024 * 1024 * 1024;
                    if (this.isGpuEnt) {
                        this.modelInfoForm.runtimeResource.gpu = this.modelInfoForm.runtimeResource.gpuObj.count;
                        this.modelInfoForm.runtimeResource.gpuModel = this.modelInfoForm.runtimeResource.gpuObj.label;
                    }
                    this.modelInfoForm.modelId = this.nameOptions.find(item => item.uuid === this.modelInfoForm.modelName) ? this.modelInfoForm.modelName : '';
                    deployModel(this.modelInfoForm).then(() => {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.contextDialogVisible = false;
                    });
                }
            });
        }
    }
};
</script>
