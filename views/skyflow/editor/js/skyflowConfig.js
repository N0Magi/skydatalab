export const stepOperation = [{
    label: '撤销',
    icon: 'sf-back',
    name: 'back'
}, {
    label: '恢复',
    icon: 'sf-forward',
    name: 'forward'
}];

export const saveOperation = [{
    label: '保存',
    icon: 'sf-save',
    name: 'save'
}, {
    label: '另存为',
    icon: 'sf-saveas',
    name: 'save-as'
}, {
    label: '清除',
    icon: 'sf-qingchu',
    name: 'clear'
}];

export const execOperation = [{
    label: '编辑画布',
    icon: 'sf-bianjihuabu',
    name: 'edit'
}, {
    label: '运行',
    icon: 'sf-yunxing',
    name: 'run'
}, {
    label: '停止',
    icon: 'sf-pause',
    name: 'stop'
}, {
    label: '恢复运行',
    icon: 'sf-huifuyunhang',
    name: 'resume'
}, {
    label: '定时运行',
    icon: 'sf-dingshiyunxing',
    name: 'timing'
}, {
    label: '执行设置',
    icon: 'sf-zhihangshezhi',
    name: 'exec-setting'
}, {
    label: '多实例设置',
    icon: 'sf-duoshilishezhi',
    name: 'muti-instance'
}, {
    label: '告警设置',
    icon: 'sf-gaojingshezhi',
    name: 'warning'
}, {
    label: '执行记录',
    icon: 'sf-zhihangjilu',
    name: 'record'
}];

export const viewOperation = [{
    label: '缩小',
    name: 'zoomin',
    icon: 'sf-jianhao'
}, {
    label: '缩放',
    name: 'zoom',
    icon: 'sf-fangdajingsvg'
}, {
    label: '放大',
    name: 'zoomout',
    icon: 'sf-jiahao'
}];

export const componentNav = [{
    label: '数据集',
    name: 'dataset',
    icon: 'sf-shujuji'
}, {
    label: '平台组件',
    name: 'platform',
    icon: 'sf-pingtaizujian'
}, {
    label: '自定义组件',
    name: 'custom',
    icon: 'sf-zidingyizujian'
}, {
    label: '公共组件',
    name: 'common',
    icon: 'sf-qitazujian'
}, {
    label: '收藏组件',
    name: 'favorite',
    icon: 'sf-wodeshoucang'
}, {
    label: '搜索',
    name: 'search',
    icon: 'sf-chazhao'
}];

export const componentType = [{
    label: '数据源',
    name: 'DataSource',
    level: 1
}, {
    label: '数据集',
    name: 'DataSet',
    level: 1
}, {
    label: '数据预处理',
    name: 'DataPreProcess',
    level: 1
}, {
    label: '二维表数据预处理',
    name: 'BivariateDataPreProcess',
    level: 2
}, {
    label: '自然语言数据预处理',
    name: 'NaturalLanguageDataPreProcess',
    level: 2
}, {
    label: '图像数据预处理',
    name: 'ImageDataPreProcess',
    level: 2
}, {
    label: '语言数据预处理',
    name: 'SpeechDataPreProcess',
    level: 2
}, {
    label: '其他',
    name: 'OtherDataPreProcess',
    level: 2
}, {
    label: '特征工程',
    name: 'FeatureEngineer',
    level: 1
}, {
    label: '二维表特征工程',
    name: 'BivariateFeatureEngineer',
    level: 2
}, {
    label: '自然语言特征工程',
    name: 'NaturalLanguageFeatureEngineer',
    level: 2
}, {
    label: '图像特征工程',
    name: 'ImageFeatureEngineer',
    level: 2
}, {
    label: '语音特征工程',
    name: 'SpeechFeatureEngineer',
    level: 2
}, {
    label: '其他',
    name: 'OtherFeatureEngineer',
    level: 2
}, {
    label: '机器学习/深度学习',
    name: 'MachineLearning',
    level: 1
}, {
    label: '异常检测',
    name: 'AnomalyDetection',
    level: 2
}, {
    label: '分类',
    name: 'Classification',
    level: 2
}, {
    label: '聚类',
    name: 'Cluster',
    level: 2
}, {
    label: '回归',
    name: 'Regression',
    level: 2
}, {
    label: '推荐',
    name: 'Recommend',
    level: 2
}, {
    label: '时序分析',
    name: 'TimeSeries',
    level: 2
}, {
    label: '文本分析',
    name: 'Text',
    level: 2
}, {
    label: '其他',
    name: 'OtherMachineLearning',
    level: 2
}, {
    label: '结果导出',
    name: 'ResultExport',
    level: 1
}, {
    label: '模型导出',
    name: 'ModelExport',
    level: 2
}, {
    label: '数据导出',
    name: 'DataExport',
    level: 2
}, {
    label: '结果评估',
    name: 'ResultEvaluator',
    level: 1
}, {
    label: '模型评估',
    name: 'ModelEvaluator',
    level: 2
}];

