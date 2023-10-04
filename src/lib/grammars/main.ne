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
# Zmanim
# ------
# - "what time is chatzos in New York?"
# - "zmanim for Denver"
# - "zmanim for 1 Teves 5784 in Jerusalem"
# - "what time is sunset on December 25, 2023 in Los Angeles?"
# - "how long is a shaah zmanis in 39.1, -107.4?"
#
# More coming soon...

@{%
import { displayHebrew } from "$lib/js/gematria.js";
%}

@builtin "number.ne"  # unsigned_int, int, unsigned_decimal, decimal, percentage, jsonfloat

@include "./generated/units.ne"  # unit, lengthUnit, areaUnit, volumeUnit, weightUnit, coinsUnit, timeUnit
@include "./generated/gematria.ne"  # gematriaMethod
@include "./generated/zmanim.ne"  # zman, duration

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
      | query[zmanimQuery] {% data => data[0][0] %}

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
hebrewString -> [\u05D0-\u05EA\u05F0\u05F1\u05F2\uFB1F\uFB2E-\uFB30\uFB4F\uFB21\uFB31\uFB4C\uFB32\uFB33\uFB22\uFB34\uFB23\uFB4B\uFB35\uFB36\uFB38\uFB39\uFB1D\uFB3A\uFB3B\uFB4D\uFB24\uFB3C\uFB25\uFB26\uFB3E\uFB40\u05C6\uFB41\uFB42\uFB20\uFB43\uFB44\uFB4E\uFB46\uFB47\uFB48\uFB27\uFB49\uFB2A-\uFB2D\uFB4A\uFB28.!?,;:()\s+\-\u0591-\u05CF\u05F3\u05F4\uFB1D\uFB1E]:+ {% data => displayHebrew(data[0].join("")) %}

# Zmanim queries
zmanimQuery -> optionalWords[("what time is" | "when is" | "what's the time of" | "what's the time for" | "what time does")] zman {% data => ({function: "zmanimQuery", zman: data[1]}) %}
             | optionalWords[("what time is" | "when is" | "what's the time of" | "what's the time for" | "what time does")] zman __ ("in" | "for") __ location {% data => ({function: "zmanimQuery", zman: data[1], location: data[5]}) %}
             | optionalWords[("what time is" | "when is" | "what's the time of" | "what's the time for" | "what time does")] zman __ ("on" | "for") __ date {% data => ({function: "zmanimQuery", zman: data[1], date: data[5]}) %}
             | optionalWords[("what time is" | "when is" | "what's the time of" | "what's the time for" | "what time does")] zman __ ("on" | "for") __ date __ ("in" | "for") __ location {% data => ({function: "zmanimQuery", zman: data[1], date: data[5], location: data[9]}) %}
             | optionalWords[("what time is" | "when is" | "what's the time of" | "what's the time for" | "what time does")] zman __ ("in" | "for") __ location __ ("on" | "for") __ date {% data => ({function: "zmanimQuery", zman: data[1], date: data[9], location: data[5]}) %}
             | optionalWords[("how long is" | "what is the length of")] optionalWords[("a" | "an" | "the")] duration {% data => ({function: "zmanimQuery", zman: data[2]}) %}
             | optionalWords[("how long is" | "what is the length of")] optionalWords[("a" | "an" | "the")] duration __ ("in" | "for") __ location {% data => ({function: "zmanimQuery", zman: data[2], location: data[6]}) %}
             | optionalWords[("how long is" | "what is the length of")] optionalWords[("a" | "an" | "the")] duration __ ("on" | "for") __ date {% data => ({function: "zmanimQuery", zman: data[2], date: data[6]}) %}
             | optionalWords[("how long is" | "what is the length of")] optionalWords[("a" | "an" | "the")] duration __ ("on" | "for") __ date __ ("in" | "for") __ location {% data => ({function: "zmanimQuery", zman: data[2], date: data[6], location: data[8]}) %}
             | optionalWords[("how long is" | "what is the length of")] optionalWords[("a" | "an" | "the")] duration __ ("in" | "for") __ location __ "on" __ date {% data => ({function: "zmanimQuery", zman: data[2], date: data[8], location: data[6]}) %}
             | optionalWords[("how long is" | "what is the length of")] optionalWords[("a" | "an" | "the")] duration __ ("in" | "for") __ location {% data => ({function: "zmanimQuery", zman: data[2], location: data[6]}) %}
             | "zmanim" __ optionalWords["for"] date {% data => ({function: "zmanimQuery", date: data[3]}) %}
             | "zmanim" __ optionalWords["for"] date __ "in" __ location {% data => ({function: "zmanimQuery", date: data[3], location: data[7]}) %}
             | "zmanim" __ optionalWords["for"] location {% data => ({function: "zmanimQuery", location: data[3]}) %}
             | "zmanim" __ optionalWords["for"] location __ "on" __ date {% data => ({function: "zmanimQuery", date: data[7], location: data[3]}) %}

