/** 项目 任务类型 (kind =>类型描述) */
export const TASK_KIND = {
    0: 'SPARK',
    1: 'PYTHON',
    2: 'TENSORFLOW',
    3: 'TENSORFLOW_DIST',
    4: 'TENSORBOARD',
    5: 'SKYFLOW',
    6: 'DATASET_SERVICE',
    7: 'JUPYTER',
    8: 'H2O',
    9: 'NVIDIA_DIGITS',
    10: 'TENSORFLOW_AUTO_DIST',
    11: 'TENSORFLOW_SERVING',
    12: 'SPARK_SERVING',
    13: 'PMML_SERVING',
    14: 'CONTAINER_DEV',
    15: 'SKYFLOW_SERVICE'
};

/** 项目 任务类型字典 (类型描述 =>kind) */
export const TASK_KIND_DICT = {
    SPARK: 0,
    PYTHON: 1,
    TENSORFLOW: 2,
    TENSORFLOW_DIST: 3,
    TENSORBOARD: 4,
    SKYFLOW: 5,
    DATASET_SERVICE: 6,
    JUPYTER: 7,
    H2O: 8,
    NVIDIA_DIGITS: 9,
    TENSORFLOW_AUTO_DIST: 10,
    TENSORFLOW_SERVING: 11,
    SPARK_SERVING: 12,
    PMML_SERVING: 13,
    CONTAINER_DEV: 14,
    SKYFLOW_SERVICE: 15
};

/** 镜像管理 镜像类型 (kind => 类型描述) */
export const DOCKER_IMAGE_KIND = {
    1: 'H2O',
    2: 'JUPYTER',
    3: 'NVIDIA_DIGITS',
    4: 'PYTHON',
    5: 'SPARK',
    6: 'TENSORFLOW',
    // 7: 'TF_SERVING',
    11: 'TENSORFLOW_SERVING',
    12: 'SPARK_SERVING',
    13: 'PMML_SERVING',
    14: 'OTHERS'
};

/** 镜像管理 镜像类型字典 (类型描述 => kind) */
export const DOCKER_IMAGE_KIND_DICT = {
    H2O: 1,
    JUPYTER: 2,
    NVIDIA_DIGITS: 3,
    PYTHON: 4,
    SPARK: 5,
    TENSORFLOW: 6,
    // TF_SERVING: 7,
    TENSORFLOW_SERVING: 11,
    SPARK_SERVING: 12,
    PMML_SERVING: 13,
    CONTAINER_DEV: 14,
    OTHERS: 15
};
/** 镜像管理 安装包 源类型 */
export const SOURCE_TYPES = ['pip', 'conda'];

/** 镜像管理 镜像可进行的操作 删除/拷贝/包详情/编辑 */
export const IMAGE_ALLOW_OPERATIONS = {
    REMOVE: 'remove',
    EXTEND: 'extend',
    DETAIL: 'detail',
    EDIT: 'edit'
};
/** 镜像管理 镜像builder可进行的操作 */
export const IMAGE_BUILDER_ALLOW_OPERATIONS = {
    REMOVE: 'remove',
    DETAIL: 'detail',
    BUILD: 'build',
    LOG: 'log',
    EDIT: 'edit',
    DIFF: 'diff'
};

/**
 * 镜像管理 镜像builder 的状态字典
 * CREATED = 1
 * BUILDING = 2
 * BUILDED = 3
 * UPLOADING = 4
 * FAILED = 5
 * FINISHED = 6
 */
export const IMAGE_BUILDER_STATE_DICT = {
    CREATED: 1,
    BUILDING: 2,
    BUILDED: 3,
    UPLOADING: 4,
    FAILED: 5,
    FINISHED: 6
};

/**
 * 镜像管理 镜像builder 的状态 state
 * CREATED = 1
 * BUILDING = 2
 * BUILDED = 3
 * UPLOADING = 4
 * FAILED = 5
 * FINISHED = 6
 */
