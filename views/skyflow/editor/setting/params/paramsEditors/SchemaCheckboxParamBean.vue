<template>
    <el-form-item
        :label="param.label"
        :required="required"
        class="setting-option"
    >
        <el-select
            v-model="localVal"
            multiple
            collapse-tags
            placeholder="请选择"
            size="small"
            :disabled="!isEditable || !param.trainEditable"
        >
            <el-option
                v-for="(item,index) in schema"
                :key="index"
                :label="`${item.cname}(${item.ctype})`"
                :value="item.cname"
            >
                <span style="float: left">
                    {{ item.cname }}
                </span>
                <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ item.ctype }}
                </span>
            </el-option>
        </el-select>
    </el-form-item>
</template>
<script>
import baseMixins from './editorBaseMixins';
export default {
    mixins: [baseMixins],
    computed: {
        schema() {
            return this.currentSchema || [];
        }
    },
    mounted() {
    // 过滤值,将不再选择项中的值过滤出去
        let valueRange = this.schema.map(item => item.cname);
        this.localVal = this.localVal || [];
        // eslint-disable-next-line no-unused-expressions
        this.localVal.filter &&
            (this.localVal = this.localVal.filter(item =>
                valueRange.includes(item)
            ));
    }
};
</script>
<style>
</style>
