/* @flow
<template>
    <div class="sky-form-widget-swicth">
        <ElSwitch
            v-model="inputModel"
            :disabled="$attrs.disabled"
            :width="$attrs.width"
        />
    </div>
</template>
*/
// <!--eslint-disable-next-line-->
// <script>
import SkyFormWidgetMixin from './SkyFormWidgetMixin';
export default {
    name: 'SkyFormWidgetSwitch',
    mixins: [SkyFormWidgetMixin],
    data() {
        return {};
    },
    computed: {

    }
};
// </script>

/*
<style lang="scss" scoped>

</style>
*/
