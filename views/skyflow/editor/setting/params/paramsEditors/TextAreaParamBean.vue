<template>
    <div class="text-area">
        <el-form-item
            :label="param.label"
            :required="required"
            class="setting-option"
        >
            <el-input
                v-model="localVal"
                @blur="checkVal"
                size="small"
                :disabled="!isEditable || !param.trainEditable"
            />
        </el-form-item>
        <span
            class="warn"
            v-if="valFlag"
        >
            请输入{{ this.param.ptype }}类型
        </span>
    </div>
</template>
<script>
import baseMixins from './editorBaseMixins';
export default {
    mixins: [baseMixins],
    methods: {
        checkVal() {
            this.valFlag = Number.isInteger(Number(this.localVal));
            if (this.valFlag) {
                this.localVal = '';
            }
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .text-area {
        .warn {
            color: #f56c6c;
            font-size: 12px;
            padding-left: 10px;
        }
    }
</style>
