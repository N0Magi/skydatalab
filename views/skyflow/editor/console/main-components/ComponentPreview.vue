<template>
    <sdxu-content-panel :title="(node && node.label) || '数据预处理'">
        <div class="preview-container-comp">
            <div
                class="preview-file-tree tree"
                v-loading="isTreeLoading"
            >
                <SdxuScroll style="height: 400px;">
                    <el-tree
                        v-bind="__treeOption"
                        ref="tree"
                        @current-change="handleCheckChange"
                    />
                </SdxuScroll>
            </div>
            <div class="preview-content">
                <div
                    class="dataset-preview"
                    v-if="showData.length > 0 && !datalistHide && !isPreview && !imageUrl"
                >
                    <DataSetPreview
                        :data="showData"
                        :columns="previewData.sky_schema"
                        :height="dataHeight"
                        :analysis="viewData.analysis_data"
                        @reach-bottom="loadMore"
                        v-loading="isLoadingTableData"
                        readonly
                    />
                </div>
                <SdxuScroll
                    style="height: 400px;"
                    v-else
                >
                    <datasListView
                        v-if="datalistHide"
                        :dataListPath="dataListPath"
                        storeType="FILESYSTEM"
                        @viewData="handleViewData"
                        @expandNode="expandNode"
                    />
                    <dataImage
                        :image-url="imageUrl"
                        v-if="imageUrl"
                    />
                    <PreviewCharts
                        :data="performance"
                        v-if="performance && showPerformance"
                    />
                    <!-- <has-nothing
                        v-if="isPreview"
                        class="has-nothing"
                        pic-type="dataframe"
                    /> -->
                    <SdxuEmpty
                        v-if="isPreview"
                        empty-type="sdx-wushuju"
                        empty-content="无法预览"
                    />
                    <!-- <has-nothing
                        v-if="noPreview"
                        class="has-nothing"
                    /> -->
                    <SdxuEmpty
                        v-if="noPreview"
                        empty-type="noData"
                        :empty-content="$t('NoData')"
                    />
                </SdxuScroll>
            </div>
        </div>
    </sdxu-content-panel>
</template>

<script>
import FileSelect from '@sdx/widget/lib/file-select';
import { getDatasetPreview } from '../../../../datas/rely/dataApi';
import datasListView from '../../../../datas/datasListView';
import DataSetPreview from '../../../../datamanagement/dataset-create/step-main/DataSetPreview';
import dataImage from '../../../../datas/dataImage';
import hasNothing from '../../../../datas/rely/util/hasNothing';
import { getPreviewPath } from '@sdx/utils/lib/api/skyflow';
import { getFilesList } from '@sdx/utils/lib/api/file';
import { getUser } from '@sdx/utils/lib/helper/shareCenter';
import PreviewCharts from './PreviewCharts';

