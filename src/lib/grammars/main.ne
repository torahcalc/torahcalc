# Nearley Grammar for inputting natural language queries
#
# Example queries supported
# =========================
#
# Unit conversions
# ----------------
# - "convert 10 amos to meters"
# - "convert 1 amah to tefachim."
# - "how many amos are in a parsah?"
# - "convert 40 seah to us liquid gallons."
# - "convert 1 us dollar to perutos."
# - "how many chalakim are in an hour?"
#
# Multi-unit conversion charts
# ----------------------------
# - "conversion chart for 1 mil"
#
# More coming soon...

@builtin "number.ne"  # unsigned_int, int, unsigned_decimal, decimal, percentage, jsonfloat

@include "./generated/units.ne"  # unit, lengthUnit, areaUnit, volumeUnit, weightUnit, coinsUnit, timeUnit

query[QUERY] -> _ $QUERY _ {% data => data[1] %}
              | _ $QUERY [?.] _ {% data => data[1] %}

main -> query[unitConversionQuery] {% data => data[0][0] %}
      | query[conversionChartQuery] {% data => data[0][0] %}

unitConversionQuery -> [A-Za-z\s]:* jsonfloat _ unit __ ("to" | "in" | "into") __ unit {% data => ({function: "unitConversionQuery", unitFrom: data[3], unitTo: data[7], amount: data[1]}) %}
                     | [A-Za-z\s]:* unit __ ("in" | "are in" | "to") __ ("a" | "an") __ unit {% data => ({function: "unitConversionQuery", unitFrom: data[7], unitTo: data[1], amount: 1}) %}
                     | [A-Za-z\s]:* unit __ ("in" | "are in") __ jsonfloat _ unit {% data => ({function: "unitConversionQuery", unitFrom: data[7], unitTo: data[1], amount: data[5]}) %}

conversionChartQuery -> "conversion" __ "chart" __ "for" __ jsonfloat _ unit {% data => ({function: "conversionChartQuery", unit: data[8], amount: data[6]}) %}
                      | "conversion" __ "chart" __ "for" __ unit {% data => ({function: "conversionChartQuery", unit: data[6], amount: 1}) %}

_ -> [ ]:* {% data => null %}

__ -> [ ]:+ {% data => null %}