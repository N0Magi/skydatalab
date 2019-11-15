<template>
    <div
        class="data-source-table shadow"
        style="min-height: 100%;"
    >
        <section>
            <div class="header">
                <div class="title">
                    数据集列表
                </div>
                <div class="option-box">
                    <el-input
                        class="wd168"
                        placeholder="输入数据集名称搜索"
                        size="small"
                        v-model.lazy.trim="searchName"
                        @keypress.native="handleEnterSearch"
                        @blur="handleClickSearch"
                    >
                        <i
                            slot="suffix"
                            class="el-icon-search search_icon"
                            @click="handleClickSearch"
                        />
                    </el-input>
                    <span class="font">
                        数据集标签
                    </span>
                    <el-select
                        v-model="search.tag"
                        placeholder="请选择"
                        size="small"
                        class="inline wd140"
                    >
                        <el-option
                            label="全部"
                            :value="-1"
                            key="all"
                        />
                        <el-option
                            v-for="item in tags"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                    <span class="font">
                        数据集类型
                    </span>
                    <el-select
                        v-model="search.share_kind"
                        placeholder="请选择"
                        size="small"
                        class="inline wd140"
                    >
                        <el-option
                            label="全部"
                            :value="-1"
                            key="all"
                        />
                        <el-option
                            v-for="item in dealOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                    <span class="font">
                        数据格式
                    </span>
                    <el-select
                        v-model="search.data_format"
                        placeholder="请选择"
                        size="small"
                        class="inline wd140"
                    >
                        <el-option
                            v-for="item in format"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                    <el-button
                        type="primary"
                        size="small"
                        class="options"
                        icon="el-icon-plus"
                        @click="handleClickDataSource"
                        v-auth.data.button="'DATA_SET:CREATE'"
                    >
                        新建数据集
                    </el-button>
                </div>
            </div>
            <div class="panel">
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    :stripe="true"
                    :default-sort="{prop: 'share_kind', order: 'descending'}"
                    @sort-change="handleSortChange"
                    v-loading="datasetLoading"
                >
                    <el-table-column
                        label="数据集名称"
                        prop="name"
                    />
                    <el-table-column
                        label="状态"
                        label-class-name="statusType"
                    >
                        <template slot-scope="scope">
                            <state-label
                                :label="scope.row.state.label"
                                :show-loading="scope.row.state.need_pull"
                                :type="scope.row && scope.row.state.name"
                                :show-error="scope.row.errorMsg !== '' && scope.row.errorMsg !== null"
                                :error-msg="scope.row.errorMsg"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="数据集标签"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.tags ? scope.row.tags.join('、') : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="类型"
                        prop="share_kind"
                        label-class-name="tableType"
                        sortable="custom"
                    >
                        <template slot-scope="scope">
                            <span
                                :class="shareKind(scope.row.share_kind, 'class')"
                                class="kindLabel"
                            >
                                {{ shareKind(scope.row.share_kind, 'value') }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="存储类型"
                        prop="type"
                    />
                    <el-table-column label="数据格式">
                        <template slot-scope="scope">
                            <span>{{ scope.row.data_format || 'OTHER' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="大小">
                        <template slot-scope="scope">
                            <span>{{ scope.row.data_size }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="创建人"
                        prop="creator_name"
                    />
                    <el-table-column
                        label="创建时间"
                        prop="created_at"
                        sortable="custom"
                    >
                        <template slot-scope="scope">
                            {{ dateFormatter(scope.row.created_at) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        min-width="120px"
                    >
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                size="small"
                                v-if="scope.row.state.allow_operations.includes('preview')"
                                @click="handleViewDataSource(scope.row.dataset)"
                            >
                                <i
                                    class="iconfont iconicon-yanjing"
                                    title="详情"
                                />
                            </el-button>
                            <el-button
                                type="text"
                                size="small"
                                v-if="scope.row.state.allow_operations.includes('edit')"
                                @click="handleEditDataSource(scope.row)"
                            >
                                <i
                                    class="iconfont iconicon-edit1"
                                    title="编辑"
                                />
                            </el-button>
                            <el-button
                                type="text"
                                class="delete"
                                size="small"
                                v-if="scope.row.state.allow_operations.includes('remove')"
                                @click="handleDeleteDataSource(scope.row)"
                            >
                                <i
                                    class="iconfont iconicon-delete1"
                                    title="删除"
                                />
                            </el-button>
                            <el-button
                                type="text"
                                class="delete"
                                size="small"
                                v-if="scope.row.state.allow_operations.includes('forceRemove')"
                                @click="rorceDeleteSource(scope.row)"
                            >
                                <i
                                    class="iconfont iconqiangzhishanchu"
                                    title="强制删除"
                                />
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="block">
                    <el-pagination
                        :current-page.sync="search.page"
                        :page-size="search.page_size"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="[10, 20, 30, 40]"
                        layout="total, sizes, prev, pager, next"
                        :total="total"
                    />
                </div>
                <div class="clear" />
            </div>
        </section>
        <sdxu-dialog
            title="编辑数据集"
            :visible.sync="detailDialogVisible"
            v-if="detailDialogVisible"
            width="680px"
            @close="currentDataSource = {};"
        >
            <div>
                <el-form
                    label-position="right"
                    label-width="120px"
                    @submit.native.prevent
                    :model="currentData"
                    ref="currentData"
                    :rules="modelRules"
                >
                    <el-form-item
                        label="名称"
                        prop="name"
                    >
                        <el-input
                            :readonly="true"
                            disabled
                            v-model="currentData.name"
                        />
                    </el-form-item>
                    <el-form-item
                        label="数据集描述"
                        prop="description"
                    >
                        <el-input
                            type="textarea"
                            v-model="currentData.description"
                        />
                    </el-form-item>
                    <el-form-item
                        label="数据集标签:"
                        prop="tags"
                    >
                        <el-select
                            placeholder="请选择"
                            size="small"
                            class="tags"
                            multiple
                            v-model="currentData.tags"
                        >
                            <el-option
                                v-for="item in datasetsOptions"
                                :key="item.label"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <SdxwShareForm
                        :default-users.sync="currentData.users"
                        :default-groups.sync="currentData.groups"
                        :default-share-type.sync="shareType"
                        :sync="true"
                        source-kind="dataset"
                        label-width="120px"
                    />
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
                    @click="handleSaveModel('currentData')"
                    size="small"
                >
                    确 定
                </el-button>
            </span>
        </sdxu-dialog>

        <sdxu-dialog
            title="用户确认"
            :visible.sync="userVisible"
            width="520px"
        >
            <div>
                <el-form
                    label-position="right"
                    label-width="100px"
                    @submit.native.prevent
                    :model="user"
                    ref="user"
                    :rules="userRules"
                >
                    <el-form-item
                        label="用户名"
                        prop="user_name"
                    >
                        <el-input v-model="user.user_name" />
                    </el-form-item>
                    <el-form-item
                        label="密码"
                        prop="passwd"
                    >
                        <el-input v-model="user.passwd" />
                    </el-form-item>
                </el-form>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    type="primary"
                    @click="handleUser('user')"
                >
                    确 认
                </el-button>
                <el-button @click="initUser">
                    取 消
                </el-button>
            </span>
        </sdxu-dialog>
        <CreateDatasetOption v-model="createDatasetOptionVisible" />
    </div>
</template>
<script>
import { getDataset, removeDatasetItem, updataDataset, getDataTag } from './rely/dataSourceApi';
import CreateDatasetOption from '../datamanagement/dataset-create/CreateDatasetOption';
import stateLabel from './rely/stateLabel';
import { dataTypes } from '../datamanagement/dataset-create/config';
import FormTip from './rely/SkyForm/FormTip';
import { dateFormatter } from '@sdx/utils/lib/helper/transform';
import SdxwShareForm from '@sdx/widget/lib/share-form';
import { FileSelect } from '@sdx/widget';
import auth from '@sdx/widget/lib/auth';
const datatype = dataTypes;
export default {
    components: { CreateDatasetOption, stateLabel, FormTip, SdxwShareForm, SdxwFileSelectTree: FileSelect.FileSelectTree },
    data() {
        // 编辑模型规则
        const modelRules = {
            name: [
                {
                    required: true, message: '请输入名称', trigger: 'blur', transform(value) {
                        return value && ('' + value).trim();
                    }
                }
            ],
            description: [
                {
                    required: true, message: '请输入数据集描述', trigger: 'blur', transform(value) {
                        return value && ('' + value).trim();
                    }
                }
            ]

        };

        // 用户密码规则
        const userRules = {
            user_name: [
                {
                    required: true, message: '请输入用户名', trigger: 'blur', transform(value) {
                        return value && ('' + value).trim();
                    }
                }
            ],
            passwd: [
                {
                    required: true, message: '请输入密码', trigger: 'blur', transform(value) {
                        return value && ('' + value).trim();
                    }
                }
            ]
        };
        return {
            tableData: [],
            total: 0,
            search: {
                name: '',
                page: 1,
                page_size: 10,
                share_kind: -1,
                data_size: -1,
                order: 'asc',
                order_by: 'share_kind',
                data_format: -1,
                tag: -1
            },
            detailDialogVisible: false,
            currentDataSource: {},
            size: [
                {
                    value: -1,
                    label: '全部'
                }, {
                    value: 1,
                    label: 'S(<10MB)'
                }, {
                    value: 2,
                    label: 'M(10M-1G)'
                }, {
                    value: 3,
                    label: 'L(>1G)'
                }
            ],
            dealOptions: [{
                value: 'PRIVATE',
                label: '私有'
            }, {
                value: 'MY_SHARE',
                label: '我的共享'
            }, {
                value: 'OTHER_SHARE',
                label: '他人共享'
            }],
            tags: [],
            currentData: {
                dataset: '',
                name: '',
                description: '',
                share_kind: 1,
                type: '',
                tags: []
            },
            modelRules,
            createDatasetOptionVisible: false,
            user: {
                user_name: '',
                passwd: '',
                dataset: ''
            },
            userVisible: false,
            userRules,
            // 数据集标签
            datasetsOptions: [],
            searchName: '',
            isInitPage: true,
            datasetLoading: false
        };
    },
    props: {
        services: {
            type: Array,
            default: () => []
        }
    },
    directives: {
        auth
    },
    created() {
        this.datasetList();
        this.getTags();
    },
    beforeDestroy() {
        // 销毁前清理计时器
        this.clearPull();
    },
    computed: {
        format() {
            let arr = [{
                value: -1,
                label: '全部'
            }];
            let lastArr = [{
                value: 0,
                label: '其他'
            }];
            for (let i = 0; i < datatype.length; i++) {
                arr.push({ value: datatype[i], label: datatype[i] });
            }
            return [...arr, ...lastArr];
        },
        // 轮询查询列表
        needPullState() {
            return this.tableData.some(item => item.state.need_pull);
        },
        shareType: {
            get() {
                return this.currentData && (this.currentData.is_public ? 'PUBLIC' : 'PRIVATE') || 'PRIVATE';
            },
            set(val) {
                if (this.currentData) {
                    this.currentData.is_public = val === 'PUBLIC';
                }
            }
        }
    },
    methods: {
        dateFormatter,
        // 数据集标签
        getTags() {
            getDataTag()
                .then(res => {
                    let data = res.data;
                    this.datasetsOptions = data.options;
                    this.tags = data.options;
                })
                .catch(error => {
                    this.tags = [{ label: '全部', value: -1 }];
                });
        },
        // 数据集查询
        datasetList(polling) {
            if (polling === 'polling') {
                this.datasetLoading = false;
            } else {
                this.datasetLoading = true;
            }

            getDataset(this.search)
                .then(res => {
                    this.datasetLoading = false;
                    this.tableData = res.data.items || [];
                    this.total = res.data.total;
                    // bugfix 修正当前页数,如果最后一页的最后一项被删除,会导致页面停留在一个空页上
                    if (
                        Math.ceil(this.total / this.search.page_size) <
                            this.search.page &&
                            this.total !== 0
                    ) {
                        this.search.page = Math.floor(
                            this.total / this.search.page_size
                        );
                    }
                }).catch(() => {
                    this.datasetLoading = false;
                    this.tableData = [];
                    this.total = 0;
                });
        },
        handleClickDataSource() {
            // this.createDatasetOptionVisible = true;
            this.$router.push('/datasManage/create-dataset/NON_STRUCT');
        },
        handleViewDataSource(id) {
            this.$router.push(`/datasManage/dataView/?dataset=${id}`);
        },
        handleEditDataSource(data) {
            this.detailDialogVisible = true;
            this.currentData = {
                dataset: data.dataset,
                name: data.name,
                description: data.description,
                share_kind: data.share_kind,
                type: data.type,
                tags: data.tags,
                groups: data.groups,
                users: data.users,
                is_public: data.is_public
            };
        },
        rorceDeleteSource(row) {
            let params = Object.assign({}, this.user, { dataset: row.dataset, force: true });
            this.$confirm('确认删除该数据集？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    removeDatasetItem(params)
                        .then(() => {
                            this.$notify.success({
                                title: '删除数据集成功',
                                duration: 3000
                            });
                            this.datasetList();
                        });
                });
        },
        handleDeleteDataSource(row) {
            this.user = Object.assign({}, this.user, { dataset: row.dataset });
            this.$confirm('确认删除该数据集？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    if (row.type === 'FILESYSTEM' || row.type === 'HDFS') {
                        removeDatasetItem(this.user)
                            .then(() => {
                                this.$notify.success({
                                    title: '删除数据集成功',
                                    duration: 3000
                                });
                                this.datasetList();
                            });
                    } else {
                        this.userVisible = true;
                    }
                })
                .catch(() => ({}));
        },
        handleUser(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    removeDatasetItem(this.user)
                        .then(() => {
                            this.$notify.success({
                                title: '删除数据集成功',
                                duration: 3000
                            });
                            this.userVisible = false;
                            this.datasetList();
                            this.initUser();
                        });
                } else {
                    return false;
                }
            });
        },
        initUser() {
            this.userVisible = false;
            this.user = {
                user_name: '',
                passwd: '',
                dataset: ''
            };
        },

        handleSaveModel(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.detailDialogVisible = false;
                    updataDataset(this.currentData)
                        .then(() => {
                            this.datasetList();
                            this.initForm();
                        });
                } else {
                    return false;
                }
            });
        },
        initForm() {
            this.datasetList();
            this.detailDialogVisible = false;
            this.currentData = {
                dataset: '',
                name: '',
                description: '',
                share_kind: 1,
                type: '',
                tags: [],
                users: [],
                groups: [],
                is_public: false
            };
        },
        // 排序
        handleSortChange({ prop, order }) {
            if (!order) {
                return;
            }
            if (this.search.order_by === prop) {
                this.isInitPage = false;
            }
            this.search.order_by = prop;
            this.search.order =
                    order === 'descending' ? 'desc' : 'asc';
        },
        // 类型转换
        shareKind(kind, type) {
            if (type === 'value') {
                if (kind === 'PRIVATE') {
                    return '私有';
                } else if (kind === 'MY_SHARE') {
                    return '我的共享';
                } else if (kind === 'OTHER_SHARE') {
                    return '他人共享';
                }
            } else if (type === 'class') {
                if (kind === 'OTHER_SHARE') {
                    return 'public';
                } else if (kind === 'MY_SHARE') {
                    return 'team';
                } else if (kind === 'PRIVATE') {
                    return 'private';
                }
            }
        },
        // 分页控件
        handleSizeChange(page_size) {
            this.search = { ...this.search, page_size, page: 1 };
        },
        handleCurrentChange(page) {
            this.isInitPage = false;
            this.search.page = page;
        },
        handleEnterSearch(event) {
            if (event.keyCode === 13) {
                this.search.name = this.searchName;
            }
        },
        handleClickSearch() {
            this.search.name = this.searchName;
        },
        startPull() {
            if (!this.pull) {
                this.pull = setInterval(() => {
                    this.datasetList('polling');
                }, 5000);
            }
        },
        clearPull() {
            if (this.pull) {
                clearInterval(this.pull);
                this.pull = undefined;
            }
        }
    },
    watch: {
        search: {
            deep: true,
            handler(nval) {
                if (this.isInitPage && nval.page !== 1) {
                    this.search.page = 1;
                    this.isInitPage = false;
                } else {
                    this.datasetList();
                    this.isInitPage = true;
                }
            }
        },
        needPullState(nval) {
            if (nval) {
                this.startPull();
            } else {
                this.clearPull();
            }
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss">


    .data-source-table {
        background: white;
        // padding: 0 20px 10px;
        // margin: 20px 0;
        border: 1px solid #efefef;

        .header {
            padding: 0 20px;
            color: #45474c;
            height: 61px;
            line-height: 60px;
            border-bottom: 1px solid #e6eaf2;
            background-color: #fff;
            text-align: justify;
            display: flex;
            justify-content: space-between;
            .title {
                display: inline-block;
                font-size: 16px;
                color: #45474c;
            }
            .font {
                font-size: 14px;
            }
            .option-box {
                float: right;
            }
            .search_icon {
                cursor: pointer;
                &:hover {
                    color: #409eff;
                }
            }
        }

        .panel {
            padding: 0px 20px 20px 20px;

            .kindLabel {
                display: inline-block;
                font-size: 14px;
                line-height: 20px;
                border-radius: 10px;
                // padding: 0 10px;
                border: none;
            }

            .statusLabel {
                @extend .kindLabel;
                width: 56px;
                text-align: center;
            }

            .public {
                color: #42894F;
                // background: #e8f6e5;
            }

            .team {
                color: #E8606F;
                // background: #FFEDEF;
            }

            .private {
                color: #597CE5;
                // background: #EFEFFE;
            }

            .running {
                color: #0075cc;
                // background-color: #e6f4ff;
            }

            .success {
                color: #00be90;
                // background-color: #d8fff5;
            }

            .fail {
                color: #0075cc;
                // background-color: #e6f4ff;
            }

            .iconBtn {
                font-size: 14px;
            }

            .tableType {
                // padding-left: 15px;
            }

            .statusType {
                padding-left: 10px;
            }

            .iconfont {
                font-size: 14px;
                margin-right: 20px;
            }
        }

        .options {
            position: relative;
            top: -1px;
        }

        .block {
            margin-top: 20px;
            float: right;

            & .el-pagination {
                display: inline-block;
            }
        }

        .clear {
            clear: both;
        }

        .conf {
            margin-left: 5px;
            margin-top: 20px;

            .conf-text {
                margin-bottom: 20px;
            }
        }

        .wd140 {
            width: 120px;
            margin-right: 10px;
            margin-left: 5px;
        }
        .wd168 {
            width: 168px;
            margin-right: 10px;
            margin-left: 5px;
        }
        .tags {
            width: 100%;
        }
        .el-form--label-left .el-form-item__label {
            text-align: right;
        }
    }
</style>
