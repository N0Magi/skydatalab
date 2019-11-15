<template>
    <TogglePanel
        class="custom-input-output-args"
        :label="params.value"
        :removable="removable"
        :expand.sync="params.expand"
        @delete="$emit('delete-arg')"
    >
        <el-form
            ref="inputOutputForm"
            :model="params"
            label-width="100px"
            label-position="left"
            :rules="rules"
            :validate-on-rule-change="false"
        >
            <el-form-item
                :label="labelName"
                prop="value"
            >
                <el-input
                    type="text"
                    v-model="params.value"
                    placeholder="请输入参数名"
                />
            </el-form-item>
            <el-form-item
                :label="labelType"
                prop="ptype"
            >
                <el-select
                    v-model="params.ptype"
                    :value="params.ptype"
                    style="width:100%;"
                >
                    <el-option
                        :label="item"
                        :value="item"
                        :key="item"
                        v-for="item in pTypeEnum"
                    />
                </el-select>
            </el-form-item>
            <el-form-item
                :label="labelSType"
                prop="stype"
            >
                <el-select
                    v-model="params.stype"
                    :multiple="type === 'input'"
                    :value="params.stype"
                    style="width:100%;"
                >
                    <el-option
                        :label="item"
                        :value="item"
                        :key="item"
                        v-for="item in sTypeEnum"
                    />
                </el-select>
            </el-form-item>
            <el-form-item
                label="参数说明"
                prop="desc"
            >
                <el-input
                    type="textarea"
                    v-model="params.desc"
                    placeholder="请输入参数描述"
                />
            </el-form-item>
        </el-form>
    </TogglePanel>
</template>

<script>
import { InputOutputArgsBean } from './InputOutputArgsBean';
import TogglePanel from '../TogglePanel';

const pTypeEnum = ['DATAFRAME-FILE', 'LABEL-FILE', 'FEATURE-FILE', 'PREDICTION-FILE', 'MODEL-FILE', 'IMAGE-FILE', 'VOICE-FILE', 'LOG-FILE', 'STREAM', 'OTHER-FILE'];
const sTypeEnum = ['CSV', 'PARQUET', 'TEXT', 'JSON', 'XML', 'MASK', 'HTML', 'WAV', 'MP3', 'FLAC', 'ORC', 'REGRESSION', 'CLASSIFICATION', 'UNSPUERVISED', 'OTHER'];
export default {
    name: 'Index',
    components: {
        TogglePanel
    },
    data() {
        return {
            pTypeEnum,
            sTypeEnum
        };
    },
    props: {
        type: {
            type: String,
            default: 'input'
        },
        paramOptions: {
            type: Object,
            required: true,
            default() {
                return {};
            }
        },
        removable: {
            type: Boolean,
            default: false
        },
        argList: {
            type: Array,
            description: '所有参数列表，用于判断参数名是否重复',
            default() {
                return [];
            }
        }
    },
    computed: {
        labelBase() {
            return this.type === 'input' ? '输入' : '输出';
        },
        labelName() {
            return `${this.labelBase}参数名`;
        },
        labelType() {
            return `${this.labelBase}类型`;
        },
        labelSType() {
            return `${this.labelBase}子类型`;
        },
        params: {
            get() {
                this.$set(this.paramOptions, 'expand', true);
                return this.paramOptions;
            },
            set(val) {
                this.$emit('update:paramOptions', val);
            }
        },
        rules() {
            return new InputOutputArgsBean(this.params, this.argList).initRules();
        }
    }
};
</script>

<style lang="scss" scoped>
    .custom-input-output-args {
        & + .custom-input-output-args {
            margin-top: 10px;
        }
    }
</style>
