<template>
    <div class="preview-charts">
        <div
            class="evaluation-table chart-block"
            v-if="data.evaluation"
        >
            <el-table
                stripe
                :data="data.evaluation"
            >
                <el-table-column
                    prop="name"
                    label="name"
                />
                <el-table-column
                    prop="value"
                    label="value"
                />
            </el-table>
        </div>
        <div
            class="line-charts chart-block"
            ref="lineCharts"
            v-if="data.graphs"
        />
        <div
            class="heatmap-charts chart-block"
            ref="heatmapCharts"
            v-if="data.matrixs"
        />
    </div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'PreviewCharts',
    data() {
        return {
            lineChartInstance: [],
            heatmapChartInstance: []
        };
    },
    props: {
        data: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    methods: {
        init() {
            this.initLineChart(this.data.graphs);
            this.initHeadmapChart(this.data.matrixs);
        },
        initLineChart(data = []) {
            this.lineChartInstance.forEach(item => {
                item.dispose();
                item._dom.remove();
            });
            this.lineChartInstance = data.map(item => {
                const $chartContainer = document.createElement('div');
                $chartContainer.style.width = '400px';
                $chartContainer.style.height = '300px';
                $chartContainer.style.display = 'inline-block';
                const ins = echarts.init($chartContainer);
                let option = {
                    title: {
                        text: item.name,
                        textStyle: {
                            align: 'center'
                        },
                        left: '30%',
                        top: 20
                    },
                    tooltip: {
                        position: 'top'
                    },
                    xAxis: {
                        name: item.x_title,
                        type: 'value'
                    },
                    yAxis: {
                        name: item.y_title,
                        type: 'value'
                    },
                    grid: {
                        left: 40,
                        right: 80,
                        top: 50,
                        bottom: 40
                    },
                    series: item.lines.map(sery => ({
                        data: sery.x_axis.map((item, index) => [sery.x_axis[index], sery.y_axis[index]]),
                        type: 'line',
                        name: sery.name
                    })),
                    color: ['#1d8cf9', '#48c367', '#6b48c3']
                };
                ins.setOption(option);
                this.$refs.lineCharts.append($chartContainer);
                return ins;
            });
        },
        initHeadmapChart(data = []) {
            this.heatmapChartInstance.forEach(item => {
                item.dispose();
                item._dom.remove();
            });
            this.heatmapChartInstance = data.map(item => {
                const $chartContainer = document.createElement('div');
                $chartContainer.style.width = '450px';
                $chartContainer.style.height = '300px';
                $chartContainer.style.display = 'inline-block';
                const ins = echarts.init($chartContainer);
                let seriesData = [];
                item.row_name.forEach((item1, index1) => {
                    item.col_name.forEach((item2, index2) => {
                        if (item.elements[index2]) {
                            let total = 0;
                            item.elements[index2].forEach(item => total += item);
                            seriesData.push([index1, index2, (item.elements[index2][index1] / total).toFixed(1) * 1]);
                        }
                    });
                });
                let option = {
                    title: {
                        text: item.name,
                        textStyle: {
                            align: 'center'
                        },
                        left: '30%',
                        top: 20
                    },
                    tooltip: {
                        position: 'top'
                    },
                    xAxis: {
                        data: item.col_name,
                        type: 'category',
                        splitArea: {
                            show: true
                        },
                        position: 'top'
                    },
                    yAxis: {
                        data: item.row_name,
                        type: 'category',
                        splitArea: {
                            show: true
                        },
                        inverse: true
                    },
                    grid: {
                        left: 70,
                        right: 80,
                        top: 70,
                        bottom: 40
                    },
                    visualMap: {
                        min: 0,
                        max: 1,
                        show: false,
                        inRange: {
                            color: ['#d8ebf9', '#007eff']
                        }
                    },
                    series: [{
                        data: seriesData,
                        type: 'heatmap',
                        label: {
                            normal: {
                                show: true
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                };
                ins.setOption(option);
                this.$refs.heatmapCharts.append($chartContainer);
                return ins;
            });
        },
        onWindowResize() {
            // todo 目前固定宽高，不需要做
        },
        destroy() {
            this.heatmapChartInstance.forEach(item => {
                item.dispose();
                item._dom.remove();
            });
            this.lineChartInstance.forEach(item => {
                item.dispose();
                item._dom.remove();
            });
        }
    },
    watch: {
        data: {
            deep: true,
            immediate: true,
            handler() {
                this.$nextTick(() => {
                    if (this._isMounted) {
                        this.init();
                    }
                });
            }
        }
    },
    activated() {
        this.init();
    },
    deactivated() {
        this.destroy();
    }
};
</script>

<style lang="scss" scoped>
    .preview-charts {
        .chart-block {
            border: 1px solid #dedede;
            background: #fff;
            & + .chart-block {
                margin-top: 10px;
            }
        }
    }
</style>
