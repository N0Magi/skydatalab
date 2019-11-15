<template>
    <linearGradient
        :id="id"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="0%"
    >
        <stop
            offset="0%"
            :stop-color="startColor"
        />
        <stop
            offset="100%"
            :stop-color="stopColor"
        />
    </linearGradient>
</template>

<script>
export default {
    name: 'Running',
    props: {
        id: {
            type: String,
            required: true
        },
        startColor: {
            type: String,
            default: '#459CDF'
        },
        stopColor: {
            type: String,
            default: '#459CDF'
        }
    }
};
</script>

<style>
</style>