export const componentsIcon = [{
    //     label: '数据库数据源',
    //     name: 'DatabaseDataSource',
    //     icon: 'sf-shujuyuanzujian'
    // }, {
    //     label: '文件系统数据源',
    //     name: 'FileSystemDataSource',
    //     icon: 'sf-wenjianxitongshujuyuan'
    // }, {
    //     label: '数据表连接',
    //     name: 'TableJoinComp',
    //     icon: 'sf-shujubiaolianjie'
    // }, {
    //     label: '数据集选取',
    //     name: 'SelectComp',
    //     icon: 'sf-shujuxuanqu'
    // }, {
    //     label: '数据追加',
    //     name: 'AdditionComp',
    //     icon: 'sf-shujuzhuijia'
    // }, {
    //     label: '数据排序',
    //     name: 'DataSort',
    //     icon: 'sf-shujupaixu'
    // }, {
    //     label: '缺失值删除',
    //     name: 'DropMissingValuesComp',
    //     icon: 'sf-queshizhishanchu1'
    // }, {
    //     label: '缺失值填充',
    //     name: 'FillingMissingValues',
    //     icon: 'sf-queshizhitianchong'
    // }, {
    //     label: '数据拆分',
    //     name: 'SplitComp',
    //     icon: 'sf-shujuchaifen'
    // }, {
    //     label: '数据抽样',
    //     name: 'SampleComp',
    //     icon: 'sf-shujuchouyang'
    // }, {
    //     label: '数据类型转换',
    //     name: 'TypeConversionComp',
    //     icon: 'sf-shujuleixingzhuanhuan'
    // }, {
    //     label: '数据运算',
    //     name: 'NumericComputingComp',
    //     icon: 'sf-shujuyunsuan'
    // }, {
    //     label: '数据归一化',
    //     name: 'NormalizationComp',
    //     icon: 'sf-shujuguiyihua'
    // }, {
    //     label: '数据标准化',
    //     name: 'StandardComp',
    //     icon: 'sf-shujubiaozhunhua'
    // }, {
    //     label: '数据编码',
    //     name: 'StringIndexerComp',
    //     icon: 'sf-shujubianma'
    // }, {
    //     label: 'PCA',
    //     name: 'PCAComp',
    //     icon: 'sf-PCA'
    // }, {
    //     label: 'LDA',
    //     name: 'LDAComp',
    //     icon: 'sf-LDA'
    // }, {
    //     label: '数据集导出',
    //     name: 'DatasetExportComp',
    //     icon: 'sf-shujujidaochu'
    // }, {
    //     label: '监督学习标签选择',
    //     name: 'SupervisedLabelSelectorComp',
    //     icon: 'sf-jianduxuexibiaoqianxuanze'
    // }, {
    //     label: '聚类特征选择',
    //     name: 'ClusterFeatureSelectorComp',
    //     icon: 'sf-juleitezhengxuanze'
    // }, {
    //     label: 'K-Means',
    //     name: 'KMeansComp',
    //     icon: 'sf-K-meanjuleisuanfa'
    // }, {
    //     label: '线性SVC',
    //     name: 'LinearSVCComp',
    //     icon: 'sf-xianxingSVCsuanfa'
    // }, {
    //     label: '决策树分类',
    //     name: 'DecisionTreeClassifierComp',
    //     icon: 'sf-jueceshusuanfa'
    // }, {
    //     label: '随机森林分类',
    //     name: 'RandomForestClassifierComp',
    //     icon: 'sf-suijisenlinfenleisuanfa'
    // }, {
    //     label: '逻辑回归模型',
    //     name: 'LogisticRegressionComp',
    //     icon: 'sf-luojihuiguisuanfa1'
    // }, {
    //     label: '朴素贝叶斯分类模型',
    //     name: 'NaiveBayesComp',
    //     icon: 'sf-pusubeiyesifenleisuanfa'
    // }, {
    //     label: 'GBDT回归',
    //     name: 'GBTRegressorComp',
    //     icon: 'sf-GBDThuiguisuanfa'
    // }, {
    //     label: '广义线性回归',
    //     name: 'GeneralizedLinearRegressionComp',
    //     icon: 'sf-guangyixianxinghuigui'
    // }, {
    //     label: '加速失效回归模型',
    //     name: 'AFTSurvivalRegressionComp',
    //     icon: 'sf-jiasushixiao'
    // }, {
    //     label: '随机森林回归模型',
    //     name: 'RandomForestRegressorComp',
    //     icon: 'sf-suijisenlinhuiguisuanfa'
    // }, {
    //     label: '模型预测',
    //     name: 'ModelPredictorComp',
    //     icon: 'sf-moxingyuce'
    // }, {
    label: '模型导出',
    name: 'ModelExportComp',
    icon: 'sf-moxingdaochu'
}, {
    label: '数据导出',
    name: 'DataExportComp',
    icon: 'sf-shujudaochu'
}, {
    label: '模型评估',
    name: 'ModelEvaluatorComp',
    icon: 'sf-moxingpinggu'
}, {
    //     label: '回归模型评估',
    //     name: 'RegressionModelEvaluatorComp',
    //     icon: 'sf-huiguimoxingpinggu'
    // }, {
    //     label: '分类模型评估',
    //     name: 'ClassificationModelEvaluatorComp',
    //     icon: 'sf-fenleimoxingpinggu'
    // }, {
    label: '数据预处理-自定义',
    name: 'DataPreprocessCustomComp',
    icon: 'sf-shujuyuchuli'
}, {
    label: '特征工程-自定义',
    name: 'FeatureEngineerL2CustomComp',
    icon: 'sf-tezhenggongcheng'
}, {
    label: '异常检测-自定义',
    name: 'AnomalyDetectionCustomComp',
    icon: 'sf-jianceyichang'
}, {
    label: '分类-自定义',
    name: 'ClassificationCustomComp',
    icon: 'sf-fenlei'
}, {
    label: '聚类-自定义',
    name: 'ClusterCustomComp',
    icon: 'sf-julei'
}, {
    label: '回归-自定义',
    name: 'RegressionCustomComp',
    icon: 'sf-huigui'
}, {
    label: '推荐-自定义',
    name: 'RecommendCustomComp',
    icon: 'sf-tuijian'
}, {
    label: '时序分析-自定义',
    name: 'TimeSeriesCustomComp',
    icon: 'sf-shixufenxi'
}, {
    label: '文本分析-自定义',
    name: 'TextCustomComp',
    icon: 'sf-wenbenfenxi-zidingyi'
}, {
    label: '模型导出-自定义',
    name: 'ModelExportCustomComp',
    icon: 'sf-moxingdaochu-zidingyi'
}, {
    label: '数据导出-自定义',
    name: 'DataExportCustomComp',
    icon: 'sf-shujudaochu-zidingyi'
}, {
    label: '模型评估-自定义',
    name: 'ModelEvaluatorCustomComp',
    icon: 'sf-moxingdaochu-zidingyi'
}, {
    label: '公共数据集',
    name: 'PublicDataSet',
    icon: 'sf-gonggongshujuji'
}, {
    label: '组内数据集',
    name: 'GroupDataSet',
    icon: 'sf-zuneishujuji'
}, {
    label: '私有数据集',
    name: 'PrivateDataSet',
    icon: 'sf-siyoushujuji'
}, {
    label: '列删除',
    name: 'ColDeleteComp',
    icon: 'sf-lieshanchu'
}, {
    label: '数据过滤',
    name: 'DataFilterComp',
    icon: 'sf-guolv'
}, {
    label: '数据拆分',
    name: 'DataSplitComp',
    icon: 'sf-shujuchaifen'
}, {
    label: '类型转换',
    name: 'DataTransformComp',
    icon: 'sf-shujuleixingzhuanhuan'
}, {
    label: '数据排序',
    name: 'DataSortComp',
    icon: 'sf-shujupaixu'
}, {
    label: '数据去重',
    name: 'DataDeduplicationComp',
    icon: 'sf-quzhong'
}, {
    label: '特征抽取',
    name: 'FeatureSelectComp',
    icon: 'sf-tezhengxuanqu'
}, {
    label: '统计缺失',
    name: 'MissingStatComp',
    icon: 'sf-tongjiqueshi'
}, {
    label: '缺失填充',
    name: 'NanDealingComp',
    icon: 'sf-queshizhitianchong1'
}, {
    label: '随机采样',
    name: 'DataRandomSamplingComp',
    icon: 'sf-suijicaiyang1'
}, {
    label: '分层采样',
    name: 'DataStratifiedSamplingComp',
    icon: 'sf-fencengcaiyang'
}, {
    label: '行追加',
    name: 'RowDataAppendComp',
    icon: 'sf-hangzhuijia'
}, {
    label: '列追加',
    name: 'ColDataAppendComp',
    icon: 'sf-liezhuijia'
}, {
    label: '分词',
    name: 'WordDivideComp',
    icon: 'sf-fenci'
}, {
    label: '数据标准化',
    name: 'StandardizationComp',
    icon: 'sf-shujubiaozhunhua'
}, {
    label: '数据二值化',
    name: 'BinarizerComp',
    icon: 'sf-erzhihua'
}, {
    label: '主成分分析',
    name: 'PCAComp',
    icon: 'sf-PCA'
}, {
    label: '数据离散化',
    name: 'DiscretizerComp',
    icon: 'sf-lisanhua'
}, {
    label: 'one-hot编码',
    name: 'OneHotEncoderComp',
    icon: 'sf-onehot'
}, {
    label: '数据归一化',
    name: 'ScalerComp',
    icon: 'sf-shujuguiyihua'
}, {
    label: '相关性分析',
    name: 'CorrelationComp',
    icon: 'sf-xiangguanxingfenxi'
}, {
    label: 'dummy编码',
    name: 'DummyEncoderComp',
    icon: 'sf-dummybianma'
}, {
    label: '卡方分布特征选取',
    name: 'Chi2Comp',
    icon: 'sf-kafangfenbutezhengxuanqu'
}, {
    label: '标签编码',
    name: 'LabelEncoderComp',
    icon: 'sf-biaoqianbianma'
}, {
    label: 'power_transform',
    name: 'PowerTransformComp',
    icon: 'sf-powertransform'
}, {
    label: '字典',
    name: 'DictionaryComp',
    icon: 'sf-zidian'
}, {
    label: '词袋模型',
    name: 'WordOfBagComp',
    icon: 'sf-cidaimoxing'
}, {
    label: '词频-逆文档频率',
    name: 'TF-IDFComp',
    icon: 'sf-cipin-niwendangpinshuai'
}, {
    label: '反向词典',
    name: 'ReverDicComp',
    icon: 'sf-fanxiangcidian'
}, {
    label: '随机森林分类',
    name: 'RandomForestClassifierComp',
    icon: 'sf-suijisenlinfenleisuanfa'
}, {
    label: '梯度提升树分类',
    name: 'GradientBoostingClassifierComp',
    icon: 'sf-tidutishengshufenlei'
}, {
    label: '朴素贝叶斯分类',
    name: 'GaussianNBComp',
    icon: 'sf-pusubeiyesifenleisuanfa'
}, {
    label: '支持向量机分类',
    name: 'SVCComp',
    icon: 'sf-xianxingSVCsuanfa'
}, {
    label: '逻辑回归分类',
    name: 'LogisticRegressionComp',
    icon: 'sf-luojihuiguisuanfa1'
}, {
    label: '决策树分类',
    name: 'DecisionTreeClassifierComp',
    icon: 'sf-jueceshusuanfa'
}, {
    label: '最近邻分类',
    name: 'KNeighborsClassifierComp',
    icon: 'sf-Kjinlinhuigui'
}, {
    label: '随机森林回归',
    name: 'RandomForestRegressorComp',
    icon: 'sf-suijisenlinhuiguisuanfa'
}, {
    label: '梯度提升树回归',
    name: 'GradientBoostingRegressorComp',
    icon: 'sf-tidutishengshuhuigui'
}, {
    label: '决策树回归',
    name: 'DecisionTreeRegressorComp',
    icon: 'sf-jueceshuhuigui'
}, {
    label: '最近邻回归',
    name: 'KNeighborsRegressorComp',
    icon: 'sf-Kjinlinhuigui'
}, {
    label: '线性回归',
    name: 'LinearRegressionComp',
    icon: 'sf-huigui1'
}, {
    label: '支持向量机回归',
    name: 'SVRComp',
    icon: 'sf-zhichixiangliangji'
}, {
    label: 'K均值聚类',
    name: 'KmeansComp',
    icon: 'sf-K-meanjuleisuanfa'
}, {
    label: '层次聚类',
    name: 'AgglomerativeClusteringComp',
    icon: 'sf-fencengjulei'
}, {
    label: '平台文件系统数据源',
    name: 'PlatFileDataSource',
    icon: 'sf-pingtaiwenjianxitongshujuyuansvg'
}, {
    label: 'HDFS数据源',
    name: 'HdfsFileDataSource',
    icon: 'sf-HDFSshujuyuan'
}, {
    label: '数据库数据源',
    name: 'DatabaseDataSource',
    icon: 'sf-shujukushujuyuan'
}, {
    label: '滤波',
    name: 'blurComp',
    icon: 'sf-lvbo'
}, {
    label: '通道转换',
    name: 'channel_conversionComp',
    icon: 'sf-tongdaozhuanhuan'
}, {
    label: '色彩调整',
    name: 'colorAdjustComp',
    icon: 'sf-yansetiaozheng'
}, {
    label: '格式转换',
    name: 'cvtColorComp',
    icon: 'sf-geshizhuanhuan'
}, {
    label: '边缘提取',
    name: 'edgeDetectionComp',
    icon: 'sf-bianyuantiqu'
}, {
    label: '图像翻转',
    name: 'flipComp',
    icon: 'sf-tuxiangfanzhuan'
}, {
    label: '直方图',
    name: 'histComp',
    icon: 'sf-zhifangtu'
}, {
    label: '裁剪和填充',
    name: 'makeBorderComp',
    icon: 'sf-jiancaihetianchong'
}, {
    label: '形态学',
    name: 'morphologyComp',
    icon: 'sf-xingtaixue'
}, {
    label: '图像输出',
    name: 'output_imgComp',
    icon: 'sf-tuxiangshuchu'
}, {
    label: '图像读取',
    name: 'read_imgComp',
    icon: 'sf-tuxiangduqu'
}, {
    label: '缩放',
    name: 'resizeComp',
    icon: 'sf-suofang'
}, {
    label: '阈值化',
    name: 'thresholdComp',
    icon: 'sf-yuzhihua'
}, {
    label: '旋转',
    name: 'warpAffineComp',
    icon: 'sf-xuanzhuan'
}, {
    label: '规整化',
    name: 'normalizeComp',
    icon: 'sf-guizhenghua'
}, {
    label: 'Kafka数据源',
    name: 'KafkaFileDataSource',
    icon: 'sf-Kafkashujuyuan'
}];

