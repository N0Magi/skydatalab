<template>
    <div class="sdx-dashboard">
        <div class="left">
            <div class="left-top">
                <div
                    class="resource"
                >
                    <el-row
                        :gutter="20"
                    >
                        <el-col :span="16">
                            <sdxu-content-panel
                                :title="$t('dashboard.resource_usage')"
                                size="small"
                                v-loading="resourceLoading || diskLoading"
                            >
                                <el-row
                                    :gutter="20"
                                    class="resource-items"
                                >
                                    <el-col :span="12">
                                        <div>
                                            <i class="iconfont iconicon-cpu-dashboard" />
                                        </div>
                                        <div
                                            class="resource-items-content"
                                        >
                                            <div>
                                                {{ resource.cpu > -1 ? Math.ceil(resource.cpu / 1000) : '-' }}
                                            </div>
                                            <div>
                                                <span>CPU</span>（{{ $t('dashboard.core') }}）
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div>
                                            <i class="iconfont iconicon-GPU-dashboard" />
                                        </div>
                                        <div class="resource-items-content">
                                            <div>
                                                {{ gpuCount > -1 ? gpuCount : '-' }}
                                            </div>
                                            <div
                                                class="gpu-resource"
                                            >
                                                <el-dropdown
                                                    @command="handleChangeType"
                                                    trigger="click"
                                                    v-if="options && options.length "
                                                >
                                                    <span
                                                        class="el-dropdown-link"
                                                        :title="gpuValue"
                                                    >
                                                        {{ gpuValue }}<i class="el-icon-arrow-down el-icon--right" />
                                                    </span>
                                                    <el-dropdown-menu slot="dropdown">
                                                        <el-dropdown-item
                                                            v-for="item in options"
                                                            :key="item.value"
                                                            :command="item.value"
                                                        >
                                                            {{ item.value }}
                                                        </el-dropdown-item>
                                                    </el-dropdown-menu>
                                                </el-dropdown>
                                                <span
                                                    v-else
                                                    class="gpu-label"
                                                >GPU</span>
                                                <span class="gpu-unit"> ({{ $t('dashboard.piece') }})</span>
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row
                                    :gutter="20"
                                    class="resource-items marginTop20"
                                >
                                    <el-col :span="12">
                                        <div>
                                            <i class="iconfont iconicon-neicun" />
                                        </div>
                                        <div class="resource-items-content">
                                            <div>
                                                {{ resource.memory > -1 ? Math.ceil(resource.memory / Math.pow(1024, 3)) : '-' }}
                                            </div>
                                            <div>
                                                <span>{{ $t('dashboard.memory') }}</span>（GB）
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div>
                                            <i class="iconfont iconicon-disk" />
                                        </div>
                                        <div class="resource-items-content">
                                            <div>
                                                {{ diskCount > -1 ? diskCount : '-' }}
                                            </div>
                                            <div>
                                                <span>DISK</span>（GB）
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </sdxu-content-panel>
                        </el-col>
                        <el-col
                            :span="8"
                            class="task"
                        >
                            <sdxu-content-panel
                                :title="$t('dashboard.total_number_of_running_tasks')"
                                size="small"
                            >
                                <CircleProgress
                                    :percentage="20"
                                    :strokeWidth="12"
                                    :totalSteps="this.taskTotal"
                                    :completedSteps="this.taskCompleted"
                                />
                            </sdxu-content-panel>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="left-center">
                <sdxu-content-panel
                    :title="$t('dashboard.industry_template')"
                    size="small"
                >
                    <el-row
                        class=""
                        :gutter="20"
                    >
                        <el-col :span="12">
                            <rain-transit />
                        </el-col>
                        <el-col :span="12">
                            <wind-industry />
                        </el-col>
                    </el-row>
                </sdxu-content-panel>
            </div>
            <div class="left-bottom">
                <el-row :gutter="20">
                    <el-col
                        :span="12"
                        v-loading="taskLoading"
                    >
                        <sdxu-content-panel
                            :title="$t('dashboard.task_resources_utilization_Top10')"
                            size="small"
                        >
                            <div
                                v-if="taskNameList && taskNameList.length"
                            >
                                <el-select
                                    size="small"
                                    v-model="orderBy"
                                    placeholder="请选择"
                                    :class="clientENG ? 'minClient' : ''"
                                >
                                    <el-option
                                        v-for="item in resourceType"
                                        :key="item.label"
                                        :label="$t(`dashboard.${item.label}`)"
                                        :value="item.value"
                                    />
                                </el-select>
                                <MoreBtn
                                    class="morebtn"
                                    @getMore="getTaskMore('/sdxv-task-management')"
                                />
                                <bar-echarts
                                    height="354px"
                                    :barData="taskData"
                                    :barNameList="taskNameList"
                                    :tipTitle="$t('dashboard.task_resource_utilization')"
                                    :colorList="taskColorList"
                                    :name-id="taskNameId"
                                />
                                <span class="xname">{{ $t('dashboard.unit') }}（{{ $t(`dashboard.${taskXname}`) }}）</span>
                            </div>
                            <SdxuEmpty
                                v-if="taskNameList.length === 0 && !taskLoading"
                                height="354px"
                                empty-type=""
                                :empty-content="$t('NoData')"
                                style="padding-top: 160px;"
                            />
                        </sdxu-content-panel>
                    </el-col>
                    <el-col
                        :span="12"
                        v-loading="versionLoading"
                    >
                        <sdxu-content-panel
                            :title="$t('dashboard.number_of_model_version_calls_Top10')"
                            size="small"
                        >
                            <div v-if="modelNameList && modelNameList.length">
                                <MoreBtn
                                    class="morebtn"
                                    @getMore="getTaskMore('/sdxv-model-manage')"
                                />
                                <bar-echarts
                                    height="354px"
                                    :barData="modelData"
                                    :barNameList="modelNameList"
                                    :tipTitle="$t('dashboard.number_of_model_version_calls')"
                                    :colorList="modelColorList"
                                    :name-id="modelNameId"
                                />
                                <span class="xname">{{ $t('dashboard.unit') }}（{{ $t('dashboard.times') }}）</span>
                            </div>
                            <SdxuEmpty
                                v-if="modelNameList.length === 0 && !versionLoading"
                                height="354px"
                                empty-type=""
                                :empty-content="$t('NoData')"
                                style="padding-top: 160px;"
                            />
                        </sdxu-content-panel>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="right">
            <recent-updates
                :title="$t('dashboard.updated_project_recently')"
                :nameTimes="projectInfo"
                path="/sdxv-project-manage"
                :loading="projectLoading"
                type="project"
            />
            <recent-updates
                :title="$t('dashboard.updated_skyflow_recently')"
                :nameTimes="skyflowInfo"
                path="/sdxv-skyflow/skyflow-list"
                :loading="skyflowLoading"
                type="skyflow"
            />
            <recent-updates
                :title="$t('dashboard.updated_model_recently')"
                :nameTimes="modelInfo"
                path="/sdxv-model-manage"
                :loading="modelLoading"
                type="model"
            />
            <recent-updates
                :title="$t('dashboard.updated_dataset_recently')"
                :nameTimes="datasetInfo"
                path="/datasManage"
                :loading="datasetLoading"
                type="dataset"
            />
        </div>
    </div>
