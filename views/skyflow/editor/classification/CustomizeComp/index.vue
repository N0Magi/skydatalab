<template>
    <div class="customize-comp skyflow-dialog">
        <sdxu-dialog
            :visible="visible"
            custom-class="selfStyle"
            width="870px"
            :title="title"
            :close-on-click-modal="false"
            @close="visible = false"
            v-loading="showLoading"
            :modal-append-to-body="false"
            :append-to-body="false"
            :no-footer="true"
        >
            <div class="customize-comp-wrapper">
                <aside class="customize-comp_step">
                    <el-steps
                        direction="vertical"
                        :active="currentStep"
                        finish-status="success"
                    >
                        <el-step
                            title="基本信息"
                            @click.native="jumpToStep(0)"
                        />
                        <el-step
                            title="输入输出"
                            @click.native="jumpToStep(1)"
                        />
                        <el-step
                            title="运行环境配置"
                            @click.native="jumpToStep(2)"
                        />
                        <el-step
                            title="运行参数配置"
                            @click.native="jumpToStep(3)"
                        />
                    </el-steps>
                </aside>
                <section class="customize-comp_main">
                    <article class="customize-comp_main_content">
                        <component
                            :is="comp"
                            ref="comp"
                            :params="form"
                            :rules="rules"
                            :comp-type="compType"
                            :component-options="componentOptions"
                            :runtime-types="runtimeTypes"
                        />
                    </article>
                    <footer class="customize-comp_main_footer">
                        <el-button
                            @click="prev"
                            v-if="currentStep !== 0"
                        >
                            上一步
                        </el-button>
                        <el-button
                            type="primary"
                            @click="next"
                        >
                            {{ currentStep === 3 ? '完成' : '下一步' }}
                        </el-button>
                        <!--<el-button type="primary" v-if="meta._id && currentStep !== 3" @click="submitForm">保存</el-button>-->
                    </footer>
                </section>
            </div>
        </sdxu-dialog>
    </div>
</template>

