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
        <el-slider
            v-model="localVal"
            :step="Number(param.step)"
            :min="Number(param.min)"
            :max="Number(param.max)"
            style="padding: 0 10px;"
            :disabled="!isEditable || !param.trainEditable"
        />
    </el-form-item>
</template>
<script>
import baseMixins from './editorBaseMixins';
export default {
    mixins: [baseMixins],
    computed: {
        localVal: {
            get() {
                return Number(this.value);
            },
            set(nval) {
                this.$emit('input', nval);
            }
        }
    }
};
</script>
<style>
</style>
