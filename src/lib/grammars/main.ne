# Nearley grammar for inputting natural language queries

@{%
import { displayHebrew } from "$lib/js/gematria.js";
import { HDate } from '@hebcal/core';
import { getNextHebrewMonth, getPrevHebrewMonth, getCurrentHebrewMonth } from "$lib/js/utils.js";
%}

@builtin "number.ne"  # unsigned_int, int, unsigned_decimal, decimal, percentage, jsonfloat

@include "./generated/units.ne"  # unit, lengthUnit, areaUnit, volumeUnit, weightUnit, coinsUnit, timeUnit
@include "./generated/gematria.ne"  # gematriaMethod
@include "./generated/zmanim.ne"  # zman, duration
@include "./generated/daily-learning.ne"  # dailyLearningType
@include "./generated/holidays.ne"  # holiday

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
      | query[gematriaSearchQuery] {% data => data[0][0] %}
      | query[gematriaTwoWordMatchQuery] {% data => data[0][0] %}
      | query[zmanimQuery] {% data => data[0][0] %}
      | query[hebrewCalendarQuery] {% data => data[0][0] %}
      | query[moladQuery] {% data => data[0][0] %}
      | query[sefirasHaOmerQuery] {% data => data[0][0] %}
      | query[leapYearQuery] {% data => data[0][0] %}
      | query[dailyLearningQuery] {% data => data[0][0] %}
      | query[jewishHolidayQuery] {% data => data[0][0] %}
      | query[zodiacQuery] {% data => data[0][0] %}
      | query[birkasHachamaQuery] {% data => data[0][0] %}
      | query[shmitaQuery] {% data => data[0][0] %}
      | query[shmitaCheckQuery] {% data => data[0][0] %}

# Unit Conversions
# - Convert 10 amos to meters
# - Convert 1 amah to tefachim.
# - How many amos are in a parsah?
# - Convert 40 seah to us liquid gallons.
# - Convert 1 us dollar to perutos.
# - How many chalakim are in an hour?
unitConversionQuery -> optionalWords[[A-Za-z\s]:*] jsonfloat _ unit __ ("to" | "in" | "into") __ unit {% data => ({function: "unitConversionQuery", unitFrom: data[3], unitTo: data[7], amount: data[1]}) %}
                     | optionalWords[[A-Za-z\s]:*] unit __ ("in" | "are in" | "to") __ ("a" | "an") __ unit {% data => ({function: "unitConversionQuery", unitFrom: data[7], unitTo: data[1], amount: 1}) %}
                     | optionalWords[[A-Za-z\s]:*] unit __ ("in" | "are in") __ jsonfloat _ unit {% data => ({function: "unitConversionQuery", unitFrom: data[7], unitTo: data[1], amount: data[5]}) %}

# Conversion Charts
# - Conversion chart for 1 mil
conversionChartQuery -> optionalWords[("conversion" | "conversions" | "convert")] optionalWords["chart"] optionalWords["for"] jsonfloat _ unit {% data => ({function: "conversionChartQuery", unit: data[5], amount: data[3]}) %}
                      | optionalWords[("conversion" | "conversions" | "convert")] optionalWords["chart"] optionalWords["for"] optionalWords[("a" | "an")] unit {% data => ({function: "conversionChartQuery", unit: data[4], amount: 1}) %}

# Gematria Calculations
# - Calculate Gematria of תורה.
# - Calculate Mispar Gadol of מלך.
# - Calculate Mispar Siduri of פרעה.
# - Calculate Mispar Katan Mispari of משיח.
# - Calculate AvGad of משה.
gematriaQuery -> optionalWords[("calculate" | "compute" | "what is" | "what's" | "how much is" | "how many is")] optionalWords["the"] gematriaMethod _ optionalWords["of"] hebrewString {% data => ({function: "gematriaQuery", gematriaMethod: data[2], text: data[5]}) %}
               | hebrewString __ gematriaMethod {% data => ({function: "gematriaQuery", gematriaMethod: data[2], text: data[0]}) %}
               | hebrewString {% data => ({function: "gematriaQuery", gematriaMethod: "standard", text: data[0]}) %}

