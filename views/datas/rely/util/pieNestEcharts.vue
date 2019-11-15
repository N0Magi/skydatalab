<template>
    <div
        :class="className"
        :style="{height:height,width:width}"
    />
</template>

<script>
import echarts from 'echarts';
import { debounce } from './commonFun';


require('echarts/theme/macarons'); // echarts theme

export default {
    props: {
        className: {
            type: String,
            default: 'chart'
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '220px'
        },
        pieData: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            chart: null,
            assigned: []
        };
    },
    beforeDestroy() {
        if (!this.chart) {
            return;
        }
        window.removeEventListener('resize', this.__resizeHanlder);
        this.chart.dispose();
        this.chart = null;
    },

    methods: {
        initChart() {
            this.chart && this.chart.clear();
            this.chart = echarts.init(this.$el, 'macarons');
            let colors = ['#30A2F2', '#D7F4FA', '#FCA800', '#FFF4DF', '#1271E7', '#C7E0FF', '#85CA97', '#E9FFEF', '#7364A2', '#F4F0FF'];
            let [arr, gpus] = [[], _.cloneDeep(this.pieData.assignedGpus)];
            for (let i = 0; i < gpus.length; i++) {
                gpus[i].itemStyle = { color: colors[i] };
                gpus[i].emphasis = { itemStyle: { color: colors[i], opacity: 0.7 } };
                arr.push(gpus[i]);
            }
            this.assigned = arr;
            this.chart.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                series: [
                    {
                        name: 'GPU类型',
                        type: 'pie',
                        hoverAnimation: false,
                        radius: [0, '60%'],
                        color: ['#30A2F2', '#FCA800', '#1271E7', '#85CA97', '#7364A2'],
                        label: {
                            normal: {
                                show: false
                            }
                        },

                        data: this.pieData.totalGpus
                    },
                    {
                        name: this.pieData.title === 'GPU概况' ? 'GPU使用情况' : 'GPU分配情况',
                        type: 'pie',
                        radius: ['70%', '90%'],
                        hoverAnimation: false,
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        data: this.assigned
                    }
                ]
            });
        }
    },
    watch: {
        pieData(nval, oval) {
            this.pieData = nval;
            if (nval.assigned !== oval.assigned || nval.total !== oval.total) {
                this.initChart();
            }
            this.__resizeHanlder = debounce(() => {
                if (this.chart) {
                    this.chart.resize();
                }
            }, 100);
            window.addEventListener('resize', this.__resizeHanlder);
        },
        $route(val) {
            if (val.params.active === 'grouplist') {
                this.chart && this.chart.resize();
            }
        }
    }
};
</script>
