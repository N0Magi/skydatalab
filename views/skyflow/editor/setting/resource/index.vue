<template>
    <div class="setting-group">
        <div class="setting-type">
            <hr class="setting-line">
            <span>资源配置</span>
        </div>
        <div class="setting-options">
            <div
                class="setting-options-item"
                v-if="executorCPU"
            >
                <ResourceConfig
                    v-model="executorCPU"
                    type="cpu"
                    :required="true"
                    :read-only="!isEditable"
                    :data-ready="true"
                />
            </div>
            <div
                class="setting-options-item"
                v-if="executorGPU"
            >
                <ResourceConfig
                    v-model="executorGPU"
                    type="gpu"
                    :show-error="false"
                    :read-only="!isEditable"
                    :data-ready="true"
                />
            </div>
            <div
                class="setting-options-item"
                v-if="sparkDriverCPU"
            >
                <ResourceConfig
                    v-model="sparkDriverCPU"
                    type="cpu"
                    cpulabel="Driver CPU/内存"
                    :required="true"
                    :read-only="!isEditable"
                    :data-ready="true"
                />
            </div>
            <div
                class="setting-options-item"
                v-if="sparkExecutorCPU"
            >
                <ResourceConfig
                    v-model="sparkExecutorCPU"
                    type="cpu"
                    cpulabel="Executor CPU/内存"
                    :required="true"
                    :read-only="!isEditable"
                    :data-ready="true"
                />
            </div>
        </div>
    </div>
</template>

<script>
import ResourceConfig from '@sdx/widget/lib/resource-config';
import { TASK_KIND } from '../../util/const';

export default {
    name: 'ResourceSetting',
    props: {
        resource: {
            type: Object,
            default: null
        },
        isEditable: {
            type: Boolean,
            default: true
        },
        taskKind: {
            type: Number,
            default: 1
        }
    },
    components: {
        ResourceConfig
    },
    computed: {
        executorCPU: {
            get() {
                return TASK_KIND[this.taskKind] === 'SPARK' ? null : {
                    cpu: this.microCoreToCore(this.resource.EXECUTOR_CPUS),
                    memory: this.byteToGB(this.resource.EXECUTOR_MEMORY),
                    uuid: this.microCoreToCore(this.resource.EXECUTOR_CPUS) + '-' + this.byteToGB(this.resource.EXECUTOR_MEMORY)
                };
            },
            set(nval) {
                this.resource.EXECUTOR_CPUS = this.coreToMicroCore(nval.cpu || 0);
                this.resource.EXECUTOR_MEMORY = this.GBToByte(nval.memory || 0);
            }
        },
        executorGPU: {
            get() {
                return TASK_KIND[this.taskKind] === 'SPARK' ? null : {
                    count: this.resource.EXECUTOR_GPUS,
                    label: this.resource.GPU_MODEL,
                    uuid: this.resource.GPU_MODEL + '-' + this.resource.EXECUTOR_GPUS
                };
            },
            set(nval) {
                this.resource.EXECUTOR_GPUS = nval.count || 0;
                this.resource.GPU_MODEL = nval.label || '';
            }
        },
        sparkDriverCPU: {
            get() {
                return TASK_KIND[this.taskKind] === 'SPARK' ? {
                    cpu: this.microCoreToCore(this.resource.SPARK_DRIVER_CPUS),
                    memory: this.byteToGB(this.resource.SPARK_DRIVER_MEMORY),
                    uuid: this.microCoreToCore(this.resource.SPARK_DRIVER_CPUS) + '-' + this.byteToGB(this.resource.SPARK_DRIVER_MEMORY)
                } : null;
            },
            set(nval) {
                this.resource.SPARK_DRIVER_CPUS = this.coreToMicroCore(nval.cpu || 0);
                this.resource.SPARK_DRIVER_MEMORY = this.GBToByte(nval.memory || 0);
            }
        },
        sparkExecutorCPU: {
            get() {
                return TASK_KIND[this.taskKind] === 'SPARK' ? {
                    cpu: this.microCoreToCore(this.resource.SPARK_EXECUTOR_CPUS),
                    memory: this.byteToGB(this.resource.SPARK_EXECUTOR_MEMORY),
                    uuid: this.microCoreToCore(this.resource.SPARK_EXECUTOR_CPUS) + '-' + this.byteToGB(this.resource.SPARK_EXECUTOR_MEMORY)
                } : null;
            },
            set(nval) {
                this.resource.SPARK_EXECUTOR_CPUS = this.coreToMicroCore(nval.cpu || 0);
                this.resource.SPARK_EXECUTOR_MEMORY = this.GBToByte(nval.memory || 0);
            }
        }
    },
    methods: {
        microCoreToCore(value) {
            return value / 1000;
        },
        coreToMicroCore(value) {
            return value * 1000;
        },
        byteToGB(value) {
            return value / (1024 * 1024 * 1024);
        },
        GBToByte(value) {
            return value * 1024 * 1024 * 1024;
        }
    },
    watch: {
        resource: {
            deep: true,
            handler() {
                this.$emit('updateResource', this.resource);
            }
        }
    }
};
</script>

<style scoped>
.resource-info {
    font-size: 12px;
    font-family: siyuan-rg;
    color: #3f5973;
    /* margin: 20px; */
}

.resource-info span:first-child {
    display: inline-block;
    margin-bottom: 10px;
    font-size: 14px;
}

.resource-info table {
    border-collapse: collapse;
    width: 210px;
    height: 55px;
    border: 1px solid rgba(206, 214, 222, 1);
    text-align: center;
    vertical-align: top;
}

.resource-info td {
    border: solid rgba(206, 214, 222, 1);
    border-width: 0 1px;
}

.current-user {
    float: right;
}

.resource-option-button {
    margin: 20px 0 16px 0;
    width: 186px;
}

.resource-button {
    display: block;
    width: 52px;
    height: 32px;
    line-height: 32px;
    border: 1px solid rgba(206, 214, 222, 1);
    margin-right: 12px;
    text-align: center;
    font-size: 12px;
    color: rgba(134, 151, 167, 1);
    cursor: pointer;
    float: left;
}
.resource-button:last-child {
    margin-right: 0;
}

.resource-button:hover {
    color: white;
    background-color: rgba(134, 151, 167, 1);
}

.resource-button.active {
    color: white;
    background-color: rgba(134, 151, 167, 1);
}

.resource-value {
    font-size: 12px;
    color: #f56c6c;
    position: relative;
    bottom: 10px;
}

.resource-desc {
    font-size: 12px;
    color: #576a7d;
    line-height: 18px;
}
</style>