export const contextMenuIcon = [{
//     label: '运行到当前组件',
//     name: 'runtothis',
//     icon: 'sf-yunhangdaodangqianzujian',
//     group: 2
// }, {
//     label: '从当前组件开始运行',
//     name: 'runfromthis',
//     icon: 'sf-congdangqianzujiankaishiyunxing',
//     group: 2
// }, {
//     label: '终止运行',
//     name: 'stop',
//     icon: 'sf-zhongzhiyunxing',
//     group: 2
// }, {
//     label: '强制终止',
//     name: 'forcestop',
//     icon: 'sf-zhongzhiyunxing',
//     group: 2
// }, {
    label: '复制',
    name: 'copy',
    icon: 'sf-fuzhi',
    group: 3
}, {
    label: '重命名',
    name: 'rename',
    icon: 'sf-zhongmingming',
    group: 3
}, {
    label: '删除',
    name: 'delete',
    icon: 'sf-delete1',
    group: 3
}, {
    label: '收藏',
    name: 'star',
    icon: 'sf-wodeshoucang',
    group: 3
}, {
    label: '结果导出',
    name: 'export',
    icon: 'sf-daochujieguo',
    group: 4
}, {
    label: '组件代码编辑',
    name: 'edit-code',
    icon: 'sf-daochujieguo',
    group: 1
}
// , {
//     label: '模型部署',
//     name: 'model',
//     icon: 'iconbushu',
//     group: 5
// }
];