location -> [\w\s,.'()+":;\-]:+ {% data => data[0].join("") %}

date -> gregorianDate {% data => ({gregorianDate: data[0]}) %}
      | hebrewDate {% data => ({hebrewDate: data[0]}) %}
gregorianDate -> dateOfMonth __ gregorianMonth ", " year {% data => ({year: data[4], month: data[2], day: data[0]}) %}
               | dateOfMonth __ gregorianMonth {% data => ({month: data[2], day: data[0]}) %}
               | gregorianMonth __ dateOfMonth ", " year {% data => ({year: data[4], month: data[0], day: data[2]}) %}
               | gregorianMonth __ dateOfMonth {% data => ({month: data[0], day: data[2]}) %}
               | dateOfMonth dateSeparator gregorianMonth dateSeparator year {% data => ({year: data[4], month: data[2], day: data[0]}) %}
               | year dateSeparator gregorianMonth dateSeparator dateOfMonth {% data => ({year: data[0], month: data[2], day: data[4]}) %}
               | gregorianMonth dateSeparator dateOfMonth dateSeparator year {% data => ({year: data[4], month: data[0], day: data[2]}) %}
hebrewDate -> dateOfMonth __ hebrewMonth ", " year {% data => ({year: data[4], month: data[2], day: data[0]}) %}
            | dateOfMonth __ hebrewMonth {% data => ({month: data[2], day: data[0]}) %}
            | hebrewMonth __ dateOfMonth ", " year {% data => ({year: data[4], month: data[0], day: data[2]}) %}
            | hebrewMonth __ dateOfMonth {% data => ({month: data[0], day: data[2]}) %}
            | dateOfMonth dateSeparator hebrewMonth dateSeparator year {% data => ({year: data[4], month: data[2], day: data[0]}) %}
            | year dateSeparator hebrewMonth dateSeparator dateOfMonth {% data => ({year: data[0], month: data[2], day: data[4]}) %}
            | hebrewMonth dateSeparator dateOfMonth dateSeparator year {% data => ({year: data[4], month: data[0], day: data[2]}) %}
dateSeparator -> ("-"|"/"|"."|__) {% data => null %}
year -> [0-9]:+ {% data => parseInt(data[0].join("")) %}
      | "-" [0-9]:+ {% data => parseInt(data[0] + data[1].join("")) %}
dateOfMonth ->  ("0":? [1-9] | [12] [0-9] | "3" [01]) {% data => parseInt((data[0][0] || "") + data[0][1]) %}
gregorianMonth -> ("january"|"jan."|"jan"|"1"|"01") {% data => 1 %}
       | ("february"|"feb."|"feb"|"2"|"02") {% data => 2 %}
       | ("march"|"mar."|"mar"|"3"|"03") {% data => 3 %}
       | ("april"|"apr."|"apr"|"4"|"04") {% data => 4 %}
       | ("may"|"5"|"05") {% data => 5 %}
       | ("june"|"jun."|"jun"|"6"|"06") {% data => 6 %}
       | ("july"|"jul."|"jul"|"7"|"07") {% data => 7 %}
       | ("august"|"aug."|"aug"|"8"|"08") {% data => 8 %}
       | ("september"|"sept."|"sept"|"sep."|"sep"|"9"|"09") {% data => 9 %}
       | ("october"|"oct."|"oct"|"10") {% data => 10 %}
       | ("november"|"nov."|"nov"|"11") {% data => 11 %}
       | ("december"|"dec."|"dec"|"12") {% data => 12 %}
hebrewMonth -> ("nisan"|"nissan"|"01"|"1") {% data => 1 %}
             | ("iyar"|"iyyar"|"02"|"2") {% data => 2 %}
             | ("sivan"|"03"|"3") {% data => 3 %}
             | ("tammuz"|"tamuz"|"04"|"4") {% data => 4 %}
             | ("av"|"05"|"5") {% data => 5 %}
             | ("elul"|"06"|"6") {% data => 6 %}
             | ("tishrei"|"tishri"|"07"|"7") {% data => 7 %}
             | ("cheshvan"|"marcheshvan"|"mar cheshvan"|"08"|"8") {% data => 8 %}
             | ("kislev"|"09"|"9") {% data => 9 %}
             | ("teves"|"tevet"|"10") {% data => 10 %}
             | ("shevat"|"11") {% data => 11 %}
             | ("adar"|"adar alef"|"adar i"|"adar 1"|"adar a"|"12") {% data => 12 %}
             | ("adar ii"|"adar bet"|"adar 2"|"adar b"|"13") {% data => 13 %}

# Whitespace (optional)
_ -> [ ]:* {% data => null %}

# Whitespace (required)
__ -> [ ]:+ {% data => null %}
