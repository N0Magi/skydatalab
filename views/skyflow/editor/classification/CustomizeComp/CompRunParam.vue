<template>
    <div class="comp-run-param">
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
                <div class="description">
                    参数组中的参数会成组出现。
                </div>
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
    </div>
</template>

<script>
import customizeCompMixin from './customizeCompMixin';
import RunParams from '../RunParams';
import { RunParamBean } from '../RunParams/RunParamBean';
export default {
    name: 'CompRunParam',
    mixins: [customizeCompMixin],
    components: {
        RunParams
    },
    computed: {
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
        }
    },
    methods: {
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
        validate() {
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
            return Promise.all(paramConfForms);
        }
    }
};
</script>

<style lang="scss" scoped>
    .add-param-btn {
        min-width: 120px;
        color: rgba(169, 187, 210, 1);
        font-size: 14px;
        margin: 10px -15px 0;
    }
    .description {
        top: -10px;
        position: relative;
        line-height: 20px;
        margin-bottom: 8px;
        font-size: 12px;
        color: #576a7d;
    }
</style>
