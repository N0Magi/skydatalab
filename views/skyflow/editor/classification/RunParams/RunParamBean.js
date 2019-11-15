/* eslint-disable no-case-declarations */
import { dataTypes } from '../../js/skyflowConfig';

export class RunParamBean {
    constructor(params = {}, pramsList, isTrainComp) {
        this.cnName = params.cnName || '';
        this.enName = params.enName || '';
        this.inputType = params.inputType || 'input';
        this.desc = params.desc || '';
        this.paramType = params.paramType || 'String';
        this.possibleValues = params.possibleValues || [
            {
                label: '',
                value: ''
            }
        ];
        this.multi = params.multi || false;
        this.min = params.min || 0;
        this.max = params.max || 1;
        this.step = params.step || 1;
        this.defaultVal = params.defaultVal || (this.inputType === 'select' && this.multi ? [] : '');
        this.trainEditable = typeof params.trainEditable === 'undefined' ? true : params.trainEditable;
        this.paramModeType = params.paramModeType || [];
        this.actionType = params.actionType || '';
        this.mixedParams = params.mixedParams || [];
        this.isMixed = this.mixedParams.length > 0;
        this.paramsList = pramsList || [];
        this.isTrainComp = isTrainComp || false;
    }

    initRules() {
        const baseRules = {
            cnName: [
                {
                    required: true, message: '请输入中文参数名', trigger: 'blur', transform(value) {
                        return value && ('' + value).trim();
                    }
                }
            ],
            enName: [
                {
                    required: true, message: '请输入英文参数名', trigger: 'blur', transform(value) {
                        return value && ('' + value).trim();
                    }
                },
                { pattern: /^[a-zA-Z_][a-zA-Z_0-9]{0,99}$/, message: '参数名以字母或下划线开头，由数字、字母或下划线组成，且少于100字符', trigger: 'blur' },
                { validator: this.repeatRuleValidator.bind(this), trigger: 'blur' }
            ],
            inputType: [
                { required: true, message: '请输入选择参数输入格式', trigger: 'change' }
            ],
            desc: [
                { required: true, message: '请输入参数说明', trigger: 'blur', transform(value) {
                    return value && ('' + value).trim();
                } }
            ],
            trainEditable: [
                { required: true, message: '请设置增量训练是否可修改', trigger: 'blur' }
            ],
            paramType: [
                { required: true, message: '请选择参数类型', trigger: 'change' }
            ],
            paramModeType: [
                { required: true, message: '请选择参数使用场景', trigger: 'change' }
            ]
        };
        const inputTypeRuleMap = {
            input: {
                defaultVal: [
                    {
                        validator: this.checkDefaultValValid.bind(this),
                        trigger: this.paramType === 'Boolean' ? 'change' : 'blur'
                    }
                ]
            },
            select: {
                possibleValues: [
                    { validator: RunParamBean.checkOptionsValid, trigger: 'blur' },
                    { required: true, message: '请设置可选项' }
                ]
            },
            slider: {
                min: [
                    { required: true, message: '请设置最小值', trigger: 'blur' }
                ],
                max: [
                    { required: true, message: '请设置最大值', trigger: 'blur', transform(value) {
                        return value && ('' + value).trim();
                    } }
                ],
                step: [
                    { required: true, message: '请设置步长', trigger: 'blur', transform(value) {
                        return value && ('' + value).trim();
                    } }
                ]
            },
            column: {
                actionType: [
                    { required: true, message: '请选择数据处理类型', trigger: 'blur' },
                    { validator: this.columnParamSingleValidator.bind(this), trigger: 'change' }
                ]
            }
        };
        return {
            ...baseRules,
            ...inputTypeRuleMap[this.inputType]
        };
    }

    static checkOptionsValid(rule, value, cb) {
        const hasEmpty = value.find(item => item.label === '' || item.value === '');
        const labels = value.map(item => item.label);
        const values = value.map(item => item.value);
        const labelSet = new Set(labels);
        const valueSet = new Set(values);
        const hasRepeat = labels.length !== labelSet.size || valueSet.size !== values.length;
        if (hasEmpty) {
            cb('可选项Label和Value不能为空');
        } else if (hasRepeat) {
            cb('可选项Label和Value不能重复');
        } else {
            cb();
        }
    }