</template>
<script>

import CircleProgress from './SvgCircle';
import RainTransit from './RainTransit';
import WindIndustry from './WindIndustry';
import BarEcharts from './BarEcharts';
import { getUserResource, getTaskList, getDisk, getProjects, getModels, getDatasets, getSkyflows,
    getVersions } from 'api/dashboard';
import MoreBtn from './MoreBtn';
import RecentUpdates from './RecentUpdates';
import { getClientWidth } from '@sdx/utils/lib/helper/dom';
import { debounce } from '../../helper/common-fun';

export default {
    name: 'Dashboard',
    data() {
        return {
            resource: {},
            options: null,
            gpuValue: '',
            taskCompleted: 0,
            taskTotal: 0,
            diskCount: -1,
            orderBy: 'CPU',
            resourceType: [
                {
                    label: 'descending_by_CPU',
                    value: 'CPU'
                },
                {
                    label: 'descending_by_Memory',
                    value: 'MEMORY'
                }, {
                    label: 'descending_by_GPU',
                    value: 'GPU'
                }
            ],
            taskData: [],
            taskNameList: [],
            taskXname: 'core',
            taskColorList: ['#5C89FF', 'rgba(92,137,255,0.9)', 'rgba(92,137,255,0.8)',
                'rgba(92,137,255,0.7)', 'rgba(92,137,255,0.6)', 'rgba(92,137,255,0.5)',
                'rgba(92,137,255,0.4)', 'rgba(92,137,255,0.3)', 'rgba(92,137,255,0.2)', 'rgba(92,137,255,0.1)'],
            modelColorList: [
                'rgba(70,192,255,1)', 'rgba(70,192,255,0.9)', 'rgba(70,192,255,0.8)', 'rgba(70,192,255,0.7)',
                'rgba(70,192,255,0.6)', 'rgba(70,192,255,0.5)', 'rgba(70,192,255,0.4)',
                'rgba(70,192,255,0.3)', 'rgba(70,192,255,0.2)', 'rgba(70,192,255,0.1)'
            ],
            projectInfo: [],
            modelInfo: [],
            datasetInfo: [],
            skyflowInfo: [],
            modelNameList: [],
            modelData: [],
            // loading
            projectLoading: true,
            skyflowLoading: true,
            modelLoading: true,
            datasetLoading: true,
            taskLoading: true,
            versionLoading: true,
            modelNameId: [],
            taskNameId: [],
            // resource loading
            resourceLoading: true,
            diskLoading: true,
            clientWidth: 1500
        };
    },
    components: {
        CircleProgress,
        RainTransit,
        WindIndustry,
        BarEcharts,
        MoreBtn,
        RecentUpdates
    },
    computed: {
        gpuCount() {
            let count = -1;
            if (this.options === null) {
                count = '-';
            } else {
                for (let i = 0; i < this.options.length; i++) {
                    if (this.options[i].value === this.gpuValue) {
                        count = this.options[i].count;
                    }
                }
                if (this.options.length === 0) {
                    count = 0;
                }
            }
            return count;
        },
        clientENG() {
            return this.lang$ === 'en' && this.clientWidth < 1500;
        }
    },
    created() {
        this.getResource();
        this.getTask().then(res => {
            this.taskTotal = res.total;
            let [count, items] = [0, res && res.items];
            for (let i = 0; i < items.length; i++) {
                if (items[i].state === 'RUNNING') {
                    count++;
                }
            }
            this.taskCompleted = count;
        });
        this.getDiskCount();
        this.getProjectList();
        this.getModelList();
        this.getDatasetList();
        this.getSkyflowList();
        this.getVersionList();
    },
    mounted() {
        this.clientWidth = getClientWidth();
        this.__resizeHanlder = debounce(() => {
            this.clientWidth = getClientWidth();
        }, 300);
        window.addEventListener('resize', this.__resizeHanlder);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.__resizeHanlder);
    },
    methods: {
        getClientWidth,
        handleChangeType(command) {
            this.gpuValue = command;
        },
        // 资源
        getResource() {
            let userId = this.$store.getters.userId;
            let params = {
                userId,
                states: 'LAUNCHING,RUNNING,KILLING'
            };
            getUserResource(params)
                .then(data => {
                    this.resourceLoading = false;
                    this.resource = data;
                    this.options = data.gpus.map(item => {
                        item.value = item && item.label;
                        return item;
                    });
                    this.gpuValue = data.gpus[0] && data.gpus[0].label;
                }, () => {
                    this.resourceLoading = false;
                });
        },
        // 任务列表
        getTask(purpose, resourcetype) {
            let params = {};
            if (purpose === 'top') {
                params = {
                    ownerId: this.$store.getters.userId,
                    start: 1,
                    count: 10,
                    order: 'desc',
                    orderBy: resourcetype,
                    states: 'LAUNCHING,RUNNING,KILLING'
                };
            } else {
                params = {
                    ownerId: this.$store.getters.userId,
                    start: 1,
                    count: -1
                };
            }
            return new Promise((resolve, reject) => {
                getTaskList(params)
                    .then(res => {
                        this.taskLoading = false;
                        resolve(res);
                    }
                    ).catch(error => {
                        this.taskLoading = false;
                        reject(error);
                    });
            });
        },
        // disk 信息
        getDiskCount() {
            let params = {
                ownerId: this.$store.getters.userId
            };
            getDisk(params)
                .then(res => {
                    this.diskLoading = false;
                    this.diskCount = Math.ceil(res.usedBytes / Math.pow(1024, 3));
                }, () => {
                    this.diskLoading = false;
                });
        },
        // 获取更多任务
        getTaskMore(path) {
            this.$router.push(path);
        },
        // 项目列表
        getProjectList() {
            let params = {
                start: 1,
                count: 5,
                order: 'desc',
                orderBy: 'updatedAt',
                ownerId: this.$store.getters.userId
            };
            getProjects(params)
                .then(res => {
                    this.projectLoading = false;
                    for (let i = 0; i < res.data.items.length; i++) {
                        this.projectInfo.push(
                            {
                                name: res.data.items[i].name,
                                time: res.data.items[i].updatedAt,
                                uuid: res.data.items[i].uuid
                            }
                        );
                    }
                }, () => {
                    this.projectLoading = false;
                });
        },
        // 模型列表
        getModelList() {
            let params = {
                order: 'desc',
                start: 1,
                count: 5,
                orderBy: 'updatedAt'
            };
            getModels(params)
                .then(res => {
                    this.modelLoading = false;
                    for (let i = 0; i < res.items.length; i++) {
                        this.modelInfo.push(
                            {
                                name: res.items[i].name,
                                time: res.items[i].updatedAt,
                                uuid: res.items[i].uuid
                            }
                        );
                    }
                }, () => {
                    this.modelLoading = false;
                });
        },
        // 数据集列表
        getDatasetList() {
            let params = {
                name: '',
                page: 1,
                page_size: 5,
                share_kind: -1,
                data_size: -1,
                order: 'desc',
                order_by: 'updated_at',
                data_format: -1,
                tag: -1
            };
            getDatasets(params)
                .then(res => {
                    this.datasetLoading = false;
                    for (let i = 0; i < res.data.items.length; i++) {
                        this.datasetInfo.push(
                            {
                                name: res.data.items[i].name,
                                time: res.data.items[i].updated_at,
                                uuid: res.data.items[i].dataset
                            }
                        );
                    }
                }, () => {
                    this.datasetLoading = false;
                });
        },
        // skyflow 列表
        getSkyflowList() {
            let params = {
                order: 'desc',
                orderBy: 'updatedAt',
                start: 1,
                count: 5,
                ownerId: this.$store.getters.userId
            };
            getSkyflows(params)
                .then(res => {
                    this.skyflowLoading = false;
                    for (let i = 0; i < res.items.length; i++) {
                        this.skyflowInfo.push(
                            {
                                name: res.items[i].name,
                                time: res.items[i].updatedAt,
                                uuid: res.items[i].uuid
                            }
                        );
                    }
                }, () => {
                    this.skyflowLoading = false;
                });
        },
        // 获取模型版本列表
        getVersionList() {
            let params = {
                order: 'desc',
                orderBy: 'apiCallNum',
                start: 1,
                count: 10
            };
            getVersions('ALL', params)
                .then(res => {
                    let [name, data, items, nameId] = [[], [], [], []];
                    if (res.items.length > 10) {
                        items = res.items.slice(0, 10);
                    } else {
                        items = res.items;
                    }
                    for (let i = 0; i < items.length; i++) {
                        name.push(items[i].name);
                        data.push(items[i].apiCallNum ? items[i].apiCallNum : 0);
                        nameId.push({ name: items[i].name, uuid: items[i].uuid, modelId: items[i].modelId });
                    }
                    this.modelData = data.reverse(),
                    this.modelNameList = name.reverse();
                    this.modelNameId = nameId;
                    this.versionLoading = false;
                }, () => {
                    this.versionLoading = false;
                    this.modelData = [],
                    this.modelNameList = [];
                    this.modelNameId = [];
                });
        }
    },
    watch: {
        orderBy: {
            immediate: true,
            handler(nval) {
                let [name, data, items, nameId] = [[], [], [], []];
                this.getTask('top', nval).then(res => {
                    if (res.items.length > 10) {
                        items = res.items.slice(0, 10);
                    } else {
                        items = res.items;
                    }
                    for (let i = 0; i < items.length; i++) {
                        name.push(items[i].name);
                        nameId.push({ name: items[i].name, type: items[i].type, uuid: items[i].uuid, projectId: items[i].projectId });
                        if (nval === 'CPU') {
                            this.taskXname = 'core';
                            data.push(Math.ceil(items[i].quota.cpu / 1000));
                        } else if (nval === 'GPU') {
                            this.taskXname = 'piece';
                            data.push(items[i].quota.gpu);
                        } else if (nval === 'MEMORY') {
                            this.taskXname = 'GB';
                            data.push(Math.ceil(items[i].quota.memory / Math.pow(1024, 3)));
                        }
                    }
                    this.taskNameId = nameId;
                    this.taskData = data.reverse(),
                    this.taskNameList = name.reverse();
                }, () => {
                    this.taskNameId = [];
                    this.taskData = [],
                    this.taskNameList = [];
                    this.taskLoading = false;
                });
            }
        }
    }
};
</script>
<style lang="scss">

