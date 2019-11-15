<template>
    <div class="hdfs-select">
        <el-popover
            ref="filePopover"
            @hide="$emit('blur')"
            placement="right"
            width="400"
            trigger="click"
        >
            <div class="hdfs-select-box">
                <!-- <slot name="header">
                    <el-input placeholder="输入关键字进行过滤"
                              class="search-box"
                              v-model="filterText">
                    </el-input>
                </slot> -->
                <div :style="{'max-height': '50vh', 'overflow': 'auto', 'display': 'flex', 'flex-direction': 'row'}">
                    <el-tree
                        v-loading="isTreeLoading"
                        v-bind="__treeOption"
                        ref="fileTree"
                        @check-change="handleCheckChange"
                        @node-expand="updatePopper"
                        @node-collapse="updatePopper"
                        class="file-el-tree"
                    />
                </div>
                <slot name="footer">
                    <div class="buttons">
                        <el-button
                            size="mini"
                            @click="handleCancel"
                        >
                            取消
                        </el-button>
                        <el-button
                            type="primary"
                            size="mini"
                            @click="handleCheckedNodes"
                        >
                            确定
                        </el-button>
                    </div>
                </slot>
            </div>
        </el-popover>
        <el-button
            v-popover:filePopover
            :type="btnType"
            class="hdfs-select-btn"
            :disabled="btnDisabled || !canSelect"
        >
            {{ btnLabel }}
        </el-button>
        <div
            class="selected-files"
            :class="{inline:isSingleCheck}"
            v-show="selectedNodes.length && showFileList"
        >
            <div
                class="selected-files__item"
                v-for="(item, index) in selectedNodes"
                :key="index"
            >
                <i class="iconfont icon-finished" />
                {{ item }}
            </div>
        </div>
        <div
            class="allow-suggest inline"
            v-if="!selectedNodes.length && computedAllow && computedAllow.length && showFileList"
            v-text="`请${isBlack?'不要':''}选择 ${computedAllow.join(' ')} 类型的文件`"
        />
        <UploadList
            :files="selectedFiles"
            @remove="handleRemove"
        />
    </div>
</template>

