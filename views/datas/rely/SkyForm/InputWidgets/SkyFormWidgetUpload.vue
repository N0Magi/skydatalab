/* @flow
<template>
    <div class="SkyFormWidgetUpload">
        <ElPopover
            ref="uploadPopover"
            trigger="click"
            :placement="placement"
            v-model="popoverVisible"
            :disabled="!canSelect"
            @hide="emitBlurOnFormItem"
        >
            <div class="upload-types">
                <Upload
                    ref="fileSelect"
                    class="upload-type-item"
                    :action="baseAPI+'/v2/ceph/upload/' + uploadPath.join('/')"
                    :multiple="true"
                    :directory="false"
                    :accept="acceptFilter"
                    :on-change="handlerFileChange"
                    :on-error="onFileError"
                    :on-progress="onProgress"
                    :on-success="onSuccess"
                    :limit="limit"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                >
                    <el-button
                        type="text"
                        :disabled="!canSelect"
                    >
                        选择本地文件
                    </el-button>
                </Upload>
                <Upload
                    ref="directorySelect"
                    v-show="limit!==1"
                    class="upload-type-item"
                    :action="baseAPI+'/v2/ceph/upload/' + uploadPath.join('/')"
                    :multiple="true"
                    :directory="true"
                    :accept="acceptFilter"
                    :on-change="handlerDirectoryChange"
                    :on-error="onDirectoryError"
                    :limit="limit"
                    :show-file-list="false"
                    :on-progress="onProgress"
                    :on-success="onSuccess"
                >
                    <el-button
                        type="text"
                        :disabled="!canSelect"
                    >
                        选择本地文件夹
                    </el-button>
                </Upload>
                <file-select
                    ref="cephSelect"
                    class="upload-type-item"
                    btnType="text"
                    btn-label="选择平台文件"
                    v-if="uploadType === 'all'"
                    v-model="cephPaths"
                    :show-file-list="false"
                    :is-single-check="limit===1"
                    :before-selected="beforeCephSelected"
                    :fullpath="fullpath"
                    :btn-disabled="!canSelect"
                    :filter="cephFilter"
                    :rich-model="true"
                    v-bind="cephParams"
                />
            </div>
        </ElPopover>
        <div
            class="popover-ref"
            v-show="!onlyFolder && (uploadType==='all' || uploadType ==='local')"
        >
            <ElButton
                v-popover:uploadPopover
                type="primary"
                :disabled="!canSelect"
                :size="size"
            >
                <slot>
                    {{ uploadBtnLabel }}
                </slot>
            </ElButton>
            <span
                class="accept-info"
                v-if="acceptFilter.length > 0"
            >
                请选择{{ acceptFilter }}类型的文件
            </span>
        </div>
        <SdxwFileSelect
            ref="cephSelectOnly"
            v-show="onlyFolder || uploadType==='ceph'"
            :fullpath="fullpath"
            :show-file-list="false"
            :is-single-check="limit===1"
            :btn-disabled="!canSelect"
            :filter="cephFilter"
            v-bind="cephParams"
            v-model="cephPaths"
            :rich-model="true"
            @blur="emitBlurOnFormItem"
        />
        <UploadList
            v-if="showUploadList"
            :files="selectedFiles"
            @remove="handleRemove"
        />
    </div>
</template>
*/
// <!--eslint-disable-next-line-->
// <script>
import Upload from '../../packages/upload';
import UploadList from '../../packages/upload/src/upload-list';
// import FileSelect from '../../project/formItems/fileSelect';
import SkyFormWidgetMixin from './SkyFormWidgetMixin';
import { getSourceCodeFilterByTaskKind } from '../../taskApis';
import emitter from 'element-ui/lib/mixins/emitter';

