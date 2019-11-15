<template>
    <div class="data-operation-additions">
        <el-form-item
            label="数据处理大类"
            prop="actionType"
        >
            <el-select
                v-model="params.actionType"
                placeholder="请选择数据处理大类"
                style="width:100%;"
            >
                <el-option
                    label="克隆列"
                    value="CloneColumn"
                />
                <el-option
                    label="删除列"
                    value="DeleteColumn"
                />
                <el-option
                    label="类型转换"
                    value="TypeTransform"
                />
                <el-option
                    label="join转换"
                    value="JoinTransform"
                />
                <el-option
                    label="数据选取"
                    value="DataPick"
                />
            </el-select>
        </el-form-item>
        <el-form-item label="支持多选:">
            <el-switch v-model="params.multi" />
        </el-form-item>
    </div>
</template>

<script>
export default {
    name: 'DataOperationAdditions',
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
        }
    }
};
</script>

<style scoped>

</style>
