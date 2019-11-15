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
        <el-input
            v-model="localVal"
            :readonly="true"
            size="small"
            :disabled="!isEditable || !param.trainEditable"
        />
    </el-form-item>
</template>
<script>
import baseMixins from './editorBaseMixins';

export default {
    mixins: [baseMixins]
};
</script>
<style lang='scss'>

</style>