.sdx-dashboard {
    overflow: hidden;
    display:flex;/*设为伸缩容器*/
    flex-flow:row;/*伸缩项目单行排列*/
    & /deep/ {
        .sdxu-content-panel__main {
            padding-top: 0px !important;
        }
        .sdxu-content-panel {
            padding: 20px;
            .sdxu-content-panel__header {
                align-items: start !important;
            }
        }
        .sdxu-empty {
            height: 355px !important;
            padding-top: 80px;
        }
    }
    .marginTop20 {
        margin-top: 20px;
    }
    .left {
        flex:3;
        margin-right: 20px;
        .left-top {
            height: 304px;
            .resource {
                .resource-items {
                    .el-col > div {
                        height:104px;
                        background:rgba(247,247,247,1);
                        border-radius:2px;
                    }
                    .el-col {
                        display: flex;
                        & > div:first-child {
                            flex: 4;
                            text-align: center;
                            & /deep/ .iconfont {
                                width: 64px;
                                height: 64px;
                                display: inline-block;
                                border-radius: 100%;
                                line-height: 64px;
                                margin-top: 20px;
                                font-size: 34px;
                                color: #fff;
                            }
                            .iconicon-cpu-dashboard {
                                background: #5C89FF;
                            }
                            .iconicon-GPU-dashboard {
                                background: #4EDBDD;
                            }
                            .iconicon-neicun {
                                background: #F68573;
                            }
                            .iconicon-disk {
                                background: #9791FF;
                            }
                        }
                        & div:last-child {
                            flex: 5;
                        }
                    }
                    .resource-items-content {
                        padding: 24px 0;
                        & > div:first-child {
                            font-size: 24px;
                            font-family: Impact;
                            color: rgba(48,49,51,1);
                            line-height: 34px;
                        }
                        & > div:last-child {
                            font-size: 14px;
                            color: rgba(96,98,102,1);
                            line-height: 26px;
                            height: 16px;
                            font-family:Roboto-Black;
                            span {
                                font-weight: 900;
                            }
                        }
                        .gpu-resource {
                            line-height: 26px !important;
                            height: 30px !important;
                            display: flex;
                            .el-dropdown-link {
                                cursor: pointer;
                                i {
                                    position: absolute;
                                    right: 0px;
                                    top: 6px;
                                }
                            }
                            .el-dropdown {
                                height: 30px;
                                overflow: hidden;
                                position: relative;
                                padding-right: 14px;
                            }
                            .gpu-unit{
                                font-weight: 400;
                            }
                            .gpu-label {
                                padding-right: 8px;
                            }
                        }
                        .el-select {
                            width: auto;
                            min-width: 94px;
                            max-width: 64%;
                        }
                        .el-input__inner {
                            padding: 0 10px 0 0;
                            border: none;
                            background: #F7F7F7;
                            font-size: 14px;
                            color: #606266;
                            font-weight: 900;
                            font-family:Roboto-Black;
                        }
                    }
                }
                .task {
                    .sdxu-content-panel {
                        height: 304px;
                        & /deep/.sdxu-content-panel__main  {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 236px;
                        }

                    }
                }
            }
        }
        .left-center {
            height: 230px;
            @extend .marginTop20;
        }
        .left-bottom {
            @extend .marginTop20;
            height: 430px;
            .el-col-12 {
                height: 430px;
            }
            .el-input__inner {
                padding: 0 10px 0 0;
                border: none;
                color: #606266;
            }
            .el-select {
                position: absolute;
                top: 15px;
                right: 85px;
                width: 92px;
            }
            .minClient {
                right: 50px;
            }
            .is-lang-en .el-select {
                width: 86px;
            }
            .sdxu-content-panel {
                position: relative;
            }
            .xname {
                position: absolute;
                bottom: 54px;
                right: 20px;
                color: rgba(96,98,102,1);
                font-size: 12px;
            }
            .morebtn {
                position: absolute;
                top: 10px;
                right: 6px;
            }
        }
    }
    .right {
        min-width: 282px;
        flex:1;
        .recent-updates:last-child {
            .sdxu-content-panel {
                margin-bottom: 0;
            }
        }
    }
}
</style>

