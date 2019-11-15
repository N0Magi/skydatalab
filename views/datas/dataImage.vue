<template>
    <div class="data-image">
        <img
            v-if="isIcon"
            :style="{'width': imageWidth, 'height': imageWidth , 'padding-top': '0px' }"
            :src="imageUrl"
        >
        <img
            v-else
            :style="{ 'padding-top': '20px'}"
            :src="imageUrl"
        >
    </div>
</template>
<script>

export default {
    name: 'DataImage',
    props: {
        imageUrl: {
            type: String,
            default: ''
        },
        imageWidth: {
            type: String,
            default: '22%'
        },
        isIcon: {
            type: Boolean,
            default: false
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.data-image {
    text-align: center;
}
</style>
