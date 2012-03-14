// $Id: calendar-en.js 11933 2008-06-16 15:47:01Z nmaxim $
// ** I18N

// Calendar EN language
// Author: Mihai Bazon, <mihai_bazon@yahoo.com>
// Encoding: any
// Distributed under the same terms as the calendar itself.

// For translators: please use UTF-8 if possible.  We strongly believe that
// Unicode is the answer to a real internationalized world.  Also please
// include your contact information in the header, as can be seen above.


// Please note that the following array of short day names (and the same goes
// for short month names, _SMN) isn't absolutely necessary.  We give it here
// for exemplification on how one can customize the short day names, but if
// they are simply the first N letters of the full name you can simply say:
//
//   Zapatec.Calendar._SDN_len = N; // short day name length
//   Zapatec.Calendar._SMN_len = N; // short month name length
//
// If N = 3 then this is not needed either since we assume a value of 3 if not
// present, to be compatible with translation files that were written before
// this feature.

Zapatec.Utils.createNestedHash(Zapatec, ["Langs", "Zapatec.Calendar", "en"], {
  // full day names
  "_DN"  : new Array
           ("Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"),
  // short day names
  "_SDN" : new Array
           ("Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun"),
  // First day of the week. "0" means display Sunday first, "1" means display
  // Monday first, etc.
  "_FD"  : 0,
  // full month names
  "_MN"  : new Array
            ("January",
             "February",
             "March",
             "April",
             "May",
             "June",
             "July",
             "August",
             "September",
             "October",
             "November",
             "December"),
  // short month names
  "_SMN" : new Array
           ("Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"),
   // tooltips
   "INFO" : "About the calendar",
   "ABOUT": "DHTML Date/Time Selector\n" +
            "(c) zapatec.com 2002-2007\n" + // don't translate this this ;-)
            "For latest version visit: http://www.zapatec.com/" +
            "\n\n" +
            "Date selection:\n" +
            "- Use the \xab, \xbb buttons to select year\n" +
            "- Use the " + String.fromCharCode(0x2039) + ", " + String.fromCharCode(0x203a) + " buttons to select month\n" +
            "- Hold mouse button on any of the above buttons for faster selection.",
   "ABOUT_TIME" : "\n\n" +
                  "Time selection:\n" +
                  "- Click on any of the time parts to increase it\n" +
                  "- or Shift-click to decrease it\n" +
                  "- or click and drag for faster selection.",

   "PREV_YEAR"    : "Prev. year (hold for menu)",
   "PREV_MONTH"   : "Prev. month (hold for menu)",
   "GO_TODAY"     : "Go Today (hold for history)",
   "NEXT_MONTH"   : "Next month (hold for menu)",
   "NEXT_YEAR"    : "Next year (hold for menu)",
   "SEL_DATE"     : "Select date",
   "DRAG_TO_MOVE" : "Drag to move",
   "PART_TODAY"   : " (today)",

   // the following is to inform that "%s" is to be the first day of week
   // %s will be replaced with the day name.
   "DAY_FIRST"    : "Display %s first",

   // This may be locale-dependent.  It specifies the week-end days, as an array
   // of comma-separated numbers.  The numbers are from 0 to 6: 0 means Sunday, 1
   // means Monday, etc.
   "WEEKEND"      : "0,6",

   "CLOSE"        : "Close",
   "TODAY"        : "Today",
   "TIME_PART"    : "(Shift-)Click or drag to change value",

   // date formats
   "DEF_DATE_FORMAT"  : "%Y-%m-%d",
   "TT_DATE_FORMAT"   : "%a, %b %e",

   "WK"           : "wk",
   "TIME"         : "Time:",
   "E_RANGE"      : "Outside the range",
   "_AMPM"        : {am : "am",
                     pm : "pm",
                     AM : "AM",
                     PM : "PM"
                     }
});
