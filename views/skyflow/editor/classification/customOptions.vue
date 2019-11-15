<template>
    <div class="custom-dialog skyflow-dialog">
        <MyDialog
            :visible="visible"
            custom-class="selfStyle"
            width="520px"
            :title="title"
            :close-on-click-modal="false"
            @close="closeDialog('customForm')"
            v-loading="showLoading"
        >
            <el-form
                class="options-form"
                label-width="100px"
                label-position="left"
                :rules="rules"
                ref="customForm"
                :model="form"
            >
                <ParamsPanel>
                    <el-form-item
                        label="组件名称:"
                        prop="label"
                    >
                        <el-input
                            v-model="form.label"
                            clearable
                            max-length="9"
                            class="larger-size"
                        />
                    </el-form-item>
                    <el-form-item
                        label="组件类型:"
                        prop="component_type_id"
                    >
                        <el-select
                            v-model="form.component_type_id"
                            style="width:100%;"
                            placeholder="请选择"
                            class="larger-size"
                        >
                            <el-option-group
                                v-for="group in componentOptions"
                                :key="group._id"
                                :label="group.label"
                            >
                                <el-option
                                    v-for="item in group.children"
                                    :key="item._id"
                                    :label="item.label"
                                    :value="item._id"
                                />
                            </el-option-group>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="组件描述:"
                        prop="description"
                    >
                        <el-input
                            v-model="form.description"
                            type="textarea"
                            rows="2"
                            class="larger-size"
                        />
                    </el-form-item>
                </ParamsPanel>
                <ParamsPanel title="输入输出">
                    <InputOutputArgs
                        v-for="(item, index) in form.inputArgs"
                        :key="`input${index}`"
                        :ref="`inputArg${index}`"
                        type="input"
                        :param-options="item"
                        :removable="index > 0"
                        :arg-list="form.inputArgs"
                        @delete-arg="subtractInputArg(index)"
                    />
                    <div>
                        <el-button
                            class="add-param-btn"
                            size="mini"
                            @click="addInputArg"
                        >
                            <i
                                class="sf-icon sf-jiahao"
                            /> 添加输入参数
                        </el-button>
                    </div>

                    <InputOutputArgs
                        v-for="(item, index) in form.outputArgs"
                        :key="`output${index}`"
                        :ref="`outputArg${index}`"
                        type="output"
                        :param-options="item"
                        :removable="true"
                        :arg-list="form.outputArgs"
                        style="margin-top: 10px;"
                        @delete-arg="subtractOutputArg(index)"
                    />
                    <div>
                        <el-button
                            class="add-param-btn"
                            size="mini"
                            @click="addOutputArg"
                        >
                            <i
                                class="sf-icon sf-jiahao"
                            /> 添加输出参数
                        </el-button>
                    </div>
                </ParamsPanel>
                <ParamsPanel title="运行环境">
                    <el-form-item
                        label="运行环境:"
                        prop="runtime_id"
                    >
                        <el-select
                            v-model="form.runtime_id"
                            placeholder="请选择"
                            class="larger-size"
                            style="width:100%;"
                        >
                            <el-option-group
                                v-for="group in runtimeTypes"
                                :key="group.name"
                                :label="group.name"
                            >
                                <el-option
                                    v-for="item in group.children"
                                    :key="item._id"
                                    :label="item.name"
                                    :value="item._id"
                                />
                            </el-option-group>
                        </el-select>
                    </el-form-item>
                </ParamsPanel>
                <ParamsPanel title="算法文件">
                    <el-form-item
                        label="执行文件:"
                        prop="run_file"
                    >
                        <!--<file-select-->
                        <!--v-model="form.run_file"-->
                        <!--:can-check-folder="false"-->
                        <!--:click-kind="-1"-->
                        <!--:fullpath="true"-->
                        <!--:filter="['.py', '.jar']"-->
                        <!--@blur="$refs.customForm.validateField('run_file')"-->
                        <!--btn-label="选择文件"-->
                        <!--/>-->
                        <SdxwFileSelect
                            v-model="form.run_file"
                            source="all"
                            :limit="1"
                            :string-model="true"
                            :accept="(runEnvType && runEnvType.parent.name) === 'spark' ? '.jar' : '.py,.zip'"
                            check-type="file"
                            :prefix-owner="false"
                            :project-enable="false"
                            :private-enable="true"
                            :share-enable="false"
                        />
                    </el-form-item>
                    <el-form-item
                        label="主类:"
                        prop="mainClass"
                        v-if="runEnvType && runEnvType.parent.name === 'spark'"
                    >
                        <el-input
                            type="text"
                            v-model="form.mainClass"
                        />
                    </el-form-item>
                </ParamsPanel>
                <ParamsPanel title="运行参数">
                    <ParamsPanel title="参数配置">
                        <RunParams
                            :params-list="form.params_conf"
                            v-for="(item, i) in simpleParamConf"
                            :key="i"
                            :ref="`runParam${i}`"
                            :param-options="item"
                            :comp-type="compType"
                            @delete-param="doDeleteParam(item,i, 'simple')"
                        />
                        <el-button
                            size="mini"
                            class="add-param-btn"
                            @click="addExecParam"
                        >
                            <i class="sf-icon sf-jiahao" /> 添加参数
                        </el-button>
                    </ParamsPanel>
                    <ParamsPanel title="参数组配置">
                        <RunParams
                            :params-list="form.params_conf"
                            v-for="(item, i) in mixedParamConf"
                            :key="&quot;exec&quot; + i"
                            :ref="`runParamMixed${i}`"
                            :param-options="item"
                            :comp-type="compType"
                            @delete-param="doDeleteParam(item,i, 'mixed')"
                        />
                        <el-button
                            size="mini"
                            class="add-param-btn"
                            @click="addExecParamGroup"
                        >
                            <i class="sf-icon sf-jiahao" /> 添加参数组
                        </el-button>
                    </ParamsPanel>
                </ParamsPanel>
            </el-form>
            <div
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    @click="closeDialog('customForm')"
                    size="small"
                    class="button-cancle"
                >
                    取 消
                </el-button>
                <el-button
                    type="primary"
                    size="small"
                    @click="submitForm('customForm')"
                    class="button-submit"
                >
                    确 定
                </el-button>
            </div>
        </MyDialog>
    </div>
