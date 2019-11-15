<template>
    <el-form-item
        class="setting-option number-pick"
        :label="resourceLabel"
    >
        <el-select
            v-model="__gpuModel"
            placeholder="请选择"
            v-if="resourceItem.includes('GPU')"
            size="small"
        >
            <el-option
                v-for="item in options"
                :key="item.label"
                :label="item.label"
                :value="item.label"
            >
                <span style="float: left">
                    {{ item.label }}
                </span>
                <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ item.value }}
                </span>
            </el-option>
        </el-select>
        <el-input-number
            class="input-number-custom"
            size="small"
            v-model="localVal"
            :min="currentResource.min || min"
            :step="currentResource.step"
            :disabled="!isEditable"
            :max="currentResource.max || max"
        />
    </el-form-item>
</template>

<script>
import { resourceInfo } from '../../js/skyflowConfig';

export default {
    name: 'NumberPick',
    props: {
        resourceItem: {
            type: String,
            required: true
        },
        quota: {
            type: Object,
            required: true
        },
        total: {
            type: Object,
            required: true
        },
        value: {
            default: ''
        },
        resource: {
            type: Object,
            required: true
        },
        isEditable: {
            type: Boolean,
            default: true
        },
        gpuModel: {
            type: String,
            default: ''
        }
    },
    computed: {
        __gpuModel: {
            get() {
                return this.gpuModel;
            },
            set(nval) {
                this.$emit('update:gpuModel', nval);
            }
        },
        options() {
            let [gpus, option] = [this.total.gpus, []];
            for (let i = 0; i < gpus.length; i++) {
                option.push(
                    { value: gpus[i].value,
                        label: gpus[i].name
                    }
                );
            }
            return option;
        },
        localVal: {
            get() {
                return this.value;
            },
            set(nval) {
                this.$emit('input', nval);
            }
        },
        max() {
            // 实例的最大值计算
            if (this.resourceItem.includes('INSTANCES')) {
                let [cpu, mem, gpu, cpuNum, memNum, gpuNum, max] = [0, 0, 0, 0, 0, 0, NaN];
                for (let key in this.resource) {
                    if (key.includes('CORES')) {
                        cpu += this.resource[key];
                    } else if (key.includes('MEMORY')) {
                        mem += this.resource[key];
                    } else if (key.includes('GPU')) {
                        gpu += this.resource[key];
                    }
                }

                cpuNum = this.total.cpu / cpu;
                memNum = this.total.mem / mem;
                gpuNum = this.total.gpu / gpu;
                if (cpu !== 0 && mem === 0 && gpu === 0) {
                    max = Math.floor(cpuNum);
                } else if (cpu === 0 && mem !== 0 && gpu === 0) {
                    max = Math.floor(memNum);
                } else if (cpu === 0 && mem === 0 && gpu !== 0) {
                    max = Math.floor(gpuNum);
                } else if (cpu !== 0 && mem !== 0 && gpu === 0) {
                    max = Math.floor(Math.min(...[cpuNum, memNum]));
                } else if (cpu !== 0 && mem === 0 && gpu !== 0) {
                    max = Math.floor(Math.min(...[cpuNum, gpuNum]));
                } else if (cpu === 0 && mem !== 0 && gpu !== 0) {
                    max = Math.floor(Math.min(...[memNum, gpuNum]));
                } else if (cpu !== 0 && mem !== 0 && gpu !== 0) {
                    max = Math.floor(Math.min(...[cpuNum, memNum, gpuNum]));
                }
                if (this.localVal > max) {
                    this.localVal = max;
                }
                return max;
            } else {
                // 非实例的最大值计算
                let [selected, max] = [0, 0];
                resourceInfo.forEach(el => {
                    if (el.name !== this.resourceItem && el.type === this.currentResource.type) {
                        selected += this.resource[el.name] || 0;
                    }
                });
                // gpu标签未选时为0
                if (this.resourceItem.includes('GPU') && this.__gpuModel === '') {
                    max = 0;
                } else if (this.resourceItem.includes('GPU') && this.__gpuModel !== '') {
                    // gpu标签选好后取gpu类型的最大值
                    let arr = this.total && this.total.gpus && this.total.gpus.filter(v => v.name === this.__gpuModel);
                    max = arr && arr[0].value;
                } else {
                    max = this.total[this.currentResource.type] - selected;
                }
                return max;
            }
        },
        min() {
            if (this.resourceItem.includes('SPARK') && this.resourceItem.includes('CORES')) {
                return 2;
            } else {
                return 0;
            }
        },
        currentResource() {
            return resourceInfo.find(el => el.name === this.resourceItem);
        },
        resourceLabel() {
            return this.currentResource.unit ? `${this.currentResource.label} (${this.currentResource.unit})` : this.currentResource.label;
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.number-pick {
    .el-select {
        position: absolute;
        left: 60px;
        top: 2px;
        .el-input__inner {
            width: 150px;
        }
    }
}
</style>