# Gematria Search
# - What words have a gematria of 613?
# - What words have the same gematria as תורה?
# - What pesukim have a gematria of 613?
gematriaSearchQuery -> gematriaSearchPrefix __ hebrewString {% data => ({function: "gematriaSearchQuery", gematriaMethod: data[0], text: data[2] }) %}
                     | gematriaSearchPrefix __ int {% data => ({function: "gematriaSearchQuery", gematriaMethod: data[0], value: data[2] }) %}

gematriaSearchPrefix -> optionalWords[("calculate" | "what" | "which" | "list" | "show" | "display" | "find" | "search")] ("words" | "pesukim" | "words and pesukim" | "verses" | "words and verses" | "sentences" | "phrases" | "words and phrases" | "words and sentences") __ optionalWords["have"] optionalWords[("the" | "a" | "the same")] gematriaMethod __ ("of" | "as") {% data => data[5] %}

# Gematria Two-Word Match Finder
# - Calculate gematria equivalences for תורה and משנה.
# - Calculate gematria equivalences for תורה and משנה with Mispar Katan Mispari.
# - Calculate gematria equivalences for תורה and משנה in the same method.
gematriaTwoWordMatchQuery -> gematriaTwoWordMatchPrefix {% data => ({function: "gematriaTwoWordMatchQuery", ...data[0]}) %}
                           | gematriaTwoWordMatchPrefix __ optionalWords[("with" | "in")] gematriaMethod {% data => ({function: "gematriaTwoWordMatchQuery", ...data[0], gematriaMethod: data[3]}) %}
                           | gematriaTwoWordMatchPrefix __ optionalWords[("with" | "in")] optionalWords["the"] "same method" {% data => ({function: "gematriaTwoWordMatchQuery", ...data[0], sameMethod: true}) %}

gematriaTwoWordMatchPrefix -> optionalWords[("calculate" | "list" | "show" | "display" | "find" | "search")] gematriaMethod __ ("equivalences" | "matches") __ optionalWords[("of" | "for" | "with")] hebrewString __ "and" __ hebrewString {% data => ({ word1: data[6], word2: data[10] }) %}

# Hebrew words for Gematria calculations
hebrewString -> [\u05D0-\u05EA\u05F0\u05F1\u05F2\uFB1F\uFB2E-\uFB30\uFB4F\uFB21\uFB31\uFB4C\uFB32\uFB33\uFB22\uFB34\uFB23\uFB4B\uFB35\uFB36\uFB38\uFB39\uFB1D\uFB3A\uFB3B\uFB4D\uFB24\uFB3C\uFB25\uFB26\uFB3E\uFB40\u05C6\uFB41\uFB42\uFB20\uFB43\uFB44\uFB4E\uFB46\uFB47\uFB48\uFB27\uFB49\uFB2A-\uFB2D\uFB4A\uFB28.!?,;:()\s+\-\u0591-\u05CF\u05F3\u05F4\uFB1D\uFB1E]:+ {% data => displayHebrew(data[0].join("").trim()) %}

# Zmanim
# - What time is chatzos in New York?
# - Zmanim for Denver
# - Zmanim for 1 Teves 5784 in Jerusalem
# - What time is sunset on December 25, 2023 in Los Angeles?
# - How long is a shaah zmanis in 39.1, -107.4?
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

