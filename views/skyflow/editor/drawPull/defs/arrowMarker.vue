<template>
    <marker
        :id="id"
        :viewBox="viewBox"
        :refX="position.refX"
        :refY="position.refY"
        :markerWidth="markerWidth"
        :markerHeight="markerHeight"
        :markerUnits="markerUnits"
        :orient="orient"
    >
        <path
            :d="position.path"
            :fill="color"
        />
    </marker>
</template>

<script>
export default {
    name: 'ArrowMarker',
    props: {
        id: {
            type: String,
            required: true
        },
        type: { // 箭头类型: 头/尾/中间
            type: String,
            default: 'middle'
        },
        color: {
            type: String,
            default: '#666'
        },
        orient: {
            type: String,
            default: 'auto'
        },
        markerUnits: {
            type: String,
            default: 'userSpaceOnUse'
        },
        markerWidth: {
            type: Number,
            default: 12
        },
        markerHeight: {
            type: Number,
            default: 10
        },
        viewBox: {
            type: String,
            default: '0 -7 16 14' // 箭头默认位置的左上角坐标和长宽(min x, min y, width, height)
        }
    },
    computed: {
        position() {
            const position = {};
            if (this.type === 'middle') {
                position.refX = 8; // 相对默认中心点的位置， 默认中心点为图形中心位置
                position.refY = 0;
                position.path = 'M5,0L0,-7L16,0L0,7';
            } else if (this.type === 'start') {
                position.refX = -4;
                position.refY = 0;
                position.path = 'M0,0L16,-7L11,0L16,7';
            } else if (this.type === 'end') {
                position.refX = 20;
                position.refY = 0;
                position.path = 'M5,0L0,-7L16,0L0,7';
            }
            return position;
        }
    }
};
</script>

<style>
</style>
