<template>
    <el-form-item
        :label="param.label"
        :required="required"
        class="sort-option"
    >
        <div class="sort">
            <div @click="$emit('topBtn', index)">
                <i class="el-icon-caret-top" />
            </div>
            <div @click="$emit('bottomBtn', index)">
                <i class="el-icon-caret-bottom" />
            </div>
        </div>
        <el-select
            v-model="localVal"
            :multiple="param.multiple"
            placeholder="请选择"
            size="small"
            :disabled="!isEditable || !param.trainEditable"
        >
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
        </el-select>
    </el-form-item>
</template>
<script>
import baseMixins from './editorBaseMixins';
import fetch from '../../../../../../utils/fetch';

export default {
    mixins: [baseMixins],
    data() {
        return {
            options: []
        };
    },
    watch: {
        'param.possibleValues': {
            immediate: true,
            handler(val) {
                if (typeof val === 'string') {
                    fetch.get(val).then(res => {
                        this.options = res.data;
                    });
                } else if (Array.isArray(val)) {
                    this.options = val.slice();
                } else {
                    this.options = [];
                }
            }
        }
    }
};
</script>
<style lang="scss">
.sort-option {
    input {
        width: 160px !important;
    }
    .el-input {
        padding-left: 4px !important;
    }
    .sort {
        position: relative;
        height: 32px;
        width: 32px;
        display: inline-block;
        border: 1px solid rgb(220, 223, 230);
        margin: 0;
        padding: 0;
        left: 8px;
        top: 11px;
        border-right: none;
        div {
            position: relative;
            left: 8px;
            height: 50%;
            i {
                position: absolute;
            }
            &:active i {
                color: #459cdf;
            }
        }
    }
}
</style>
