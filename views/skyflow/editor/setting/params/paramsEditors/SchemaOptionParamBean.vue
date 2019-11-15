<template>
    <el-form-item class="setting-option">
        <el-tooltip
            v-if="param.tooltips"
            :content="param.tooltips"
            placement="bottom"
        >
            <span class="tip">
                <i v-if="required">
                    *
                </i> {{ param.label }}
            </span>
        </el-tooltip>
        <span
            class="tip"
            v-if="!param.tooltips"
        >
            <i v-if="required">
                *
            </i> {{ param.label }}
        </span>
        <el-select
            v-model="localVal"
            placeholder="请选择"
            size="small"
            :multiple="param.multiple"
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
                <span style="float: right; color: #8492a6; font-size: 13px; margin-right: 20px">
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
    // 如果所选的值不再选择项中,则删除这个值
        let valueRange = this.schema.map(item => item.cname);
        if (this.param.multiple) {
            this.localVal = this.localVal || [];
            // eslint-disable-next-line no-unused-expressions
            this.localVal.filter &&
            (this.localVal = this.localVal.filter(item =>
                valueRange.includes(item)
            ));
        } else {
            this.localVal = valueRange.includes(this.localVal) ? this.localVal : '';
        }
    }
};
</script>
<style lang='scss'>

</style>
