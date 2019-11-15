<template>
    <div class="data-form-jupyter">
        <sky-title-go-back />
        <BaseForm
            title="新建Jupyter任务"
            class="form-jupyter"
            :label-width="100"
            icon="sdx-Jupter"
            @commit="commit"
            commit-title="确定并启动"
        >
            <el-form
                label-position="right"
                label-width="100px"
                slot="form"
                @submit.native.prevent
                ref="jupyter"
                :rules="rules"
                :model="params"
            >
                <el-form-item
                    label="项目名称:"
                    prop="projectId"
                >
                    <el-select
                        v-model="params.projectId"
                        placeholder="请选择或输入项目名称"
                        size="small"
                        class="project"
                        filterable
                        allow-create
                        @change="allowCreateProject"
                    >
                        <el-option
                            v-for="item in projects"
                            :key="item.label"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="任务名称:"
                    prop="name"
                >
                    <SdxuInput
                        v-model="params.name"
                        :searchable="true"
                        size="small"
                        placeholder="请输入任务名称"
                    />
                </el-form-item>
                <el-form-item
                    prop="description"
                    label="任务描述:"
                >
                    <SdxuInput
                        type="textarea"
                        v-model="params.description"
                        size="small"
                        placeholder="请输入任务描述"
                    />
                </el-form-item>
                <el-form-item
                    prop="imageId"
                    label="运行环境:"
                >
                    <el-select
                        v-model="params.imageId"
                        :searchable="true"
                        size="small"
                        placeholder="请选择运行环境"
                    >
                        <el-option
                            v-for="item in imageOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    prop="resourceConfig"
                    label="资源配置:"
                >
                    <i class="icon">*</i>
                    <SdxwResourceConfig
                        v-if="!isGpuEnt"
                        v-model="cpuObj"
                        type="onlycpu"
                    />

                    <div v-if="isGpuEnt">
                        <SdxwResourceConfig
                            v-model="cpuObj"
                            type="cpu"
                        />
                        <SdxwResourceConfig
                            v-model="gpuObj"
                            type="gpu"
                        />
                    </div>
                </el-form-item>
                <el-form-item
                    v-if="!is_cooperate"
                    prop="datasources"
                    label="数据源:"
                >
                    <data-source-select v-model="params.datasources" />
                </el-form-item>
                <el-form-item
                    prop="datasets"
                    label="数据集:"
                >
                    <el-select
                        v-model="params.datasets"
                        size="small"
                        placeholder="请选择数据集"
                        multiple
                        disabled
                    >
                        <el-option
                            v-for="item in datasetsOptions"
                            :key="item.label"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
        </BaseForm>
    </div>
</template>

<script>

import ProjectManagemenet from '@sdx/view/lib/project-management';
import Form from 'element-ui/lib/form';
import FormItem from 'element-ui/lib/form-item';
import Select from 'element-ui/lib/select';
import SdxuInput from '@sdx/ui/lib/input';
import { getImageList } from '@sdx/utils/lib/api/image';
import SdxwResourceConfig from '@sdx/widget/lib/resource-config';
import { createTask, getProjectList, createProject, startTask } from '@sdx/utils/lib/api/project';
import { nameWithChineseValidator } from '@sdx/utils/lib/helper/validate';
import SkyTitleGoBack from './rely/skyTitleGoBack';
import { getDatasetInfo } from './rely/dataApi';

