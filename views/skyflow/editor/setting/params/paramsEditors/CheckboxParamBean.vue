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
            placeholder="请选择"
            size="small"
            :disabled="!isEditable || !param.trainEditable"
        >
            <el-option
                v-for="item in param.possibleValues"
                :key="item"
                :label="item"
                :value="item"
            />
        </el-select>
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
