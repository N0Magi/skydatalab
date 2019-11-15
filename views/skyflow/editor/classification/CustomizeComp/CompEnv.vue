<template>
    <el-form
        ref="compForm"
        label-width="100px"
        label-position="left"
        :rules="rules"
        :model="form"
    >
        <ParamsPanel title="运行环境">
            <el-form-item
                label="运行环境:"
                prop="runtime_id"
            >
                <el-select
                    v-model="form.runtime_id"
                    placeholder="请选择"
                    class="larger-size"
                    style="width:100%;"
                >
                    <el-option-group
                        v-for="group in runtimeTypes"
                        :key="group.name"
                        :label="group.name"
                    >
                        <el-option
                            v-for="item in group.children"
                            :key="item._id"
                            :label="item.name"
                            :value="item._id"
                        />
                    </el-option-group>
                </el-select>
            </el-form-item>
        </ParamsPanel>
        <ParamsPanel title="算法文件">
            <el-form-item
                label="执行文件:"
                prop="run_file"
            >
                <SdxwFileSelect
                    v-model="form.run_file"
                    source="all"
                    :limit="1"
                    :accept="(runEnvType && runEnvType.parent.name) === 'spark' ? '.jar' : '.py,.zip'"
                    :string-model="true"
                    check-type="file"
                    :prefix-owner="false"
                    :project-enable="false"
                    :private-enable="true"
                    :share-enable="false"
                />
            </el-form-item>
            <el-form-item
                label="主类:"
                prop="mainClass"
                v-if="runEnvType && runEnvType.parent.name === 'spark'"
            >
                <el-input
                    type="text"
                    v-model="form.mainClass"
                />
            </el-form-item>
        </ParamsPanel>
    </el-form>
</template>

<script>
import customizeCompMixin from './customizeCompMixin';
import FileSelect from '@sdx/widget/lib/file-select';
import { TASK_KIND_DICT } from '../../util/const';
export default {
    name: 'CompEnv',
    components: {
        [FileSelect.FileSelectMix.name]: FileSelect.FileSelectMix
    },
    mixins: [customizeCompMixin],
    data() {
        return {
            TASK_KIND_DICT
        };
    },
    computed: {
        runEnvType() {
            for (let i = 0, len = this.runtimeTypes.length; i < len; i++) {
                const child = this.runtimeTypes[i].children || [];
                for (let j = 0; j < child.length; j++) {
                    if (child[j]._id === this.form.runtime_id) {
                        return {
                            parent: this.runtimeTypes[i],
                            sub: child[j]
                        };
                    }
                }
            }
            return '';
        }
    },
    watch: {
        'form.runtime_id': {
            handler() {
                this.form.run_file = '';
            }
        }
    }
};
</script>

<style scoped>

</style>
