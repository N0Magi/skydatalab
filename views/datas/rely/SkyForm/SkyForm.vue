<script>
import * as FormInputWidgets from './InputWidgets';
import { InputWidgetMap } from './InputWidgets/SkyFormWidgetInputTypeMap';
import FormTip from './FormTip';

export default {
    name: 'SkyForm',
    components: {
        ...FormInputWidgets
    },
    data() {
        return {
            InputWidgetMap,
            eventEmitTimerMap: {}
        };
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
        }
    },
    computed: {
        model() {
            let temp = {};
            this.list.forEach(item => {
                temp[item.prop] = item.value;
            });
            return temp;
        },
        rules() {
            let temp = {};
            this.list.forEach(item => {
                temp[item.prop] = item.validator;
            });
            return temp;
        }
    },
    methods: {
        // pass
    },
    render(h) {
        const {
            model,
            rules,
            list,
            readonly,
            inline,
            labelWidth,
            labelPosition,
            InputWidgetMap
        } = this;
        /**
         * 转换function类型参数为原始参数
         */
        const parseParamsFnToPrimitive = (param: any, model: Object, prop: string, ctx: Object = undefined): any => {
            if (typeof param === 'function') {
                if (ctx) {
                    return param.call(ctx, model, prop);
                } else {
                    return param(model, prop);
                }
            } else {
                return param;
            }
        };
        return (
            <div class="sky-form">
                <ElForm
                    ref="skyForm"
                    inline={inline}
                    rules={rules}
                    // 直接写model={model}不行，ElForm中接收到的model一直是undefined，改成这种写法才生效。
                    // 难道是model有什么特殊用途？
                    {...{ attrs: { model } }}
                    label-width={labelWidth}
                    label-position={labelPosition}
                    validate-on-rule-change={false}
                    statusIcon={true}
                    vOn:input={() => undefined}
                >
                    {list
                        .filter(item => (typeof item.renderIgnore === 'function' ? !item.renderIgnore(model) : !item.renderIgnore))
                        .map((item, index) => {
                            const { label, labelTip, prop, editable, value, inputType, vNode, hide, tooltip, tooltipVisible, widgetParams, formatter, options } = item;
                            let isHidden: boolean = parseParamsFnToPrimitive(hide, model, prop),
                                syncInputType: string = parseParamsFnToPrimitive(inputType, model, prop),
                                syncTooltipVisible: boolean = parseParamsFnToPrimitive(tooltipVisible, model, prop),
                                formItemLabel: string = parseParamsFnToPrimitive(label, model, prop),
                                formItemOptions: any = parseParamsFnToPrimitive(options, model, prop, item);
                            let parsedWidgetParams: Object = parseParamsFnToPrimitive(widgetParams, model, prop);
                            const formattedVal = (formatter && typeof formatter === 'function') ? formatter(value, model) : value;
                            const isReadonly = readonly || !editable;
                            const InputComp = InputWidgetMap[syncInputType];
                            const InputCompParams = {
                                ...item, ...{
                                    inputType: syncInputType,
                                    tooltipVisible: syncTooltipVisible,
                                    options: formItemOptions
                                }
                            };
                            return (
                                <ElFormItem
                                    key={index}
                                    label={formItemLabel}
                                    prop={prop}
                                    vShow={!isHidden}
                                    class={isReadonly ? 'form-item-readonly' : ''}
                                >
                                    <span class="form-item-label-slot" slot="label">
                                        {formItemLabel}
                                        {labelTip ? (
                                            <ElPopover
                                                popper-class="form-tip-popover"
                                                ref="labelTipPopover"
                                                trigger="hover"
                                                placement="top-start"
                                            >
                                                {typeof labelTip === 'function' ? labelTip.call(item, h, model) : labelTip}
                                                <i slot="reference" class="iconfont icon-information" />
                                            </ElPopover>) : ''}
                                    </span>
                                    <div class="form-inner">
                                        {isReadonly ? (label ? <span class="value-text">{formattedVal || '暂无数据'}</span> : '') : (
                                            vNode ? (vNode.call(item, h, model) ? vNode.call(item, h, model) : (
                                                <InputComp
                                                    {...{ attrs: { ...InputCompParams, ...parsedWidgetParams } }}
                                                    vModel={item.value}
                                                />)) : (
                                                <InputComp
                                                    {...{ attrs: { ...InputCompParams, ...parsedWidgetParams } }}
                                                    vModel={item.value}
                                                />)
                                        )}
                                        {syncTooltipVisible && !isReadonly && (<FormTip>{tooltip}</FormTip>)}
                                    </div>
                                </ElFormItem>
                            );
                        })}
                    {this.$slots.default}
                </ElForm>
            </div>
        );
    },
    updated() {
        this.$refs.skyForm.clearValidate();
    },
    watch: {
        model: {
            deep: true,
            handler(val, oldVal) {
                Object.keys(val).forEach(item => {
                    if (val[item] !== oldVal[item]) {
                        clearTimeout(this.eventEmitTimerMap[item]);
                        this.eventEmitTimerMap[item] = setTimeout(() => {
                            this.$emit('model-change', item, val);
                            clearTimeout(this.eventEmitTimerMap[item]);
                            delete this.eventEmitTimerMap[item];
                        }, 200);
                    }
                });
            }
        }
    },
    beforeDestroy() {
        Object.keys(this.eventEmitTimerMap).forEach(item => {
            clearTimeout(this.eventEmitTimerMap[item]);
            delete this.eventEmitTimerMap[item];
        });
    }
};
</script>

<style lang="scss" scoped>
    .sky-form {
        width: 100%;
        /*.form-item-readonly {*/
            /*line-height: 1.2;*/
            /*& /deep/ {*/
                /*.el-form-item__label, .el-form-item__content {*/
                    /*line-height: 1.2;*/
                /*}*/
            /*}*/
        /*}*/
        .value-text {
            line-height: 1.2;
            word-break: break-all;
            display: inline-block;
        }
        .form-item-label-slot {
            position: relative;
            .iconfont {
                position: absolute;
                right: -14px;
                top: 3px;
                font-size: 12px;
                line-height: 0;
                cursor: pointer;
            }
        }
        .form-inner {
            padding-left: 15px;
        }
        & /deep/ .el-form-item__error {
            padding-left: 15px;
        }
    }
</style>
<style lang="scss">
    .form-tip-popover.el-popover {
        background: rgba(0,0,0,.5);
        color: #fff;
        padding: 5px 10px;
        border-radius: 5px;
        &[x-placement^=bottom] .popper__arrow {
            &:after {
                border-bottom-color: rgba(0,0,0,0.4) !important;
            }
        }
        &[x-placement^=top] .popper__arrow {
            &:after {
                border-top-color: rgba(0,0,0,0.4) !important;
            }
        }
        &[x-placement^=left] .popper__arrow {
            &:after {
                border-left-color: rgba(0,0,0,0.4) !important;
            }
        }
        &[x-placement^=right] .popper__arrow {
            &:after {
                border-right-color: rgba(0,0,0,0.4) !important;
            }
        }
    }
</style>
