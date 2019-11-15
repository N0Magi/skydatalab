<template>
    <el-form-item
        class="setting-option"
        :error="validateResult"
    >
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

        <SdxwFileSelect
            :source="param.id"
            v-model="localVal"
            :limit="-1"
            :string-model="true"
        />
    </el-form-item>
</template>
<script>
import baseMixins from './editorBaseMixins';
import Validator from 'async-validator';
import FileSelect from '@sdx/widget/lib/file-select';
export default {
    mixins: [baseMixins],
    data() {
        return {
            validateResult: ''
        };
    },
    components: {
        [FileSelect.FileSelectMix.name]: FileSelect.FileSelectMix
    },
    methods: {
        checkFileValid() {
            let locVal = String(this.localVal);
            this.validateResult = '';
            const validator = new Validator({
                val: {
                    required: true,
                    message: '请选择文件',
                    trigger: 'blur'
                }
            });
            validator.validate({ val: locVal }, error => {
                if (!error) return;
                this.localVal = '';
                this.validateResult = error && error[0] && error[0].message || '';
            });
        }
    }
};
</script>
<style lang='scss'>

</style>