# Hebrew Calendar
# - Convert 21 Kislev, 5730 to Gregorian calendar.
# - Convert December 1, 1969 to Hebrew calendar.
# - Convert 5780 to Gregorian calendar.
# - When will 14 Nissan fall next year?
# - Today's date on Hebrew calendar.
hebrewCalendarQuery -> optionalWords[("convert" | "translate")] date _ optionalWords[("on" | "to" | "into")] _ optionalWords[("gregorian" | "english" | "standard" | "hebrew" | "jewish")] _ optionalWords[("calendar" | "date")] {% data => ({function: "hebrewCalendarQuery", date: data[1]}) %}
                     | optionalWords[("convert" | "translate")] optionalWords["year"] calendarAwareYear _ optionalWords[("on" | "to" | "into")] _ optionalWords[("gregorian" | "english" | "standard" | "hebrew" | "jewish")] _ optionalWords[("calendar" | "date")] {% data => ({function: "hebrewCalendarQuery", year: data[2]}) %}
                     | optionalWords["when"] optionalWords[("will" | "is" | "does" | "did")] hebrewDate __ optionalWords[("fall" | "occur" | "be" | "land")] optionalWords["in"] calendarAwareYear {% data => ({function: "hebrewCalendarQuery", date: data[2], year: data[6]}) %}
                     | optionalWords["when"] optionalWords[("will" | "is" | "does" | "did")] gregorianDate __ optionalWords[("fall" | "occur" | "be" | "land")] optionalWords["in"] calendarAwareYear {% data => ({function: "hebrewCalendarQuery", date: data[2], year: data[6]}) %}

# Molad
# - Calculate the molad of Sivan 5781.
# - When will the molad of Elul be?
# - When is the next molad?
# - Calculate molados for 5781.
moladQuery -> optionalWords[("calculate" | "compute" | "what is" | "what's" | "when is" | "when's" | "what time is" | "what time was")] optionalWords["the"] moladMonth {% data => ({function: "moladQuery", ...data[2]}) %}
            | optionalWords["when will"] optionalWords["the"] moladMonth _ optionalWords[("be" | "occur" | "land" | "fall")] {% data => ({function: "moladQuery", ...data[2]}) %}
            | optionalWords[("calculate" | "compute" | "what are" | "when are")] optionalWords["the"] ("molados" | "moladot" | "moladim" | "molads" | "molad") _ optionalWords[("for" | "or" | "in")] hebrewYear {% data => ({function: "moladQuery", year: data[5]}) %}

# Sefiras HaOmer
# - Sefiras Haomer for tonight
# - Day of Omer on May 12, 2021
# - Day of Omer on 18 Iyar
sefirasHaOmerQuery -> optionalWords[("calculate" | "compute" | "what is" | "what's")] optionalWords["the"] ("day of omer" | "omer" | "omer count" | "sefiras haomer" | "sefirat haomer" | "sefirah" | "sefiras ha'omer" | "sefirat ha'omer") __ optionalWords[("on" | "for")] date {% data => ({function: "sefirasHaOmerQuery", date: data[5]}) %}

# Leap Years
# - Is this year a leap year?
# - Was 5775 a leap year?
# - Will 5784 be a leap year?
# - Is next year a leap year?
leapYearQuery -> optionalWords[("is" | "was" | "will")] optionalWords[("gregorian" | "english" | "standard")] optionalWords["year"] gregorianYear __ optionalWords[("be a" | "a")] "leap year" _ optionalWords["on"] optionalWords["the"] optionalWords[("gregorian" | "english" | "standard")] optionalWords["calendar"] {% data => ({function: "leapYearQuery", year: data[3], calendar: "gregorian"}) %}
               | optionalWords[("is" | "was" | "will")] optionalWords[("hebrew" | "jewish")] optionalWords["year"] hebrewYear __ optionalWords[("be a" | "a")] "leap year" _ optionalWords["on"] optionalWords["the"] optionalWords[("hebrew" | "jewish")] optionalWords["calendar"] {% data => ({function: "leapYearQuery", year: data[3], calendar: "hebrew"}) %}

