<template>
    <div class="datas-view">
        <sky-title-go-back />
        <el-button
            type="primary"
            size="small"
            class="btn-jupyter"
            @click="toJupyter(id)"
            v-if="viewData.support_jupyter"
        >
            在Jupyter任务中使用
        </el-button>
        <div class="infos">
            <el-row class="baseInfoItem">
                <el-col
                    :xs="12"
                    :sm="6"
                    :md="6"
                    :lg="6"
                    :xl="6"
                    class="baseInfo shadow"
                >
                    <div class="header">
                        基本信息
                    </div>
                    <div class="bottom">
                        <div><span>创建人: </span> <span>{{ viewData.creator_name }}</span></div>
                        <div><span>数据集名称: </span> <span>{{ viewData.name }}</span></div>
                        <div><span>数据集大小: </span> <span>{{ viewData.data_size }}</span></div>
                        <div><span>数据集描述: </span> <span>{{ viewData.description }}</span></div>
                    </div>
                </el-col>
                <el-col
                    :xs="12"
                    :sm="6"
                    :md="6"
                    :lg="6"
                    :xl="6"
                    :class="[viewData.source_option.type === 'DATABASE' ? 'type': 'dataType','shadow']"
                >
                    <div class="header">
                        源信息
                    </div>
                    <div class="bottom">
                        <div><span>源类型: </span><span>{{ viewData.source_option.type }}</span></div>
                        <div v-if="viewData.source_option.type !== 'DATABASE'">
                            <span>源文件类型: </span><span>{{ viewData.source_option.data_format }}</span>
                        </div>
                        <div v-if="viewData.source_option.type !== 'DATABASE'">
                            <span>源文件路径: </span>
                            <div class="paths">
                                <div
                                    v-for="(v,k) in viewData.source_option.paths"
                                    :key="k"
                                >
                                    {{ v }}
                                </div>
                            </div>
                        </div>
                        <div v-if="viewData.source_option.type === 'DATABASE'">
                            <span>源数据库链接: </span><span>{{ viewData.source_option.db_url }}</span>
                        </div>
                        <div v-if="viewData.source_option.type === 'DATABASE'">
                            <span>源表名: </span><span>{{ viewData.source_option.table }}</span>
                        </div>
                        <div v-if="viewData.source_option.type === 'DATABASE'">
                            <span>SQL: </span><span>{{ viewData.source_option.sql }}</span>
                        </div>
                    </div>
                </el-col>
                <!-- :sm="viewData.is_dataframe ? 6 : 8"  [viewData.is_dataframe ? 'target' : 'marginnone','shadow']-->
                <el-col
                    :xs="12"
                    :sm="6"
                    :md="6"
                    :lg="6"
                    :xl="6"
                    class="target"
                    :class="['target','shadow']"
                >
                    <div class="header">
                        目标信息
                    </div>
                    <div class="bottom">
                        <div>
                            <span>目标类型:</span><span>{{ viewData.sink_option.type }}</span>
                        </div>
                        <div v-if="viewData.sink_option.type !== 'DATABASE'">
                            <span>目标文件类型:</span><span>{{ viewData.sink_option.data_format }}</span>
                        </div>
                        <div v-if="viewData.sink_option.type !== 'DATABASE'">
                            <span>目标文件路径: </span><span>{{ viewData.sink_option.path }}</span>
                        </div>
                        <div v-if="viewData.sink_option.type !== 'DATABASE'">
                            <span>分区信息: </span><span>{{ (viewData.sink_option.partition).join(',') }}</span>
                        </div>

                        <div v-if="viewData.sink_option.type === 'DATABASE'">
                            <span>目标数据链接: </span><span>{{ viewData.sink_option.db_url }}</span>
                        </div>
                        <div v-if="viewData.sink_option.type === 'DATABASE'">
                            <span>目标表名: </span><span>{{ viewData.sink_option.store_name }}</span>
                        </div>
                        <div><span>保存种类: </span><span>{{ viewData.sink_option.save_mode }}</span></div>
                    </div>
                </el-col>
                <el-col
                    :xs="12"
                    :sm="6"
                    :md="6"
                    :lg="6"
                    :xl="6"
                    :class="['shadow','cloName']"
                >
                    <div class="header">
                        <div>
                            文件列表
                        </div>
                        <div>
                            <i
                                class="iconfont iconicon--download"
                                @click="allDownload(allDownloadParams.paths, allDownloadParams.ownerId)"
                                v-if="viewData.store_type === 'FILESYSTEM'"
                            />
                        </div>
                    </div>
                    <div
                        class="listName bottom tree"
                        :style="{'overflow': 'auto', 'display': 'flex', 'flex-direction': 'row'}"
                    >
                        <el-tree
                            v-loading="isTreeLoading"
                            v-bind="__treeOption"
                            ref="tree"
                            @current-change="handleCheckChange"
                        />
                    </div>
                </el-col>
            </el-row>
        </div>
        <div :class="['view','shadow',fullscreen ? 'fullScreen' : '']">
            <div class="header">
                数据预览
                <span
                    class="colInfo"
                    v-if="showData.length > 0 && !datalistHide && !isPreview && !imageUrl"
                >
                    预览   {{ `${previewData.data_rows.length}*${previewData.sky_schema.length}` }}
                </span>
                <span
                    class="colInfo"
                    v-if="showData.length > 0 && !datalistHide && !isPreview && !imageUrl"
                >
                    实际   {{ previewData.shape }}
                </span>
                <div
                    class="headerIcon"
                    v-poploadmore="poploadmore"
                >
                    <el-popover
                        placement="left"
                        width="420"
                        trigger="click"
                        v-model="visiblePopover"
                        @show="show"
                        v-if="showData.length > 0 && !datalistHide && !imageUrl"
                    >
                        <div class="popover-header">
                            <el-checkbox
                                :indeterminate="isIndeterminate"
                                v-model="checkAll"
                                @change="handleCheckAllChange"
                            >
                                列名
                            </el-checkbox>
                            <el-input
                                class="wd200"
                                placeholder="搜索"
                                suffix-icon="el-icon-search"
                                size="small"
                                v-model="searchName"
                            />
                        </div>
                        <el-checkbox-group
                            v-model="checkedCols"
                            @change="handleCheckedColsChange"
                            class="list-name"
                        >
                            <div :style="{ height: `${this.lazyTopHeight}px`}" />
                            <el-checkbox
                                v-for="item in showSchema"
                                :key="item.fieldName"
                                :label="item.fieldName"
                                :value="item.fieldName"
                            >
                                <span><i :class="['iconfont', dealIcon(item.fieldType)]" /></span>
                                <span>{{ item.fieldName }}</span>
                            </el-checkbox>
                            <div :style="{ height: `${this.lazyBottomHeight}px`}" />
                        </el-checkbox-group>
                        <div class="btn">
                            <el-button
                                type="primary"
                                @click="submitForm"
                            >
                                确定
                            </el-button>
                            <el-button @click="resetForm">
                                取消
                            </el-button>
                        </div>
                        <i
                            class="iconfont iconshaicha"
                            slot="reference"
                        />
                    </el-popover>
                    <i
                        class="iconfont iconicon--download"
                        v-if="(previewData.path && !datalistHide) || imageUrl"
                        @click="handleDownload(previewData.path, previewData.ownerId)"
                    />
                    <i
                        :class="['iconfont', fullscreen ? 'iconzuixiaohua':'iconzuidahua']"
                        @click="handleFullScreen"
                        v-if="showData.length > 0 || imageUrl"
                    />
                </div>
            </div>
            <div
                class="dataView"
                v-loading="isLoadingTableData"
            >
                <datasListView
                    v-if="datalistHide"
                    :dataListPath="dataListPath"
                    :storeType="store_type"
                    :datasource="datasource"
                    @viewData="handleViewData"
                    @expandNode="expandNode"
                    :ownerId="viewData.creator"
                />
                <DataSetPreview
                    :data="showData"
                    :columns="previewData.sky_schema"
                    :height="dataHeight"
                    :analysis="viewData.analysis_data"
                    @reach-bottom="loadMore"
                    v-loading="isLoadingTableData"
                    :readonly="true"
                    v-if="showData.length > 0 && !datalistHide && !isPreview && !imageUrl"
                />
                <dataImage
                    :image-url="imageUrl"
                    v-if="imageUrl"
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
            </div>
        </div>
    </div>
