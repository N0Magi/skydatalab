<template>
    <el-form
        ref="compForm"
        label-width="100px"
        label-position="left"
        :rules="rules"
        :model="form"
    >
        <ParamsPanel title="基本信息">
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
    </el-form>
</template>

<script>
import customizeCompMixin from './customizeCompMixin';
export default {
    name: 'CompBaseInfo',
    mixins: [customizeCompMixin]
};
</script>

<style scoped>

</style>
