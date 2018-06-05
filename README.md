## 这是什么？
斗地主选牌算法，支持控制台调试。算法的难点在于带牌逻辑，这里采用的是避开「最长牌型」的策略，进行了递归处理。

### 1.工程结构

* console.js    控制台测试入口
* picker.js     算法主文件
* utils.js      工具类

### 2.支持逻辑

* 同指定牌型比较大小

        /*
            牌型比较
            * src    候选列表
            * dst    比较列表
            * return 结果集
        */
        interface_compare : function(src, dst)

* 检查牌型有效性

        /*
            检查输入手牌有效性
            * source    候选列表
            * return    返回值
                * 0     有效与否
                * 1     [普通牌型, 炸弹, 王炸]中取一个
                * 2     牌型
                * 3     牌型重复次数
                * 4     带牌数量
                * 5     牌型最小数字
        */
        interface_check_valid : function(source)

* 最长牌型选择

        /*
            最长牌型选择
            * source    候选列表
            * return    最长牌型（唯一）
        */
        interface_select_longest : function(source)

* 选取指定牌型

        /*
            牌型选择
            * source    候选列表
            * type      牌型
            * repeat    重复牌型个数
            * constraint    约束
                * 0     带一对个数
                * 1     带单张个数
                * 2     最小牌面
        */
        interface_select_type : function(source, type, repeat, constraint)

### 3.缺点

* 4带2逻辑还没有加入，后面有空再加上。
* 算法只针对经典场，癞子什么的大家自由发挥。