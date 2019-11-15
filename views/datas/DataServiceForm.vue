<template>
    <sdxu-dialog
        :visible.sync="__visible"
        size="large"
        :title="task ? '编辑数据服务' : '新建数据服务'"
        class="data-service"
        @open="open"
        @opened="$refs.dataService.clearValidate()"
        @close="$refs.dataService.clearValidate()"
        :modalAppendToBody="false"
    >
        <el-form
            label-position="right"
            label-width="120px"
            @submit.native.prevent
            ref="dataService"
            :rules="rules"
            :model="params"
        >
            <el-form-item
                prop="name"
                label="任务名称:"
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
                    :searchable="true"
                    size="small"
                    placeholder="请输入任务描述"
                    v-model="params.description"
                />
            </el-form-item>
            <el-form-item
                prop="imageId"
                label="运行环境:"
            >
                <ElSelect
                    v-model="params.imageId"
                    size="small"
                    placeholder="请输入运行环境"
                    class="self-select"
                >
                    <el-option
                        v-for="item in images"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </ElSelect>
            </el-form-item>
            <el-form-item
                prop="resourceConfig"
                label="资源配置:"
            >
                <i class="icon">*</i>
                <SdxwResourceConfig
                    v-model="cpuDriver"
                    type="cpu"
                    cpulabel="驱动器CPU/内存"
                />
                <SdxwResourceConfig
                    v-model="cpuExecute"
                    type="cpu"
                    cpulabel="执行器CPU/内存"
                />
            </el-form-item>
            <el-form-item
                prop="resourceConfig.SPARK_EXECUTOR_INSTANCES"
                label="执行器实例数:"
            >
                <el-input-number
                    v-model="params.resourceConfig.SPARK_EXECUTOR_INSTANCES"
                    :min="1"
                    :max="InputNumberMax"
                />
            </el-form-item>
        </el-form>
        <template slot="footer">
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
                @click="confirm"
            >
                确定
            </SdxuButton>
        </template>
    </sdxu-dialog>
</template>

<script>