// 左侧自定义组件右键菜单
export const contextMenuClassification = [{
    label: '编辑',
    name: 'edit',
    icon: 'sf-ico_edite',
    disabled: false,
    group: 1
}, {
    label: '删除',
    name: 'del',
    icon: 'sf-delete1',
    disabled: false,
    group: 1
}, {
    label: '分享',
    name: 'share',
    icon: 'sf-fenxiang2',
    disabled: false,
    group: 1
}, {
    label: '取消分享',
    name: 'cancelshare',
    icon: 'sf-fenxiang1',
    disabled: false,
    group: 1
}];

export const resourceInfo = [{
    name: 'SPARK_DRIVER_CPUS',
    label: 'Driver CPU',
    unit: '核',
    type: 'cpu',
    step: 1,
    min: 0
}, {
    name: 'SPARK_DRIVER_MEMORY',
    label: 'Driver 内存',
    unit: 'GB',
    type: 'mem',
    step: 1,
    min: 0
}, {
    name: 'SPARK_EXECUTOR_CPUS',
    label: 'Executor CPU',
    unit: '核',
    type: 'cpu',
    step: 1,
    min: 0
}, {
    name: 'SPARK_EXECUTOR_MEMORY',
    label: 'Executor 内存',
    unit: 'GB',
    type: 'mem',
    step: 1,
    min: 0
}, {
    name: 'SPARK_EXECUTOR_INSTANCES',
    label: 'Executor 实例',
    unit: '',
    type: 'instance',
    step: 1,
    min: 1
}, {
    name: 'TF_MASTER_CPUS',
    label: '主节点 CPU',
    unit: '核',
    type: 'cpu',
    step: 1,
    min: 0
}, {
    name: 'TF_MASTER_MEMORY',
    label: '主节点 内存',
    unit: 'GB',
    type: 'mem',
    step: 1,
    min: 0
}, {
    name: 'TF_PS_CPUS',
    label: '参数服务器 CPU',
    unit: '核',
    type: 'cpu',
    step: 1,
    min: 0
}, {
    name: 'TF_PS_MEMORY',
    label: '参数服务器 内存',
    unit: 'GB',
    type: 'mem',
    step: 1,
    min: 0
}, {
    name: 'TF_PS_INSTANCES',
    label: '参数服务器 实例',
    unit: '',
    type: 'instance',
    step: 1,
    min: 0
}, {
    name: 'TF_WORKER_CPUS',
    label: '计算节点 CPU',
    unit: '核',
    type: 'cpu',
    step: 1,
    min: 0
}, {
    name: 'TF_WORKER_MEMORY',
    label: '计算节点 内存',
    unit: 'GB',
    type: 'mem',
    step: 1,
    min: 0
}, {
    name: 'TF_WORKER_GPUS',
    label: '计算节点 GPU',
    unit: '块',
    type: 'gpu',
    step: 1,
    min: 0
}, {
    name: 'TF_WORKER_INSTANCES',
    label: '计算节点 实例',
    unit: '',
    type: 'instance',
    step: 1,
    min: 1
}, {
    name: 'TF_EXECUTOR_INSTANCES',
    label: '计算节点 实例',
    unit: '',
    type: 'instance',
    step: 1,
    min: 1
}, {
    name: 'EXECUTOR_CPUS',
    label: 'CPU',
    unit: '核',
    type: 'cpu',
    step: 1,
    min: 0
}, {
    name: 'EXECUTOR_GPUS',
    label: 'GPU',
    unit: '块',
    type: 'gpu',
    step: 1,
    min: 0
}, {
    name: 'EXECUTOR_MEMORY',
    label: '内存',
    unit: 'GB',
    type: 'mem',
    step: 1,
    min: 0
}, {
    name: 'EXECUTOR_INSTANCES',
    label: 'Executor 实例',
    unit: '',
    type: 'instance',
    step: 1,
    min: 1
}];

