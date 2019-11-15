<template>
    <el-form
        ref="compForm"
        label-width="100px"
        label-position="left"
        :rules="rules"
        :model="form"
    >
        <ParamsPanel title="输入输出">
            <div class="description">
                输入输出路径获取方式：从系统环境变量里面获取参数名对应的值。python中的获取方式：os.environ.get("input. 输入输出参数名")。
            </div>
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
                    <i class="sf-icon sf-jiahao" /> 添加输入参数
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
                    <i class="sf-icon sf-jiahao" /> 添加输出参数
                </el-button>
            </div>
        </ParamsPanel>
    </el-form>
</template>

<script>
import customizeCompMixin from './customizeCompMixin';
import InputOutputArgs from '../InputOutputArgs';
import { InputOutputArgsBean } from '../InputOutputArgs/InputOutputArgsBean';
export default {
    name: 'CompInputOutput',
    mixins: [customizeCompMixin],
    components: {
        InputOutputArgs
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
        validate() {
            let validateList = [];
            this.form.inputArgs.forEach((item, index) => {
                validateList.push(this.$refs[`inputArg${index}`][0].$refs.inputOutputForm.validate());
            });
            this.form.outputArgs.forEach((item, index) => {
                validateList.push(this.$refs[`outputArg${index}`][0].$refs.inputOutputForm.validate());
            });
            return Promise.all(validateList);
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
