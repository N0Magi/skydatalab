/* @flow
<template>
    <div
        class="sky-form-panel"
        :class="{'has-footer': !readonly && !inline && appendFooter}"
    >
        <SkyForm
            @model-change="onModelChange"
            ref="form"
            :list="list"
            :readonly="readonly"
            :inline="inline"
            :label-position="labelPosition"
            :label-width="labelWidth"
        >
            <template>
                <slot name="formItems" />
            </template>
        </SkyForm>
        <slot :scope="{ model, $skyForm }" />
        <SkyFormFooter
            v-if="!readonly && !inline && appendFooter"
            @confirm="formConfirm"
            @cancel="formCancel"
            @reset="formReset"
        />
    </div>
</template>
*/
// <!--eslint-disable-next-line-->
// <script>
import SkyForm from './SkyForm';
import SkyFormFooter from './SkyFormFooter';
export default {
    name: 'Index',
    components: {
        SkyFormFooter,
        SkyForm
    },
    props: {
        list: {
            default() {
                return [];
            },
            type: Array,
            required: true
        },
        readonly: {
            type: Boolean,
            default: false
        },
        inline: {
            type: Boolean,
            default: false
        },
        labelWidth: {
            type: String,
            default: '100px'
        },
        labelPosition: {
            type: String,
            default: 'right'
        },
        appendFooter: {
            type: Boolean,
            default: false
        },
        onConfirm: {
            type: Function,
            default() {
                return () => undefined;
            }
        },
        onCancel: {
            type: Function,
            default: undefined
        },
        onReset: {
            type: Function,
            default: undefined
        }
    },
    data() {
        return {};
    },
    computed: {
        $skyForm() {
            return this.$refs.form && this.$refs.form.$refs.skyForm;
        },
        model() {
            return this.$refs.form && this.$refs.form.model;
        }
    },
    methods: {
        getSkyForm() {
            return this.$refs.form && this.$refs.form.$refs.skyForm;
        },
        getModel() {
            return this.$refs.form && this.$refs.form.model;
        },
        formConfirm() {
            this.validate().then(() => {
                this.onConfirm(this.getModel());
            });
        },
        formCancel() {
            if (this.onCancel) {
                this.onCancel();
            } else {
                this.$router.go(-1);
            }
        },
        /**
         * 表单重置方法，相较于ElForm的表单重置，对用户通过slot插入表单的部分也进行了重置并同步到model
         */
        formReset() {
            let resetForm = this.model;
            this.getSkyForm().resetFields();
            if (this.$parent) {
                resetForm = this.$parent.formData.resetForm();
            }
            if (this.onReset && typeof this.onReset === 'function') {
                this.onReset(resetForm);
            }
        },
        /**
         * 模型改变时，触发model-change事件
         * 但此事件触发比较频繁，慎用！
         */
        onModelChange(key: string, model: Object) {
            this.$emit('model-change', key, model);
        },
        /**
         * 过滤掉隐藏的表单项和忽略的表单项不参与校验
         * 对表单进行校验时，请使用此方法。
         * 如果用ElForm的validate方法会导致隐藏的部分参与校验，使校验无法通过
         * @returns {Promise<any[]>}
         */
        validate(): Promise<any> {
            let needValidateFields = this.list.filter(item => (typeof item.hide === 'boolean' ? !item.hide : !item.hide(this.getModel(), item.prop))
                && (typeof item.renderIgnore === 'boolean' ? !item.renderIgnore : !item.renderIgnore(this.getModel(), item.prop)) && item.prop !== '').map(item => item.prop);
            let _resolve, _reject;
            const promise: Promise<any> = new Promise((resolve, reject) => {
                _resolve = resolve;
                _reject = reject;
            });
            this.validateFields(needValidateFields).then(_resolve, _reject);
            return promise;
        },
        validateFields(props: Array<string> | string): Promise<any> {
            const promise = new Promise((resolve: Function, reject: Function) => {
                let validatedCount = 0;
                let valid = true;
                if (typeof props === 'string') {
                    props = [props];
                }
                props.forEach((item: string) => {
                    this.getSkyForm().validateField(item, (msg: string) => {
                        if (msg) {
                            valid = false;
                        }
                        validatedCount++;
                        if (validatedCount >= props.length) {
                            valid ? resolve(valid) : reject(valid);
                        }
                    });
                });
            });
            return promise;
        }
    },
    mounted() {
        // pass
    },
    updated() {
        // pass
    }
};
// </script>

/*
<style lang="scss" scoped>
    .sky-form-panel {
        position: relative;
        font-size: 14px;
        &.has-footer {
            padding-bottom: 62px;
        }
        & /deep/ {
            .sky-form-footer {
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
            }
            .sky-form {
                padding: 0 20px;
            }
        }
    }
</style>
*/