/**
 * 资源自动分配值
 */
export const resourceAllocationAuto = {
    low: {
        cpu: 1,
        mem: 2,
        gpu: 0,
        instance: 1
    },
    middle: {
        cpu: 2,
        mem: 4,
        gpu: 0,
        instance: 1
    },
    high: {
        cpu: 4,
        mem: 8,
        gpu: 0,
        instance: 1
    }
};

export const iconsMap = {
    maximization: 'sf-zuidahua',
    minimization: 'sf-zuixiaohua',
    arrowDown: 'sf-arrow-down',
    arrowRight: 'sf-arrow-right',
    lamb: 'sf-dengpao',
    interrogation: 'sf-wenhao',
    goback: 'sf-fanhui',
    openDetail: 'sf-jiahao',
    closeDetail: 'sf-jianhao',
    folder: 'sf-wenjianjia',
    success: 'sf-chenggongsvg',
    defaultCompIcon: 'sf-morenzujian'
};

/**
 * 节点状态描述配置
 */
export const nodeState = {
    NOTREADY: 0,
    READY: 1,
    STARTING: 2,
    RUNNING: 3,
    SUCCESS: 4,
    FAILED: 5,
    STOPING: 6,
    STOPED: 7,
    STOPFAILED: 8,
    CRONRUNNING: 9,
    FORCESTOPED: 10
};

