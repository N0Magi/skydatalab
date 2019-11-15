import ParamsPanel from '../ParamsPanel';
export default {
    components: {
        ParamsPanel
    },
    props: {
        rules: {
            type: Object,
            default() {
                return {};
            }
        },
        componentOptions: {
            type: Array,
            default() {
                return [];
            }
        },
        params: {
            type: Object,
            default() {
                return {};
            }
        },
        compType: {
            type: [Object, String],
            default() {
                return {};
            }
        },
        runtimeTypes: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    computed: {
        form: {
            get() {
                return this.params;
            },
            set(val) {
                this.$emit('update:params', val);
            }
        }
    },
    methods: {
        validate() {
            // 组件通用校验函数，如果不止是表单校验，可以在各组件中重写
            return this.$refs.compForm.validate();
        }
    }
};