</template>

<script>
import {
    createCustomComponent,
    updateCustomComponent,
    getComponentOptions,
    getRunTimeOptions
} from '@sdx/utils/lib/api/skyflow';
import FileSelect from '@sdx/widget/lib/file-select';
import InputOutputArgs from './InputOutputArgs';
import RunParams from './RunParams';
import { RunParamBean } from './RunParams/RunParamBean';
import { InputOutputArgsBean } from './InputOutputArgs/InputOutputArgsBean';
import ParamsPanel from './ParamsPanel';
import ElDialog from 'element-ui/lib/dialog';

export default {
    name: 'CustomOptons',
    components: {
        ParamsPanel,
        [FileSelect.FileSelectMix.name]: FileSelect.FileSelectMix,
        RunParams,
        InputOutputArgs,
        MyDialog: ElDialog
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
    computed: {
        title() {
            return this.meta._id ? '编辑自定义组件' : '创建自定义组件';
        },
        simpleParamConf: {
            get() {
                return this.form.params_conf.filter(item => !item.isMixed);
            },
            set(val) {
                this.form.params_conf = [
                    ...val,
                    ...this.mixedParamConf
                ];
            }
        },
        mixedParamConf: {
            get() {
                return this.form.params_conf.filter(item => item.isMixed);
            },
            set(val) {
                this.form.params_conf = [
                    ...this.simpleParamConf,
                    ...val
                ];
            }
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
        runEnvType() {
            for (let i = 0, len = this.runtimeTypes.length; i < len; i++) {
                const child = this.runtimeTypes[i].children || [];
                for (let j = 0; j < child.length; j++) {
                    if (child[j]._id === this.form.runtime_id) {
                        return {
                            parent: this.runtimeTypes[i],
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
        },
        visible: {
            get() {
                return this.dialogVisible;
            },
            set(val) {
                this.$emit('update:dialogVisible', val);
            }
        }
    },
    data() {
        return {
            showLoading: false,
            form: {
                label: '',
                component_type_id: '',
                description: '',
                input_params: [],
                output_params: [],
                run_file: [],
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
    methods: {
        addInputArg() {
            this.form.inputArgs.push(new InputOutputArgsBean({ multi: true }));
        },
        addOutputArg() {
            this.form.outputArgs.push(new InputOutputArgsBean());
        },
        subtractInputArg(i) {
            this.form.inputArgs.splice(i, 1);
        },
        subtractOutputArg(i) {
            this.form.outputArgs.splice(i, 1);
        },
        addExecParam() {
            this.form.params_conf.push(new RunParamBean());
        },
        addExecParamGroup() {
            this.form.params_conf.push(new RunParamBean({
                mixedParams: [new RunParamBean()]
            }));
        },
        doDeleteParam(item, index, type) {
            if (type === 'mixed') {
                this.mixedParamConf = [
                    ...this.mixedParamConf.slice(0, index),
                    ...this.mixedParamConf.slice(index + 1)
                ];
            } else {
                this.simpleParamConf = [
                    ...this.simpleParamConf.slice(0, index),
                    ...this.simpleParamConf.slice(index + 1)
                ];
            }
        },
        submitForm(formName) {
            let forms = [
                ...this.form.inputArgs.map((item, index) => this.$refs[`inputArg${index}`][0].$refs.inputOutputForm.validate()),
                ...this.form.outputArgs.map((item, index) => this.$refs[`outputArg${index}`][0].$refs.inputOutputForm.validate())
            ];
            let paramConfForms = [];
            this.simpleParamConf.forEach((item, index) => {
                paramConfForms.push(this.$refs[`runParam${index}`][0].$refs.execParamForm.validate());
            });
            this.mixedParamConf.forEach((item, index) => {
                paramConfForms.push(this.$refs[`runParamMixed${index}`][0].$refs.mixedFormParent.validate());
                item.mixedParams.forEach((mItem, mIndex) => {
                    paramConfForms.push(this.$refs[`runParamMixed${index}`][0].$refs[`mixForm${mIndex}`][0].$refs.execParamForm.validate());
                });
            });
            Promise.all(
                [
                    ...forms,
                    ...paramConfForms,
                    this.$refs[formName].validate()
                ]
            ).then(() => {
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
            });
        },
        closeDialog(formName) {
            this.$refs[formName].resetFields();
            this.visible = false;
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

<style>
    /* 修改element-ui默认样式 */
    .custom-dialog .options-form {
        padding-left: 10px;
    }

    .custom-dialog .selfStyle .el-dialog__body {
        max-height: 60vh;
        overflow: auto;
        padding: 10px 20px;
    }
</style>

<style scoped>
    .custom-dialog * {
        border-radius: 0;
    }

    .custom-dialog input {
        height: 32px;
    }

    .custom-dialog .icon-shanchu {
        color: #dee4ec;
        font-size: 24px;
        cursor: pointer;
    }

    .custom-dialog label {
        font-size: 14px;
        font-family: siyuan-rg;
        color: rgba(63, 89, 115, 1);
    }

    .custom-dialog-title {
        font-size: 16px;
        font-family: siyuan-rg;
        color: rgba(39, 63, 88, 1);
    }

    .custom-group {
        display: block;
        font-size: 14px;
        font-family: siyuan-rg;
        font-weight: bold !important;
        color: rgba(39, 63, 88, 1);
        margin-bottom: 16px;
    }

    .add-exec-param {
        margin: 20px 0 20px;
    }

    .small-size {
        width: 140px;
    }

    .middle-size {
        width: 340px;
    }

    .add-param-btn {
        /*border: 1px dashed rgba(222, 228, 236, 1);*/
        min-width: 120px;
        color: rgba(169, 187, 210, 1);
        font-size: 14px;
        margin: 10px -15px 0;
    }

    .button-subtract {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border-width: 1;
        vertical-align: middle;
        color: rgba(206, 214, 222, 1);
        /* background-color: rgba(222, 228, 236, 1); */
        border-color: #ced6de;
        padding: 0;
    }

    .button-subtract i {
        font-size: 20px;
    }

    .button-subtract-input {
        position: absolute;
        right: -30px;
        bottom: 8px;
    }

    .button-subtract-exec {
        position: absolute;
        right: -12px;
        bottom: 60px;
    }

    .input-subtract > input {
        padding-right: 36px;
    }

    .button-submit,
    .button-cancle {
        width: 80px;
    }

    hr.custom-dialog-line {
        border-width: 0;
        width: 460px;
        height: 2px;
        background-color: rgba(222, 228, 236, 1);
        margin-bottom: 20px;
    }
</style>
