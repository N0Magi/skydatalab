/* @flow
<template>
    <div class="sky-form-widget-datetime">
        <el-date-picker
            v-model="inputModel"
            :type="type"
            :placeholder="placeholder"
            value-format="yyyy-MM-dd"
        />
    </div>
</template>
*/
// <!--eslint-disable-next-line-->
// <script>
import SkyFormWidgetMixin from './SkyFormWidgetMixin';
export default {
    name: 'SkyFormWidgetDateTime',
    mixins: [SkyFormWidgetMixin],
    data() {
        return {};
    },
    props: {
        type: {
            default: 'datetime',
            type: String
        }
    }
};
// </script>

/*
<style scoped>

</style>
*/
