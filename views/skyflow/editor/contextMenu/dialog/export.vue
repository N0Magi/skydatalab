<template>
    <div class="share-container skyflow-dialog private-dialog">
        <sdxu-dialog
            title="结果导出"
            :visible.sync="dialogVisible"
            custom-class="selfStyle"
            width="520px"
            :close-on-click-modal="false"
        >
            <div>
                <el-form
                    label-position="right"
                    @submit.native.prevent
                    :model="currentData"
                    label-width="115px"
                    ref="currentData"
                    :rules="rules"
                >
                    <el-form-item>
                        <el-radio
                            v-model="currentData.export_type"
                            label="file"
                        >
                            文件系统
                        </el-radio>
                        <el-radio
                            v-model="currentData.export_type"
                            label="dataSet"
                        >
                            数据集
                        </el-radio>
                    </el-form-item>
                    <el-form-item
                        label="数据集名称:"
                        prop="dataset_name"
                        v-if="currentData.export_type === 'dataSet'"
                    >
                        <el-input
                            placeholder="请输入"
                            v-model="currentData.dataset_name"
                            size="small"
                        />
                    </el-form-item>
                    <el-form-item
                        label="数据集描述:"
                        prop="dataset_describe"
                        v-if="currentData.export_type === 'dataSet'"
                    >
                        <el-input
                            type="textarea"
                            placeholder="请输入"
                            v-model="currentData.dataset_describe"
                            size="small"
                        />
                    </el-form-item>
                    <el-form-item
                        label="导出节点:"
                        prop="nodeOutputParam"
                        class="paddingStyle"
                    >
                        <el-radio
                            v-model="currentData.nodeOutputParam"
                            v-for="(item,index) in (node && node.outputParams)"
                            :label="item"
                            :key="index"
                        >
                            {{ `节点${index + 1}/${item.ptype}/${item.stype}` }}
                        </el-radio>
                    </el-form-item>
                    <el-form-item
                        label="导出目标路径:"
                        prop="path"
                    >
                        <SdxwFileSelect
                            v-model="currentData.path"
                            checkType="folder"
                            source="ceph"
                            :string-model="true"
                        >
                            选择路径
                        </SdxwFileSelect>
                    </el-form-item>
                </el-form>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    @click="initForm"
                    size="small"
                >
                    取 消
                </el-button>
                <el-button
                    type="primary"
                    size="small"
                    @click="handleSaveModel('currentData')"
                >
                    确 认
                </el-button>
            </span>
        </sdxu-dialog>
    </div>
</template>
<script>
import FileSelect from '@sdx/widget/lib/file-select';
import { componentExport } from '@sdx/utils/lib/api/skyflow';

export default {
    name: 'Export',
    props: {
        contextDialogVisible: {
            type: Boolean,
            default: true
        },
        node: {
            type: Object,
            default: () => ({})
        },
        executeId: {
            type: String,
            default: ''
        }
    },
    components: {
        [FileSelect.FileSelectMix.name]: FileSelect.FileSelectMix
    },
    data() {
        return {
            currentData: {
                export_type: 'file',
                nodeOutputParam: null,
                dataset_name: '',
                dataset_describe: '',
                share_kind: 2,
                path: ''
            },
            rules: {
                dataset_name: [
                    {
                        required: true,
                        message: '请填写数据集名称',
                        trigger: 'blur',
                        transform(value) {
                            return value && ('' + value).trim();
                        }
                    },
                    { max: 9, message: '长度在9个字符以内', trigger: 'blur' }
                ],
                dataset_describe: [
                    {
                        required: true,
                        message: '请填写数据集描述',
                        trigger: 'blur',
                        transform(value) {
                            return value && ('' + value).trim();
                        }
                    }
                ],
                path: [{ required: true, message: '请选择路径', trigger: 'blur' }],
                nodeOutputParam: [
                    { required: true, message: '请选择导出节点', trigger: 'blur' }
                ],
                share_kind: [
                    { required: true, message: '请选择数据集共享', trigger: 'blur' }
                ]
            }
        };
    },
    computed: {
        dialogVisible: {
            get() {
                return this.contextDialogVisible;
            },
            set(nval) {
                this.$emit('update:contextDialogVisible', nval);
            }
        }
    },
    methods: {
        handleSaveModel(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    // this.$emit('confirm', { event: 'export', data: this.currentData })
                    let id = {
                        execute_id: this.executeId,
                        nid: this.node.id
                    };
                    let params = {};
                    if (this.currentData.export_type === 'file') {
                        params = Object.assign({}, id, {
                            export_type: 'file',
                            nodeOutputParam: this.currentData.nodeOutputParam,
                            path: this.currentData.path
                        });
                    } else {
                        params = Object.assign({}, id, this.currentData);
                    }

                    componentExport(params).then(data => {
                        this.currentData.path = '';
                    });

                    this.dialogVisible = false;
                    this.currentData.path = '';
                } else {
                    return false;
                }
            });
        },
        initForm() {
            this.dialogVisible = false;
            this.currentData.path = '';
        }
    },
    watch: {
        node() {
            if (this.node) {
                this.currentData = {
                    share_kind: 2,
                    export_type: 'file',
                    nodeOutputParam: this.node.outputParams[0]
                };
            }
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.private-dialog {
  .el-form-item:first-child {
    margin-left: 34px;
    border-bottom: 1px solid #dee4ec;
  }
  .paddingStyle {
    .el-radio + .el-radio {
      margin-left: 0px;
    }
  }
}
</style>
