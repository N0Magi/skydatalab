<template>
    <component
        :current-schema="currentSchema"
        :param="handledParam"
        :val-obj="valObj"
        :required="required"
        v-model="valObj[param.name]"
        :input-type="param.ptype"
        :param-input-type="param.paramInputType === 'textarea' ? 'textarea' : 'text'"
        :is="comp"
        :is-editable="isEditable"
    />
</template>
<script>
import baseMixins from './editorBaseMixins';
import * as paramsEditors from '../paramsEditors';
export default {
    name: 'CommonInputParamBean',
    mixins: [baseMixins],
    components: {
        ...paramsEditors
    },
    data() {
        return {
            handledParam: Object.assign({}, this.param)
        };
    },
    computed: {
        comp() {
            if (this.param.ptype === 'String' || this.param.ptype === '') {
                return 'TextParamBean';
            } else if (['Double', 'Integer', 'Float', 'Number'].indexOf(this.param.ptype) >= 0) {
                return 'TextParamBean';
            } else if (this.param.ptype === 'DateTime') {
                return 'DateTimeParamBean';
            } else if (this.param.ptype === 'Boolean') {
                this.handledParam = {
                    ...this.handledParam,
                    ...{
                        possibleValues: [
                            {
                                label: '是',
                                value: true
                            },
                            {
                                label: '否',
                                value: false
                            }
                        ]
                    }
                };
                return 'OptionParamBean';
            } else {
                return 'TextParamBean';
            }
        }
    },
    watch: {
        param(val) {
            this.handledParam = Object.assign({}, val);
        }
    }
};
</script>
<style>
</style>
