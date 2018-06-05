var utils = require("./utils")
var picker = require("./picker")

var dst = [
    {digit : 3, style : 0},
    {digit : 3, style : 1},
    {digit : 3, style : 2},
    // {digit : 3, style : 3},
    {digit : 4, style : 0},
    {digit : 4, style : 1},
    {digit : 4, style : 2},

    {digit : 7, style : 0},
    // {digit : 7, style : 1},
    // {digit : 8, style : 0},
    {digit : 8, style : 1},
];

var src = [
    {digit : 3, style : 1},
    {digit : 5, style : 0},
    {digit : 5, style : 1},
    {digit : 5, style : 2},
    // {digit : 6, style : 0},
    {digit : 6, style : 1},
    {digit : 7, style : 1},
    {digit : 8, style : 1},
    {digit : 9, style : 1},
    {digit : 9, style : 2},

    {digit : 10, style : 0},
    {digit : 10, style : 1},
    {digit : 10, style : 2},
    {digit : 10, style : 3},
    {digit : 11, style : 0},
    {digit : 11, style : 1},
    {digit : 11, style : 2},

    {digit : 12, style : 0},
    {digit : 12, style : 1},
    {digit : 13, style : 0},
    {digit : 13, style : 1},

    {digit : 16, style : 0},
    {digit : 17, style : 0},
]

// var result = picker.interface_compare(src, dst);
var result = picker.interface_select_type(src, 3, 2, [0, 2, 5])
utils.dump(result)