<script>
import { hdfsLs } from '../dataApi';
// import { mapState } from 'vuex';
import UploadList from '../../packages/upload/src/upload-list';
export default {
    name: 'HdfsSelect',
    data() {
        return {
            filterText: '', // 头部的过滤器
            isTreeLoading: false, // 文件树是否正在加载
            showPopover: false, // 是否展示
            allow: null, // 通过type获取的文件类型过滤数组
            computedAllow: [], // 计算后的文件类型过滤数组,用于提示
            name: '',
            saveName: '',
            fileFilter__: false,
            treeData: []
        };
    },
    components: {
        UploadList
    },
    props: {
        // v-model绑定的数据(文件的path,单选的时候是字符串,多选的时候是数组)
        value: {
            type: [String, Array, Object],
            default: ''
        },
        source: {
            type: String,
            default: '',
            required: true
        },
        filter: {
            // 过滤文件类型,默认是白名单过滤,如果isBlack是true,则采用黑名单过滤
            // 当过滤器是数组时,只过滤文件扩展名
            // 当过滤器是个函数时,返回true则保留,返回false则丢弃,接受参数为当前node对象
            // 根据kind获取的过滤条件优先级高于filter
            type: [Array, Function],
            default: null
        },
        // 是否是黑名单过滤
        isBlack: {
            type: Boolean,
            default: false
        },
        // 是否只能选择一个文件
        isSingleCheck: {
            type: Boolean,
            default: true
        },
        // el-element tree 控件参数,参考官方文档
        // 该参数的配置会覆盖本插件内的默认配置.
        // 插件已经配置部分参数,如果没有特殊需求,不需要改动
        treeOptions: {
            type: Object,
            default: null
        },
        // 是否可以选中文件夹
        canCheckFolder: {
            type: Boolean,
            default: false
        },
        onlyFolder: {
            type: Boolean,
            default: false
        },
        // 按钮上的文字定制
        btnLabel: {
            type: String,
            default: '选择文件'
        },
        btnType: {
            type: String,
            default: 'primary'
        },
        // 确认之前的hook,接受当前选择结果为参数 (checkedFiles, checkedFilesObj)
        // 接受同步回调,返回 false 则不关闭弹出,返回 true 则关闭弹出
        // 接受异步回调,返回 Promise.reslove(true)则关闭弹出,reslove(false)不关闭弹出,reject(errMsg)不关闭弹出且会弹出错误信息
        beforeSelected: {
            type: Function,
            default: null
        },
        // 是否使用全路径，传true则会返回fullpath
        fullpath: {
            type: Boolean,
            default: false
        },
        // 按钮禁用
        btnDisabled: {
            type: Boolean,
            default: false
        },
        showFileList: {
            type: Boolean,
            default: false
        },
        // 富Model，再value中携带is_dir等属性，用于特殊场景需要获取文件类型等信息
        richModel: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        // 获取用户名,用于请求当前用户的目录树
        ...mapState({
            userPath: () => '/',
            // 排序
            rootFileNameMap() {
                return {
                    group_files: '组内共享文件',
                    public_files: '全局共享文件',
                    project_files: '项目共享文件'
                };
            }
        }),
        canSelect() {
            if (this.isSingleCheck && (this.value !== '' || this.value.length > 0)) {
                return false;
            }
            return true;
        },
        // 已选节点(兼容单选和多选模式)
        selectedNodes() {
            if (this.isSingleCheck) {
                if (this.richModel) {
                    return (this.value ? [this.value] : []).map(
                        item => item.fullpath
                    );
                } else {
                    return this.value ? [this.value] : [];
                }
            } else {
                if (this.richModel) {
                    return this.value.map(item => item.fullpath);
                } else {
                    return this.value;
                }
            }
        },
        // 动态文件过滤器
        // fileFilter__() {
        //     // 通过kind获取的过滤条件比通过filter传入的优先级高
        //     let __allow = this.allow || this.filter;
        //     if (__allow) {
        //         // 当过滤条件是数组的时候,默认过滤文件类型
        //         if (_.isArray(__allow)) {
        //             this.computedAllow = __allow;
        //             return ({ ext, is_dir }) => {
        //                 if (is_dir) {
        //                     return true;
        //                 } else {
        //                     let ret = __allow.includes(ext);
        //                     return this.isBlack ? !ret : ret; // 兼容黑名单和白名单
        //                 }
        //             };
        //         } else if (_.isFunction(__allow)) {
        //             return __allow;
        //         }
        //     } else {
        //         return false;
        //     }
        // },
        // 合并外部Tree参数,通过 v-bind='__treeOption' 一次性将这些设置都配置到 el-tree上
        __treeOption() {
            return {
                'filter-node-method': this.filterNodeMethod,
                'render-content': this.renderContent,
                'check-strictly': true,
                'show-checkbox': true,
                'highlight-current': true,
                'node-key': this.fullpath ? 'fullpath' : 'path',
                'empty-text': '没有文件',
                lazy: true,
                load: this.fetchFiles,
                'default-checked-keys': this.selectedNodes,
                data: this.treeData || [],
                props: {
                    label: 'name',
                    children: 'children',
                    isLeaf: data => !data.is_dir
                },
                ...this.treeOptions
            };
        },
        // 返回 tree 的 ref 引用,可以通过这引用调用 el-tree 的各种方法
        tree() {
            return this.$refs.fileTree;
        },
        selectedFiles() {
            const nodes = typeof this.selectedNodes === 'string' ? (this.selectedNodes ? [this.selectedNodes] : []) : this.selectedNodes;
            return nodes.map(item => ({
                name: item,
                hdfsName: item,
                status: 'success',
                percentage: 100,
                uid: Math.ceil(Math.random() * 1000000000),
                from: 'hdfs',
                isDir: false
            }));
        }
    },
    methods: {
        // 文件树的数据过滤器,用于在源头过滤文件树
        __filterNodes(files) {
            if (this.fileFilter__) {
                return files.filter(item => this.fileFilter__(item));
            } else {
                return files;
            }
        },
        // 文件树过滤函数,用户用户输入文件名时的过滤(兼容自定义props)
        filterNodeMethod(value, data) {
            // 兼容自定义props
            return data[this.__treeOption.props.label].indexOf(value) !== -1;
        },
        // 获取文件列表
        fetchFiles(node, resolve) {
            if (!this.source) {
                return;
            }
            this.isTreeLoading = true;
            let path;
            if (node.level === 0) {
                if (!node.isInit) {
                    return;
                }
                path = this.userPath;
            } else {
                path = node.data.fullpath;
            }

            return hdfsLs(this.source, path, this.onlyFolder)
                .then(data => {
                    data.paths.forEach(item => item.is_dir = item.is_dir || item.is_idr);
                    if (resolve) {
                        resolve(this.__filterNodes(data.paths));
                        this.updatePopper();
                    } else {
                        this.treeData = this.__filterNodes(data.paths);
                        this.updatePopper();
                    }
                    this.isTreeLoading = false;
                })
                .catch(err => {
                    this.isTreeLoading = false;
                });
        },
        // 处理"单文件选择"问题
        handleCheckChange(data, checked) {
            if (checked) {
                // 处理单文件选择
                if (this.isSingleCheck) {
                    // 处理是否可以选中文件夹
                    if (this.canCheckFolder) {
                        if (data.is_dir) {
                            this.tree.setCheckedKeys([
                                this.fullpath ? data.fullpath : data.path
                            ]);
                        } else {
                            if (this.onlyFolder) {
                                this.tree.setCheckedKeys([]);
                            } else {
                                this.tree.setCheckedKeys([
                                    this.fullpath ? data.fullpath : data.path
                                ]);
                            }
                        }
                    } else {
                        if (data.is_dir) {
                            this.tree.setCheckedKeys([]);
                        } else {
                            this.tree.setCheckedKeys([
                                this.fullpath ? data.fullpath : data.path
                            ]);
                        }
                    }
                }
            }
        },
        // 提交选择 (v-model 在这里触更新)
        handleCheckedNodes() {
            // 获取选中的文件path
            let checkedFiles = this.tree.getCheckedKeys();
            // 获取选中的文件对象
            let checkedFilesObj = this.tree.getCheckedNodes();
            // 如果是单文件选择,则返回一个字符串
            if (this.isSingleCheck) {
                checkedFiles = checkedFiles[0] || '';
                checkedFilesObj = checkedFilesObj[0] || '';
            }
            // 触发事件,方便外层处理回调
            this.$emit('btn-commit-click', checkedFiles, checkedFilesObj);
            // 提交选择之前，回调检查，校验失败则提示错误
            if (this.beforeSelected) {
                // 将回调函数包装成Promise,避免非Promise回调报错
                Promise.resolve(
                    this.beforeSelected(checkedFiles, checkedFilesObj)
                )
                    .then(data => {
                        if (data) {
                            // 关闭popover
                            this.$refs.filePopover.doClose();
                            // console.log(1, checkedFiles)
                            this.$emit(
                                'input',
                                this.richModel ? checkedFilesObj : checkedFiles
                            );
                        } else {
                            this.$emit('input', '');
                            return Promise.reject(data);
                        }
                    })
                    .catch(err => {
                        if (err) {
                            this.$emit('input', '');
                        }
                    });
            } else {
                // 关闭popover
                this.$refs.filePopover.doClose();
                this.$emit(
                    'input',
                    this.richModel ? checkedFilesObj : checkedFiles
                );
            }
            // 兼容element-ui的检查事件,用简单的方式复刻了源码中的dispatch事件
            // 参考 https://github.com/ElemeFE/element/blob/dev/packages/input/src/input.vue
            // 参考 https://github.com/ElemeFE/element/blob/dev/src/mixins/emitter.js
            if (this.$parent.$options.componentName === 'ElFormItem') {
                this.$parent.$emit('el.form.change', checkedFiles);
            }
        },
        // 处理取消
        handleCancel() {
            this.$refs.filePopover.doClose();
            this.$emit('cancel');
        },
        // 定制 tree 的渲染函数,为文件夹加上图标
        renderContent(h, { node, data }) {
            return (
                <span
                    class={{
                        is_folder: data.is_dir,
                        not_folder: !data.is_dir,
                        'caret-right': true
                    }}
                >
                    {this.rootFileNameMap[node.label] || node.label}
                </span>
            );
        },
        createFileFilter() {
            this.fileFilter__ = (() => {
                // 通过kind获取的过滤条件比通过filter传入的优先级高
                let __allow = this.allow || this.filter;
                if (__allow) {
                    // 当过滤条件是数组的时候,默认过滤文件类型
                    if (_.isArray(__allow) && __allow.length > 0) {
                        this.computedAllow = __allow;
                        return ({ ext, is_dir }) => {
                            if (is_dir) {
                                return true;
                            } else {
                                let ret = __allow.includes(ext);
                                return this.isBlack ? !ret : ret; // 兼容黑名单和白名单
                            }
                        };
                    } else if (_.isFunction(__allow)) {
                        return __allow;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            })();
            this.fetchFiles({
                level: 0,
                isInit: true
            });
        },
        updatePopper() {
            this.$nextTick(() => {
                setTimeout(() => {
                    this.$refs.filePopover &&
                        this.$refs.filePopover.updatePopper();
                }, 500);
            });
        },
        setNodeChecked(key, checked, deep) {
            this.$refs.fileTree.setChecked(key, checked, deep);
        },
        handleRemove(file) {
            if (typeof this.value === 'string') {
                this.$emit('input', '');
            } else {
                let index;
                if (this.richModel) {
                    index = this.value.findIndex(item => item.fullpath === file.name);
                } else {
                    index = this.value.findIndex(item => item === file.name);
                }
                this.$emit('input', [...this.value.slice(0, index), ...this.value.slice(index + 1)]);
            }
            this.setNodeChecked(file.name);
        }
    },
    watch: {
        // 监听过滤框,如果有变化则触发过滤
        filterText(val) {
            this.tree.filter(val);
        },
        allow: {
            deep: true,
            immediate: true,
            handler(val, oldval) {
                if (val && val !== oldval) {
                    this.createFileFilter();
                }
            }
        },
        filter: {
            deep: true,
            immediate: true,
            handler(val, oldval) {
                this.createFileFilter();
            }
        },
        source: {
            immediate: true,
            handler(val, oval) {
                if (val && val !== oval) {
                    this.fetchFiles({
                        level: 0,
                        isInit: true
                    });
                }
            }
        }
    }
};
</script>

<style lang="scss">
    @import "../../../../assets/styles/base/constants";
    @import "../../../../assets/styles/base/colors";
    .hdfs-select {
        .hdfs-select-btn {
            width: 130px;
        }
        .allow-suggest {
            line-height: 2em;
            font-size: $fs-content;
            color: $c-description;
            padding: 0 10px;
        }
        .inline {
            display: inline-block;
        }
        .selected-files {
            .selected-files__item {
                line-height: 2em;
                font-size: $fs-content;
                color: $c-description;
                padding: 0 10px;
                word-break: break-all;
                .iconfont {
                    color: $c-main;
                    position: relative;
                    top: 2px;
                    margin-right: 5px;
                }
            }
        }
    }
    .hdfs-select-box {
        background-color: $white;
        .search-box {
            .el-input__inner {
                border: none;
                border-bottom: 1px solid $c-border;
            }
        }
        .buttons {
            text-align: right;
            border-top: 1px solid $c-border;
            padding: 10px;
        }
        .caret-right:before {
            content: "";
        }
        .is_folder.caret-right:before {
            content: url("../../../assets/images/dir.png");
            position: relative;
            top: 3px;
            margin-right: 5px;
        }
        .not_folder.caret-right:before {
            content: "";
        }
        .el-tree {
            min-width: 100%;
            .el-tree-node {
                width: max-content;
            }
        }
    }
</style>
