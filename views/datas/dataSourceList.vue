<template>
    <div class="data-source-list shadow">
        <div class="header">
            <div class="title">
                数据源列表
            </div>
            <div class="option-box">
                <el-input
                    class="wd200"
                    placeholder="输入数据源名称搜索"
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
                <el-button
                    type="primary"
                    size="small"
                    class="options"
                    icon="el-icon-plus"
                    @click="createDataSource"
                    v-auth.data.button="'DATA_SOURCE:CREATE'"
                >
                    新建数据源
                </el-button>
            </div>
        </div>
        <div class="table">
            <el-table
                ref="multipleTable"
                :data="tableData"
                :stripe="true"
                :default-sort="{prop: 'created_at', order: 'descending'}"
                @sort-change="handleSortChange"
            >
                <el-table-column
                    prop="name"
                    label="数据源名称"
                />
                <el-table-column
                    prop="kind"
                    label="数据源种类"
                />
                <el-table-column
                    prop="user"
                    label="创建人"
                />
                <el-table-column
                    prop="created_at"
                    label="创建时间"
                    sortable="custom"
                >
                    <template
                        slot-scope="scope"
                    >
                        {{ dateFormatter(scope.row.created_at) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                >
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            size="small"
                            @click="viewDataSource(scope.row)"
                            v-if="scope.row.all_operations.includes('detail')"
                        >
                            <i
                                class="iconfont iconicon-yanjing"
                                title="详情"
                            />
                        </el-button>
                        <el-button
                            type="text"
                            size="small"
                            @click="testDataSource(scope.row)"
                            v-if="scope.row.all_operations.includes('test')"
                        >
                            <i
                                class="iconfont icontest"
                                title="测试"
                            />
                        </el-button>
                        <el-button
                            type="text"
                            size="small"
                            @click="editDataSource(scope.row)"
                            v-if="scope.row.all_operations.includes('edit')"
                        >
                            <i
                                class="iconfont iconicon-edit1"
                                title="编辑"
                            />
                        </el-button>
                        <el-button
                            type="text"
                            size="small"
                            @click="deleteDataSource(scope.row)"
                            v-if="scope.row.all_operations.includes('remove')"
                        >
                            <i
                                class="iconfont iconicon-delete1"
                                title="删除"
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
                    :page-sizes="[5]"
                    layout="total, sizes, prev, pager, next"
                    :total="total"
                />
            </div>
            <div class="clear" />
        </div>
    </div>
</template>

<script>

import { getSourceList, removeDataSource, testDataSourceConnection } from './rely/dataSourceApi';
import { dateFormatter } from '@sdx/utils/lib/helper/transform';
import auth from '@sdx/widget/lib/auth';
export default {
    name: 'DataSourceList',
    data() {
        return {
            tableData: [],
            total: 0,
            search: {
                name: '',
                page: 1,
                page_size: 5,
                order: 'desc',
                order_by: 'created_at'
            },
            searchName: '',
            isInitPage: true
        };
    },
    created() {
        this.dataSourceList();
    },
    directives: {
        auth
    },
    methods: {
        dateFormatter,
        // 数据源查询
        dataSourceList() {
            getSourceList(this.search)
                .then(res => {
                    this.tableData = res.data.items;
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
                });
        },
        // 删除数据源
        deleteDataSource(row) {
            this.$confirm('确认删除该数据源？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    removeDataSource({ datasource: row.datasource_id })
                        .then(() => {
                            this.$notify.success({
                                title: '删除数据源成功',
                                duration: 3000
                            });
                            this.dataSourceList();
                        });
                });
        },
        // 排序
        handleSortChange({ order }) {
            if (!order) {
                return;
            }
            this.isInitPage = false;
            this.search.order =
                    order === 'descending' ? 'desc' : 'asc';
        },
        // 分页控件
        handleSizeChange(page_size) {
            this.search = { ...this.search, page_size, page: 1 };
        },
        handleCurrentChange(page) {
            this.isInitPage = false;
            this.search.page = page;
        },
        viewDataSource(data) {
            this.$router.push(
                `/datasManage/data-source-create/${data.datasource_id}/1`
            );
        },
        editDataSource(data) {
            this.$router.push({
                name: 'CreateDataSource',
                params: {
                    id: data.datasource_id
                }
            });
        },
        testDataSource(data) {
            testDataSourceConnection({
                datasource: data.datasource_id
            })
                .then(() => {
                    this.$message.success('测试成功');
                });
        },
        createDataSource() {
            this.$router.push({
                name: 'CreateDataSource'
            });
        },
        handleEnterSearch(event) {
            if (event.keyCode === 13) {
                this.search.name = this.searchName;
            }
        },
        handleClickSearch() {
            this.search.name = this.searchName;
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
                    this.dataSourceList();
                    this.isInitPage = true;
                }
            }
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

.data-source-list {
    background: white;
    margin: 20px 0;
    border: 1px solid #efefef;
    .header {
        padding: 0 20px;
        color: #45474c;
        height: 61px;
        line-height: 60px;
        border-bottom: 1px solid #e6eaf2;;
        background-color: #fff;
        text-align: right;
        display: flex;
        justify-content: space-between;
        .title {
            display: inline-block;
            font-size: 16px;
            color: #45474c;
        }
        .wd200 {
            width: 168px;
            margin-right: 10px;
        }
        .option-box {
            float: right;
            .options {
                position: relative;
                top: -1px;
            }
            .search_icon {
                cursor: pointer;
                &:hover {
                    color: #409eff;
                }
            }
        }
    }
    .table {
        padding: 0px 20px 20px 20px;
        .iconfont {
            font-size: 14px;
            margin-right: 20px;
        }
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
    .el-dialog__body {
        padding: 20px 0 0 0;
    }
}

</style>


