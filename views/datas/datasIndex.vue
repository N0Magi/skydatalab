<template>
    <div class="datas-index">
        <div class="service-panel shadow">
            <div class="header-bar">
                <div class="title">
                    数据服务列表
                </div>
                <div class="option-box">
                    <el-input
                        class="option-box-input"
                        size="small"
                        v-model.lazy.trim="searchName"
                        placeholder="输入名称搜索服务"
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
                        class="option-box-btn"
                        type="primary"
                        icon="el-icon-plus"
                        size="small"
                        @click="createService"
                        v-auth.data.button="'DATA_SERVICE:CREATE'"
                    >
                        新建数据服务
                    </el-button>
                </div>
            </div>
            <sdxu-scroll style="height: 240px;">
                <div
                    class="task-card-box"
                    ref="cardBox"
                >
                    <!-- <has-nothing
                        v-if="nothing"
                        class="has-nothing"
                    /> -->
                    <SdxuEmpty
                        v-if="nothing"
                        empty-type="noData"
                        :empty-content="$t('NoData')"
                    />
                    <data-service-card
                        class="task-card-box__item"
                        v-for="item in services"
                        :key="item._id"
                        :task="item"
                        @refresh="handleFetchList"
                        @taskOperation="handleServiceOperation"
                    />
                </div>
            </sdxu-scroll>
        </div>
        <!-- 数据源列表 -->
        <data-source-list />
        <!-- 数据集列表 -->
        <datas-list :services="services" />

        <data-service-form
            :visible.sync="dataServicevisible"
            :task="editTask"
            :create-data="createData"
            @refresh="handleFetchList()"
        />
    </div>
</template>
<script>

import { getTaskList } from '@sdx/utils/lib/api/project';
import dataServiceCard from './rely/dataServiceCard';
import datasList from './datasList';
import dataSourceList from './dataSourceList';
import dataServiceForm from './DataServiceForm';
import taskMixin from '@sdx/utils/lib/mixins/task';
export default {
    components: { dataServiceCard, datasList, dataSourceList, dataServiceForm },
    mixins: [taskMixin],
    data() {
        return {
            search: {
                // 查询参数
                name: '',
                start: 1,
                count: -1,
                order: 'desc',
                orderBy: 'createdAt',
                type: 'DATA_SERVICE'
            },
            searchName: '',
            services: [],
            total: 0,
            cardMarginRight: 0, // 卡片右边距,用户动态排版卡片,两边对齐
            pullSecuqence: 5000, // 状态拉取周期
            nothing: false,
            dataServicevisible: false,
            editTask: null,
            createData: true
        };
    },
    beforeCreate() {
        // this.$store.dispatch('currentUser').then(() => ({}));
    },
    created() {
        this.handleFetchList();
        this.fetchDataMinxin = this.handleFetchList;
    },
    beforeDestroy() {
        // 销毁前清理计时器
        this.clearPull();
    },
    computed: {
        needPullState() {
            return this.services.some(item => item.state === 'LAUNCHING' || item.state === 'KILLING');
        }
    },
    methods: {
        handleFetchList() {
            getTaskList(this.search)
                .then(data => {
                    this.services = data.items;
                    if (data.items.length) {
                        this.nothing = false;
                    } else {
                        this.nothing = true;
                    }
                    let dataFlagObj = {
                        dataFlag: true
                    };
                    this.services.map(item => Object.assign(item, dataFlagObj));
                    this.total = data.total;
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

        startPull() {
            if (!this.pull) {
                this.pull = setInterval(() => {
                    this.handleFetchList();
                }, this.pullSecuqence);
            }
        },
        clearPull() {
            if (this.pull) {
                clearInterval(this.pull);
                this.pull = undefined;
            }
        },
        createService() {
            this.dataServicevisible = true;
            this.editTask = null;
            this.createData = true;
        },
        handleEnterSearch(event) {
            if (event.keyCode === 13) {
                this.search.name = this.searchName;
            }
        },
        handleClickSearch() {
            this.search.name = this.searchName;
        },
        handleServiceOperation(btn, task) {
            if (btn === 'start' || btn === 'remove' || btn === 'kill') {
                this.handleOperation(btn, task);
            }
            if (btn === 'detail') {
                // 跳转详情
                task.type = 'DATASET_SERVICE';
                this.handleOperation(btn, task);
            }
            if (btn === 'edit') {
                // 编辑
                this.dataServicevisible = true;
                this.editTask = task;
                this.createData = false;
            }
        }
    },
    watch: {
        search: {
            deep: true,
            handler() {
                this.handleFetchList();
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
<style rel="stylesheet/scss" lang="scss" scoped>

.service-panel {
    background-color: #fff;
    border: 1px solid #e6eaf2;
    overflow: hidden;
    .header-bar {
        padding: 0 20px;
        height: 61px;
        line-height: 60px;
        border-bottom: 1px solid #e6eaf2;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        .title {
            display: inline-block;
            font-size: 16px;
            color: #45474c;
        }
        .option-box {
            display: inline-block;
            text-align: left;
            .option-box-input {
                width: 168px;
                margin-right: 10px;
            }
            .option-box-btn {
                position: relative;
            }
        }
        .search_icon {
            cursor: pointer;
            &:hover {
                color: #409eff;
            }
        }
    }
    .task-card-box {
        white-space: nowrap;
        padding-bottom: 18px;
        padding-left:20px;
        min-height: 223px;
        .task-card-box__item {
            display: inline-block;
            margin-right: 20px;
        }
        .sdxu-empty {
            padding-top: 0;
        }
    }
    .task-page-box {
        padding: 20px 20px 30px;
        text-align: right;
    }
}
</style>