export default {
    name: 'JupyterForm',
    components: {
        BaseForm: ProjectManagemenet.BaseForm,
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Select.name]: Select,
        SdxuInput,
        SdxwResourceConfig,
        DataSourceSelect: ProjectManagemenet.DataSourceSelect,
        SkyTitleGoBack
    },
    data() {
        const resourceValidate = (rule, value, callback) => {
            if (this.isGpuEnt) {
                if (value.EXECUTOR_CPUS === 0) {
                    callback(new Error('需要配置CPU/内存资源'));
                } else if (value.EXECUTOR_GPUS === 0) {
                    callback(new Error('需要配置GPU资源'));
                } else {
                    callback();
                }
            } else {
                if (value.EXECUTOR_CPUS === 0) {
                    callback(new Error('需要配置CPU/内存资源'));
                } else {
                    callback();
                }
            }
        };
        return {
            params: {
                projectId: '',
                name: '',
                description: '',
                type: 'JUPYTER',
                imageId: '',
                resourceConfig: {
                    EXECUTOR_INSTANCES: 1,
                    EXECUTOR_CPUS: 0,
                    EXECUTOR_GPUS: 0,
                    EXECUTOR_MEMORY: 0,
                    GPU_MODEL: ''
                },
                datasources: [],
                datasets: []
            },
            imageOptions: [],
            cpuObj: {},
            gpuObj: {},
            datasetsOptions: [],
            projects: [],
            rules: {
                name: [
                    { required: true, message: '请输入任务名称', trigger: 'blur',
                        transform(value) {
                            return value && ('' + value).trim();
                        }
                    },
                    { validator: nameWithChineseValidator, trigger: 'blur' }
                ],
                imageId: [
                    { required: true, message: '请选择运行环境', trigger: 'change' }
                ],
                resourceConfig: [
                    {
                        validator: resourceValidate,
                        trigger: 'change'
                    }
                ],
                projectId: [
                    { required: true, message: '请选择项目名称', trigger: 'change' }
                ]
            }
        };
    },
    computed: {
        isGpuEnt() {
            let isGpuEnt = false;
            for (let i = 0; i < this.imageOptions.length; i++) {
                if (this.imageOptions[i].value === this.params.imageId) {
                    if (this.imageOptions[i].label.includes('gpu')) {
                        isGpuEnt = true;
                    } else {
                        isGpuEnt = false;
                    }
                }
            }
            return isGpuEnt;
        },
        // 判断选中的项目自建还是协助
        is_cooperate() {
            let [checkProject, is_coop] = [this.projects.filter(v => v.value === this.params.projectId), true];
            if (checkProject.length === 0 && this.params.projectId) {
                is_coop = false;
            } else if (checkProject.length > 0) {
                is_coop = checkProject[0].type === 'public';
            } else if (this.params.projectId === '') {
                is_coop = true;
            }
            return is_coop;
        }
    },
    created() {
        this.getInfo();
        this.imageList();
    },
    methods: {
        // 数据集信息
        async getInfo() {
            let res = await this.getDataInfo();
            this.params.datasets = [res.data._id];
            this.datasetsOptions = [{ value: res.data._id, label: res.data.name }];
            let [type, params] = ['', {
                start: 1,
                count: -1
            }];
            if (!(res && res.data.users.length) && !res.data.groups.length && !res.data.is_public) {
                type = 'private';
            } else {
                type = 'public';
            }
            this.projectList(Object.assign({}, params, { type }));
        },
        // 获取项目列表
        projectList(params) {
            getProjectList(params)
                .then(res => {
                    this.projects = res.data.items.map(item => ({
                        label: item.name,
                        value: item.uuid,
                        type: item.type
                    }));
                });
        },
        allowCreateProject() {
            let arr = this.projects.filter(v => v.value === this.params.projectId);
            if (!arr.length && this.params.projectId) {
                createProject({ name: this.params.projectId })
                    .then(data => {
                        let id = data.uuid;
                        getProjectList({ type: 'private', start: 1, count: -1 })
                            .then(res => {
                                this.projects = res.data.items.map(item => ({
                                    label: item.name,
                                    value: item.uuid,
                                    type: item.type
                                }));
                                this.$nextTick(() => {
                                    this.params.projectId = id;
                                });
                            });
                    });
            }
        },
        // 根据数据id查询数据集信息
        getDataInfo() {
            return new Promise(
                (resolve, reject) => {
                    getDatasetInfo({ dataset: this.$route.params.dataset })
                        .then(data => resolve(data))
                        .catch(error => {
                            reject(error);
                        });
                }
            );
        },
        imageList() {
            const params = {
                imageType: 'JUPYTER',
                start: 1,
                count: -1,
                ownerId: this.$store.getters.userId || ''
            };
            getImageList(params)
                .then(data => {
                    for (let i = 0; i < data.data.length; i++) {
                        this.imageOptions.push({ value: data.data[i].uuid, label: data.data[i].name });
                    }
                });
        },
        commit() {
            this.$refs.jupyter.validate().then(() => {
                createTask(this.params)
                    .then(res => {
                        let id = res.uuid;
                        startTask(id, { isAuto: false })
                            .then(() => {
                                this.$router.go(-1);
                                window.open(`/#/jupyterurl/${id}/${this.$route.params.dataset}`);
                            });
                    });
            });
        }
    },
    watch: {
        cpuObj(val) {
            this.params.resourceConfig = {
                EXECUTOR_INSTANCES: 1,
                EXECUTOR_CPUS: val.cpu * 1000,
                EXECUTOR_GPUS: this.params.resourceConfig.EXECUTOR_GPUS,
                EXECUTOR_MEMORY: val.memory * 1024 * 1024 * 1024,
                GPU_MODEL: this.params.resourceConfig.GPU_MODEL
            };
        },
        gpuObj(val) {
            this.params.resourceConfig = {
                EXECUTOR_INSTANCES: 1,
                EXECUTOR_CPUS: this.params.resourceConfig.EXECUTOR_CPUS,
                EXECUTOR_GPUS: val.count,
                EXECUTOR_MEMORY: this.params.resourceConfig.EXECUTOR_MEMORY,
                GPU_MODEL: val.label
            };
        },
        'params.imageId'() {
            this.$refs.jupyter.clearValidate('resourceConfig');
        }
    }
};
</script>

<style lang="scss" scoped>
    .data-form-jupyter {
        .title {
            color: #909399;
        }
        .el-form-item__content {
            position: relative;
        }
        .icon {
            color: #F56C6C;
            position: absolute;
            top: 2px;
            left: -83px;
        }
        .sdxw-file-select {
            max-width: 560px;
        }
    }
</style>