/**
 * 节点状态描述
 */
export const nodeStateDesc = {
    [nodeState.NOTREADY]: '未就绪',
    [nodeState.READY]: '就绪',
    [nodeState.STARTING]: '启动中',
    [nodeState.RUNNING]: '运行中',
    [nodeState.SUCCESS]: '成功',
    [nodeState.FAILED]: '失败',
    [nodeState.STOPING]: '终止中',
    [nodeState.STOPED]: '已终止',
    [nodeState.STOPFAILED]: '终止失败',
    [nodeState.CRONRUNNING]: '定时任务运行',
    [nodeState.FORCESTOPED]: '强制终止'
};

/**
 * 节点运行状态图标配置
 */
// todo: 补全图标
export const nodeStateIconConf = {
    [nodeState.NOTREADY]: 'sf-gantanhaowenti',
    [nodeState.READY]: 'sf-jiuxu',
    [nodeState.STARTING]: '',
    [nodeState.RUNNING]: 'sf-yunhangzhong',
    [nodeState.SUCCESS]: 'sf-chenggongsvg',
    [nodeState.FAILED]: 'sf-shibai',
    [nodeState.STOPING]: '',
    [nodeState.STOPED]: 'sf-zhongzhi',
    [nodeState.STOPFAILED]: '',
    [nodeState.CRONRUNNING]: '',
    [nodeState.FORCESTOPED]: 'sf-qiangzhizhongzhi'
};

