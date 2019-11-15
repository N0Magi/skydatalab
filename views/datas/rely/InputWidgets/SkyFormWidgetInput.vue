/* @flow
<template>
    <div class="sky-form-widget-input">
        <!--auto-complete="new-password"： 解决chrome自动填充账号密码表单的bug-->
        <el-input
            :type="renderInputType"
            v-model="inputModel"
            :placeholder="placeholder"
            :aria-checked="false"
            @change="onChange"
            @blur="onBlur"
            auto-complete="new-password"
        />
    </div>
</template>
*/
// <!--eslint-disable-next-line-->
// <script>
import SkyFormWidgetMixin from './SkyFormWidgetMixin';
const INPUT_TYPE_MAP = {
    INPUT: 'text',
    TEXTAREA: 'textarea',
    PASSWORD: 'password'
};
export default {
    name: 'SkyFormWidgetInput',
    mixins: [SkyFormWidgetMixin],
    data() {
        return {};
    },
    computed: {
        renderInputType() {
            return INPUT_TYPE_MAP[this.inputType];
        }
    },
    methods: {
        onChange() {
            let fn = this.$attrs.onChange || (() => ({}));
            fn(this.value);
        },
        onBlur() {
            let fn = this.$attrs.onBlur || (() => ({}));
            fn(this.value);
        }
    }
};
// </script>

/*
<style scoped>
</style>
*/
