<template>
    <div class="result-export ">
        <sdxu-dialog
            title="评估结果导出"
            class="skyflow-dialog"
            append-to-body
            :visible.sync="resultExportShow"
            width="520px"
            :before-close="handleClose"
            custom-class="selfStyle"
        >
            <el-form
                :model="resultExportData"
                :rules="rules"
                ref="ruleForm"
                label-width="120px"
                class="demo-ruleForm"
            >
                <el-form-item
                    label="模型名称"
                    prop="modelName"
                >
                    <el-input v-model="resultExportData.modelName" />
                </el-form-item>
                <el-form-item
                    label="模型版本"
                    prop="modelVersion"
                >
                    <el-input v-model="resultExportData.modelVersion" />
                </el-form-item>
                <el-form-item
                    label="报告名称"
                    prop="reportName"
                >
                    <el-input v-model="resultExportData.reportName" />
                </el-form-item>
                <el-form-item
                    label="报告描述"
                    prop="reportDescroption"
                >
                    <el-input
                        type="textarea"
                        v-model="resultExportData.reportDescroption"
                    />
                </el-form-item>
                <el-form-item
                    label="导出种类"
                    prop="type"
                >
                    <el-select
                        v-model="resultExportData.type"
                        placeholder="请选择导出种类"
                        style="width: 100%;"
                    >
                        <el-option
                            label="pdf"
                            value="1"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="导出目标路径"
                    prop="path"
                >
                    <SdxwFileSelect
                        v-model="resultExportData.path"
                        checkType="folder"
                        source="ceph"
                        :string-model="true"
                    >
                        选择路径
                    </SdxwFileSelect>
                </el-form-item>
            </el-form>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    @click="handleClose"
                    size="small"
                >
                    取 消
                </el-button>
                <el-button
                    type="primary"
                    @click="handleConfirm"
                    size="small"
                >
                    确 定
                </el-button>
            </span>
        </sdxu-dialog>
    </div>
</template>
<script>
import FileSelect from '@sdx/widget/lib/file-select';

export default {
    data() {
        return {
            resultExportData: {
                modelName: '',
                modelVersion: '',
                reportName: '',
                reportDescroption: '',
                type: '',
                path: ''
            },
            rules: {
                modelName: [{
                    required: true, message: '请输入模型名称', trigger: 'blur', transform(value) {
                        return value && ('' + value).trim();
                    }
                }],
                modelVersion: [{
                    required: true, message: '请输入模型版本', trigger: 'blur', transform(value) {
                        return value && ('' + value).trim();
                    }
                }],
                reportName: [{
                    required: true, message: '请输入报告名称', trigger: 'blur', transform(value) {
                        return value && ('' + value).trim();
                    }
                }],
                type: [{ required: true, message: '请选择导出种类', trigger: 'change' }],
                path: [{ required: true, message: '请选择导出路径', trigger: 'change' }]
            }
        };
    },
    props: {
        resultExportShow: {
            type: Boolean,
            required: true
        }
    },
    components: {
        [FileSelect.FileSelectMix.name]: FileSelect.FileSelectMix
    },
    methods: {
        checkPath() {
            this.$refs.ruleForm.validateField('path');
        },
        handleClose() {
            this.$refs.ruleForm.resetFields();
            this.$emit('update:resultExportShow', false);
        },
        handleConfirm() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
