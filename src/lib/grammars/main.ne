# Nearley Grammar for inputting natural language queries
#
# Example queries supported
# =========================
#
# Unit conversions
# ----------------
# - Convert 10 amos to meters
# - Convert 1 amah to tefachim.
# - How many amos are in a parsah?
# - Convert 40 seah to us liquid gallons.
# - Convert 1 us dollar to perutos.
# - How many chalakim are in an hour?
# - Conversion chart for 1 mil
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
# - What time is chatzos in New York?
# - Zmanim for Denver
# - Zmanim for 1 Teves 5784 in Jerusalem
# - What time is sunset on December 25, 2023 in Los Angeles?
# - How long is a shaah zmanis in 39.1, -107.4?
#
# Hebrew Calendar
# ---------------
# - Convert 21 Kislev, 5730 to Gregorian calendar.
# - Convert December 1, 1969 to Hebrew calendar.
# - Convert 5780 to Gregorian calendar.
# - When will 14 Nissan fall next year?
# - Today's date on Hebrew calendar.
#
#
# Molad
# -----
# - Calculate the molad of Sivan 5781.
# - When will the molad of Elul be?
# - When is the next molad?
# - Calculate molados for 5781.
#
# Sefiras HaOmer
# --------------
# - Sefiras Haomer for tonight
# - Day of Omer on May 12, 2021
# - Day of Omer on 18 Iyar
# 
# More coming soon...

