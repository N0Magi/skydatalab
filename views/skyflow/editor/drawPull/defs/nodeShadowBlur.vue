<template>
    <filter :id="id">
        <feGaussianBlur
            in="SourceGraphic"
            std-deviation="3"
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