export default {
    name: '',
    data() {
        return {
            id: '',
            viewData: {
                creator: '',
                creator_name: '',
                name: '',
                data_size: '',
                description: '',
                allow_download: true,
                analysis_data: {},
                source_option: {
                    type: '', // 数据源类型，1：FILESYSTEM，2：HDFS，3：DATABASE，4：HIVE，5：HBASE
                    data_format: '', // 数据格式 csv:1,txt:2,json:3,orc:4,parquet:5,jdbc:6
                    path: '', // 数据源文件路径
                    db_url: '' // 数据库连接url
                },
                sink_option: {
                    type: '', // 目标类型
                    data_format: '',
                    path: '', // 目标文件路径
                    store_name: '', // 目标表名
                    db_url: '', // 目标数据链接
                    partition: [], // 分区
                    save_mode: '' // 存储模式, 1:new，2：overwrite，3：append
                },
                sky_schema: Object.freeze([]),
                is_dataframe: false,
                support_jupyter: false
            },
            previewData: {
                data_rows: Object.freeze([]),
                sky_schema: Object.freeze([]),
                path: '',
                shape: '',
                ownerId: ''
            },
            checkedCols: Object.freeze([]),
            isIndeterminate: false,
            saveSchema: Object.freeze([]),
            pageIndex: 0,
            pageSize: 50,
            showData: Object.freeze([]),
            isLoadingTableData: false,
            dataHeight: '390px',
            totalCols: [],
            // 文件列表
            treeData: [],
            isTreeLoading: false, // 文件树是否正在加载
            // 数据预览参数
            data_file: '',
            datalistHide: false,
            dataListPath: '',
            store_type: '',
            datasource: '',
            expandedKey: [],
            nodeId: '',
            firstExpand: false,
            // 不可预览
            isPreview: false,
            noPreview: false,
            imageUrl: '',
            showPerformance: false
        };
    },
    props: {
        executeId: {
            type: String,
            default: ''
        },
        nId: {
            type: String,
            default: ''
        },
        path: {
            type: String,
            default: ''
        },
        performance: {
            type: Object,
            default: null
        },
        node: {
            type: Object,
            default: null
        }
    },
    computed: {
        __treeOption() {
            return {
                'render-content': this.renderContent, // 为文件夹加上图标
                'check-strictly': true,
                'show-checkbox': false, // 选中框
                'highlight-current': true,
                'empty-text': '没有文件',
                'node-key': 'path',
                'check-on-click-node': true,
                'default-expanded-keys': this.expandedKey,
                data: this.treeData || [],
                lazy: true,
                load: this.fetchFiles,
                props: {
                    label: 'name',
                    children: 'children',
                    isLeaf: data => !data.is_dir
                }
            };
        }
    },
    watch: {
        executeId() {
            this.init();
        },
        nId() {
            this.init();
        }
    },
    created() {
        this.init();
    },
    components: {
        [FileSelect.FileSelectTree.name]: FileSelect.FileSelectTree,
        datasListView,
        DataSetPreview,
        dataImage,
        hasNothing,
        PreviewCharts
    },
    methods: {
        init() {
            if (!this.path && (!this.executeId || !this.nId)) return;
            if (this.path) {
                this.getFileList(this.path);
            } else {
                const params = {
                    execute_id: this.executeId,
                    nid: this.nId
                };
                getPreviewPath(params).then(res => {
                    this.getFileList(res.path);
                });
            }
        },
        loadMore() {
            if (this.pageIndex < this.totalPage - 1) {
                this.pageIndex += 1;
                setTimeout(() => {
                    this.showData = Object.freeze([...this.showData, ...this.previewData.data_rows.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize)]);
                }, 10);
            }
        },
        getPreview(params) {
            // 获取数据集数据预览
            this.isLoadingTableData = true;
            getDatasetPreview(params)
                .then(res => {
                    let data = res.data;
                    this.previewData.sky_schema = Object.freeze(data.sky_schema);
                    this.previewData.data_rows = Object.freeze(data.data_rows);

                    this.totalCols = data.all_cols;

                    this.previewData.shape = data.shape;
                    // 复制一份
                    this.saveSchema = Object.freeze(_.cloneDeep(data.all_cols));


                    // 判断是否全部选中
                    this.isIndeterminate = data.all_cols.length !== data.sky_schema.length;

                    // 重置当前页码，重新获取分页数据
                    this.pageIndex = 0;
                    this.showData = Object.freeze(this.previewData.data_rows.slice(this.pageIndex, this.pageSize));
                    this.totalPage = Math.ceil(this.previewData.data_rows.length / this.pageSize);
                    setTimeout(() => {
                        this.isLoadingTableData = false;
                    }, 200);

                    // 选中的列名
                    this.checkedCols = Object.freeze(data.sky_schema.map(item => item.fieldName));
                })
                .catch(() => {
                    this.previewData.sky_schema = Object.freeze([]);
                    this.previewData.data_rows = Object.freeze([]);
                    this.showData = Object.freeze([]);
                    this.totalPage = 0;
                    this.previewData.path = '';
                    this.previewData.shape = '';
                    this.isPreview = true;
                    this.datalistHide = false;
                    setTimeout(() => {
                        this.isLoadingTableData = false;
                    }, 200);
                });
        },
        expandNode(fullpath, path) {
            let [arr, key] = [[], ''];
            arr = path.split('/');
            arr = arr.slice(0, arr.length);
            key = arr.join('/');
            if (this.firstExpand === true) {
                this.expandedKey.push(this.nodeId);
                this.firstExpand === false;
            }
            this.expandedKey.push(key);
            this.$refs.tree.setCurrentKey(path);
            this.dataListPath = path;
        },
        // 文件列表
        getFileList(path) {
            this.isTreeLoading = true;
            getFilesList({ path, userId: getUser().userId })
                .then(data => {
                    if (data.children) {
                        for (let i = 0; i < data.children.length; i++) {
                            data.children[i].is_dir = !data.children[i].isFile;
                            data.children[i].fullpath = data.children[i].path;
                            data.children[i].ext = data.children[i].fileExtension;
                        }
                    }
                    data.paths = data.children;
                    this.previewData.ownerId = data.paths[0].ownerId;
                    this.treeData = data.paths;
                    this.isTreeLoading = false;

                    if (data.paths.length > 0) {
                        this.nodeId = data.paths[0].path;
                        this.firstExpand = true;

                        if (data.paths[0].is_dir) {
                            this.expandedKey = [data.paths[0].path];
                        }
                        this.$nextTick(() => {
                            this.$refs.tree.setCurrentKey(data.paths[0].path);
                        });

                        this.data_file = data.paths[0].fullpath;
                    }
                    if (data.paths.length === 0) {
                        this.noPreview = true;
                        return;
                    } else {
                        this.noPreview = false;
                    }
                    if (data.paths[0].ext.includes('.csv') || data.paths[0].ext.includes('.txt') || data.paths[0].ext.includes('.orc') || data.paths[0].ext.includes('.parquet')) {
                        // 调用预览接口
                        let params = {
                            dataset: this.id,
                            data_file: data.paths[0].fullpath
                        };
                        // 预览文件
                        this.getPreview(params);
                        this.datalistHide = false;
                        this.isPreview = false;
                        // 图片
                        this.imageUrl = '';
                    } else if (data.paths[0].is_dir) {
                        this.datalistHide = true;
                        this.dataListPath = data.paths[0].path;
                        this.isPreview = false;
                        // 图片
                        this.imageUrl = '';
                    } else if (data.paths[0].mimeType.indexOf('image/') === 0) {
                        this.imageUrl = `${location.origin}/file-manager/api/v1/files/download?ownerId=${data.paths[0].ownerId}&path=${data.paths[0].path}&filesystem=cephfs`;
                        this.isPreview = false;
                        this.datalistHide = false;
                        this.previewData.path = data.paths[0].path;
                    } else {
                        this.isPreview = true;
                        this.datalistHide = false;
                        // 图片
                        this.imageUrl = '';
                    }
                })
                .catch(() => {
                    this.isTreeLoading = false;
                    this.isPreview = true;
                    this.datalistHide = false;
                    this.noPreview = false;
                    // 图片
                    this.imageUrl = '';
                });
        },
        handleViewData(fullpath, path, type, ownerId) {
            this.data_file = fullpath;
            this.$refs.tree.setCurrentKey(path);
            let params = {
                dataset: this.id,
                data_file: fullpath
            };
            this.datalistHide = false;
            if (type === 'image') {
                // 预览图片
                this.imageUrl = `${location.origin}/file-manager/api/v1/files/download?ownerId=${ownerId}&path=${path}&filesystem=cephfs`;
                this.isPreview = false;
            } else {
                // 预览文件
                this.getPreview(params);
            }
        },
        handleFileSelect(data, checked) {
            console.log('data', data);
            console.log('checked', checked);
        },
        // 定制 tree 的渲染函数,为文件夹加上图标
        renderContent(h, { data }) {
            return (
                <span
                    class={{
                        is_folder: data.is_dir,
                        not_folder: !data.is_dir,
                        'caret-right': true
                    }}
                >
                    {data.name}
                </span>
            );
        },
        // 获取文件列表
        fetchFiles(node, resolve) {
            this.isTreeLoading = true;
            let path;
            if (node.level === 0) {
                if (!node.isInit) {
                    return;
                }
            } else {
                path = node.data.path;
            }
            return getFilesList({ path, userId: this.viewData.creator })
                .then(data => {
                    if (resolve) {
                        if (data.children) {
                            for (let i = 0; i < data.children.length; i++) {
                                data.children[i].is_dir = !data.children[i].isFile;
                                data.children[i].fullpath = data.children[i].path;
                                data.children[i].ext = data.children[i].fileExtension;
                            }
                        }
                        data.paths = data.children;
                        resolve(data.paths);
                    }

                    this.isTreeLoading = false;
                })
                .catch(() => {
                    this.isTreeLoading = false;
                    this.isPreview = true;
                    this.datalistHide = false;
                });
        },
        // 处理"单文件选择"问题
        handleCheckChange(data, checked) {
            this.showPerformance = false;
            if (checked) {
                this.data_file = data.fullpath;
                this.previewData.ownerId = data.ownerId;
                this.previewData.path = data.path;

                // 调用预览接口
                let params = {
                    dataset: this.id,
                    data_file: data.fullpath
                };
                // 预览文件
                if (data.name.includes('.csv') || data.name.includes('.txt') || data.name.includes('.orc') || data.name.includes('.parquet')) {
                    this.datalistHide = false;
                    this.isPreview = false;
                    this.getPreview(params);
                    this.imageUrl = '';
                } else if (data.is_dir) {
                    this.isPreview = false;
                    // 一直张开
                    this.expandedKey.push(data.path);

                    this.datalistHide = true;
                    this.dataListPath = data.path;
                    if (this.viewData.store_type === 'HDFS') {
                        this.store_type === 'HDFS';
                    } else if (this.viewData.store_type === 'FILESYSTEM') {
                        this.store_type === 'FILESYSTEM';
                    }
                    this.imageUrl = '';
                } else if (this.viewData.store_type === 'SQL_DATABASE') {
                    this.getPreview({ dataset: this.id });
                    this.imageUrl = '';
                } else if (data.mimeType.indexOf('image/') === 0) {
                    this.imageUrl = `${location.origin}/file-manager/api/v1/files/download?ownerId=${data.ownerId}&path=${data.path}&filesystem=cephfs`;
                    this.isPreview = false;
                    this.datalistHide = false;
                } else if (data.name === 'preformace.json') {
                    this.showPerformance = true;
                    this.isPreview = false;
                    this.datalistHide = false;
                } else {
                    this.isPreview = true;
                    this.datalistHide = false;
                    this.imageUrl = '';
                }
            }
        }
    }
};
</script>

<style scoped lang="scss">
.preview-container-comp {
    width: 100%;
    display: flex;
    .preview-file-tree {

        overflow: auto;
        flex: 2;
    }
    .preview-content {
        overflow: auto;
        flex: 7;
        .dataset-preview {
            overflow: hidden;
            height: 400px;
        }
    }
}
</style>

<style rel="stylesheet/scss" lang="scss">

    .preview-file-tree {
        .caret-right:before {
            content: "";
        }
        .is_folder:before {
            content: url("../../../../../assets/images/file-dir.png");
            position: relative;
            top: 3px;
            margin-right: 5px;
            width: 6px;
            height: 6px;
        }
    }
</style>