@{%
import { displayHebrew } from "$lib/js/gematria.js";
import { HDate } from '@hebcal/core';

/**
 * Returns the next Hebrew month
 * @returns {{month: number, year: number}}
 */
function getNextHebrewMonth() {
      const today = new HDate();
      const monthsInYear = today.isLeapYear() ? 13 : 12;
      const nextHebrewMonth = (today.getMonth() + 1) % monthsInYear || monthsInYear;
      return {
            month: nextHebrewMonth,
            year: nextHebrewMonth === 1 ? today.getFullYear() + 1 : today.getFullYear(),
      };

}

/**
 * Returns the previous Hebrew month
 * @returns {{month: number, year: number}}
 */
function getPrevHebrewMonth() {
      const today = new HDate();
      const monthsInPrevYear = (7 * today.getFullYear()) % 19 < 7 ? 13 : 12;
      const prevHebrewMonth = (today.getMonth() - 1) || monthsInPrevYear;
      return {
            month: prevHebrewMonth,
            year: prevHebrewMonth === monthsInPrevYear ? today.getFullYear() - 1 : today.getFullYear(),
      };
}

/**
 * Returns the current Hebrew month
 * @returns {{month: number, year: number}}
 */
function getCurrentHebrewMonth() {
      const today = new HDate();
      return {
            month: today.getMonth(),
            year: today.getFullYear(),
      };
}
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

# Macro for matching a string with optional trailing spaces or optional whitespace
optionalWordsEnd[STRING] -> $STRING _ {% data => data[0] %}
                          | _ {% data => null %}

# Start symbol
main -> query[unitConversionQuery] {% data => data[0][0] %}
      | query[conversionChartQuery] {% data => data[0][0] %}
      | query[gematriaQuery] {% data => data[0][0] %}
      | query[zmanimQuery] {% data => data[0][0] %}
      | query[hebrewCalendarQuery] {% data => data[0][0] %}
      | query[moladQuery] {% data => data[0][0] %}
      | query[sefirasHaOmerQuery] {% data => data[0][0] %}

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
             | optionalWords[("what time is" | "when is" | "what's the time of" | "what's the time for" | "what time does")] zman _ optionalWords[("in" | "at" | "for")] _ location {% data => ({function: "zmanimQuery", zman: data[1], location: data[5]}) %}
             | optionalWords[("what time is" | "when is" | "what's the time of" | "what's the time for" | "what time does")] zman _ optionalWords[("on" | "for")] _ date {% data => ({function: "zmanimQuery", zman: data[1], date: data[5]}) %}
             | optionalWords[("what time is" | "when is" | "what's the time of" | "what's the time for" | "what time does")] zman _ optionalWords[("on" | "for")] _ date _ optionalWords[("in" | "at" | "for")] _ location {% data => ({function: "zmanimQuery", zman: data[1], date: data[5], location: data[9]}) %}
             | optionalWords[("what time is" | "when is" | "what's the time of" | "what's the time for" | "what time does")] zman _ optionalWords[("in" | "at" | "for")] _ location _ optionalWords[("on" | "for")] _ date {% data => ({function: "zmanimQuery", zman: data[1], date: data[9], location: data[5]}) %}
             | optionalWords[("how long is" | "what is the length of")] optionalWords[("a" | "an" | "the")] duration {% data => ({function: "zmanimQuery", zman: data[2]}) %}
             | optionalWords[("how long is" | "what is the length of")] optionalWords[("a" | "an" | "the")] duration _ optionalWords[("in" | "at" | "for")] _ location {% data => ({function: "zmanimQuery", zman: data[2], location: data[6]}) %}
             | optionalWords[("how long is" | "what is the length of")] optionalWords[("a" | "an" | "the")] duration _ optionalWords[("on" | "for")] _ date {% data => ({function: "zmanimQuery", zman: data[2], date: data[6]}) %}
             | optionalWords[("how long is" | "what is the length of")] optionalWords[("a" | "an" | "the")] duration _ optionalWords[("on" | "for")] _ date _ optionalWords[("in" | "at" | "for")] _ location {% data => ({function: "zmanimQuery", zman: data[2], date: data[6], location: data[8]}) %}
             | optionalWords[("how long is" | "what is the length of")] optionalWords[("a" | "an" | "the")] duration _ optionalWords[("in" | "at" | "for")] _ location _ optionalWords[("on" | "for")] _ date {% data => ({function: "zmanimQuery", zman: data[2], date: data[8], location: data[6]}) %}
             | optionalWords[("how long is" | "what is the length of")] optionalWords[("a" | "an" | "the")] duration _ optionalWords[("in" | "at" | "for")] _ location {% data => ({function: "zmanimQuery", zman: data[2], location: data[6]}) %}
             | "zmanim" __ optionalWords["for"] date {% data => ({function: "zmanimQuery", date: data[3]}) %}
             | "zmanim" __ optionalWords["for"] date _ optionalWords[("in" | "at" | "for")] _ location {% data => ({function: "zmanimQuery", date: data[3], location: data[7]}) %}
             | "zmanim" __ optionalWords["for"] location {% data => ({function: "zmanimQuery", location: data[3]}) %}
             | "zmanim" __ optionalWords["for"] location _ optionalWords[("on" | "for")] _ date {% data => ({function: "zmanimQuery", date: data[7], location: data[3]}) %}

# Location parsing for Zmanim queries
location -> [a-zÀ-ÖØ-öø-ÿ\d\s,.'()+":;\-]:+ {% data => data[0].join("") %}

# Hebrew Calendar queries
hebrewCalendarQuery -> optionalWords[("convert" | "translate")] date _ optionalWords[("on" | "to" | "into")] _ optionalWords[("gregorian" | "english" | "standard" | "hebrew" | "jewish")] _ optionalWordsEnd[("calendar" | "date")] {% data => ({function: "hebrewCalendarQuery", date: data[1]}) %}
                     | optionalWords[("convert" | "translate")] year _ optionalWords[("on" | "to" | "into")] _ optionalWords[("gregorian" | "english" | "standard" | "hebrew" | "jewish")] _ optionalWordsEnd[("calendar" | "date")] {% data => ({function: "hebrewCalendarQuery", year: data[1]}) %}
                     | optionalWords["when"] optionalWords[("will" | "is" | "does" | "did")] date __ optionalWords[("fall" | "occur" | "be" | "land")] optionalWords["in"] year {% data => ({function: "hebrewCalendarQuery", date: data[2], year: data[6]}) %}

# Molad queries
moladQuery -> optionalWords[("calculate" | "compute" | "what is" | "what's" | "when is" | "when's" | "what time is" | "what time was")] optionalWords["the"] moladMonth {% data => ({function: "moladQuery", ...data[2]}) %}
            | optionalWords["when will"] optionalWords["the"] moladMonth _ optionalWordsEnd[("be" | "occur" | "land" | "fall")] {% data => ({function: "moladQuery", ...data[2]}) %}
            | optionalWords[("calculate" | "compute" | "what are" | "when are")] optionalWords["the"] ("molados" | "moladot" | "moladim" | "molads" | "molad") _ optionalWords[("for" | "or" | "in")] year {% data => ({function: "moladQuery", year: data[5]}) %}

# Sefiras HaOmer queries
sefirasHaOmerQuery -> optionalWords[("calculate" | "compute" | "what is" | "what's")] optionalWords["the"] ("day of omer" | "omer" | "omer count" | "sefiras haomer" | "sefirat haomer" | "sefirah" | "sefiras ha'omer" | "sefirat ha'omer") __ optionalWords[("on" | "for")] date {% data => ({function: "sefirasHaOmerQuery", date: data[5]}) %}

# Date parsing for Zmanim, Hebrew Calendar, Molad, and Omer queries
date -> gregorianDate {% data => ({gregorianDate: data[0]}) %}
      | hebrewDate {% data => ({hebrewDate: data[0]}) %}
      | "today" {% data => ({gregorianDate: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()}}) %}
      | "today's" __ "date" {% data => ({gregorianDate: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()}}) %}
      | "tonight" {% data => ({gregorianDate: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate(), afterSunset: true }}) %}
      | "tomorrow" {% data => ({gregorianDate: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1}}) %}
      | "tomorrow night" {% data => ({gregorianDate: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1, afterSunset: true }}) %}
      | "yesterday" {% data => ({gregorianDate: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() - 1}}) %}
      | "last night" {% data => ({gregorianDate: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() - 1, afterSunset: true }}) %}
      | ("next" | "upcoming") __ "week" {% data => ({gregorianDate: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 7}}) %}
      | ("next" | "upcoming") __ "month" {% data => ({gregorianDate: {year: new Date().getFullYear(), month: new Date().getMonth() + 2, day: new Date().getDate()}}) %}
      | ("last" | "previous") __ "week" {% data => ({gregorianDate: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() - 7}}) %}
      | ("last" | "previous") __ "month" {% data => ({gregorianDate: {year: new Date().getFullYear(), month: new Date().getMonth(), day: new Date().getDate()}}) %}
      | ("last" | "previous") __ "year" {% data => ({gregorianDate: {year: new Date().getFullYear() - 1, month: new Date().getMonth() + 1, day: new Date().getDate()}}) %}