# Daily Learning / Daf Yomi
# - What is today's Daf Yomi?
# - What is the Daf Yomi for tomorrow?
# - What is the Nach Yomi for May 12, 2023?
# - What are the daily psalms for tomorrow?
# - What is the Weekly Daf for 18 Iyar?
# - What will the daf yomi for december 31
dailyLearningQuery -> optionalWords[("what is" | "what was" | "what's" | "what are" | "what will")] optionalWords["the"] optionalWords["daily"] dailyLearningType __ optionalWords["be"] optionalWords[("for" | "on")] date {% data => ({function: "dailyLearningQuery", date: data[7], dailyLearningType: data[3]}) %}
                    | optionalWords[("what is" | "what was" | "what's" | "what are" | "what will")] ("today's" | "this week's") optionalWords["daily"] dailyLearningType {% data => ({function: "dailyLearningQuery", date: { gregorianDate: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()}}, dailyLearningType: data[3]}) %}
                    | optionalWords[("what is" | "what's" | "what are" | "what will")] "tomorrow's" optionalWords["daily"] dailyLearningType {% data => ({function: "dailyLearningQuery", date: { gregorianDate: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1}}, dailyLearningType: data[3]}) %}
                    | optionalWords[("what is" | "what was" | "what's" | "what are")] "yesterday's" optionalWords["daily"] dailyLearningType {% data => ({function: "dailyLearningQuery", date: { gregorianDate: {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() - 1}}, dailyLearningType: data[3]}) %}

# Jewish Holidays
# - When is Rosh Hashana?
# - When did Pesach fall last year?
# - When is the next Rosh Chodesh?
# - List Jewish holidays in Hebrew year 5784.
# - List Jewish holidays in Gregorian year 2023.
# - List upcoming Jewish holidays.
jewishHolidayQuery -> jewishHolidayUpcomingPrefix optionalWords[("next" | "upcoming" | "this" | "this coming" | "the next" | "the upcoming")] holiday _ optionalWords[("fall" | "occur" | "land" | "be")] optionalWords[("this year" | "next year")] {% data => ({function: "jewishHolidayQuery", holiday: data[2], upcoming: true }) %}
                    | jewishHolidayPastPrefix optionalWords[("last" | "previous" | "the last" | "the previous")] holiday _ optionalWords[("fall" | "occur" | "land" | "happen")] optionalWords[("this year" | "last year")] {% data => ({function: "jewishHolidayQuery", holiday: data[2], upcoming: false }) %}
                    | jewishHolidayWhenPrefix _ optionalWords["the"] holiday _ optionalWords[("fall" | "occur" | "land" | "happen" | "be")] optionalWords[("in" | "for" | "of")] optionalWords["the"] ("gregorian" | "english" | "standard") __ "year" __ gregorianYear {% data => ({function: "jewishHolidayQuery", holiday: data[3], year: { value: data[12], calendar: "gregorian" } }) %}
                    | jewishHolidayWhenPrefix _ optionalWords["the"] holiday _ optionalWords[("fall" | "occur" | "land" | "happen" | "be")] optionalWords[("in" | "for" | "of")] optionalWords["the"] ("hebrew" | "jewish") __ "year" __ hebrewYear {% data => ({function: "jewishHolidayQuery", holiday: data[3], year: { value: data[12], calendar: "hebrew" } }) %}
                    | jewishHolidayWhenPrefix _ optionalWords["the"] holiday _ optionalWords[("fall" | "occur" | "land" | "happen" | "be")] optionalWords[("in" | "for" | "of")] optionalWords["the year"] __ calendarAwareYear {% data => ({function: "jewishHolidayQuery", holiday: data[3], year: data[9] }) %}
                    | jewishHolidayListPrefix _ optionalWords["the"] ("gregorian" | "english" | "standard") __ "year" __ gregorianYear {% data => ({function: "jewishHolidayQuery", year: { value: data[7], calendar: "gregorian" } }) %}
                    | jewishHolidayListPrefix _ optionalWords["the"] ("hebrew" | "jewish") __ "year" __ hebrewYear {% data => ({function: "jewishHolidayQuery", year: { value: data[7], calendar: "hebrew" } }) %}
                    | jewishHolidayListPrefix _ optionalWords["the year"] calendarAwareYear {% data => ({function: "jewishHolidayQuery", year: data[3] }) %}
                    | jewishHolidaysListPrefixNoYear {% data => ({function: "jewishHolidayQuery"}) %}