    checkDefaultValValid(rule, value, cb) {
        // 为空时不校验类型，默认值可以不填写
        if (value === '') {
            cb();
            return;
        }
        if (['Double', 'Number', 'Float'].indexOf(this.paramType) >= 0) {
            if (+value) {
                cb();
            } else {
                cb(`请输入${this.paramType}类型的值`);
            }
        } else if (this.paramType === 'Integer') {
            if (Number.isInteger(+value)) {
                cb();
            } else {
                cb(`请输入${this.paramType}类型的值`);
            }
        } else {
            cb();
        }
    }

    columnParamSingleValidator(rule, value, cb) {
        let inputTypeColumnCount = 0;
        let DataPickTypeCount = 0;
        for (let i = 0, len = this.paramsList.length; i < len; i++) {
            const conf = this.paramsList[i];
            if (conf.mixedParams && conf.mixedParams.length > 0) {
                for (let j = 0, len = conf.mixedParams.length; j < len; j++) {
                    const item = conf.mixedParams[j];
                    if (item.actionType !== 'DataPick') {
                        inputTypeColumnCount++;
                        if (inputTypeColumnCount > 1) {
                            cb('组件最多允许一个数据处理类型参数');
                            return;
                        }
                    } else {
                        DataPickTypeCount++;
                        if (DataPickTypeCount > 1) {
                            cb('组件最多允许一个数据选择参数');
                            return;
                        }
                    }
                }
            } else {
                if (conf.actionType !== 'DataPick') {
                    inputTypeColumnCount++;
                    if (inputTypeColumnCount > 1) {
                        cb('组件最多允许一个数据处理类型参数');
                        return;
                    }
                } else {
                    DataPickTypeCount++;
                    if (DataPickTypeCount > 1) {
                        cb('组件最多允许一个数据选择参数');
                        return;
                    }
                }
            }
        }
        cb();
    }

    repeatRuleValidator(value, rule, cb) {
        if (this.paramsList && this.paramsList.length > 0) {
            if (new Set(this.paramsList.map(item => item.enName)).size !== this.paramsList.length) {
                cb('参数名不可重复');
            } else {
                cb();
            }
        } else {
            cb();
        }
    }

    /**
     * 转换数据以用于保存自定义组件
     */
    transformParam4Save() {
        let result = {
            label: this.cnName,
            name: this.enName,
            uiType: 'CommonInputParamBean',
            tooltips: this.desc,
            trainEditable: !!this.trainEditable,
            paramModeType: this.paramModeType || []
        };
        if (this.isTrainComp) {
            // 如果是特征功能/模型训练类型的组件，则需要根据paramModeType设置参数与operMode的级联关系
            result.showAttr = 'operMode';
            result.showVal = this.paramModeType || [];
        }
        if (this.isMixed) {
            result = Object.assign({}, result, {
                uiType: 'mixedParamBean',
                paramsConf: this.mixedParams.map(item => new RunParamBean(item).transformParam4Save())
            });
        } else {
            switch (this.inputType) {
                    case 'text':
                        result = Object.assign({}, result, {
                            ptype: ''
                        });
                        break;
                    case 'input':
                        result = Object.assign({}, result, {
                            defaultValue: this.paramTypeTransform(this.defaultVal),
                            ptype: this.paramType
                        });
                        break;
                    case 'select':
                        result = Object.assign({}, result, {
                            defaultValue: this.defaultVal,
                            possibleValues: this.possibleValues.map(item => ({
                                label: item.label,
                                value: this.paramTypeTransform(item.value)
                            })),
                            ptype: this.paramType,
                            multiple: this.multi,
                            uiType: 'OptionParamBean'
                        });
                        break;
                    case 'slider':
                        result = Object.assign({}, result, {
                            defaultValue: this.paramTypeTransform(this.defaultVal),
                            max: this.paramTypeTransform(this.max),
                            min: this.paramTypeTransform(this.min),
                            step: this.paramTypeTransform(this.step),
                            ptype: this.paramType,
                            uiType: 'SliderParamBean'
                        });
                        break;
                    case 'file':
                        result = Object.assign({}, result, {
                            uiType: 'FileSelectParamBean'
                        });
                        break;
                    case 'column':
                        let data;
                        const options = this.createDataHandlePossibleValues();
                        if (options && options.length > 0) {
                            data = {
                                ptype: this.paramType,
                                multiple: this.multi,
                                possibleValues: options,
                                actionType: this.actionType,
                                uiType: 'OptionParamBean'
                            };
                        } else {
                            data = {
                                ptype: 'Column',
                                multiple: this.multi,
                                actionType: this.actionType,
                                uiType: 'SchemaOptionParamBean'
                            };
                        }
                        result = Object.assign({}, result, data);
                        break;
                    default:
                        break;
            }
        }
        return result;
    }

