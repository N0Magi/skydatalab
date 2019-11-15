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
        <el-input-number
            v-model="localVal"
            :step="param.step"
            :min="param.min"
            :max="localMax"
            size="small"
            class="input-number-custom"
            :disabled="!isEditable || !param.trainEditable"
        />
    </el-form-item>
</template>
<script>
import baseMixins from './editorBaseMixins';
export default {
    mixins: [baseMixins],
    computed: {
        localMax() {
            if (_.isArray(this.param.max)) {
                let ret = this.valObj;
                for (let item of this.param.max) {
                    ret = ret[item];
                }
                return ret;
            } else {
                return this.param.max;
            }
        }
    },
    watch: {
    /** @description 监听最大值变化,修正组件值 */
        localMax(nval) {
            if (this.localVal > nval) {
                this.localVal = nval;
            }
        }
    }
};
</script>
<style lang='scss'>

</style>
