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
            v-model="localVal"
            source="ceph"
            :disabled="!isEditable || !param.trainEditable"
            :checkType="param.onlyFolder ? 'folder' : 'all'"
            :limit="param.limits || 1"
            :string-model="true"
            :prefix-owner="false"
        >
            {{ param.limits ?'选择文件' : '选择文件夹' }}
        </SdxwFileSelect>
    </el-form-item>
</template>
<script>
import baseMixins from './editorBaseMixins';
import FileSelect from '@sdx/widget/lib/file-select';
import Validator from 'async-validator';

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
                    message: `${this.param.limits ? '请选择文件' : '请选择文件'}`,
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