import { getImageList } from '@sdx/utils/lib/api/image';
import { createTask, updateTask } from '@sdx/utils/lib/api/project';
import { nameWithChineseValidator } from '@sdx/utils/lib/helper/validate';
import ElSelect from 'element-ui/lib/select';
import SdxwResourceConfig from '@sdx/widget/lib/resource-config';
export default {
    name: 'DataServiceForm',
    components: {
        ElSelect,
        SdxwResourceConfig
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        task: {
            type: Object,
            default: null
        },
        createData: {
            type: Boolean,
            default: false
        }
    },
    data() {
        const resourceValidate = (rule, value, callback) => {
            if (value.SPARK_DRIVER_CPUS === 0 || Number.isNaN(value.SPARK_DRIVER_CPUS)) {
                callback(new Error('需要配置驱动器CPU/内存'));
            } else if (value.SPARK_EXECUTOR_CPUS === 0 || Number.isNaN(value.SPARK_EXECUTOR_CPUS)) {
                callback(new Error('需要配置执行器CPU/内存'));
            } else {
                callback();
            }
        };
        return {
            InputNumberMax: 100,
            params: {
                projectId: '',
                name: '',
                description: '',
                type: 'DATA_SERVICE',
                imageId: '',
                resourceConfig: {
                    SPARK_DRIVER_CPUS: 0,
                    SPARK_EXECUTOR_INSTANCES: 1,
                    SPARK_EXECUTOR_CPUS: 0,
                    SPARK_DRIVER_MEMORY: 0,
                    SPARK_EXECUTOR_MEMORY: 0
                }
            },
            images: [],
            imageOptions: [],
            cpuDriver: {},
            cpuExecute: {},
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
                'resourceConfig.SPARK_EXECUTOR_INSTANCES': [
                    { required: true, message: '请输入实例个数', trigger: 'change' }
                ]

            }
        };
    },
    computed: {
        __visible: {
            get() {
                return this.visible;
            },
            set(nval) {
                this.$emit('update:visible', nval);
            }
        }
    },

    methods: {
        open() {
            if (this.createData) {
                this.params = {
                    projectId: '',
                    name: '',
                    description: '',
                    type: 'DATA_SERVICE',
                    imageId: '',
                    resourceConfig: {
                        SPARK_DRIVER_CPUS: 0,
                        SPARK_EXECUTOR_INSTANCES: 1,
                        SPARK_EXECUTOR_CPUS: 0,
                        SPARK_DRIVER_MEMORY: 0,
                        SPARK_EXECUTOR_MEMORY: 0
                    }

                };
                this.$nextTick(() => {
                    this.$refs.dataService && this.$refs.dataService.clearValidate();
                });

                this.cpuDriver = {};
                this.cpuExecute = {};
            }
            const params = {
                imageType: 'SPARK',
                start: 1,
                count: -1,
                ownerId: this.$store.getters.userId
            };
            let options = [];
            getImageList(params)
                .then(data => {
                    for (let i = 0; i < data.data.length; i++) {
                        options.push({ value: data.data[i].uuid, label: data.data[i].name });
                    }
                    this.imageOptions = options;
                });
        },
        confirm() {
            this.$refs.dataService.validate().then(() => {
                (this.task ? updateTask(this.task.uuid, this.params) : createTask(this.params))
                    .then(() => {
                        this.$emit('update:visible', false);
                        this.$emit('refresh');
                    });
            });
        },
        dialogClose() {
            this.$emit('update:visible', false);
        }
    },

    watch: {
        task(nval) {
            if (nval) {
                this.params = { ...this.params,
                    ...{
                        projectId: '',
                        name: nval.name,
                        description: nval.description,
                        type: 'DATA_SERVICE',
                        imageId: nval.imageId,
                        resourceConfig: nval.resourceConfig
                    }
                };
                this.cpuDriver = {
                    cpu: this.params.resourceConfig.SPARK_DRIVER_CPUS / 1000,
                    memory: this.params.resourceConfig.SPARK_DRIVER_MEMORY / (1024 * 1024 * 1024),
                    uuid: `${this.params.resourceConfig.SPARK_DRIVER_CPUS / 1000}-${this.params.resourceConfig.SPARK_DRIVER_MEMORY / (1024 * 1024 * 1024)}`
                };
                this.cpuExecute = {
                    cpu: this.params.resourceConfig.SPARK_EXECUTOR_CPUS / 1000,
                    memory: this.params.resourceConfig.SPARK_EXECUTOR_MEMORY / (1024 * 1024 * 1024),
                    uuid: `${this.params.resourceConfig.SPARK_EXECUTOR_CPUS / 1000}-${this.params.resourceConfig.SPARK_EXECUTOR_MEMORY / (1024 * 1024 * 1024)}`
                };
            }
        },
        cpuDriver(val) {
            this.params.resourceConfig = {
                SPARK_DRIVER_CPUS: val.cpu * 1000,
                SPARK_EXECUTOR_INSTANCES: this.params.resourceConfig.SPARK_EXECUTOR_INSTANCES,
                SPARK_EXECUTOR_CPUS: this.params.resourceConfig.SPARK_EXECUTOR_CPUS,
                SPARK_DRIVER_MEMORY: val.memory * 1024 * 1024 * 1024,
                SPARK_EXECUTOR_MEMORY: this.params.resourceConfig.SPARK_EXECUTOR_MEMORY
            };
        },
        cpuExecute(val) {
            this.params.resourceConfig = {
                SPARK_DRIVER_CPUS: this.params.resourceConfig.SPARK_DRIVER_CPUS,
                SPARK_EXECUTOR_INSTANCES: this.params.resourceConfig.SPARK_EXECUTOR_INSTANCES,
                SPARK_EXECUTOR_CPUS: val.cpu * 1000,
                SPARK_DRIVER_MEMORY: this.params.resourceConfig.SPARK_DRIVER_MEMORY,
                SPARK_EXECUTOR_MEMORY: val.memory * 1024 * 1024 * 1024
            };
        },
        'params.imageId'() {
            this.$refs.dataService && this.$refs.dataService.clearValidate('resourceConfig');
        },
        imageOptions: {
            immediate: true,
            deep: true,
            handler(val) {
                this.images = val;
            }
        }
    }
};
</script>

<style lang="scss">

.data-service {
    .title {
        color: #909399;
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
.el-select-dropdown {
        z-index: 3000 !important;
    }
</style>
