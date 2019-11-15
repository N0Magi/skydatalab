export default {
    steps: {
        STRUCT: [
            {
                index: 1,
                title: '基本信息'
            },
            {
                index: 2,
                title: '选择DataSource'
            },
            {
                index: 3,
                title: '选择数据服务'
            },
            {
                index: 4,
                title: '数据资源配置'
            },
            {
                index: 5,
                title: '数据预处理'
            },
            {
                index: 6,
                title: '数据保存'
            }
        ],
        NON_STRUCT: [
            {
                index: 1,
                title: '基本信息'
            },
            {
                index: 2,
                title: '选择DataSource'
            },
            {
                index: 3,
                title: '数据保存'
            }
        ]
    },
    stepCompMap: {
        STRUCT: ['StepBaseInfo', 'StepChooseDataSource', 'StepChooseDataService',
            'StepDataSetting', 'StepDataPreprocessing', 'StepDataSave'],
        NON_STRUCT: ['StepBaseInfo', 'StepChooseDataSource',
            'StepDataSave']
    }
};

export const schemaColumnTypes = ['bigint', 'binary', 'boolean', 'date', 'decimal',
    'double', 'float', 'int', 'string', 'timestamp', 'tinyint'];

export const canTransformTypesMap = {
    integer: ['date', 'string'],
    int: ['date', 'string'],
    bigint: ['date', 'string'],
    string: ['bigint', 'date', 'double', 'int', 'timestamp'],
    timestamp: ['string'],
    double: ['string'],
    date: ['string', 'timestamp'],
    binary: [],
    boolean: [],
    decimal: ['float', 'string', 'int', 'double'],
    float: ['string', 'int', 'double'],
    tinyint: ['date', 'string']
};

export const dataFileTypes = ['CSV', 'TEXT', 'JSON', 'ORC', 'PARQUET'];

// 文件类型后缀映射
export const dataFileTypeExt = {
    CSV: '.csv',
    TEXT: '.txt',
    JSON: '.json',
    ORC: '.orc',
    PARQUET: '.parquet'
};
export const dataTypes = [...dataFileTypes, 'JDBC'];
export const CSV_FILE_SPLITOR = [
    {
        label: '无',
        value: ''
    }, {
        label: ',',
        value: ','
    }, {
        label: ';',
        value: ';'
    }, {
        label: '空格',
        value: ' '
    }, {
        label: '制表符',
        value: '\t'
    }
];

export const nonStructFileTypes = ['AVRO', 'CSV', 'JSON', 'ORC', 'PARQUET'];

export const fileTypeMap = {
    0: 'LOCAL',
    1: 'FILESYSTEM',
    2: 'HDFS',
    3: 'DATABASE'
};

export const samplingTypeMap = {
    topN: 'FIRST_N',
    lastN: 'TAIL_N',
    randomNum: 'RANDOM_N',
    randomPercent: 'RANDOM_PERCENT'
};

export const SAVE_TYPE_OPTIONS = [
    // {
    //     label: 'Append（如果已存在，追加在原来的数据集之后）',
    //     value: 'Append'
    // },
    {
        label: 'Overwrite（如果已存在，覆盖原来的数据集）',
        value: 'Overwrite'
    },
    {
        label: 'ErrorIfExists（如果已存在，则会报错）',
        value: 'ErrorIfExists'
    },
    {
        label: 'Ignore（如果已存在，则忽略本次的保存）',
        value: 'Ignore'
    }
];

export const shareKindMap = {
    1: 2,
    2: 1,
    3: 3
};

export const NUMBER_TYPES = ['byte', 'short', 'int', 'integer', 'long', 'float', 'double', 'decimal'];
export const STRING_TYPES = ['string'];

export const DRIVER_CLASSES = ['org.postgresql.Driver', 'com.mysql.jdbc.Driver', 'com.microsoft.sqlserver.jdbc.SQLServerDriver'/** , 'oracle.jdbc.OracleDriver'*/];

export const NUMBER_COUNT = ['Minimum', 'Maximum', 'Mean', 'Std Dev', 'Variance', 'Sum'];
export const STRING_COUNT = ['countDistinct'];

export const DATA_SOURCE_OPTIONS = [
    {
        label: '平台文件系统',
        value: '1',
        options: '/v2/datasource/options?kind=FILESYSTEM'
    },
    {
        label: 'HDFS',
        value: '2',
        options: '/v2/datasource/options?kind=HDFS'
    },
    {
        label: 'SQL DataBase',
        value: '3',
        options: '/v2/datasource/options?kind=SQL_DATABASE'
    },
    {
        label: 'Hive',
        value: '4',
        disabled: true
    },
    {
        label: 'NoSQL',
        value: '5',
        disabled: true
    }
];

export const SOURCE_SYSTEM_MAP = {
    FILESYSTEM: '1',
    HDFS: '2',
    SQL_DATABASE: '3',
    HIVE: '4',
    NOSQL: '5'
};

export const FILE_TYPES = ['CSV', 'TXT', 'JSON', 'ORC', 'PARQUET', 'OTHER'];
export const DATA_FORMAT_MAP = {
    CSV: 'CSV',
    TXT: 'TEXT',
    JSON: 'JSON',
    ORC: 'ORC',
    PARQUET: 'PARQUET',
    OTHER: 'OTHER'
};
export const QUOTE = [
    {
        label: '无',
        value: ''
    },
    {
        label: '"',
        value: '"'
    }
];
export const ESCAPE = [
    {
        label: '无',
        value: ''
    },
    {
        label: '\\',
        value: '\\'
    }
];
export const CHARSET = [
    {
        label: 'UTF-8',
        value: 'UTF-8'
    },
    {
        label: 'GB2312',
        value: 'GB2312'
    }
];