const inputTypeMap = {
    LOCAL_UPLOAD: 'local',
    CEPH_FILE: 'ceph',
    ALL_UPLOAD: 'all'
};
export default {
    name: 'SkyFormWidgetUpload',
    components: {
        // FileSelect,
        Upload,
        UploadList
    },
    mixins: [SkyFormWidgetMixin, emitter],
    data() {
        return {
            baseAPI: process.env.VUE_APP_BASE_API,
            cephPaths: [],
            selectedType: 'ceph',
            popoverVisible: false,
            acceptTypes: ''
        };
    },
    props: {
        fileList: {
            type: [Array, String],
            default: () => []
        },
        // 兼容model为string类型，如需使用string类型的Model，必须设置为true
        stringModel: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'all' // local:仅本地, ceph: ceph文件系统
        },
        limit: {
            type: Number,
            default: 1
        },
        accept: {
            type: String,
            default: ''
        },
        cephParams: {
            type: Object,
            default: () => ({})
        },
        onlyFolder: {
            type: Boolean,
            default: false
        },
        path: {
            type: Array,
            default: () => []
        },
        uploadBtnLabel: {
            type: String,
            default: '选择文件'
        },
        // 文件大小限制：最大，单位byte,默认200M
        maxSize: {
            type: Number,
            default: 200 * 1024 * 1024
        },
        onExceedMaxSize: {
            type: Function,
            default: undefined
        },
        // 根据接口过滤可选择的文件类型
        acceptKind: {
            type: Number,
            default: -1
        },
        // 兼容不使用绝对路径的场景，如需使用相对路径，必须设置为false
        fullpath: {
            type: Boolean,
            default: true
        },
        onProgress: {
            type: Function,
            default: undefined
        },
        onSuccess: {
            type: Function,
            default: undefined
        },
        onError: {
            type: Function,
            default: undefined
        },
        showUploadList: {
            type: Boolean,
            default: true
        },
        size: {
            type: String,
            default: 'normal'
        },
        placement: {
            type: String,
            default: 'right'
        }
    },
    model: {
        prop: 'fileList',
        event: 'change'
    },
    computed: {
        canSelect() {
            if (typeof this.fileList === 'string') {
                return (this.fileList && this.fileList.split(',') || []).length < this.limit;
            } else {
                return this.fileList.length < this.limit;
            }
        },
        cephFilter() {
            return this.acceptFilter !== '' && this.acceptFilter.split(',').filter(item => item.indexOf('.') === 0) || this.cephParams.filter || [];
        },
        uploadType() {
            // 兼容SkyForm中直接使用或通过组件引用两种模式
            if (this.inputType && inputTypeMap[this.inputType]) {
                return inputTypeMap[this.inputType];
            } else {
                return this.type;
            }
        },
        uploadPath() {
            if (this.path && this.path.length > 0) {
                return this.path;
            } else {
                return [this.$store.state.user.user.name];
            }
        },
        selectedFiles() {
            if (typeof this.fileList === 'string') {
                return (this.fileList && this.fileList.split(',') || []).map(item => ({
                    name: item,
                    cephName: item,
                    status: 'success',
                    percentage: 100,
                    uid: Math.ceil(Math.random() * 1000000000),
                    from: 'ceph',
                    isDir: false
                }));
            } else {
                return this.fileList;
            }
        },
        acceptFilter() {
            if (this.acceptTypes) {
                return this.acceptTypes;
            } else {
                return this.accept;
            }
        }
    },
    methods: {
        beforeUpload(file: Object): Promise<any> {
            return new Promise((resolve, reject) => {
                if (file.size > this.maxSize) {
                    this.$emit('exceed-max-size', file);
                    if (this.onExceedMaxSize && typeof this.onExceedMaxSize === 'function') {
                        this.onExceedMaxSize(file);
                    }
                    this.$refs.fileSelect.clearInputValue();
                    this.handleRemove(file);
                    reject(file);
                } else {
                    resolve(file);
                }
            });
        },
        handlerFileChange() {
            console.log(arguments);
            this.makeFileList();
        },
        handlerDirectoryChange() {
            this.makeFileList();
        },
        onFileError(err: Error, file: any, fileList: any) {
            // pass
            this.onError && this.onError(err, file, fileList);
            this.$message.error(err.message);
            this.handleRemove(file);
        },
        onDirectoryError(err: Error, file: any) {
            // pass
            this.onError && this.onError(err, file);
            this.$message.error(err.message);
            this.handleRemove(file);
        },
        handleRemove(file: any, rawFile: any) {
            if (file.from === 'ceph') {
                if (typeof this.cephPaths === 'string') {
                    this.cephPaths = '';
                } else if (typeof this.cephPaths === 'object' && !Array.isArray(this.cephPaths)) {
                    this.cephPaths = '';
                } else {
                    let index = this.cephPaths.findIndex(item => item === file.cephName);
                    this.cephPaths.splice(index, 1);
                }
                this.$refs.cephSelect && this.$refs.cephSelect.setNodeChecked(file.cephName, false, false);
                this.$refs.cephSelectOnly && this.$refs.cephSelectOnly.setNodeChecked(file.cephName, false, false);
                this.makeFileList();
            } else {
                this.$refs.fileSelect && this.$refs.fileSelect.handleRemove(file, rawFile);
                this.$refs.directorySelect && this.$refs.directorySelect.handleRemove(file, rawFile);
                this.makeFileList();
            }
        },
        beforeCephSelected() {
            this.selectedType = 'ceph';
            return true;
        },
        makeFileList() {
            let cephPaths = this.cephPaths;
            let fileUploadFiles = this.$refs.fileSelect && this.$refs.fileSelect.uploadFiles || [];
            let dirUploadFiles = this.$refs.directorySelect && this.$refs.directorySelect.uploadFiles || [];
            if (typeof cephPaths === 'string') {
                if (cephPaths !== '') {
                    cephPaths = [{
                        fullpath: cephPaths,
                        path: cephPaths,
                        is_dir: false
                    }];
                } else {
                    cephPaths = [];
                }
            } else if (typeof cephPaths === 'object' && !Array.isArray(cephPaths)) {
                cephPaths = [cephPaths];
            }
            const cephPathsMap = cephPaths.map(item => ({
                name: this.fullpath ? item.fullpath : item.path,
                cephName: this.fullpath ? item.fullpath : item.path,
                status: 'success',
                percentage: 100,
                uid: Math.ceil(Math.random() * 1000000000),
                from: 'ceph',
                isDir: item.is_dir
            }));
            let temp = [...fileUploadFiles, ...dirUploadFiles, ...cephPathsMap];
            this.$emit('change', this.stringModel ? temp.map(item => item.cephName).join(',') : temp);
        },
        emitBlurOnFormItem() {
            if (this.$parent.$options.componentName === 'ElFormItem') {
                this.$parent.$emit('el.form.blur');
            }
            this.dispatch('ElFormItem', 'el.form.blur');
            this.$emit('blur');
        },
        initFilter() {
            if (this.acceptKind === -1) {
                return;
            }
            getSourceCodeFilterByTaskKind(this.acceptKind)
                .then(data => {
                    this.acceptTypes = data.allow.join(',');
                });
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.uploadPopover && this.$refs.uploadPopover.updatePopper();
            let fileList = this.fileList;
            let cephModel;
            if (typeof this.fileList === 'string') {
                fileList = this.fileList && this.fileList.split(',') || [];
                cephModel = fileList.map(item => ({
                    fullpath: item,
                    path: item,
                    is_dir: false
                }));
            } else {
                cephModel = fileList.map(item => ({
                    fullpath: item.cephName,
                    path: item.cephName,
                    is_dir: item.isDir || false
                }));
            }

            cephModel.forEach(item => {
                this.$refs.cephSelect && this.$refs.cephSelect.setNodeChecked(item.cephName, true, false);
                this.$refs.cephSelectOnly && this.$refs.cephSelectOnly.setNodeChecked(item.cephName, true, false);
            });
            this.cephPaths = cephModel;
        });
        this.initFilter();
    },
    watch: {
        fileList: {
            deep: true,
            handler(val: Array<any> | string, oldval: Array<any> | string) {
                if (typeof val === 'string') {
                    if (val !== oldval) {
                        this.popoverVisible = false;
                    }
                } else {
                    // if (val.length !== oldval.length) {
                    this.popoverVisible = false;
                    // }
                }
            }
        },
        cephPaths() {
            this.makeFileList();
        },
        uploadType() {
            this.cephPaths = [];
            this.$refs.fileSelect && this.$refs.fileSelect.clearFiles();
            this.$refs.directorySelect && this.$refs.directorySelect.clearFiles();
        },
        popoverVisible(val: ?boolean) {
            if (!val) {
                this.emitBlurOnFormItem();
            }
        }
    }
};
// </script>

/*
<style lang="scss" scoped>
    .upload-types {
        text-align: center;
        .upload-type-item {
            color: #7A8599;
            text-align: center;
            border-top: 1px solid #dedede;
            /deep/ .el-button--text {
                color: inherit;
            }
            &:first {
                border-top: 0;
            }
            &:hover {
                color: #1681DE;
                background: #EFF8FF;
            }
        }
    }
    .SkyFormWidgetUpload {
        .popover-ref {
            position: relative;
            .accept-info {
                font-size: 14px;
                color: #ababab;
                margin-left: 5px;
            }
        }
    }
</style>
*/