export const IMAGE_BUILDER_STATE = {
    1: {
        value: 1,
        label: '新建'
    },
    2: {
        value: 2,
        label: '创建中'
    },
    3: {
        value: 3,
        label: '创建完成',
        tagType: 'success'
    },
    4: {
        value: 4,
        label: '上传中'
    },
    5: {
        value: 5,
        label: '失败',
        tagType: 'danger'
    },
    6: {
        value: 6,
        label: '已完成',
        tagType: 'success'
    }
};

/**
 * 镜像管理 镜像builder 的状态列表 state
 * CREATED = 1
 * BUILDING = 2
 * BUILDED = 3
 * UPLOADING = 4
 * FAILED = 5
 * FINISHED = 6
 */
export const IMAGE_BUILDER_STATE_LIST = [{
    value: 1,
    label: '新建'
},
{
    value: 2,
    label: '创建中'
},
{
    value: 3,
    label: '创建完成',
    tagType: 'success'
},
{
    value: 4,
    label: '上传中'
},
{
    value: 5,
    label: '失败',
    tagType: 'danger'
},
{
    value: 6,
    label: '已完成',
    tagType: 'success'
}
];

/**
 * package 安装URL类型
 */
export const SOURCE_TYPE_URL_KIND = {
    DEFAULT: 1,
    USER_DEFINE: 2,
    SELECTED: 3
};

/**
 * package的升级类型
 */
export const VERSION_KIND = {
    USER_DEFINE: 1,
    TO_LATEST: 2
};

/**
 * 模型版本对应的维护状态
 */
export const VERSION_OPERATIONS = {
    ACTIVATED: 'start',
    DEACTIVATED: 'kill',
    TEST: 'test',
    EDIT: 'edit',
    DELETE: 'remove',
    DETAIL: 'detail'
};

/**
 * 平台相关(项目/任务/镜像...)权限列表
 */
export const PLATFORM_AUTHORITY_LIST = [{
    label: '组内',
    value: 1
}, {
    label: '私有',
    value: 2
}, {
    label: '公共',
    value: 3
}];

/**
 * 镜像来源列表
 */
export const IMAGE_SOURCE_LIST = [{
    label: '基础镜像',
    value: 1
},
{
    label: '自定义镜像',
    value: 2
}
];

/**
 * 镜像构建方式列表
 */
export const IMAGE_BUILD_KIND_LIST = [{
    label: '基础镜像',
    value: 1
}, {
    label: '在线构建',
    value: 2
}, {
    label: '基于tar构建',
    value: 3
}, {
    label: '基于DockerFile构建',
    value: 4
}, {
    label: '任务转存',
    value: 5
}];

/**
 * 镜像种类列表
 */
export const DOCKER_IMAGE_KIND_LIST = [{
    label: 'H2O',
    value: 1
}, {
    label: 'JUPYTER',
    value: 2
}, {
    label: 'NVIDIA_DIGITS',
    value: 3
}, {
    label: 'PYTHON',
    value: 4
}, {
    label: 'SPARK',
    value: 5
}, {
    label: 'TENSORFLOW',
    value: 6
}, {
    label: 'TENSORFLOW_SERVING',
    value: 11
}, {
    label: 'SPARK_SERVING',
    value: 12
}, {
    label: 'PMML_SERVING',
    value: 13
}, {
    label: 'OTHERS',
    value: 14
}];

/**
 * 任务状态类型
 */
export const TASK_STATUS_MAP = [{
    label: '新建',
    name: 'created',
    id: 0
},
{
    label: '启动中',
    name: 'launching',
    id: 1
},
{
    label: '启动异常',
    name: 'launch_abnormal',
    id: 2
},
{
    label: '运行中',
    name: 'running',
    id: 3
},
{
    label: '已完成',
    name: 'finished',
    id: 4
},
{
    label: '已终止',
    name: 'killed',
    id: 5
},
{
    label: '失败',
    name: 'failed',
    id: 6
},
{
    label: '终止中',
    name: 'killing',
    id: 7
}
];
