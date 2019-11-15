export default {
    props: {
        value: {
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        inputType: {
            type: [String, Function],
            default: 'INPUT'
        }
    },
    computed: {
        inputModel: {
            get() {
                return this.value;
            },
            set(value: string) {
                this.$emit('input', value);
            }
        }
    }
};
