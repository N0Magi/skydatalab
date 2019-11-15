<template>
    <el-form-item class="setting-option">
        <el-tooltip
            v-if="param.tooltips"
            :content="param.tooltips"
            placement="bottom"
        >
            <span class="tip">
                <i v-if="required">
                    *
                </i> {{ param.label }}
            </span>
        </el-tooltip>
        <span
            class="tip"
            v-if="!param.tooltips"
        >
            <i v-if="required">
                *
            </i> {{ param.label }}
        </span>
        <el-select
            v-model="localVal"
            :multiple="param.multiple"
            placeholder="请选择"
            size="small"
            :disabled="!isEditable || !param.trainEditable"
        >
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
        </el-select>
    </el-form-item>
</template>
<script>
import baseMixins from './editorBaseMixins';
import fetch from 'utils/fetch';
// import { mapState } from 'vuex';
import { fetchDbTablesBySource } from '../../../../../datas/rely/dataSourceApi';
export default {
    mixins: [baseMixins],
    data() {
        return {
            options: []
        };
    },
    // computed: {
    //     ...mapState({
    //         roleName: state => state.user.role.name
    //     })
    // },
    watch: {
        'param.possibleValues': {
            immediate: true,
            handler(val) {
                if (this.param.name === 'get_table_name') {
                    fetchDbTablesBySource(this.param.id).then(data => {
                        let arr = [];
                        let res = data.data;
                        for (let i = 0; i < res.table_name.length; i++) {
                            arr.push({ value: res.table_name[i], label: res.table_name[i] });
                        }
                        this.options = arr;
                    }).catch(() => {
                        this.options = [];
                    });
                } else if (typeof val === 'string') {
                    fetch.get(val).then(res => {
                        this.options = res.data;
                    });
                } else if (Array.isArray(val)) {
                    if (this.param.dependence) {
                        let itemTypeObj = this.currentSchema.find(
                            item => item.cname === this.valObj[this.param.dependence]
                        );
                        let itemType = itemTypeObj ? itemTypeObj.ctype : '';
                        return this.param.possibleValues.filter(item =>
                            item.accept && item.accept.includes(itemType) || false
                        );
                    } else {
                        this.options = val.slice();
                        // if (this.roleName !== 'admin') {
                        //     this.options = this.options.filter(item => item.label !== '公共');
                        // } else {
                        //     this.options;
                        // }
                    }
                } else {
                    this.options = [];
                }
            }
        }
    },
    mounted() {
        if (this.param.dependence) {
            this.unwatch = this.$watch('valObj', obj => {
                if (obj[this.param.dependence]) {
                    let itemTypeObj = this.currentSchema.find(
                        item => item.cname === obj[this.param.dependence]
                    );
                    let itemType = itemTypeObj ? itemTypeObj.ctype : '';
                    this.options = this.param.possibleValues.filter(item =>
                        item.accept && item.accept.includes(itemType) || false
                    );
                } else {
                    this.options = [];
                }
            }, { deep: true });
        }
    },
    beforeDestroy() {
        this.unwatch && this.unwatch();
    }
};
</script>
<style lang='scss'>

</style>
