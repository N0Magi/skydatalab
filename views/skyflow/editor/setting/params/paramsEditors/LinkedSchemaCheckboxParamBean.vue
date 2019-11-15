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
            let linkedParam = this.valObj[this.param.linkParam];
            this.currentSchema = this.currentSchema || [];
            return this.currentSchema.filter(item =>
                linkedParam.includes(item.cname)
            );
        }
    },
    methods: {
        filterVal() {
            // 过滤值,将不再选择项中的值过滤出去
            let valueRange = this.schema.map(item => item.cname);
            // eslint-disable-next-line
            this.localVal.filter &&
                (this.localVal = this.localVal.filter(item =>
                    valueRange.includes(item)
                ));
        }
    },
    mounted() {
        this.filterVal();
    },
    watch: {
        schema() {
            this.filterVal();
        }
    }
};
</script>
<style lang='scss'>

</style>