gregorianDate -> dateOfMonth __ gregorianMonth (", " | __) year {% data => ({year: data[4], month: data[2], day: data[0], format: "DMY"}) %}
               | dateOfMonth __ gregorianMonth {% data => ({month: data[2], day: data[0], format: "DM"}) %}
               | gregorianMonth __ dateOfMonth (", " | __) year {% data => ({year: data[4], month: data[0], day: data[2], format: "MDY"}) %}
               | gregorianMonth __ dateOfMonth {% data => ({month: data[0], day: data[2], format: "MD"}) %}
               | dateOfMonth dateSeparator gregorianMonth dateSeparator year {% data => ({year: data[4], month: data[2], day: data[0], format: "DMY"}) %}
               | year dateSeparator gregorianMonth dateSeparator dateOfMonth {% data => ({year: data[0], month: data[2], day: data[4], format: "YMD"}) %}
               | gregorianMonth dateSeparator dateOfMonth dateSeparator year {% data => ({year: data[4], month: data[0], day: data[2], format: "MDY"}) %}
               | dateOfMonth dateSeparator gregorianMonth {% data => ({month: data[2], day: data[0], format: "DM"}) %}
               | gregorianMonth dateSeparator dateOfMonth {% data => ({month: data[0], day: data[2], format: "MD"}) %}
               | gregorianDate __ ("(" | _) ("after sunset" | "after sundown" | "after nightfall" | "after nightfall" | "at night" | "night") (")" | _) {% data => ({afterSunset: true, ...data[0]}) %}
hebrewDate -> dateOfMonth __ hebrewMonth (", " | __) year {% data => ({year: data[4], month: data[2], day: data[0], format: "DMY"}) %}
            | dateOfMonth __ hebrewMonth {% data => ({month: data[2], day: data[0], format: "DM"}) %}
            | hebrewMonth __ dateOfMonth (", " | __) year {% data => ({year: data[4], month: data[0], day: data[2], format: "MDY"}) %}
            | hebrewMonth __ dateOfMonth {% data => ({month: data[0], day: data[2], format: "MD"}) %}
            | dateOfMonth dateSeparator hebrewMonth dateSeparator year {% data => ({year: data[4], month: data[2], day: data[0], format: "DMY"}) %}
            | year dateSeparator hebrewMonth dateSeparator dateOfMonth {% data => ({year: data[0], month: data[2], day: data[4], format: "YMD"}) %}
            | hebrewMonth dateSeparator dateOfMonth dateSeparator year {% data => ({year: data[4], month: data[0], day: data[2], format: "MDY"}) %}
            | dateOfMonth dateSeparator hebrewMonth {% data => ({month: data[2], day: data[0], format: "DM"}) %}
            | hebrewMonth dateSeparator dateOfMonth {% data => ({month: data[0], day: data[2], format: "MD"}) %}
moladMonth -> "molad" __ optionalWords["of"] hebrewMonth __ year {% data => ({year: data[5], month: data[3]}) %}
            | "molad" __ optionalWords["of"] hebrewMonth {% data => ({month: data[3], year: new HDate().getFullYear()}) %}
            | ("next" | "upcoming") __ "molad" {% data => getNextHebrewMonth() %}
            | ("last" | "previous") __ "molad" {% data => getPrevHebrewMonth() %}
            | ("this" | "this month's" | "current") __ "molad" {% data => getCurrentHebrewMonth() %}
dateSeparator -> ("-"|"/"|".") {% data => null %}
year -> [0-9]:+ {% data => parseInt(data[0].join("")) %}
      | "-" [0-9]:+ {% data => parseInt(data[0] + data[1].join("")) %}
      | optionalWords["the"] ("next" | "upcoming" | "following") __ "year" {% data => new Date().getFullYear() + 1 %}
      | optionalWords["the"] ("last" | "previous") __ "year" {% data => new Date().getFullYear() - 1 %}
      | ("this" | "the current") __ "year" {% data => new Date().getFullYear() %}
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
