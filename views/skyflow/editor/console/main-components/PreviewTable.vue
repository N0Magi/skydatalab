<template>
    <div class="preview-table">
        <DataSetPreview
            :data="data"
            ref="previewTable"
            :columns="columns"
            height="100%"
            :readonly="true"
            :show-data-type-icon="false"
        />
    </div>
</template>
<script>
import DataSetPreview from '../../../components/dataset/DataSetPreview';
export default {
    name: 'PreviewTable',
    components: { DataSetPreview },
    data() {
        return {};
    },
    props: {
        data: {
            type: Array,
            default() {
                return [];
            }
        },
        columns: {
            type: Array,
            default() {
                return [];
            }
        }
    }
};
</script>
<style lang="scss">
.preview-table{
    border: 1px solid #dedede;
    height: calc(100% - 33px);
    width: 100%;
}

</style>
