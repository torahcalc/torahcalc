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
# Gematria calculations
# ---------------------
# - Calculate Gematria of תורה.
# - Calculate Mispar Gadol of מלך.
# - Calculate Mispar Siduri of פרעה.
# - Calculate Mispar Katan Mispari of משיח.
# - Calculate AvGad of משה.
#
# More coming soon...

@builtin "number.ne"  # unsigned_int, int, unsigned_decimal, decimal, percentage, jsonfloat

@include "./generated/units.ne"  # unit, lengthUnit, areaUnit, volumeUnit, weightUnit, coinsUnit, timeUnit
@include "./generated/gematria.ne"  # gematriaMethod

# Macro for matching a query with optional trailing spaces and punctuation at the end
query[QUERY] -> _ $QUERY _ {% data => data[1] %}
              | _ $QUERY [?.] _ {% data => data[1] %}

# Macro for matching strings followed by whitespace or optional whitespace
optionalWords[STRING] -> $STRING __ {% data => data[0] %}
                  | _ {% data => null %}

# Start symbol
main -> query[unitConversionQuery] {% data => data[0][0] %}
      | query[conversionChartQuery] {% data => data[0][0] %}
      | query[gematriaQuery] {% data => data[0][0] %}

# Unit conversion queries
unitConversionQuery -> optionalWords[[A-Za-z\s]:*] jsonfloat _ unit __ ("to" | "in" | "into") __ unit {% data => ({function: "unitConversionQuery", unitFrom: data[3], unitTo: data[7], amount: data[1]}) %}
                     | optionalWords[[A-Za-z\s]:*] unit __ ("in" | "are in" | "to") __ ("a" | "an") __ unit {% data => ({function: "unitConversionQuery", unitFrom: data[7], unitTo: data[1], amount: 1}) %}
                     | optionalWords[[A-Za-z\s]:*] unit __ ("in" | "are in") __ jsonfloat _ unit {% data => ({function: "unitConversionQuery", unitFrom: data[7], unitTo: data[1], amount: data[5]}) %}

# Conversion chart queries
conversionChartQuery -> optionalWords[("conversion" | "conversions" | "convert")] optionalWords["chart"] optionalWords["for"] jsonfloat _ unit {% data => ({function: "conversionChartQuery", unit: data[5], amount: data[3]}) %}
                      | optionalWords[("conversion" | "conversions" | "convert")] optionalWords["chart"] optionalWords["for"] optionalWords[("a" | "an")] unit {% data => ({function: "conversionChartQuery", unit: data[4], amount: 1}) %}

# Gematria queries
gematriaQuery -> optionalWords[("calculate" | "compute" | "what is" | "what's" | "how much is" | "how many is")] optionalWords["the"] gematriaMethod _ optionalWords["of"] hebrewString {% data => ({function: "gematriaQuery", gematriaMethod: data[2], text: data[5]}) %}

# Hebrew words for Gematria calculations
hebrewCharacter -> [\u05D0-\u05EA\u05F0\u05F1\u05F2\uFB1F\uFB2E-\uFB30\uFB4F\uFB21\uFB31\uFB4C\uFB32\uFB33\uFB22\uFB34\uFB23\uFB4B\uFB35\uFB36\uFB38\uFB39\uFB1D\uFB3A\uFB3B\uFB4D\uFB24\uFB3C\uFB25\uFB26\uFB3E\uFB40\u05C6\uFB41\uFB42\uFB20\uFB43\uFB44\uFB4E\uFB46\uFB47\uFB48\uFB27\uFB49\uFB2A-\uFB2D\uFB4A\uFB28] {% data => data[0] %}
hebrewPunctuation -> [\u05F3\u05F4\u05B0-\u05C4\u0591-\u05AF.!?,;:()\s+\-]:+ {% data => data[0] %}
hebrewString -> hebrewCharacter {% data => data[0] %}
                  | hebrewPunctuation hebrewString {% data => data[0] + data[1] %}
                  | hebrewCharacter hebrewString {% data => data[0] + data[1] %}
                  | hebrewString hebrewCharacter {% data => data[0] + data[1] %}

# Whitespace (optional)
_ -> [ ]:* {% data => null %}

# Whitespace (required)
__ -> [ ]:+ {% data => null %}
