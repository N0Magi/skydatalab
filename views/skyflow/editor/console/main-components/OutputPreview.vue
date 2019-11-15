<template>
    <div
        class="output-preview"
        v-loading="isLoading"
    >
        <div
            class="preview-container"
            :style="{'min-height': `${consoleMainHeight - 40}px`}"
        >
            <div v-if="!path">
                <div class="comp-name">
                    <span>{{ node.label }}</span>输出预览：
                </div>
                <el-tabs
                    class="tab-container"
                    v-model="activeName"
                    v-if="hasPreview"
                >
                    <template v-if="dataframe && dataframe.length > 0">
                        <el-tab-pane
                            lazy
                            :label="`数据预览${index + 1}`"
                            :name="`TABLE${index + 1}`"
                            :style="{height: `${consoleMainHeight - 87}px`}"
                            v-for="(item, index) in dataframe"
                            :key="index"
                        >
                            <FormTip style="text-align: right;color: #999">
                                最多支持预览输出文件夹中首个csv文件的前100行数据。
                            </FormTip>
                            <PreviewTable
                                :data="item.data || []"
                                :columns="item.schema || []"
                                ref="dataPreview"
                            />
                        </el-tab-pane>
                    </template>
                    <el-tab-pane
                        label="模型评估结果"
                        name="CHART"
                        v-if="performance"
                    >
                        <PreviewCharts :data="performance" />
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div v-if="path">
                <ComponentPreview
                    :path="path"
                    :performance="performance"
                    :node="node"
                />
            </div>
            <!-- <div
                class="empty-content"
                v-if="!hasPreview && !isLoading && !path"
            >
                <img src="../../../../../assets/images/state/empty-no-text2.png">
                <p>当前组件暂无预览数据</p>
            </div> -->
            <SdxuEmpty
                v-if="!hasPreview && !isLoading && !path"
                height="354px"
                empty-type="noData"
                :empty-content="$t('NoData')"
            />
        </div>
    </div>
</template>

<script>
import PreviewCharts from './PreviewCharts';
import PreviewTable from './PreviewTable';
import ComponentPreview from './ComponentPreview';
import { nodeState as nodeStateConf } from '../../js/skyflowConfig';
import { getCompOutputPreview } from '@sdx/utils/lib/api/skyflow';
import FormTip from '../../../components/FormTip';

export default {
    name: 'OutputPreview',
    components: { FormTip, PreviewCharts, PreviewTable, ComponentPreview },
    data() {
        return {
            chartData: null,
            activeName: 'TABLE1',
            dataframe: [],
            performance: null,
            isLoading: false,
            path: ''
        };
    },
    props: {
        executeId: {
            type: String,
            default: ''
        },
        node: {
            type: Object,
            default: null
        },
        collapse: {
            type: Boolean
        },
        consoleMainHeight: {
            type: Number
        }
    },
    computed: {
        state() {
            return this.node.nodeState ? this.node.nodeState.state : '';
        },
        nid() {
            return this.node.nodeState ? this.node.nodeState.node_id : '';
        },
        hasDataframe() {
            return !!this.dataframe && this.dataframe.length > 0;
        },
        hasPreview() {
            return !!this.hasDataframe || !!this.performance;
        }
    },
    activated() {
        console.log('node', this.node);
        this.dataframe = Object.freeze([]);
        this.performance = null;
        this.path = '';
        if (this.state === nodeStateConf.SUCCESS) {
            this.getPreview();
        }
        this.unWatch = this.$watch('node.nodeState.state', (v, ov) => {
            if (v === nodeStateConf.SUCCESS && v !== ov) {
                this.getPreview();
            }
        }, { deep: true });
    },
    deactivated() {
        this.unWatch && this.unWatch();
    },
    methods: {
        getPreview() {
            // 获取数据集数据预览
            this.isLoading = true;
            getCompOutputPreview(this.nid, this.executeId)
                .then(data => {
                    console.log('data', data);
                    this.dataframe = Object.freeze(data.dataframe);
                    this.performance = data.performance;
                    this.path = data.path;
                    this.isLoading = false;
                    this.$nextTick(() => {
                        this.activeName = this.hasDataframe && 'TABLE1' || 'CHART';
                        if (this.hasDataframe) {
                            this.$nextTick(() => {
                                this.$refs.dataPreview.forEach(item => {
                                    // 由于在切换tab时表格被隐藏，导致计算的可视区域列数不正确，这里需要在切换tab后重新计算一次
                                    item.$refs.previewTable.calcViewPortMaxCount();
                                    item.$refs.previewTable.$refs.table.doLayout();
                                });
                            });
                        }
                    });
                })
                .catch(err => {
                    this.isLoading = false;
                    this.dataframe = Object.freeze([]);
                    this.performance = null;
                    this.path = '';
                });
        }
    },
    watch: {
        consoleMainHeight() {
            const fn = _.debounce(() => {
                this.$nextTick(() => {
                    if (this.$refs.dataPreview) {
                        this.$refs.dataPreview.forEach(item => {
                            // 由于在切换tab时表格被隐藏，导致计算的可视区域列数不正确，这里需要在切换tab后重新计算一次
                            item.$refs.previewTable.listenResize();
                        });
                    }
                });
            }, 1000);
            fn.apply(this);
        }
    }
};
</script>


<style lang="scss" scoped>
    .output-preview {
        padding: 20px;
        font-size: 14px;
        .preview-container {
            background: #F8F9FA;
            .comp-name {
                padding: 0 20px;
                height: 47px;
                line-height: 47px;
                border-bottom: 1px solid #dedede;
                span {
                    color: #459cdf;
                    margin-right: 6px;
                }
            }
        }
        .tab-container {
            height: 100%;
        }
        & /deep/ .el-tabs__item {
            font-size: 14px;
        }
        & /deep/ .el-tabs__content{
            overflow: auto;
            height: calc(100% - 60px);
        }
        & /deep/ .el-tab-pane{
            padding: 20px !important;
        }
        .empty-content {
            text-align: center;
            background: #fff;
            padding: 50px 20px 20px;
            font-size: 16px;
            img {
                height: 120px;
            }
            p {
                color: #687c91;
            }
        }
    }
</style>
