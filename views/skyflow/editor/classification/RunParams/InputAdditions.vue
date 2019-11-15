<template>
    <div class="input-additions">
        <el-form-item label="数据类型:">
            <el-select
                v-model="params.paramType"
                placeholder="请选择数据类型"
                style="width:100%;"
            >
                <el-option
                    label="Double"
                    value="Double"
                />
                <el-option
                    label="Float"
                    value="Float"
                />
                <el-option
                    label="Integer"
                    value="Integer"
                />
                <el-option
                    label="String"
                    value="String"
                />
                <el-option
                    label="Boolean"
                    value="Boolean"
                />
                <!--<el-option label="DateTime" value="DateTime"/>-->
                <!--<el-option label="Number" value="Number"/>-->
            </el-select>
        </el-form-item>
        <el-form-item
            label="参数默认值:"
            prop="defaultVal"
        >
            <el-input
                v-if="defaultInputMode === 'input'"
                v-model="params.defaultVal"
                placeholder="请输入参数默认值"
            />
            <el-switch
                v-model="params.defaultVal"
                v-if="defaultInputMode === 'switch'"
                active-text="是"
                inactive-text="否"
                @change="$parent.validateField('defaultVal')"
            />
            <el-date-picker
                v-model="params.defaultVal"
                type="datetime"
                v-if="defaultInputMode === 'time'"
                placeholder="选择日期时间"
            />
        </el-form-item>
    </div>
</template>

<script>
const noNeedChangeType = ['Double', 'Integer', 'String', 'Number', 'Float'];
export default {
    name: 'InputAdditions',
    props: {
        paramOptions: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    computed: {
        params: {
            get() {
                return this.paramOptions;
            },
            set(val) {
                this.$emit('update:paramOptions', val);
            }
        },
        defaultInputMode() {
            let ret = '';
            if (['Double', 'Integer', 'String', 'Number', 'Float'].indexOf(this.params.paramType) >= 0) {
                ret = 'input';
            } else if (this.params.paramType === 'Boolean') {
                ret = 'switch';
            } else if (this.params.paramType === 'DateTime') {
                ret = 'time';
            }
            return ret;
        }
    },
    watch: {
        'params.paramType': {
            handler(val, oldval) {
                if (noNeedChangeType.indexOf(val) >= 0 && noNeedChangeType.indexOf(oldval) >= 0) {
                    return;
                } else {
                    if (val === 'Boolean') {
                        this.params.defaultVal = false;
                    } else {
                        this.params.defaultVal = '';
                    }
                }
            }
        }
    },
    mounted() {
        console.log(this.$parent);
    }
};
</script>

<style scoped>

</style>
