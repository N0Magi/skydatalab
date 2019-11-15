<template>
    <el-form-item
        :error="validateResult"
        class="setting-option"
    >
        <el-tooltip
            v-if="param.tooltips"
            :content="param.tooltips"
            placement="bottom"
        >
            <span class="tip">
                <i v-if="required">
                    *
                </i> {{ param.label }}
            </span>
        </el-tooltip>
        <span
            class="tip"
            v-if="!param.tooltips"
        >
            <i v-if="required">
                *
            </i> {{ param.label }}
        </span>
        <div>
            <el-input
                v-model="localVal"
                :type="paramInputType"
                size="small"
                :disabled="!isEditable || !param.trainEditable"
                @blur="checkInputValid"
                :autosize="paramInputType === 'textarea' ? true : false"
            />
        </div>
    </el-form-item>
</template>
<script>
import baseMixins from './editorBaseMixins';
import Validator from 'async-validator';
import { isDatasetNameExist } from '../../../../../datas/rely/dataSourceApi';
export default {
    mixins: [baseMixins],
    data() {
        return {
            validateResult: ''
        };
    },
    props: {
        inputType: {
            default: 'String',
            type: String
        },
        paramInputType: {
            default: 'textarea',
            type: String
        }
    },
    computed: {
        rules() {
            if (this.inputType === 'Number') {
                return [
                    {
                        required: true, message: `${this.param.label}不能为空`, trigger: 'blur', transform(value) {
                            return value && ('' + value).trim();
                        }
                    },
                    { type: 'number', message: `${this.param.label}必须为Number类型`, trigger: 'blur' }
                ];
            } else if (this.inputType === 'Double') {
                return [
                    {
                        required: true, message: `${this.param.label}不能为空`, trigger: 'blur', transform(value) {
                            return value && ('' + value).trim();
                        }
                    },
                    { type: 'float', message: `${this.param.label}必须为Double类型`, trigger: 'blur' }
                ];
            } else if (this.inputType === 'Integer') {
                return [
                    {
                        required: true, message: `${this.param.label}不能为空`, trigger: 'blur', transform(value) {
                            return value && ('' + value).trim();
                        }
                    },
                    { type: 'integer', message: `${this.param.label}必须为Integer类型`, trigger: 'blur' }
                ];
            } else {
                return [
                    {
                        required: true, message: `${this.param.label}不能为空`, trigger: 'blur', transform(value) {
                            return value && ('' + value).trim();
                        }
                    }
                ];
            }
        }
    },
    methods: {
        checkInputValid() {
            let locVal = String(this.localVal);
            if (this.required) {
                this.validateResult = '';
                const validator = new Validator({
                    val: {
                        required: true,
                        message: `${this.param.label}不能为空`,
                        trigger: 'blur'
                    }
                });
                validator.validate({ val: locVal }, error => {
                    if (!error) return;
                    this.localVal = '';
                    this.validateResult = error && error[0] && error[0].message || '';
                });
                if (this.validateResult) return;
            } else {
                if (!locVal) return;
            }
            if (this.inputType === 'Number') {
                const numberValidator = new Validator({
                    val: {
                        type: 'number',
                        message: `${this.param.label}必须为Number类型`,
                        trigger: 'blur'
                    }
                });
                numberValidator.validate({ val: +this.localVal }, error => {
                    if (!error) return;
                    this.localVal = '';
                    this.validateResult = error && error[0] && error[0].message || '';
                });
            } else if (this.inputType === 'Double') {
                const doubleValidator = new Validator({
                    val: {
                        type: 'number',
                        message: `${this.param.label}必须为Double类型`,
                        trigger: 'blur'
                    }
                });
                doubleValidator.validate({ val: +this.localVal }, error => {
                    if (!error) return;
                    this.localVal = '';
                    this.validateResult = error && error[0] && error[0].message || '';
                });
            } else if (this.inputType === 'Integer') {
                const intValidator = new Validator({
                    val: {
                        type: 'integer',
                        message: `${this.param.label}必须为Integer类型`,
                        trigger: 'blur'
                    }
                });
                intValidator.validate({ val: +this.localVal }, error => {
                    if (!error) return;
                    this.localVal = '';
                    this.validateResult = error && error[0] && error[0].message || '';
                });
            } else if (this.param.label === '数据集名称') {
                isDatasetNameExist(this.localVal.trim()).then(res => {
                    if (res.exist) {
                        const dataValidator = new Validator({
                            val: {
                                message: '数据集名称已存在！',
                                trigger: 'blur'
                            }
                        });
                        dataValidator.validate({ val: +this.localVal }, error => {
                            if (!error) return;
                            this.localVal = '';
                            this.validateResult = error && error[0] && error[0].message || '';
                        });
                    }
                });
            } else if (this.param.checkSqlSelect) {
                if (this.localVal.trim().toLowerCase().indexOf('select') !== 0) {
                    this.localVal = '';
                    this.validateResult = 'sql只能是查询语句';
                } else {
                    this.validateResult = '';
                }
            }
        }
    }
};
</script>
<style lang='scss'>

</style>