</template>
<script>
import { getDatasetInfo, getDatasetPreview, checkDownload, getZipId, getZip, hdfsLs } from './rely/dataApi';
import DataSetPreview from '../datamanagement/dataset-create/step-main/DataSetPreview';
import { NUMBER_TYPES, STRING_TYPES } from '../datamanagement/dataset-create/config';

const isNumber = type => type && !!NUMBER_TYPES.find(item => item.toLowerCase() === type.toLowerCase()) || false;
const isString = type => type && !!STRING_TYPES.find(item => item.toLowerCase() === type.toLowerCase()) || false;
import hasNothing from './rely/util/hasNothing';
import poploadmore from './js/loadMore';
import datasListView from './datasListView';
import SkyTitleGoBack from './rely/skyTitleGoBack';
import { getFilesList, download, pack } from '@sdx/utils/lib/api/file';
import dataImage from './dataImage';
// import { mapMutations } from 'vuex';
export default {
    name: 'DatasView',
    components: { DataSetPreview, hasNothing, datasListView, SkyTitleGoBack, dataImage },
    data() {
        return {
            id: '',
            fullscreen: false,
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
            checkAll: true,
            checkedCols: Object.freeze([]),
            isIndeterminate: false,
            searchName: '',
            saveSchema: Object.freeze([]),
            visiblePopover: false,
            pageIndex: 0,
            pageSize: 50,
            showData: Object.freeze([]),
            isLoadingTableData: false,
            dataHeight: '650px',
            pageIndexPop: 0,
            topCount: 0,
            searchSchema: [],
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
            allDownloadParams: {
                paths: [],
                ownerId: ''
            }
        };
    },
    computed: {
        lazyTopHeight() {
            return this.topCount * 40;
        },
        lazyBottomHeight() {
            let height = 0;
            if (this.saveSchema.length) {
                if (this.searchSchema.length < 7) {
                    height = 0;
                } else {
                    height = (this.searchSchema.length - 7) * 40 - this.lazyTopHeight;
                }
            }
            return height;
        },
        showSchema() {
            this.searchSchema = Object.freeze(this.saveSchema.filter(item => item.fieldName.includes(this.searchName)));
            return this.searchSchema.slice(this.topCount, this.topCount + 7);
        },
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
    methods: {
        // ...mapMutations([
        //     'setDownLoading'
        // ]),
        getInfo(dataset) {
            // 获取数据元信息
            getDatasetInfo({ dataset })
                .then(res => {
                    let data = res.data;
                    this.viewData = data;
                    this.store_type = data.store_type;
                    // 源类型
                    if (data.store_type === 'FILESYSTEM') {
                        // 文件列表
                        if (data.short_path) {
                            this.getFlieList(data.short_path);
                        }
                    } else if (data.store_type === 'HDFS') {
                        if (data.short_path) {
                            this.datasource = data.sink_option.datasource;
                            this.getHdfsList(data.sink_option.datasource, data.short_path, false);
                        }
                    } else if (data.store_type === 'SQL_DATABASE') {
                        let arr = [{
                            path: data.sink_option.table,
                            fullpath: data.sink_option.table,
                            is_dir: false,
                            name: data.sink_option.table
                        }];

                        this.$nextTick(() => {
                            this.$refs.tree.setCurrentKey(data.sink_option.table);
                        });
                        this.isTreeLoading = false;
                        this.treeData = arr;
                        this.getPreview({ dataset });
                    }
                });
        },
        // HDFS 列表
        getHdfsList(datasource, path, only_dir) {
            hdfsLs(datasource, path, only_dir)
                .then(res => {
                    let data = res.data;
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
                    } else if (data.paths.length === 0) {
                        this.noPreview = true;
                        return;
                    } else {
                        this.noPreview = false;
                    }
                    if (data.paths[0].name.includes('.csv') || data.paths[0].name.includes('.txt') || data.paths[0].name.includes('.orc') || data.paths[0].name.includes('.parquet')) {
                        // 调用预览接口
                        let params = {
                            dataset: this.id,
                            data_file: data.paths[0].fullpath
                        };
                        // 预览文件
                        this.getPreview(params);
                        this.datalistHide = false;
                        this.isPreview = false;
                    } else if (data.paths[0].is_dir) {
                        this.datalistHide = true;
                        this.dataListPath = data.paths[0].path;
                        this.isPreview = false;
                    } else {
                        this.isPreview = true;
                        this.datalistHide = false;
                    }
                })
                .catch(error => {
                    this.isTreeLoading = false;
                    this.isPreview = true;
                    this.datalistHide = false;
                    this.noPreview = false;
                });
        },
        // 文件列表
        getFlieList(path) {
            this.isTreeLoading = true;
            getFilesList({ path, ownerId: this.viewData.creator })
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

                        // 下载
                        let downloadPaths = [];
                        for (let i = 0; i < data.paths.length; i++) {
                            downloadPaths.push(data.paths[i].path);
                        }
                        this.allDownloadParams = {
                            paths: downloadPaths,
                            ownerId: data.ownerId
                        };
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
                        this.previewData.path = data.paths[0].path;
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
                .catch(error => {
                    this.isTreeLoading = false;
                    this.isPreview = true;
                    this.datalistHide = false;
                    this.noPreview = false;
                    // 图片
                    this.imageUrl = '';
                });
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
            if (this.store_type === 'HDFS') {
                return hdfsLs(this.datasource, path, false)
                    .then(data => {
                        if (resolve) {
                            resolve(data.paths);
                        }

                        this.isTreeLoading = false;
                    })
                    .catch(err => {
                        this.isTreeLoading = false;
                        this.isPreview = true;
                        this.datalistHide = false;
                    });
            } else {
                return getFilesList({ path, ownerId: this.viewData.creator })
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
                    .catch(err => {
                        this.isTreeLoading = false;
                        this.isPreview = true;
                        this.datalistHide = false;
                    });
            }
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
                    {data.name}
                </span>
            );
        },
        // 处理"单文件选择"问题
        handleCheckChange(data, checked) {
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

                    this.previewData.path = data.path;
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
                } else {
                    this.isPreview = true;
                    this.datalistHide = false;
                    this.imageUrl = '';
                }
            }
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
        handleViewData(fullpath, path, type, ownerId) {
            this.previewData.path = path;
            this.previewData.ownerId = ownerId;
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
                .catch(err => {
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
        // 图标
        dealIcon(fieldType) {
            if (isNumber(fieldType)) {
                return 'iconN';
            } else if (isString(fieldType)) {
                return 'iconS';
            } else {
                return '';
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
        handleFullScreen() {
            this.fullscreen = !this.fullscreen;
            if (this.fullscreen) {
                this.dataHeight = 'calc(100vh - 100px)';
                this.loadMore();
            } else {
                this.dataHeight = '650px';
            }
        },
        // 预览
        handleCheckAllChange(val) {
            this.checkedCols = Object.freeze(val ? this.totalCols.map(item => item.fieldName) : []);
            this.isIndeterminate = false;
        },
        handleCheckedColsChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.totalCols.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.totalCols.length;
        },
        // 确定
        submitForm() {
            if (this.checkedCols.length === 0) {
                this.$message({
                    message: '请选择列名',
                    type: 'warning'
                });
            } else {
                this.visiblePopover = false;
                let params = {
                    dataset: this.id,
                    data_file: this.data_file,
                    columns: this.checkedCols
                };
                // 预览文件
                this.getPreview(params);
            }
        },
        // 取消
        resetForm() {
            this.visiblePopover = false;
            this.searchName = '';
            this.checkedCols = Object.freeze([]);
            this.isIndeterminate = this.totalCols.length !== this.checkedCols.length;
        },
        // 下载
        handleDownload: _.throttle((path, ownerId) => {
            if (path) {
                download(path, ownerId);
            }
        }, 5000, {
            leading: true,
            trailing: false
        }),
        show() {
            this.topCount = 0;
            this.checkedCols = Object.freeze(this.previewData.sky_schema.map(item => item.fieldName));
        },
        poploadmore(direction, scrollDistance) {
            this.topCount = Math.floor(scrollDistance / 40);
        },
        // 跳转到jupyter
        toJupyter(id) {
            this.$router.push(
                `/datasManage/jupyter/${id}`
            );
        },
        allDownload: _.throttle((paths, ownerId) => {
            pack(paths, ownerId).then(res => {
                download(res, ownerId);
            });
        }, 5000, {
            leading: true,
            trailing: false
        })
    },
    directives: {
        poploadmore
    },
    watch: {
        searchName() {
            this.topCount = 0;
            localStorage.setItem('scrollTop', true);
        }
    },
    created() {
        this.id = this.$route.query.dataset;
        this.getInfo(this.id);
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>


.datas-view {
    position: relative;
    margin-bottom: 20px;
    .btn-jupyter {
        position: absolute;
        right: 0;
        top:0;
    }
    .infos {
        margin-bottom: 20px;
        .header {
            height: 60px;
            line-height: 60px;
            color:rgba(75,77,82,1);
            font-size:16px;
            padding-left: 20px;
            border-bottom: none !important;
            display: flex !important;
            justify-content: space-between;
            align-items: center;
            .iconfont {
                @extend .iconStyle;
            }
        }
        .baseInfoItem {
            & > div {
                margin-right: 20px;
            }
            & > div:last-child {
                margin-right: 0px;
            }
            .marginnone {
                margin-right: 0px !important;
            }
            color:rgb(75, 77, 82);
            font-size: 14px;
            display: flex;
            justify-content: stretch;
            & > div > div {
                background: #fff;
                // margin-right: 10px;
                border: 1px solid rgba(151,151,151,0.3);
                & > div:nth-child(n + 1) {
                    line-height: 30px;
                    display: flex;
                    span {
                        word-break: break-all;
                    }
                }
            }
            & > div:last-child {
                padding-right: 0px !important;
                border-right: none;
            }
            .baseInfo, .type, .target, .dataType {
                span:first-child {
                    opacity: 0.7;
                }
            }
            span:last-child {
                opacity: 0.9;
            }
            .cloName {
                padding-right: 24px !important;
                & > div {
                    display: block;
                }
                & > div:first-child {
                    border-bottom: 1px solid rgba(151,151,151,0.3);
                }
                .listName > div {
                    display: block;
                    flex-grow: 6;

                    // width: 100%;
                    // overflow: hidden;
                    // text-overflow: ellipsis;
                    // white-space: nowrap;
                    span:first-child {
                        margin-right: 12px;
                        border-radius: 50%;
                        display: inline-block;
                        width: 12px;
                    }
                }
            }
            .cloNameNone {
                display: none;
            }
            .baseInfo {
                div > div > span:first-child {
                    min-width: 84px;
                }
            }
            .type {
                div > span:first-child {
                    min-width: 98px;
                }
            }
            .dataType {
                div > span:first-child {
                    min-width: 89px;
                }
            }
            .target {
                div > span:first-child {
                    min-width: 98px;
                }
            }
            .bottom {
                padding: 20px;
                // div {
                //     display: flex;
                // }
                height: 211px;
                overflow-y: auto;
                .paths {
                    display: flex;
                    flex-wrap: wrap;
                    opacity: 0.9;
                }
            }
        }
    }
    .header {
        height: 61px;
        line-height: 60px;
        color:rgba(75,77,82,1);
        font-size:16px;
        padding-left: 20px;
        border-bottom: 1px solid #e6eaf2;
    }
    .iconStyle {
        margin-right: 20px;
        width: 30px;
        height: 30px;
        background: #edf5ff;
        border-radius: 4px;
        display: inline-block;
        vertical-align: middle;
        font-size: 18px;
        text-align: center;
        line-height: 30px;
        color: #1999f7;
        cursor: pointer;
    }
    .view {
        background: #fff;
        .header {
            position: relative;
            .colInfo {
                font-size:12px;
                color:rgba(75,77,82,1);
                margin-left: 12px;
            }
        }
        .headerIcon {
            float: right;
            .iconfont {
                @extend .iconStyle;
            }
        }
    }
    .fullScreen {
        position: fixed;
        left: 40px;
        right: 40px;
        top: 20px;
        bottom: 20px;
        z-index: 99;
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
        overflow: auto;
    }
    .has-nothing {
        height: 400px;
        // border:1px solid rgba(201,210,225,0.6);
        border-top: none;
        // width: calc(100% + 42px);
        margin: 0 -21px;
    }
    .dataView {
        padding: 0 0 20px 0;
        min-height: 160px;
    }
}

.popover-header {
    height: 58px;
    border-bottom: 1px solid rgba(201,210,225,0.6);
    line-height: 58px;
    padding: 0 12px;
}
.wd200 {
    float: right;
    width: 200px;
}
.list-name {
    height: 266px;
    overflow-y: auto;
    margin-bottom: 12px;
    overflow-x: hidden;
    .el-checkbox {
        width: 100%;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid rgba(201,210,225,0.6);
        padding-left: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 12px;
    }
}
.btn {
    float: right;
    margin: 0 12px 12px 0;
}
.iconN {
    color: #FF9001;
    font-size: 12px;
}
.iconS {
    color: #02BE86;
    font-size: 12px;
}

.el-checkbox+.el-checkbox {
    margin-left: 0px;
}
.el-checkbox__label {
    & > span:first-child {
        width: 12px;
    }
    & > span:last-child {
        color:rgb(96, 98, 102);
    }
}
.tree {
    & /deep/ {
        .caret-right:before {
            content: "";
        }
        .is_folder:before {
            content: url("../../assets/images/file-dir.png");
            position: relative;
            top: 3px;
            margin-right: 5px;
            width: 6px;
            height: 6px;
        }
    }
}
.datas-view {
    & /deep/ {
        .caret-right {
            // overflow: hidden;
            // text-overflow: ellipsis;
            // white-space: nowrap;
            width: calc(100% - 20px);
        }
    }
}
</style>

