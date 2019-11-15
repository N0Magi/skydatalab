export default {
    data() {
        return {
            valFlag: false
        };
    },
    props: {
        param: {
            type: Object,
            default: null
        },
        value: {
            default: ''
        },
        currentSchema: {
            default: []
        },
        valObj: {
            type: Object,
            default: null
        },
        required: {
            type: Boolean,
            default: true
        },
        index: {
            type: Number
        },
        isEditable: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        localVal: {
            get() {
                return this.value;
            },
            set(nval) {
                this.$emit('input', nval);
            }
        }
    }
};
