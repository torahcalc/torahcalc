import {units} from "./units.js";
// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "unsigned_int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_int$ebnf$1", "symbols": ["unsigned_int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_int", "symbols": ["unsigned_int$ebnf$1"], "postprocess": 
        function(d) {
            return parseInt(d[0].join(""));
        }
        },
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"-"}]},
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"+"}]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "int$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "int$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$2", "symbols": ["int$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "int", "symbols": ["int$ebnf$1", "int$ebnf$2"], "postprocess": 
        function(d) {
            if (d[0]) {
                return parseInt(d[0][0]+d[1].join(""));
            } else {
                return parseInt(d[1].join(""));
            }
        }
        },
    {"name": "unsigned_decimal$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$1", "symbols": ["unsigned_decimal$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1", "symbols": [{"literal":"."}, "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "unsigned_decimal$ebnf$2", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "unsigned_decimal$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "unsigned_decimal", "symbols": ["unsigned_decimal$ebnf$1", "unsigned_decimal$ebnf$2"], "postprocess": 
        function(d) {
            return parseFloat(
                d[0].join("") +
                (d[1] ? "."+d[1][1].join("") : "")
            );
        }
        },
    {"name": "decimal$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "decimal$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decimal$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$2", "symbols": ["decimal$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": ["decimal$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "decimal$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "decimal$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "decimal$ebnf$3", "symbols": ["decimal$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "decimal$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decimal", "symbols": ["decimal$ebnf$1", "decimal$ebnf$2", "decimal$ebnf$3"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "")
            );
        }
        },
    {"name": "percentage", "symbols": ["decimal", {"literal":"%"}], "postprocess": 
        function(d) {
            return d[0]/100;
        }
        },
    {"name": "jsonfloat$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "jsonfloat$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$2", "symbols": ["jsonfloat$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": ["jsonfloat$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "jsonfloat$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "jsonfloat$ebnf$3", "symbols": ["jsonfloat$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [/[+-]/], "postprocess": id},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": ["jsonfloat$ebnf$4$subexpression$1$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$4$subexpression$1", "symbols": [/[eE]/, "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "jsonfloat$ebnf$4$subexpression$1$ebnf$2"]},
    {"name": "jsonfloat$ebnf$4", "symbols": ["jsonfloat$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat", "symbols": ["jsonfloat$ebnf$1", "jsonfloat$ebnf$2", "jsonfloat$ebnf$3", "jsonfloat$ebnf$4"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "") +
                (d[3] ? "e" + (d[3][1] || "+") + d[3][2].join("") : "")
            );
        }
        },
    {"name": "main$macrocall$2", "symbols": ["unitConversionQuery"]},
    {"name": "main$macrocall$1", "symbols": ["_", "main$macrocall$2", "_"], "postprocess": data => data[1]},
    {"name": "main$macrocall$1", "symbols": ["_", "main$macrocall$2", /[?.]/, "_"], "postprocess": data => data[1]},
    {"name": "main", "symbols": ["main$macrocall$1"], "postprocess": data => data[0][0]},
    {"name": "main$macrocall$4", "symbols": ["conversionChartQuery"]},
    {"name": "main$macrocall$3", "symbols": ["_", "main$macrocall$4", "_"], "postprocess": data => data[1]},
    {"name": "main$macrocall$3", "symbols": ["_", "main$macrocall$4", /[?.]/, "_"], "postprocess": data => data[1]},
    {"name": "main", "symbols": ["main$macrocall$3"], "postprocess": data => data[0][0]},
    {"name": "unitConversionQuery$ebnf$1", "symbols": []},
    {"name": "unitConversionQuery$ebnf$1", "symbols": ["unitConversionQuery$ebnf$1", /[A-Za-z\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unitConversionQuery$subexpression$1$string$1", "symbols": [{"literal":"t"}, {"literal":"o"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "unitConversionQuery$subexpression$1", "symbols": ["unitConversionQuery$subexpression$1$string$1"]},
    {"name": "unitConversionQuery$subexpression$1$string$2", "symbols": [{"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "unitConversionQuery$subexpression$1", "symbols": ["unitConversionQuery$subexpression$1$string$2"]},
    {"name": "unitConversionQuery$subexpression$1$string$3", "symbols": [{"literal":"i"}, {"literal":"n"}, {"literal":"t"}, {"literal":"o"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "unitConversionQuery$subexpression$1", "symbols": ["unitConversionQuery$subexpression$1$string$3"]},
    {"name": "unitConversionQuery", "symbols": ["unitConversionQuery$ebnf$1", "_", "jsonfloat", "__", "unit", "__", "unitConversionQuery$subexpression$1", "__", "unit"], "postprocess": data => ({type: "unitConversionQuery", fromUnit: data[4], toUnit: data[8], amount: data[2]})},
    {"name": "unitConversionQuery$string$1", "symbols": [{"literal":"h"}, {"literal":"o"}, {"literal":"w"}, {"literal":" "}, {"literal":"m"}, {"literal":"a"}, {"literal":"n"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "unitConversionQuery$subexpression$2$string$1", "symbols": [{"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "unitConversionQuery$subexpression$2", "symbols": ["unitConversionQuery$subexpression$2$string$1"]},
    {"name": "unitConversionQuery$subexpression$2$string$2", "symbols": [{"literal":"a"}, {"literal":"r"}, {"literal":"e"}, {"literal":" "}, {"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "unitConversionQuery$subexpression$2", "symbols": ["unitConversionQuery$subexpression$2$string$2"]},
    {"name": "unitConversionQuery$subexpression$2$string$3", "symbols": [{"literal":"t"}, {"literal":"o"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "unitConversionQuery$subexpression$2", "symbols": ["unitConversionQuery$subexpression$2$string$3"]},
    {"name": "unitConversionQuery$subexpression$3", "symbols": [{"literal":"a"}]},
    {"name": "unitConversionQuery$subexpression$3$string$1", "symbols": [{"literal":"a"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "unitConversionQuery$subexpression$3", "symbols": ["unitConversionQuery$subexpression$3$string$1"]},
    {"name": "unitConversionQuery", "symbols": ["unitConversionQuery$string$1", "__", "unit", "__", "unitConversionQuery$subexpression$2", "__", "unitConversionQuery$subexpression$3", "__", "unit"], "postprocess": data => ({type: "unitConversionQuery", fromUnit: data[8], toUnit: data[2], amount: 1})},
    {"name": "unitConversionQuery$string$2", "symbols": [{"literal":"h"}, {"literal":"o"}, {"literal":"w"}, {"literal":" "}, {"literal":"m"}, {"literal":"a"}, {"literal":"n"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "unitConversionQuery$subexpression$4$string$1", "symbols": [{"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "unitConversionQuery$subexpression$4", "symbols": ["unitConversionQuery$subexpression$4$string$1"]},
    {"name": "unitConversionQuery$subexpression$4$string$2", "symbols": [{"literal":"a"}, {"literal":"r"}, {"literal":"e"}, {"literal":" "}, {"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "unitConversionQuery$subexpression$4", "symbols": ["unitConversionQuery$subexpression$4$string$2"]},
    {"name": "unitConversionQuery", "symbols": ["unitConversionQuery$string$2", "__", "unit", "__", "unitConversionQuery$subexpression$4", "__", "jsonfloat", "__", "unit"], "postprocess": data => ({type: "unitConversionQuery", fromUnit: data[8], toUnit: data[2], amount: data[6]})},
    {"name": "conversionChartQuery$string$1", "symbols": [{"literal":"c"}, {"literal":"o"}, {"literal":"n"}, {"literal":"v"}, {"literal":"e"}, {"literal":"r"}, {"literal":"s"}, {"literal":"i"}, {"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "conversionChartQuery$string$2", "symbols": [{"literal":"c"}, {"literal":"h"}, {"literal":"a"}, {"literal":"r"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "conversionChartQuery$string$3", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "conversionChartQuery", "symbols": ["conversionChartQuery$string$1", "__", "conversionChartQuery$string$2", "__", "conversionChartQuery$string$3", "__", "jsonfloat", "__", "unit"], "postprocess": data => ({type: "conversionChartQuery", unit: data[8], amount: data[6]})},
    {"name": "conversionChartQuery$string$4", "symbols": [{"literal":"c"}, {"literal":"o"}, {"literal":"n"}, {"literal":"v"}, {"literal":"e"}, {"literal":"r"}, {"literal":"s"}, {"literal":"i"}, {"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "conversionChartQuery$string$5", "symbols": [{"literal":"c"}, {"literal":"h"}, {"literal":"a"}, {"literal":"r"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "conversionChartQuery$string$6", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "conversionChartQuery", "symbols": ["conversionChartQuery$string$4", "__", "conversionChartQuery$string$5", "__", "conversionChartQuery$string$6", "__", "unit"], "postprocess": data => ({type: "conversionChartQuery", unit: data[6], amount: 1})},
    {"name": "unit$ebnf$1", "symbols": [/[a-zA-Z\s]/]},
    {"name": "unit$ebnf$1", "symbols": ["unit$ebnf$1", /[a-zA-Z\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unit", "symbols": ["unit$ebnf$1"], "postprocess":  function(data, location, reject) {
            const unit = data[0].join("").trim().toLowerCase();
            for (const [type, unitsOfType] of Object.entries(units)) {
                if (unit in unitsOfType) {
                    return {type, unitId: unitsOfType[unit]};
                }
            }
            return reject;
        } },
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[ ]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": data => null},
    {"name": "__$ebnf$1", "symbols": [/[ ]/]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", /[ ]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": data => null}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