/**
 * 节点结果状态图标配置
 */
export const nodeResultStateIconConf = {
    [nodeState.NOTREADY]: 'sf-gantanhaowenti',
    [nodeState.SUCCESS]: 'sf-chenggong',
    [nodeState.FAILED]: 'sf-shibai1',
    [nodeState.STOPED]: 'sf-zhongzhi1',
    [nodeState.FORCESTOPED]: 'sf-qiangzhizhongzhi1'
};

/**
 * 调度周期
 */
export const timeMap = [{
    label: '秒',
    value: 1,
    type: 'second'
}, {
    label: '分',
    value: 60,
    type: 'minute'
}, {
    label: '时',
    value: 60 * 60,
    type: 'hour'
}, {
    label: '天',
    value: 24 * 60 * 60,
    type: 'day'
}, {
    label: '周',
    value: 7 * 24 * 60 * 60,
    type: 'week'
}, {
    label: '月',
    value: 30 * 7 * 24 * 60 * 60,
    type: 'month'
}, {
    label: '年',
    value: 365 * 30 * 7 * 24 * 60 * 60,
    type: 'year'
}];

/**
 * cron表达式 - 日期选择
 */
export const cronDateList = [{
    label: '分',
    type: 'minute',
    value: Array.from(new Array(60).keys()),
    default: 0
}, {
    label: '时',
    type: 'hour',
    value: Array.from(new Array(24).keys()),
    default: 0
}, {
    label: '天',
    type: 'day',
    value: (Array.from(new Array(31).keys()).map(el => el + 1)),
    default: 1
}, {
    label: '周',
    type: 'week',
    value: (Array.from(new Array(7).keys()).map(el => el + 1)),
    default: 1
}, {
    label: '月',
    type: 'month',
    value: (Array.from(new Array(12).keys()).map(el => el + 1)),
    default: 1
}, {
    label: '年',
    type: 'year',
    value: Array.from(new Array(100).keys()).map(el => el + new Date().getFullYear()),
    default: new Date().getFullYear()
}];

export const dataTypes = {
    DOUBLE: 'double',
    INT: 'integer',
    SMALLINT: 'short',
    FLOAT: 'float',
    BIGINT: 'long',
    STRING: 'string',
    TIMESTAMP: 'timestamp',
    BINARY: 'binary',
    DATE: 'date',
    BOOLEAN: 'boolean',
    BYTE: 'byte'
};

/**
 * cron表达式设置方式
 */
export const cronTypes = [{
    label: 'cron表达式',
    value: 1
}, {
    label: '时间选择',
    value: 2
}];

/**
 * 定时任务周期内未执行完时的调度方式
 */
export const cronHandleTypes = [{
    label: '并行',
    value: 1
}, {
    label: '等待',
    value: 2
}, {
    label: '放弃',
    value: 3
}];
