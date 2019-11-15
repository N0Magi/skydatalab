<template>
    <g :id="id" />
</template>
<script>
import * as d3 from 'd3';

import utils from '../js/utils';

const TYPES = {
    MAIN: 'main', // 主画布
    THUMB: 'thumb' // 缩略图
};

export default {
    name: 'LinkGroup',
    props: {
        id: {
            type: String,
            required: true
        },
        links: {
            type: Array,
            required: true
        },
        type: {
            type: String,
            default: TYPES.MAIN
        },
        markerMid: {
            type: String,
            default: ''
        }
    },
    methods: {
        init() {
            const _this = this;
            d3.select(`#${this.id}`)
                .selectAll('path.link')
                .remove(); // 初始化时，先清除之前绘制的线
            d3.select(`#${this.id}`)
                .selectAll('path.link')
                .data(this.links)
                .enter()
                .append('path')
                .attr('class', 'link')
                .attr('id', link => {
                    if (_this.type === TYPES.MAIN) {
                        return `link_${link.source.id}_${link.target.id}`;
                    } else {
                        return '';
                    }
                })
                .attr('marker-mid', link => _this.markerMid && link.source.id !== link.target.id ? _this.markerMid : false
                )
                .attr('stroke', '#3F5973')
                .attr('stroke-width', 1)
                .attr('d', link => {
                    let x1 = link.source.x;
                    let y1 = link.source.y;
                    let x2 = link.target.x;
                    let y2 = link.target.y;
                    return utils.generateBézierControlPoints2(x1, y1, x2, y2);
                })
                .attr('fill', 'none');
        }
    },
    mounted() {
        this.init();
    },
    watch: {
        links() {
            this.init();
        }
    }
};
</script>
<style>
</style>
