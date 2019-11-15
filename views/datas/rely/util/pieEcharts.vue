<template>
    <div
        :style="{height:height,width:width}"
    />
</template>

<script>
import echarts from 'echarts';
import { debounce } from './commonFun';


require('echarts/theme/macarons'); // echarts theme

export default {
    props: {
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
            chart: null
        };
    },
    mounted() {
        this.initChart();
        this.__resizeHanlder = debounce(() => {
            if (this.chart) {
                this.chart.resize();
            }
        }, 100);
        window.addEventListener('resize', this.__resizeHanlder);
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
            this.chart.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: this.pieData.total === 0 ? '无资源' : '{a} <br/>{b}: {c} ({d}%)'
                },
                color: this.pieData.total === 0 ? ['#30A2F2', '#EFEFEF'] : ['#30A2F2', '#C9D2E1'],
                series: [
                    {
                        name: this.pieData.title,
                        type: 'pie',
                        hoverAnimation: false,
                        radius: ['70%', '90%'],
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                color: this.pieData.total === 0 ? '#EFEFEF' : ''
                            }
                        },
                        data: [
                            { value: this.pieData.total === 0 ? 0 : this.pieData.assigned, name: this.pieData.assignedName },
                            { value: this.pieData.total === 0 ? 1 : this.pieData.total - this.pieData.assigned, name: this.pieData.noAssignedName }
                        ]
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
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