jewishHolidayWhenPrefix -> jewishHolidayUpcomingPrefix {% data => null %}
                         | jewishHolidayPastPrefix {% data => null %}
jewishHolidayUpcomingPrefix -> optionalWords[("when is" | "when's" | "what is" | "what's" | "what's" | "when will")] optionalWords[("the date of" | "the date for")] _ {% data => null %}
jewishHolidayPastPrefix -> optionalWords[("when was" | "what was" | "what was" | "what was" | "when did")] optionalWords[("the date of" | "the date for")] _ {% data => null %}

jewishHolidayListPrefix -> jewishHolidaysListPrefixNoYear __ optionalWords[("in" | "for" | "of")] {% data => null %}
jewishHolidaysListPrefixNoYear -> optionalWords[("list" | "show" | "display" | "find" | "search")] optionalWords[("the" | "of")] optionalWords["upcoming"] optionalWords[("jewish" | "hebrew calendar")] _ "holidays" {% data => null %}

# Zodiac Signs
# - What is the zodiac sign for 1 Teves?
# - What is the zodiac sign for December 25, 2023?
zodiacQuery -> optionalWords[("what is" | "what's" | "what was")] optionalWords["the"] optionalWords[("hebrew" | "jewish")] "zodiac" __ optionalWords["sign"] optionalWords[("for" | "on")] date {% data => ({function: "zodiacQuery", date: data[7]}) %}

# Birkas Hachama
# - When is the next Birkas Hachama?
# - When was the last Birkas Hachama?
# - When will Birkas Hachama be after 2037?
# - When was Birkas Hachama before 2009?
birkasHachamaQuery -> optionalWords[("when's" | "when was" | "when is" | "when did" | "when will")] optionalWords["the"] _ "next" __ birkasHachamaTerm optionalWords[("be" | "land" | "fall" | "occur")] {% data => ({function: "birkasHachamaQuery", direction: 1}) %}
                    | optionalWords[("when's" | "when was" | "when is" | "when did" | "when will")] optionalWords["the"] _ "last" __ birkasHachamaTerm optionalWords[("happen" | "land" | "fall" | "occur")] {% data => ({function: "birkasHachamaQuery", direction: -1}) %}
                    | optionalWords[("when's" | "when was" | "when is" | "when did" | "when will")] optionalWords["the"] optionalWords["next"] _ birkasHachamaTerm __ optionalWords[("be" | "land" | "fall" | "occur")] _ "after" __ calendarAwareYear {% data => ({function: "birkasHachamaQuery", direction: 1, year: data[10]}) %}
                    | optionalWords[("when's" | "when was" | "when is" | "when did" | "when will")] optionalWords["the"] optionalWords[("last" | "previous")] _ birkasHachamaTerm __ optionalWords[("happen" | "land" | "fall" | "occur")] _ "before" __ calendarAwareYear {% data => ({function: "birkasHachamaQuery", direction: -1, year: data[10]}) %}

birkasHachamaTerm -> ("birkas hachama" | "birkat hachama" | "blessing of the sun" | "birchas hachama" | "birchat hachama" | "ברכת החמה") {% data => null %}

# Shmita
# - When is the next Shmita?
# - When was the last Shmita?
# - When will Shmita be after 2023?
# - When was Shmita before 2021?
# - Is 5782 a Shmita year?
shmitaQuery -> optionalWords[("when's" | "when was" | "when is" | "when did" | "when will")] optionalWords["the"] _ "next" __ shmitaTerm optionalWords[("be" | "land" | "fall" | "occur")] {% data => ({function: "shmitaQuery", direction: 1}) %}
                    | optionalWords[("when's" | "when was" | "when is" | "when did" | "when will")] optionalWords["the"] _ "last" __ shmitaTerm optionalWords[("happen" | "land" | "fall" | "occur")] {% data => ({function: "shmitaQuery", direction: -1}) %}
                    | optionalWords[("when's" | "when was" | "when is" | "when did" | "when will")] optionalWords["the"] optionalWords["next"] _ shmitaTerm __ optionalWords[("be" | "land" | "fall" | "occur")] _ "after" __ calendarAwareYear {% data => ({function: "shmitaQuery", direction: 1, year: data[10]}) %}
                    | optionalWords[("when's" | "when was" | "when is" | "when did" | "when will")] optionalWords["the"] optionalWords[("last" | "previous")] _ shmitaTerm __ optionalWords[("happen" | "land" | "fall" | "occur")] _ "before" __ calendarAwareYear {% data => ({function: "shmitaQuery", direction: -1, year: data[10]}) %}