    // 转换默认值类型
    paramTypeTransform(val) {
        const paramTypeTransformMap = {
            Double: val => parseFloat(val),
            Integer: val => parseInt(val),
            String: val => val + '',
            Number: val => +val,
            Float: val => parseFloat(val),
            Boolean: val => !!val
        };
        return paramTypeTransformMap[this.paramType] && paramTypeTransformMap[this.paramType](val) || val;
    }

    makeParamsRules() {
        let rules = {
            [this.enName]: [
                { required: true, message: `运行参数${this.cnName} 缺失` }
            ]
        };
        if (this.mixedParams && this.mixedParams.length > 0) {
            this.mixedParams.forEach(item => {
                rules[item.enName] = [{ required: true, message: `运行参数${item.cnName} 缺失` }];
            });
        }
        if (this.isTrainComp) {
            rules.operMode = [
                { required: true, message: '运行参数处理场景 缺失' }
            ];
        }
        return rules;
    }

    createDataHandlePossibleValues() {
        if (this.inputType === 'column') {
            if (this.actionType === 'JoinTransform') {
                return [
                    {
                        label: 'inner',
                        value: 'inner'
                    },
                    {
                        label: 'full',
                        value: 'full'
                    },
                    {
                        label: 'left',
                        value: 'left'
                    },
                    {
                        label: 'right',
                        value: 'right'
                    }
                ];
            } else if (this.actionType === 'TypeTransform') {
                return [
                    {
                        label: 'float与double转int',
                        value: 'DTC_FLOAT_TO_INT',
                        accept: [dataTypes.DOUBLE, dataTypes.FLOAT]
                    },
                    {
                        label: 'int转datetime',
                        value: 'DTC_INDEX_TO_TIMESTAMP',
                        accept: [
                            dataTypes.INT,
                            dataTypes.SMALLINT,
                            dataTypes.BIGINT
                        ]
                    },
                    {
                        label: 'int转float',
                        value: 'DTC_INT_TO_FLOAT',
                        accept: [
                            dataTypes.INT,
                            dataTypes.SMALLINT,
                            dataTypes.BIGINT
                        ]
                    },
                    {
                        label: 'str转int',
                        value: 'DTC_STRING_INDEXER',
                        accept: [dataTypes.STRING]
                    },
                    {
                        label: 'str转datetime',
                        value: 'DTC_STRING_TO_TIMESTAMP',
                        accept: [dataTypes.STRING]
                    },
                    {
                        label: 'datetime转int',
                        value: 'DTC_TIMESTAMP_TO_INDEX',
                        accept: [dataTypes.TIMESTAMP, dataTypes.DATE]
                    },
                    {
                        label: 'datetime转str',
                        value: 'DTC_TIMESTAMP_TO_STRING',
                        accept: [dataTypes.TIMESTAMP, dataTypes.DATE]
                    }
                ];
            }
        }
    }
}
