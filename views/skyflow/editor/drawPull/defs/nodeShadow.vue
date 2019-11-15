<template>
    <filter
        :id="id"
        x="0"
        y="0"
        width="105%"
        height="120%"
    >
        <feOffset
            result="offOut"
            in="SourceGraphic"
            dx="2"
            dy="2"
        />
        <feColorMatrix
            result="matrixOut"
            in="offOut"
            type="matrix"
            values="
                    0.5 0 0 0 0
                    0 0.5 0 0 0
                    0 0 0.5 0 0
                    0 0 0 0.5 0"
        />
        <feGaussianBlur
            result="blurOut"
            in="matrixOut"
            std-deviation="3"
        />
        <feBlend
            in="SourceGraphic"
            in2="blurOut"
            mode="normal"
        />
    </filter>
</template>

<script>
export default {
    name: 'NodeShadow',
    props: {
        id: {
            type: String,
            required: true
        }
    }
};
</script>

<style>
</style>
