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
            :disabled="!isEditable || !param.trainEditable"
        >
            <el-option
                v-for="item in localPossibleValue"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
        </el-select>
    </el-form-item>
</template>
<script>
import baseMixins from './editorBaseMixins';
export default {
    mixins: [baseMixins],
    computed: {
        localPossibleValue() {
            let acceptVal = this.valObj[this.param.filterParam];
            if (acceptVal) {
                return this.param.possibleValues.filter(item =>
                    item.accept.includes(acceptVal)
                );
            } else {
                return [];
            }
        }
    },
    watch: {
        localPossibleValue(nval) {
            if (!nval.find(item => item.value === this.localVal)) {
                this.localVal = '';
            }
        }
    }
};
</script>
<style lang='scss'>

</style>