shmitaCheckQuery -> optionalWords[("is" | "was" | "will")] optionalWords[("hebrew" | "jewish")] optionalWords["year"] hebrewYear __ optionalWords[("be a" | "a")] shmitaTerm _ optionalWords["year"] _ optionalWords["on"] optionalWords["the"] optionalWords[("hebrew" | "jewish")] optionalWords["calendar"] {% data => ({function: "shmitaCheckQuery", year: data[3]}) %}

shmitaTerm -> shmitaWord {% data => null %}
            | shmitaWord __ "year" {% data => null %}

shmitaWord -> ("shmita" | "shemita" | "shmitta" | "shemitta" | "shmitah" | "shemitah" | "shmittah" | "shemittah" | "שמיטה" | "sabbatical year" | "sabbatical") {% data => null %}

# Date parsing
date -> gregorianDate {% data => data[0] %}
      | hebrewDate {% data => data[0] %}
gregorianDate -> gregorianDateInner {% data => ({gregorianDate: data[0]}) %}
               | gregorianDateInner __ ("(" | _) ("after sunset" | "after sundown" | "after nightfall" | "after nightfall" | "at night" | "night") (")" | _) {% data => ({gregorianDate: {afterSunset: true, ...data[0]}}) %}
gregorianDateInner -> dateOfMonth __ gregorianMonth (", " | __) gregorianYear {% data => ({year: data[4], month: data[2], day: data[0], format: "DMY"}) %}
                    | dateOfMonth __ gregorianMonth {% data => ({month: data[2], day: data[0], format: "DM"}) %}
                    | gregorianMonth __ dateOfMonth (", " | __) gregorianYear {% data => ({year: data[4], month: data[0], day: data[2], format: "MDY"}) %}
                    | gregorianMonth __ dateOfMonth {% data => ({month: data[0], day: data[2], format: "MD"}) %}
                    | dateOfMonth dateSeparator gregorianMonth dateSeparator gregorianYear {% data => ({year: data[4], month: data[2], day: data[0], format: "DMY"}) %}
                    | gregorianYear dateSeparator gregorianMonth dateSeparator dateOfMonth {% data => ({year: data[0], month: data[2], day: data[4], format: "YMD"}) %}
                    | gregorianMonth dateSeparator dateOfMonth dateSeparator gregorianYear {% data => ({year: data[4], month: data[0], day: data[2], format: "MDY"}) %}
                    | dateOfMonth dateSeparator gregorianMonth {% data => ({month: data[2], day: data[0], format: "DM"}) %}
                    | gregorianMonth dateSeparator dateOfMonth {% data => ({month: data[0], day: data[2], format: "MD"}) %}
                    | "today" {% data => ({year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()}) %}
                    | "today's" __ "date" {% data => ({year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()}) %}
                    | "tonight" {% data => ({year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate(), afterSunset: true }) %}
                    | "tomorrow" {% data => ({year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1}) %}
                    | "tomorrow night" {% data => ({year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1, afterSunset: true }) %}
                    | "yesterday" {% data => ({year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() - 1}) %}
                    | "last night" {% data => ({year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() - 1, afterSunset: true }) %}
                    | ("next" | "upcoming") __ "week" {% data => ({year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 7}) %}
                    | ("next" | "upcoming") __ "month" {% data => ({year: new Date().getFullYear(), month: new Date().getMonth() + 2, day: new Date().getDate()}) %}
                    | ("next" | "upcoming") __ "year" {% data => ({year: new Date().getFullYear() + 1, month: new Date().getMonth() + 1, day: new Date().getDate()}) %}
                    | ("last" | "previous") __ "week" {% data => ({year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() - 7}) %}
                    | ("last" | "previous") __ "month" {% data => ({year: new Date().getFullYear(), month: new Date().getMonth(), day: new Date().getDate()}) %}
                    | ("last" | "previous") __ "year" {% data => ({year: new Date().getFullYear() - 1, month: new Date().getMonth() + 1, day: new Date().getDate()}) %}
