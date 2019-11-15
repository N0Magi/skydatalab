<template>
    <TogglePanel
        class="customize-run-params"
        :label="params.cnName"
        :removable="removable"
        :expand.sync="params.expand"
        @delete="$emit('delete-param')"
    >
        <template v-if="params.isMixed">
            <el-form
                ref="mixedFormParent"
                :model="params"
                :rules="rules"
                label-width="130px"
                label-position="left"
                :validate-on-rule-change="false"
            >
                <el-form-item
                    label="参数组名:"
                    prop="enName"
                >
                    <el-input
                        class="small-size"
                        type="text"
                        v-model="params.enName"
                        placeholder="请输入英文参数名"
                    />
                </el-form-item>
                <el-form-item
                    label="参数组显示名:"
                    prop="cnName"
                >
                    <el-input
                        class="small-size"
                        type="text"
                        v-model="params.cnName"
                        placeholder="请输入中文参数名"
                    />
                </el-form-item>
                <el-form-item
                    label="增量训练时可修改:"
                    v-if="isTrainAddition"
                    prop="trainEditable"
                >
                    <el-switch v-model="params.trainEditable" />
                </el-form-item>
                <el-form-item
                    label="参数使用场景:"
                    v-if="isTrainAddition"
                    prop="paramModeType"
                >
                    <el-select
                        multiple
                        v-model="params.paramModeType"
                        placeholder="请选择参数使用场景"
                        style="width: 100%;"
                    >
                        <el-option
                            label="模型训练"
                            value="TRAINING"
                        />
                        <el-option
                            label="模型预测"
                            value="PREDICTION"
                        />
                        <el-option
                            label="模型增量训练"
                            value="INCRE-TRAINING"
                        />
                    </el-select>
                </el-form-item>
                <div class="mixed-params-group">
                    <RunParams
                        :ref="`mixForm${index}`"
                        v-for="(item, index) in params.mixedParams"
                        :key="index"
                        :param-options="item"
                        :params-list="paramsList"
                        :removable="index > 0"
                    />
                    <el-button
                        class="add-mix-btn"
                        size="mini"
                        @click.stop.prevent="addMixedParams"
                    >
                        <i class="sf-icon sf-jiahao" /> 添加
                    </el-button>
                </div>
            </el-form>
        </template>
        <template v-else>
            <el-form
                ref="execParamForm"
                :model="params"
                :rules="rules"
                label-width="130px"
                label-position="left"
                :validate-on-rule-change="false"
            >
                <el-form-item
                    label="参数名:"
                    prop="enName"
                >
                    <el-input
                        class="small-size"
                        type="text"
                        v-model="params.enName"
                        placeholder="请输入英文参数名"
                    />
                </el-form-item>
                <el-form-item
                    label="参数显示名:"
                    prop="cnName"
                >
                    <el-input
                        class="small-size"
                        type="text"
                        v-model="params.cnName"
                        placeholder="请输入中文参数名"
                    />
                </el-form-item>
                <el-form-item
                    label="参数说明:"
                    prop="desc"
                >
                    <el-input
                        type="text"
                        v-model="params.desc"
                        placeholder="请输入参数说明"
                    />
                </el-form-item>
                <el-form-item
                    label="格式种类:"
                    prop="inputType"
                >
                    <el-select
                        v-model="params.inputType"
                        placeholder="请选择格式种类"
                        :value="params.inputType"
                        style="width:100%;"
                    >
                        <el-option
                            label="输入框"
                            value="input"
                        />
                        <el-option
                            label="文本框"
                            value="text"
                        />
                        <el-option
                            label="选择框"
                            value="select"
                        />
                        <el-option
                            label="滑动条"
                            value="slider"
                        />
                        <el-option
                            label="文件选择框"
                            value="file"
                        />
                        <!--<el-option label="数据处理选择框" value="column"></el-option>-->
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="增量训练时可修改:"
                    v-if="isTrainAddition"
                    prop="trainEditable"
                >
                    <el-switch v-model="params.trainEditable" />
                </el-form-item>
                <el-form-item
                    label="参数使用场景:"
                    v-if="isTrainAddition"
                    prop="paramModeType"
                >
                    <el-select
                        multiple
                        v-model="params.paramModeType"
                        placeholder="请选择参数使用场景"
                        style="width: 100%;"
                    >
                        <el-option
                            label="模型训练"
                            value="TRAINING"
                        />
                        <el-option
                            label="模型预测"
                            value="PREDICTION"
                        />
                        <el-option
                            label="模型增量训练"
                            value="INCRE-TRAINING"
                        />
                    </el-select>
                </el-form-item>
                <component
                    :is="comp"
                    :param-options="paramOptions"
                />
            </el-form>
        </template>
    </TogglePanel>