<script>
    import {
        createCustomComponent,
        updateCustomComponent,
        getComponentOptions,
        getRunTimeOptions
    } from '@sdx/utils/lib/api/skyflow';
    import CompBaseInfo from './CompBaseInfo';
    import CompInputOutput from './CompInputOutput';
    import CompEnv from './CompEnv';
    import CompRunParam from './CompRunParam';
    import ElDialog from 'element-ui/lib/dialog';

    import { InputOutputArgsBean } from '../InputOutputArgs/InputOutputArgsBean';
    import { RunParamBean } from '../RunParams/RunParamBean';

    const stepCompMap = ['CompBaseInfo', 'CompInputOutput', 'CompEnv', 'CompRunParam'];

    export default {
        name: 'Index',
        components: {
            CompBaseInfo,
            CompInputOutput,
            CompEnv,
            CompRunParam,
            ElDialog
        },
        props: {
            dialogVisible: {
                type: Boolean,
                required: true
            },
            meta: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            return {
                currentStep: 0,
                showLoading: false,
                form: {
                    label: '',
                    component_type_id: '',
                    description: '',
                    input_params: [],
                    output_params: [],
                    run_file: '',
                    mainClass: '',
                    params_conf: [],
                    runtime_id: '',
                    inputArgs: [new InputOutputArgsBean({ multi: true })],
                    outputArgs: [new InputOutputArgsBean()]
                },
                componentOptions: [],
                runtimeTypes: [],
                rules: {
                    label: [
                        {
                            required: true, message: '请填写组件名称', trigger: 'blur', transform(value) {
                                return value && ('' + value).trim();
                            }
                        },
                        {
                            validator(rule, value, cb) {
                                if (value.replace(/[\u0391-\uFFE5]/g, 'aa').length > 15) {
                                    cb('组件名称长度在15个字符以内');
                                } else {
                                    cb();
                                }
                            }, trigger: 'blur'
                        }
                    ],
                    component_type_id: [
                        { required: true, message: '请选择组件类型', trigger: 'change' }
                    ],
                    description: [
                        { max: 200, message: '长度在200个字符以内', trigger: 'blur' }
                    ],
                    runtime_id: [
                        { required: true, message: '请选择运行环境', trigger: 'change' }
                    ],
                    run_file: [
                        { required: true, message: '请选择执行文件路径', trigger: 'blur' }
                    ],
                    mainClass: [
                        {
                            required: true, message: '请设置主类', trigger: 'blur', transform(value) {
                                return value && ('' + value).trim();
                            }
                        }
                    ]
                }
            };
        },
        computed: {
            visible: {
                get() {
                    return this.dialogVisible;
                },
                set(val) {
                    this.$emit('update:dialogVisible', val);
                }
            },
            comp() {
                return stepCompMap[this.currentStep];
            },
            title() {
                return this.meta._id ? '编辑自定义组件' : '创建自定义组件';
            },
            compType() {
                for (let i = 0, len = this.componentOptions.length; i < len; i++) {
                    const child = this.componentOptions[i].children || [];
                    for (let j = 0; j < child.length; j++) {
                        if (child[j]._id === this.form.component_type_id) {
                            return {
                                parent: this.componentOptions[i],
                                sub: child[j]
                            };
                        }
                    }
                }
                return '';
            },
            isTrainComp() {
                if (this.compType) {
                    return this.compType.parent.name === 'MachineLearning' || this.compType.parent.name === 'FeatureEngineer';
                } else {
                    return false;
                }
            }
        },
        methods: {
            prev() {
                this.currentStep--;
            },
            next() {
                this.$refs.comp.validate().then(() => {
                    if (this.currentStep === 3) {
                        // 保存
                        this.submitForm();
                    } else {
                        this.currentStep++;
                    }
                }, err => {
                    console.log(err);
                });
            },
            jumpToStep(step) {
                if (this.meta._id) {
                    // 在编辑模式下才允许跳转,跳转之前先校验当前页面数据是否合法，验证通过才允许跳转
                    this.$refs.comp.validate().then(() => {
                        this.currentStep = step;
                    });
                }
            },
            submitForm() {
                let params = { ...this.form };
                params.input_params = [];
                params.output_params = [];
                params.inputArgs.forEach(el => {
                    params.input_params.push({
                        name: el.value,
                        ptype: el.ptype,
                        stype: el.stype,
                        desc: el.desc
                    });
                });
                params.outputArgs.forEach(el => {
                    params.output_params.push({
                        name: el.value,
                        ptype: el.ptype,
                        stype: el.stype,
                        desc: el.desc
                    });
                });
                let runParams = params.params_conf;
                params.params_conf = runParams.map(item => new RunParamBean(item, null, this.isTrainComp).transformParam4Save());
                if (this.isTrainComp) {
                    params.params_conf.unshift({
                        label: '处理场景',
                        name: 'operMode',
                        uiType: 'OptionParamBean',
                        tooltips: '处理场景',
                        trainEditable: true,
                        defaultValue: '',
                        possibleValues: [
                            {
                                label: '模型训练',
                                value: 'TRAINING'
                            },
                            {
                                label: '模型预测',
                                value: 'PREDICTION'
                            },
                            {
                                label: '模型增量训练',
                                value: 'INCRE-TRAINING'
                            }
                        ],
                        ptype: 'String',
                        multiple: false
                    });
                }
                params.rules = {};
                let rulesConf = {};
                runParams.forEach(item => {
                    rulesConf = { ...rulesConf, ...new RunParamBean(item, null, this.isTrainComp).makeParamsRules() };
                });
                params.rules.paramRules = rulesConf;
                this.showLoading = true;
                (this.meta._id ? updateCustomComponent({
                    ...params,
                    component_id: this.meta._id
                }) : createCustomComponent(params)).then(() => {
                    this.showLoading = false;
                    this.visible = false;
                    this.$emit('submitSuccess');
                }).catch(err => {
                    this.showLoading = false;
                });
            },
            initModel() {
                const uiTypeMap = {
                    CommonInputParamBean: 'input',
                    OptionParamBean: 'select',
                    SliderParamBean: 'slider',
                    FileSelectParamBean: 'file'
                };
                this.form.label = this.meta.label;
                let compTypeId = '';
                this.componentOptions.forEach(opt => {
                    (opt.children || []).forEach(item => {
                        if (item.name === this.meta.type) {
                            compTypeId = item._id;
                        }
                    });
                });
                this.form.component_type_id = compTypeId;
                this.form.description = this.meta.description || '';
                this.form.inputArgs = this.meta.inputParams.map(item => (new InputOutputArgsBean({
                    ...item, ...{
                        value: item.name,
                        multi: true
                    }
                })));
                this.form.outputArgs = this.meta.outputParams.map(item => (new InputOutputArgsBean({ ...item, ...{ value: item.name } })));
                this.form.run_file = this.meta.runFile || '';
                const buildParamsConf = (conf = []) => (
                    conf.map(item => {
                        let inputType = uiTypeMap[item.uiType];
                        if (item.actionType && item.actionType !== '') {
                            inputType = 'column';
                        }
                        if (inputType === 'input' && !item.ptype) {
                            inputType = 'text';
                        }
                        return new RunParamBean({
                            defaultVal: item.defaultValue,
                            cnName: item.label,
                            enName: item.name,
                            possibleValues: item.possibleValues || undefined,
                            paramType: item.ptype,
                            desc: item.tooltips,
                            inputType,
                            multi: item.multiple,
                            min: item.min,
                            max: item.max,
                            step: item.step,
                            actionType: item.actionType,
                            trainEditable: item.trainEditable,
                            paramModeType: item.paramModeType || [],
                            mixedParams: buildParamsConf(item.paramsConf),
                            isMixed: item.paramsConf && item.paramsConf.length > 0
                        });
                    })
                );
                this.form.params_conf = buildParamsConf(this.meta.paramsConf);
                this.form.runtime_id = this.meta.dockerImage._id;
                this.form.mainClass = this.meta.mainClass;
                if (this.isTrainComp) {
                    this.form.params_conf = this.form.params_conf.slice(1);
                }
            }
        },
        created() {
            Promise.all([
                getComponentOptions(),
                getRunTimeOptions()
            ]).then(([cData, rData]) => {
                this.componentOptions = cData;
                this.runtimeTypes = rData;
                if (this.meta && this.meta._id) {
                    this.initModel();
                }
            }, () => {
                this.runtimeTypes = [];
                this.componentOptions = [];
            });
        }
    };
</script>

<style lang="scss" scoped>
    .customize-comp {
        & /deep/ .sdxu-dialog .el-dialog {
            width: 680px;
        }
        .customize-comp-wrapper {
            height: 580px;
            display: flex;
            margin: -20px -40px;

            .customize-comp_step {
                width: 220px;
                padding: 40px 40px 100px;
                border-right: 1px solid #dedede;
            }

            .customize-comp_main {
                flex: 1;
                display: flex;
                justify-content: flex-start;
                flex-direction: column;

                .customize-comp_main_content {
                    flex: 1;
                    width: 100%;
                    overflow: auto;
                    padding: 20px 20px;
                }

                .customize-comp_main_footer {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    background: #f2f2f2;
                    height: 60px;
                    padding: 0 20px;
                    box-shadow:0px 0px 6px 0px rgba(0,0,0,0.12),0px -1px 0px 0px rgba(242,242,242,1);
                    z-index: 999;
                }
            }
        }
    }
</style>