hebrewDate -> hebrewDateInner {% data => ({hebrewDate: data[0]}) %}
hebrewDateInner -> dateOfMonth __ hebrewMonth (", " | __) hebrewYear {% data => ({year: data[4], month: data[2], day: data[0], format: "DMY"}) %}
                 | dateOfMonth __ hebrewMonth {% data => ({month: data[2], day: data[0], format: "DM"}) %}
                 | hebrewMonth __ dateOfMonth (", " | __) hebrewYear {% data => ({year: data[4], month: data[0], day: data[2], format: "MDY"}) %}
                 | hebrewMonth __ dateOfMonth {% data => ({month: data[0], day: data[2], format: "MD"}) %}
                 | dateOfMonth dateSeparator hebrewMonth dateSeparator hebrewYear {% data => ({year: data[4], month: data[2], day: data[0], format: "DMY"}) %}
                 | hebrewYear dateSeparator hebrewMonth dateSeparator dateOfMonth {% data => ({year: data[0], month: data[2], day: data[4], format: "YMD"}) %}
                 | hebrewMonth dateSeparator dateOfMonth dateSeparator hebrewYear {% data => ({year: data[4], month: data[0], day: data[2], format: "MDY"}) %}
                 | dateOfMonth dateSeparator hebrewMonth {% data => ({month: data[2], day: data[0], format: "DM"}) %}
                 | hebrewMonth dateSeparator dateOfMonth {% data => ({month: data[0], day: data[2], format: "MD"}) %}
moladMonth -> "molad" __ optionalWords["of"] hebrewMonth __ hebrewYear {% data => ({year: data[5], month: data[3]}) %}
            | "molad" __ optionalWords["of"] hebrewMonth {% data => ({month: data[3], year: new HDate().getFullYear()}) %}
            | ("next" | "upcoming") __ "molad" {% data => getNextHebrewMonth() %}
            | ("last" | "previous") __ "molad" {% data => getPrevHebrewMonth() %}
            | ("this" | "this month's" | "current") __ "molad" {% data => getCurrentHebrewMonth() %}
dateSeparator -> ("-"|"/"|".") {% data => null %}
year -> gregorianYear {% data => data[0] %}
      | hebrewYear {% data => data[0] %}
calendarAwareYear -> gregorianYear {% data => ({ value: data[0], calendar: "gregorian" }) %}
                   | hebrewYear {% data => ({ value: data[0], calendar: "hebrew" }) %}
gregorianYear -> [0-9]:+ {% data => parseInt(data[0].join("")) %}
               | "-" [0-9]:+ {% data => parseInt(data[0] + data[1].join("")) %}
               | optionalWords["the"] ("next" | "upcoming" | "following") __ "year" {% data => new Date().getFullYear() + 1 %}
               | optionalWords["the"] ("last" | "previous") __ "year" {% data => new Date().getFullYear() - 1 %}
               | ("this" | "the current") __ "year" {% data => new Date().getFullYear() %}
hebrewYear -> [0-9]:+ {% data => parseInt(data[0].join("")) %}
            | "-" [0-9]:+ {% data => parseInt(data[0] + data[1].join("")) %}
            | optionalWords["the"] ("next" | "upcoming" | "following") __ "year" {% data => new HDate().getFullYear() + 1 %}
            | optionalWords["the"] ("last" | "previous") __ "year" {% data => new HDate().getFullYear() - 1 %}
            | ("this" | "the current") __ "year" {% data => new HDate().getFullYear() %}
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
