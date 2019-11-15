<template>
    <div class="slider-additions">
        <el-form-item label="参数类型:">
            <el-select
                v-model="params.paramType"
                placeholder="请选择参数类型"
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
            </el-select>
        </el-form-item>
        <el-form-item
            label="最大值:"
            prop="max"
        >
            <el-input
                type="number"
                v-model="params.max"
                placeholder="请输入参数最大值"
            />
        </el-form-item>
        <el-form-item
            label="最小值:"
            prop="min"
        >
            <el-input
                type="number"
                v-model="params.min"
                placeholder="请输入参数最小值"
            />
        </el-form-item>
        <el-form-item
            label="步长:"
            prop="step"
        >
            <el-input
                type="number"
                v-model="params.step"
                placeholder="请输入步长"
            />
        </el-form-item>
        <el-form-item label="参数默认值:">
            <el-input
                type="number"
                v-model="params.defaultVal"
                placeholder="请输入参数默认值"
            />
        </el-form-item>
    </div>
</template>

<script>
export default {
    name: 'SliderAdditions',
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