</template>

<script>
import { RunParamBean } from './RunParamBean';

const paramTypeCompMap = {
    input: 'InputAdditions',
    select: 'SelectAdditions',
    slider: 'SliderAdditions',
    column: 'DataOperationAdditions'
};
import InputAdditions from './InputAdditions';
import SelectAdditions from './SelectAdditions';
import SliderAdditions from './SliderAdditions';
import DataOperationAdditions from './DataOperationAdditions';
import TogglePanel from '../TogglePanel';
export default {
    name: 'RunParams',
    components: {
        TogglePanel,
        InputAdditions,
        SelectAdditions,
        SliderAdditions,
        DataOperationAdditions
    },
    data() {
        return {};
    },
    props: {
        paramOptions: {
            type: Object,
            default() {
                return {};
            }
        },
        removable: {
            type: Boolean,
            default: true
        },
        compType: {
            type: Object,
            default() {
                return {
                    parent: {},
                    sub: {}
                };
            }
        },
        paramsList: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    computed: {
        comp() {
            return paramTypeCompMap[this.paramOptions.inputType];
        },
        isTrainAddition() {
            return this.compType.parent.name === 'MachineLearning' || this.compType.parent.name === 'FeatureEngineer';
        },
        params: {
            get() {
                this.$set(this.paramOptions, 'expand', true);
                this.paramOptions.mixedParams.forEach(item => {
                    this.$set(item, 'expand', true);
                });
                return this.paramOptions;
            },
            set(val) {
                if (val.inputType === 'select' && val.multi) {
                    if (!Array.isArray(val.defaultVal)) {
                        val.defaultVal = [];
                    }
                } else {
                    if (Array.isArray(val.defaultVal)) {
                        val.defaultVal = '';
                    }
                }
                this.$emit('update:paramOptions', val);
            }
        },
        rules() {
            const param = new RunParamBean(this.params, this.paramsList);
            return param.initRules();
        }
    },
    methods: {
        addMixedParams() {
            this.params.mixedParams.push(new RunParamBean());
        }
    },
    watch: {
        'params.inputType': {
            handler(val) {
                this.params.defaultVal = (val === 'select' && this.params.multi) ? [] : '';
                if (val === 'slider') {
                    this.params.paramType = ['Number', 'Integer', 'Double'].indexOf(this.params.paramType) >= 0 ? this.params.paramType : 'Integer';
                } else {
                    this.params.paramType = 'String';
                }
            }
        }
    }
};
</script>

<style lang="scss" scoped>
    .customize-run-params {
        &+.customize-run-params {
            margin-top: 10px;
        }
        .mixed-params-group {
            padding: 0 15px;
            &+.mixed-params-group {
                margin-top: 10px;
            }
            .customize-run-params {
                background:rgba(222,228,236,0.25);
                border: none;
                & +.customize-run-params {
                    margin-top: 10px;
                }
            }
            .add-mix-btn {
                margin: 10px -15px 0;
                display: block;
                width: calc(100% + 30px);
                color: rgba(169, 187, 210, 1);
                font-size: 14px;
            }
        }
    }
</style>
<style lang="scss">
    .customize-run-params {
        .mixed-params-group {
            .customize-run-params {
                input, select {
                    background:rgba(222,228,236,0.25);
                }
            }
        }
    }
</style>
