var utils = require("./utils")

var print = function(data, desc) {
    console.log(desc || '')
    utils.dump(data)
}

var type_map = [
    [1, 5, 0],
    [2, 3, 0],
    [3, 1, 1],
    [4, 1, 0],
]
var block_num = 15;

var picker = {
    preprocess : function(source) {
        source.sort(function(a, b) {
            if (a.digit == b.digit) {
                return a.style - b.style;
            } else {
                return a.digit - b.digit;
            }
        })

        var list = []
        for (var i = 0; i < 15; i++) {
            list[i] = [];
        }

        for (var i = 0; i < source.length; i++) {
            var row = source[i]
            list[row.digit - 3].push(i);
        }

        return list;
    },

    select_type : function(list, type, repeat) {
        var results = [];
        var result = [];
        for (var i = 0; i < list.length; i++) {
            var group = list[i];
            if (i < block_num - 3 && group.length >= type) {
                result.push(group.slice(0, type));
            } else {
                if (result.length >= repeat) {
                    results.push(result);
                }
                result = [];
            }
        }

        return results;
    },

    postprocess : function(list, source) {
        var group = [];
        list.forEach(element => {
            if (typeof(element) == 'object') {
                element.forEach(row => {
                    group.push(source[row])
                });
            } else {
                group.push(source[element])
            }
        });
        return group;
    },

    select_bonus : function(list, results, num) {
        var bonus = []
        if ((typeof(num) == 'number' && num > 0) ||
            (typeof(num) == 'object' && num[0] + num[1] > 0)) {
            var total = [];
            results.forEach(element => {
                total = total.concat(element)
            });
            var left = this.split(list, total)

            bonus = this.select_left(left, num)
        }
        return bonus
    },

    select_left : function(list, num) {
        var double_list = [];
        var smooth_list = this.smooth(list);

        for (var i = 0; i < list.length; i++) {
            var group = list[i];

            while(group.length >= 2) {
                double_list.push([group[0], group[1]]);
                group.splice(0, 2);
            }
        }

        var single_list = this.smooth(list);

        if (typeof(num) == 'number') {
            if (double_list.length >= num) {
                return double_list.slice(0, num);
            } else {
                if (single_list.length >= num) {
                    return single_list.slice(0, num);
                } else {
                    return smooth_list.slice(0, num);
                }
            }
        } else {
            if (num[0] > 0 && double_list.length > num[0]) {
                return double_list.slice(0, num[0]);
            } else {
                if (single_list.length >= num[1]) {
                    return single_list.slice(0, num[1]);
                } else {
                    return smooth_list.slice(0, num[1]);
                }
            }
        }
    },

    select_bomb : function(source) {
        var list = this.preprocess(source)

        var bombs = [];
        for (var i = 0; i < list.length; i++) {
            var group = list[i]
            if (group.length == 4) {
                bombs.push(group.slice(0, 4));
            }
        }

        return bombs
    },

    select_super_bomb : function(source) {
        var list = this.preprocess(source)

        if (list[13].length == 1 && list[14].length == 1) {
            return [list[13][0], list[14][0]]
        }

        return [];
    },

    is_bomb : function(source) {
        var result = false;
        if (source.length == 4) {
            var list = this.preprocess(source)

            for (var i = 0; i < list.length; i++) {
                var group = list[i]
                if (group.length == 4) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    },

    is_super_bomb : function(source) {
        var result = false;
        if (source.length == 2) {
            var list = this.preprocess(source)
            result = list[13].length == 1 && list[14].length == 1;
        }
        return result;
    },

    /*
        牌型比较
        * src    候选列表
        * dst    比较列表
        * return 结果集
    */
    interface_compare : function(src, dst) {
        var result = this.interface_check_valid(dst)
        if (!result[0]) {
            console.error('dst params in interface_compare function is invalid');
            return;
        }

        switch(result[1]) {
            case 2:{
                // super bomb
                // console.log("interface_compare | super bomb");
                return [];
            }
            case 1:{
                // bomb
                var bombs = this.select_bomb(src);
                // print(bombs, 'interface_compare | bombs')

                var results = [];
                bombs.forEach(element => {
                    if (src[element[0]].digit > dst[0].digit) {
                        var arr = [];
                        for (var i = 0; i < 4; i++) {
                            arr.push(src[element[i]])
                        }
                        results.push(arr)
                    }
                });

                // print(results, 'interface_compare | results')
                return results;
            }
            case 0:{
                // normal
                var factor = result[4] / result[3];
                var constraint = [factor == 2? result[3] : 0, factor == 1? result[3] : 0, result[5]];
                var results = this.interface_select_type(src, result[2], result[3], constraint);

                // print(results, 'interface_compare | normal')

                // bomb
                var bombs = this.select_bomb(src);
                bombs.forEach(element => {
                    var arr = [];
                    for (var i = 0; i < 4; i++) {
                        arr.push(src[element[i]])
                    }
                    results.push(arr)
                });
                // print(results, 'interface_compare | with bombs')

                // super bomb
                var super_bomb = this.select_super_bomb(src)
                var arr = [];
                super_bomb.forEach(element => {
                    arr.push(src[element])
                });
                if (arr.length > 0) {
                    results.push(arr)
                    // print(results, 'interface_compare | with super_bomb')
                }

                return results;
            }
        }
    },

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
    interface_check_valid : function(source) {
        if (this.is_super_bomb(source)) {
            return [true, 2];
        }

        if (this.is_bomb(source)) {
            return [true, 1];
        }

        var list = this.preprocess(source)
        var results = this.select_longest(list)
        var bonus = this.select_bonus(list, results, type_map[results[0][0].length - 1][2] > 0? results[0].length : 0);

        // print(results, 'interface_check_valid | results')
        // print(bonus, 'interface_check_valid | bonus')

        var smooth_results = this.smooth(results[0])
        var smooth_bonus = this.smooth(bonus)

        // console.log(smooth_results.length)
        // console.log(smooth_bonus.length)

        var valid = smooth_results.length + smooth_bonus.length == source.length;
        if (valid) {
            return [true, 0, results[0][0].length, results[0].length, smooth_bonus.length, source[results[0][0][0]].digit]
        } else {
            return [false];
        }
    },

    /*
        最长牌型选择
        * source    候选列表
        * return    最长牌型（唯一）
    */
    interface_select_longest : function(source) {
        var list = this.preprocess(source);
        var results = this.select_longest(list);
        // print(results, 'eventual result')

        var bonus = this.select_bonus(list, results, type_map[results[0][0].length - 1][2] > 0? results[0].length : 0);
        // print(bonus, 'eventual bonus')

        var main = this.postprocess(results[0], source)
        var bonus = this.postprocess(bonus, source)
        var converted = main.concat(bonus);
        // // print(converted, 'eventual converted')

        return converted;
    },

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
    interface_select_type : function(source, type, repeat, constraint) {
        var list = this.preprocess(source);
        var groups = this.select_type(list, type, repeat);

        // console.log(type, 'interface_select_type | type')
        // console.log(repeat, 'interface_select_type | repeat')
        // console.log(constraint, 'interface_select_type | constraint')
        // print(groups, 'interface_select_type | groups')

        for (var i = 0; i < groups.length; i++) {
            var index = groups[i][0][0];
            var rawdata = source[index];
            if (rawdata.digit < constraint[2]) {
                groups.splice(i--, 1);
            }
        }

        var results = [];
        groups.forEach(element => {
            if (constraint[0] + constraint[1] > 0) {
                // TODO 递归
                var left = this.split(list, element);
                // print(left, 'interface_select_type | left')

                var longest = this.select_longest(left, [constraint.slice(0, 2)])
                // print(longest, 'interface_select_type | longest')

                var bonus = this.select_bonus(left, longest, constraint)
                // print(bonus, 'interface_select_type | bonus')

                var smooth_bonus = this.smooth(bonus);
                if (smooth_bonus.length == constraint[0] * 2 + constraint[1]) {
                    results.push([element, bonus]);
                }
            } else {
                results.push([element, []]);
            }
        });

        // print(results, 'interface_select_type | eventual results')

        var converted = [];
        results.forEach(element => {
            var main = this.postprocess(element[0], source)
            var bonus = this.postprocess(element[1], source)
            converted.push(main.concat(bonus))
        });
        // print(converted, 'interface_select_type | eventual converted')

        return converted;
    },

    select_longest : function(list, stack) {
        stack = stack || [];

        var constraint = [0, 0];
        stack.forEach(element => {
            constraint[0] += element[0]
            constraint[1] += element[1]
        });

        // console.log("------------loop deep: " + stack.length);
        // print(list, 'list')
        // print(stack, 'stack')

        var maxCountTarget = [];
        var maxCount = 0;
        var leftCount = 0;
        var leftType = 0;
        for (var i = 0; i < type_map.length; i++) {
            var row = type_map[i];
            var targets = this.select_type(list, row[0], row[1]);

            // console.log('row: ' + row[0]);

            targets.forEach(target => {
                var left = this.split(list, target);

                var count = this.precheck_left(left, row[2] * target.length, constraint);

                // print(target, 'target')
                // print(left, 'left')
                // print(constraint, 'constraint')
                // print(count, 'count')

                if (count >= 0) {
                    var curCount = row[0] * target.length + count
                    if (curCount >= maxCount) {
                        maxCount = curCount;
                        maxCountTarget = target;

                        leftCount = count;
                        leftType = count / row[2] * target.length;
                    }
                }
            });
        }

        // print(maxCountTarget, 'maxCountTarget')
        // print(maxCount, 'maxCount')

        if (leftCount > 0) {
            var left = this.split(list, maxCountTarget);

            if (leftType == 1) {
                stack.push([0, leftCount]);
            } else {
                stack.push([leftCount / 2, 0]);
            }

            var target = this.select_longest(left, stack);
            var arr = [maxCountTarget];
            var result = arr.concat(target)
            // print(result, 'result')
            return result;
        } else {
            return [maxCountTarget];
        }
    },

    precheck_left : function(list, num, constraint) {
        var double_list = [];
        var smooth_list = this.smooth(list);

        for (var i = 0; i < list.length; i++) {
            var group = list[i];

            while(group.length >= 2) {
                double_list.push(i);
                group.splice(0, 2);
            }
        }

        // 不满足前置限定
        if (constraint[0] > double_list.length || constraint[1] > smooth_list.length - constraint[0]*2) {
            return -1;
        }

        if (double_list.length >= constraint[0] + num && smooth_list.length - (constraint[0] + num) * 2 >= constraint[1]) {
            return 2 * num;
        }

        if (smooth_list.length >= constraint[0] * 2 + constraint[1] + num) {
            return num;
        }

        return 0;
    },

    split : function(list, part) {
        var planeArr = [];
        for (var i = 0; i < part.length; i++) {
            var group = part[i];
            group.forEach(element => {
                planeArr[element] = true;
            });
        }

        var list = utils.clone(list);
        for (var i = 0; i < list.length; i++) {
            var group = list[i];
            for (var j = 0; j < group.length; j++) {
                var index = group[j]
                if (planeArr[index]) {
                    group.splice(j--, 1);
                }
            }
        }

        return list
    },

    smooth : function(list) {
        var result = [];
        for (var i = 0; i < list.length; i++) {
            var group = list[i];
            result = result.concat(group);
        }
        return result;
    },
}

module.exports = picker;