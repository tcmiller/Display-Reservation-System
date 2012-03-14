/**
 * @fileoverview Zapatec Date library. Used to perform various operations with
 * dates. Translations into several languages available in the utils/lang/
 * directory. TRANSLATION PLUG-IN IS REQUIRED for zpdate.js to work correctly.
 *
 * <pre>
 * Copyright (c) 2004-2009 by Zapatec, Inc.
 * http://www.zapatec.com
 * 1700 MLK Way, Berkeley, California,
 * 94709, U.S.A.
 * All rights reserved.
 * </pre>
 */

/* $Id: zpdate.js 16970 2009-04-10 10:02:01Z nmaxim $ */

if (typeof zapatecDate != 'function') {

if (typeof Zapatec == 'undefined') {
	/**
	 * @ignore Namespace definition.
	 */
	Zapatec = function() {};
}

/**
 * @constructor
 */
Zapatec.Date = function() {};

/**
 * Shortcut for faster access.
 * @private
 * @final
 */
zapatecDate = Zapatec.Date;

/**
 * Day names.
 * @private
 * @final
 */
Zapatec.Date.dayNames = [
	'date.day.sun',
	'date.day.mon',
	'date.day.tue',
	'date.day.wed',
	'date.day.thu',
	'date.day.fri',
	'date.day.sat',
	'date.day.sun'
];

/**
 * Shortcut for faster access.
 * @private
 * @final
 */
zapatecDateDayNames = zapatecDate.dayNames;

/**
 * Short day names.
 * @private
 * @final
 */
Zapatec.Date.shortDayNames = [
	'date.shortDay.sun',
	'date.shortDay.mon',
	'date.shortDay.tue',
	'date.shortDay.wed',
	'date.shortDay.thu',
	'date.shortDay.fri',
	'date.shortDay.sat',
	'date.shortDay.sun'
];

/**
 * Shortcut for faster access.
 * @private
 * @final
 */
zapatecDateShortDayNames = zapatecDate.shortDayNames;

/**
 * Month names.
 * @private
 * @final
 */
Zapatec.Date.monthNames = [
	'date.month.jan',
	'date.month.feb',
	'date.month.mar',
	'date.month.apr',
	'date.month.may',
	'date.month.jun',
	'date.month.jul',
	'date.month.aug',
	'date.month.sep',
	'date.month.oct',
	'date.month.nov',
	'date.month.dec'
];

/**
 * Shortcut for faster access.
 * @private
 * @final
 */
zapatecDateMonthNames = zapatecDate.monthNames;

/**
 * Short month names.
 * @private
 * @final
 */
Zapatec.Date.shortMonthNames = [
	'date.shortMonth.jan',
	'date.shortMonth.feb',
	'date.shortMonth.mar',
	'date.shortMonth.apr',
	'date.shortMonth.may',
	'date.shortMonth.jun',
	'date.shortMonth.jul',
	'date.shortMonth.aug',
	'date.shortMonth.sep',
	'date.shortMonth.oct',
	'date.shortMonth.nov',
	'date.shortMonth.dec'
];

/**
 * Shortcut for faster access.
 * @private
 * @final
 */
zapatecDateShortMonthNames = zapatecDate.shortMonthNames;

/**
 * AM.
 * @private
 * @final
 */
Zapatec.Date.AM = 'date.misc.AM';

/**
 * Shortcut for faster access.
 * @private
 * @final
 */
zapatecDateAM = zapatecDate.AM;

/**
 * PM.
 * @private
 * @final
 */
Zapatec.Date.PM = 'date.misc.PM';

/**
 * Shortcut for faster access.
 * @private
 * @final
 */
zapatecDatePM = zapatecDate.PM;

/**
 * am.
 * @private
 * @final
 */
Zapatec.Date.am = 'date.misc.am';

/**
 * Shortcut for faster access.
 * @private
 * @final
 */
zapatecDateAm = zapatecDate.am;

/**
 * pm.
 * @private
 * @final
 */
Zapatec.Date.pm = 'date.misc.pm';

/**
 * Shortcut for faster access.
 * @private
 * @final
 */
zapatecDatePm = zapatecDate.pm;


/**
 * Translates constants.
 * @private
 */
Zapatec.Date.translate = function() {
	zapatecTranslateArray(zapatecDateDayNames);
	zapatecTranslateArray(zapatecDateShortDayNames);
	zapatecTranslateArray(zapatecDateMonthNames);
	zapatecTranslateArray(zapatecDateShortMonthNames);
	zapatecDateAM = zapatecDate.AM = zapatecTranslate(zapatecDateAM);
	zapatecDatePM = zapatecDate.PM = zapatecTranslate(zapatecDatePM);
	zapatecDateAm = zapatecDate.am = zapatecTranslate(zapatecDateAm);
	zapatecDatePm = zapatecDate.pm = zapatecTranslate(zapatecDatePm);
};

// Translate constants
zapatecDate.translate();

Zapatec.Date._MD = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; /**< Number of days in each month */

/** Returns true if year is a leap year
 * optional; if not passed, the current year of \b this Date object is
 * assumed.
 *
 * @param year [int, optional] the year number.
 */
Zapatec.Date.isLeapYear = function (date, year) {
	if (typeof year == "undefined") {
		var year = date.getFullYear();
	}

	if ((0 == (year%4)) && ( (0 != (year%100)) || (0 == (year%400)))) {
		return true;
	}	else {
		return false;
	}
}

/** Returns the number of days in the month.  The \em month parameter is
 * optional; if not passed, the current month of \b this Date object is
 * assumed.
 *
 * @param month [int, optional] the month number, 0 for January.
 */
Zapatec.Date.getMonthDays = function(date, month) {
	var year = date.getFullYear();
	if (typeof month == "undefined") {
		month = date.getMonth();
	}
	if (Zapatec.Date.isLeapYear(date) && month == 1) {
		return 29;
	} else {
		return zapatecDate._MD[month];
	}
};

/** Returns true if year is a leap year
 * optional; if not passed, the current year of \b this Date object is
 * assumed.
 *
 * @param year [int, optional] the year number.
 */
Zapatec.Date.getYearDays = function(date, year) {
	var days = 365;

	if (Zapatec.Date.isLeapYear(date, year)) {
		days++;
	} 

	return days;	
};

/** Returns the number of the current day in the current year. */
Zapatec.Date.getDayOfYear = function(date) {
	var now = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
	var then = new Date(date.getFullYear(), 0, 0, 0, 0, 0);
	var time = now - then;
	return Math.round(time / 86400000);
};

/** Returns the number of the week in year, as defined in ISO 8601. */
Zapatec.Date.getWeekNumber = function(date) {
	var d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
	var DoW = d.getDay();
	d.setDate(d.getDate() - (DoW + 6) % 7 + 3); // Nearest Thu
	var ms = d.valueOf(); // GMT
	d.setMonth(0);
	d.setDate(4); // Thu in Week 1
	return Math.round((ms - d.valueOf()) / (7 * 864e5)) + 1;
};

/** Returns the number of the year and week according to ISO 8601 format
 equal to %Y W%w but gives correct year number for leap weaks
 **/
Zapatec.Date.getWeekAndYearNumber = function (date) {
    var wn = Zapatec.Date.getWeekNumber (date);
    var day = date.getDate();
    var year = date.getFullYear();
    if (day > 28 && wn == 1){
	year =  Math.round(year) + 1;
    };
    if (day < 4 && wn > 51){
	year = Math.round(year) - 1;
    };
    return (year + " W"+wn);
};

/** Checks dates equality.  Checks time too. */
Zapatec.Date.equalsTo = function(date1, date2) {
	if (!date1 || !date2) {
		return false;
	}
	return ((date1.getFullYear() == date2.getFullYear()) &&
		(date1.getMonth() == date2.getMonth()) &&
		(date1.getDate() == date2.getDate()) &&
		(date1.getHours() == date2.getHours()) &&
		(date1.getMinutes() == date2.getMinutes()));
};

/** Checks dates equality.  Ignores time. */
Zapatec.Date.dateEqualsTo = function(date1, date2) {
	if (!date1 || !date2) {
		return false;
	}
	return ((date1.getFullYear() == date2.getFullYear()) &&
		(date1.getMonth() == date2.getMonth()) &&
		(date1.getDate() == date2.getDate()));
};

/** Set only the year, month, date parts (keep existing time) */
Zapatec.Date.setDateOnly = function(date1, date2) {
	var tmp = new Date(date2);
	date1.setDate(1);
	date1.setFullYear(tmp.getFullYear());
	date1.setMonth(tmp.getMonth());
	date1.setDate(tmp.getDate());
};

/** Prints the date in a string according to the given format.
 *
 * The format (\b str) may contain the following specialties:
 *
 * - %%a - Abbreviated weekday name
 * - %%A - Full weekday name
 * - %%b - Abbreviated month name
 * - %%B - Full month name
 * - %%C - Century number
 * - %%d - The day of the month (00 .. 31)
 * - %%e - The day of the month (0 .. 31)
 * - %%H - Hour (00 .. 23)
 * - %%I - Hour (01 .. 12)
 * - %%j - The day of the year (000 .. 366)
 * - %%k - Hour (0 .. 23)
 * - %%l - Hour (1 .. 12)
 * - %%m - Month (01 .. 12)
 * - %%M - Minute (00 .. 59)
 * - %%n - A newline character
 * - %%o - added by Mike to display correct year number for leap year: 2009-01 for 30st of December 2009 for instance;
 * - %%p - "PM" or "AM"
 * - %%P - "pm" or "am"
 * - %%S - Second (00 .. 59)
 * - %%s - Number of seconds since Epoch
 * - %%t - A tab character
 * - %%W - The week number (as per ISO 8601)
 * - %%u - The day of week (1 .. 7, 1 = Monday)
 * - %%w - The day of week (0 .. 6, 0 = Sunday)
 * - %%y - Year without the century (00 .. 99)
 * - %%Y - Year including the century (ex. 1979)
 * - %%% - A literal %% character
 *
 * They are almost the same as for the POSIX strftime function.
 *
 * @param str [string] the format to print date in.
 */
Zapatec.Date.print = function (date, str) {
	var m = date.getMonth();
	var d = date.getDate();
	var y = date.getFullYear();
	var wn = /%U|%W|%V/.test(str) ? zapatecDate.getWeekNumber(date) : "";
	var w = date.getDay();
	var s = {};
	var hr = date.getHours();
	var pm = (hr >= 12);
	var ir = (pm) ? (hr - 12) : hr;
	var dy = /%j/.test(str) ? zapatecDate.getDayOfYear(date) : "";
	if (ir == 0) {
		ir = 12;
	}
	var min = date.getMinutes();
	var sec = date.getSeconds();
	// Calendar still wants to translate in its own way
	if (Zapatec.Calendar && this instanceof Zapatec.Calendar) {
		s["%a"] = /%a/.test(str) ? Zapatec.Calendar.i18n(w, "sdn", this) : ""; // abbreviated weekday name
		s["%A"] = /%A/.test(str) ? Zapatec.Calendar.i18n(w, "dn", this) : ""; // full weekday name
		s["%b"] = /%b/.test(str) ? Zapatec.Calendar.i18n(m, "smn", this) : ""; // abbreviated month name
		s["%B"] = /%B/.test(str) ? Zapatec.Calendar.i18n(m, "mn", this) : ""; // full month name
	} else {
		s["%a"] = /%a/.test(str) ? zapatecDateShortDayNames[w] : ""; // abbreviated weekday name
		s["%A"] = /%A/.test(str) ? zapatecDateDayNames[w] : ""; // full weekday name
		s["%b"] = /%b/.test(str) ? zapatecDateShortMonthNames[m] : ""; // abbreviated month name
		s["%B"] = /%B/.test(str) ? zapatecDateMonthNames[m] : ""; // full month name
	}
	// FIXME: %c : preferred date and time representation for the current locale
	s["%C"] = 1 + Math.floor(y / 100); // the century number
	s["%d"] = (d < 10) ? ("0" + d) : d; // the day of the month (range 01 to 31)
	s["%e"] = d; // the day of the month (range 1 to 31)
	// FIXME: %D : american date style: %m/%d/%y
	// FIXME: %E, %F, %G, %g, %h (man strftime)
	s["%H"] = (hr < 10) ? ("0" + hr) : hr; // hour, range 00 to 23 (24h format)
	s["%I"] = (ir < 10) ? ("0" + ir) : ir; // hour, range 01 to 12 (12h format)
	s["%j"] = (dy < 100) ? ((dy < 10) ? ("00" + dy) : ("0" + dy)) : dy; // day of the year (range 001 to 366)
	s["%k"] = hr ? hr :  "0"; // hour, range 0 to 23 (24h format)
	s["%l"] = ir;       // hour, range 1 to 12 (12h format)
	s["%m"] = (m < 9) ? ("0" + (1+m)) : (1+m); // month, range 01 to 12
	s["%M"] = (min < 10) ? ("0" + min) : min; // minute, range 00 to 59
	s["%n"] = "\n";     // a newline character
	// Calendar still wants to translate in its own way
	if (Zapatec.Calendar && this instanceof Zapatec.Calendar) {
		s["%p"] = pm ? Zapatec.Calendar.i18n("PM", "AMPM", this) : Zapatec.Calendar.i18n("AM", "AMPM", this);
		s["%P"] = pm ? Zapatec.Calendar.i18n("pm", "AMPM", this) : Zapatec.Calendar.i18n("am", "AMPM", this);
		if (!s["%p"]) {
			s["%p"] = s["%P"];
		}
	} else {
		s["%p"] = pm ? zapatecDatePM : zapatecDateAM;
		s["%P"] = pm ? zapatecDatePm : zapatecDateAm;
	}
	//FIXME %o - added by Mike to display correct year number for leap year: 2009-01 for 30st of December 2009 for instance;
	s["%o"] = /%o/.test(str) ? Zapatec.Date.getWeekAndYearNumber(date) : "";
	// FIXME: %r : the time in am/pm notation %I:%M:%S %p
	// FIXME: %R : the time in 24-hour notation %H:%M
	s["%s"] = Math.floor(date.getTime() / 1000);
	s["%S"] = (sec < 10) ? ("0" + sec) : sec; // seconds, range 00 to 59
	s["%t"] = "\t";     // a tab character
	// FIXME: %T : the time in 24-hour notation (%H:%M:%S)
	s["%U"] = s["%W"] = s["%V"] = (wn < 10) ? ("0" + wn) : wn;
	s["%u"] = (w == 0) ? 7 : w; // the day of the week (range 1 to 7, 1 = MON)
	s["%w"] = w ? w : "0";      // the day of the week (range 0 to 6, 0 = SUN)
	// FIXME: %x : preferred date representation for the current locale without the time
	// FIXME: %X : preferred time representation for the current locale without the date
	s["%y"] = '' + y % 100; // year without the century (range 00 to 99)
	if (s["%y"] < 10) {
		s["%y"] = "0" + s["%y"];
	}
	s["%Y"] = y;        // year with the century
	s["%%"] = "%";      // a literal '%' character
	if (/%z/.test(str)) {
		var minutes = new String(date.getTimezoneOffset()%60);
		var hours = new String(Math.abs(date.getTimezoneOffset()/60));
		s["%z"] = "GMT"+ (date.getTimezoneOffset() > 0 ? "-" : "+");
		hours.length < 2 ? s["%z"]+="0" : "";
		s["%z"] += Math.abs(date.getTimezoneOffset()/60) + ":" + date.getTimezoneOffset()%60;
		minutes.length < 2 ? s["%z"]+="0" : "";
	}
	if (/%Z/.test(str)) {
		s["%Z"] = (date.getTimezoneOffset() > 0 ? "-" : "+");
		hours.length < 2 ? s["%Z"] += "0" : "";
		s["%Z"] += Math.abs(date.getTimezoneOffset()/60) + "" + date.getTimezoneOffset()%60;
		minutes.length < 2 ? s["%Z"] += "0" : "";
	}
	var re = /%./g;
	var a = str.match(re) || [];
	var tmp, ln = a.length;
	for (var i = 0; i < ln; i++) {
		tmp = s[a[i]];
		if (tmp) {
			re = new RegExp(a[i], 'g');
			str = str.replace(re, tmp);
		}
	}
	return str;
};

/**
 * Parses a date from a string in the specified format.
 * This function requires strict following of the string to
 * the format template, and any difference causes failure
 * to be returned. Also function refuses to parse formats
 * which containing number rules that have not fixed length
 * and are not separated from the next number rule by any
 * character string, as this requires complication of algorythm
 * and still sometimes is impossible to parse.
 *
 * @param str [string] the date as a string
 * @param format [string] the format to try to parse the date in
 *
 * @return [Date] a date object containing the parsed date or \b null if for
 * some reason the date couldn't be parsed.
 */
Zapatec.Date.parseDate = function (str, format) {
	var fmt = format, strPointer = 0, token = null, parseFunc = null,
		valueLength = null, valueRange = null, date = new Date(), values = {},
		valueType = '';
	//need to have a way to determine whether rule is number
	var numberRules = ["%d", "%H", "%I", "%m", "%M", "%S", "%s", "%W", "%u",
		"%w", "%y", "%e", "%k", "%l", "%s", "%Y", "%C", "%z", "%Z"];
	var aNames;
	//parses string value from translation table
	function parseString() {
		for(var iString = valueRange[0]; iString < valueRange[1]; ++iString) {
			// Calendar still wants to translate in its own way
			var value;
			if (Zapatec.Calendar && this instanceof Zapatec.Calendar) {
				value = Zapatec.Calendar.i18n(iString, valueType, this);
			} else {
				value = aNames[iString];
			}
			if (!value) {
				return null;
			}
			//comparing with our part of the string
			if (value == str.substr(strPointer, value.length)) {
				//increasing string pointer
				valueLength = value.length;
				return iString;
			}
		}
		return null;
	}
	//parses the number from beginning of string
	function parseNumber() {
		var val = str.substr(strPointer, valueLength);
		if (val.length != valueLength || /$\d+^/.test(val)) {
			return null;
		}
		return parseInt(val, 10);
	}
	//parses AM PM rule
	function parseAMPM() {
		var result = str.substr(strPointer, valueLength).toLowerCase() == Zapatec.Date.Pm ? true : false;
		return result || (str.substr(strPointer, valueLength).toLowerCase() == Zapatec.Date.Am ? false : null);
	}
	//parses GMT time format
	function parseGMT() {
		var val = str.substr(strPointer, valueLength);
			if (val.length != valueLength || !/(\w){3}(\+|-)+((\d){4}|(\d)+:(\d))+/.test(val)) {
				return null;
			}
		var sgn = val.substr(3, 1);
		values["%zm"] = (sgn == "-" ? (-1) * parseInt(val.substr(7, 2), 10) : parseInt(val.substr(7, 2), 10));
		return parseInt(val.substr(3, 3), 10);
	}
	//parses RFC822 time format
	function parseRFC() {
		var val = str.substr(strPointer, valueLength);
			if (val.length != valueLength || !/(\+|-)+((\d){4}|(\d)+:(\d))+/.test(val)) {
				return null;
			}
		var sgn = val.substr(0, 1);
		values["%Zm"] = (sgn == "-" ? (-1) * parseInt(val.substr(3, 2), 10) : parseInt(val.substr(3, 2), 10));
		return parseInt(val.substr(0, 3), 10);
	}
	//function determines if rule value was parsed
	function wasParsed(rule) {
		if (typeof rule == "undefined" || rule === null) {
			return false;
		}
		return true;
	}
	//gets first defined value or null if no
	function getValue() {
		for(var i = 0; i < arguments.length; ++i) {
			if (arguments[i] !== null && typeof arguments[i] != "undefined" && !isNaN(arguments[i])) {
				return arguments[i];
			}
		}
		return null;
	}
	if (typeof fmt != "string" || typeof str != "string" || str == "" || fmt == "") {
		return null;
	}
	//cycle breaks format into tokens and checks or parses them
	while(fmt) {
		//this is the default value type
		parseFunc = parseNumber;
		//taking char token(that doesn't hold any information)
		valueLength = fmt.indexOf("%");
		valueLength = (valueLength == -1) ? fmt.length : valueLength;
		token = fmt.slice(0, valueLength);
		//checking if we have same token in parsed string
		if (token != str.substr(strPointer, valueLength)) {
			return null;
		}
		//skiping it
		strPointer += valueLength;
		fmt = fmt.slice(valueLength);
		if (fmt == "") {
			break;
		}
		//taking formating rule
		token = fmt.slice(0, 2);
		//this is the default length of value, as it is very often one for rules
		valueLength = 2;
		switch (token) {
			case "%A" :
			case "%a" : {
				if ("%A" == token) {
					aNames = zapatecDateDayNames;
					valueType = "dn";
				} else {
					aNames = zapatecDateShortDayNames;
					valueType = "sdn";
				}
				valueRange = [0, 7];
				parseFunc = parseString;
				break;
			}
			case "%B" :
			case "%b" : {
				if ("%B" == token) {
					aNames = zapatecDateMonthNames;
					valueType = "mn";
				} else {
					aNames = zapatecDateShortMonthNames;
					valueType = "smn";
				}
				valueRange = [0, 12];
				parseFunc = parseString;
				break;
			}
			case "%p" :
			case "%P" : {
				parseFunc = parseAMPM;
				break;
			}
			case "%Y" : {
				valueLength = 4;
				if (zapatecUtils.arrIndexOf(numberRules, fmt.substr(2, 2)) != -1) {
					return null;
				}
				while(isNaN(parseInt(str.charAt(strPointer + valueLength - 1))) && valueLength > 0) {
					--valueLength;
				}
				if (valueLength == 0) {break;}
				break;
			}
			case "%C" :
			case "%s" : {
				valueLength = 1;
				if (zapatecUtils.arrIndexOf(numberRules, fmt.substr(2, 2)) != -1) {
					return null;
				}
				while(!isNaN(parseInt(str.charAt(strPointer + valueLength)))) {
					++valueLength;
				}
				break;
			}
			case "%k" :
			case "%l" :
			case "%e" : {
				valueLength = 1;
				if (zapatecUtils.arrIndexOf(numberRules, fmt.substr(2, 2)) != -1) {
					return null;
				}
				if (!isNaN(parseInt(str.charAt(strPointer + 1)))) {
					++valueLength;
				}
				break;
			}
			case "%j" : valueLength = 3; break;
			case "%u" :
			case "%w" : valueLength = 1;
			case "%y" :
			case "%m" :
			case "%d" :
			case "%W" :
			case "%H" :
			case "%I" :
			case "%M" :
			case "%S" : {
				break;
			}
			case "%z" :
				valueLength = 9;
				parseFunc = parseGMT;
				break;
			case "%Z" :
				if (values["%z"]) break;
				valueLength = 5;
				parseFunc = parseRFC;
				break;
		}
		if ((values[token] = parseFunc()) === null) {
			return null;
		}
		//increasing pointer
		strPointer += valueLength;
		//skipint it
		fmt = fmt.slice(2);
	}
	if (wasParsed(values["%s"])) {
		date.setTime(values["%s"] * 1000);
	} else {
		var year = getValue(values["%Y"], values["%y"] + --values["%C"] * 100,
			values["%y"] + (date.getFullYear() - date.getFullYear() % 100),
			values["%C"] * 100 + date.getFullYear() % 100);
		var month = getValue(values["%m"] - 1, values["%b"], values["%B"]);
		var day = getValue(values["%d"] || values["%e"]);
		if (day === null || month === null) {
			var dayOfWeek = getValue(values["%a"], values["%A"], values["%u"] == 7 ? 0 : values["%u"], values["%w"]);
		}
		var hour = getValue(values["%H"], values["%k"]/*, values["%z"]*/);
		if (hour === null && (wasParsed(values["%p"]) || wasParsed(values["%P"]))) {
			var pm = getValue(values["%p"], values["%P"]);
			hour = getValue(values["%I"], values["%l"]);
			hour = pm ? ((hour == 12) ? 12 : (hour + 12)) : ((hour == 12) ? (0) : hour);
		}
		if (year || year === 0) {
			date.setFullYear(year);
		}
		if (month || month === 0) {
			date.setMonth(month, 1);
		}
		if (day || day === 0) {
			date.setDate(day);
		}
		if (wasParsed(values["%j"])) {
			date.setMonth(0);
			date.setDate(1);
			date.setDate(values["%j"]);
		}
		if (wasParsed(dayOfWeek)) {
			date.setDate(date.getDate() + (dayOfWeek - date.getDay()));
		}
		if (wasParsed(values["%W"])) {
			var weekNumber = zapatecDate.getWeekNumber(date);
			if (weekNumber != values["%W"]) {
				date.setDate(date.getDate() + (values["%W"] - weekNumber) * 7);
			}
		}
		if (hour !== null) {
			date.setHours(hour);
		}
		if (wasParsed(values["%M"]/*, values["%zm"]*/)) {
			date.setMinutes(values["%M"]);
		}
		if (wasParsed(values["%S"])) {
			date.setSeconds(values["%S"]);
		}
		if (wasParsed(values["%z"])) {
			date.setUTCHours(date.getUTCHours() + (date.getTimezoneOffset()/60 + parseInt(values["%z"], 10)));
			date.setUTCMinutes(date.getUTCMinutes() + (-1) * (date.getTimezoneOffset()%60 - parseInt(values["%zm"], 10)))
		}
		if (wasParsed(values["%Z"])) {
			date.setUTCHours(date.getUTCHours() + (date.getTimezoneOffset()/60 + parseInt(values["%Z"], 10)));
			date.setUTCMinutes(date.getUTCMinutes() + (-1) * (date.getTimezoneOffset()%60 - parseInt(values["%Zm"], 10)))
		}
	}
	//printing date in the same format and checking if we'll get the same string
	if (zapatecDate.print(date, format) != str) {
		//if not returning error
		return null;
	}
	//or returning parsed date
	return date;
};

/**
 * This function replaces the original Date.setFullYear() with a "safer"
 * function which makes sure that the month or date aren't modified (unless in
 * the exceptional case where the date is February 29 but the new year doesn't
 * contain it).
 *
 * @param y [int] the new year to move this date to
 */
Zapatec.Date.setFullYear = function(date, y) {
	var d = new Date(date);
	d.setFullYear(y);
	if (d.getMonth() != date.getMonth()) {
		date.setDate(28);
	}
	date.setFullYear(y);
};

/**
 * This function compares only years, months and days of two date objects.
 *
 * @return [int] -1 if date1>date2, 1 if date2>date1 or 0 if they are equal
 *
 * @param date1 [Date] first date to compare
 * @param date1 [Date] second date to compare
 */
Zapatec.Date.compareDatesOnly = function (date1,date2) {
	var year1 = date1.getYear();
	var year2 = date2.getYear();
	var month1 = date1.getMonth();
	var month2 = date2.getMonth();
	var day1 = date1.getDate();
	var day2 = date2.getDate();
	if (year1 > year2) { return -1; }
	if (year2 > year1) { return 1; } //years are equal
	if (month1 > month2) { return -1; }
	if (month2 > month1) { return 1; } //years and months are equal
	if (day1 > day2) { return -1; }
	if (day2 > day1) { return 1; } //days are equal
	return 0;
};

/**
 * Keeps regexp used in {@link Zapatec.Date#parseTime}.
 * @private
 * @final
 */
Zapatec.Date.dateRegexpTime =
	/^(\d{1,2})(\D+(\d{1,2}))?(\D+(\d{1,2}))?\W*(AM|PM|A|P)?\s*(.*)/i;

/**
 * Parses time string into object.
 *
 * <pre>
 * Result format:
 * {
 *   hours: [number, optional] hours,
 *   minutes: [number, optional] minutes,
 *   tail: [string] the rest of the string
 * }
 *
 * String may contain not only time, but must be started from time. If it
 * contains anything else after the time, the rest will be returned as tail.
 *
 * If hours and minutes are not defined in the result, this means time was not
 * found in the beginning of passed string.
 *
 * Following time formats are recognized:
 * 1) HH:MM:SS
 * 2) HH:MM:SS AM/PM
 * 3) HH:MM
 * 4) HH:MM AM/PM
 * 5) HH AM/PM
 * Any type of separator can be used.
 * Examples: 1.40A, 05-06-02, 3:8:1, 02:05[PM], 7pm, etc.
 * </pre>
 *
 * @param {string} sTime Time string
 * @return Result
 * @type object
 */
Zapatec.Date.parseTime = function(sTime) {
	// Result object
	var oResult = {
		tail: sTime
	};
	// Check arguments
	if (!sTime) {
		return oResult;
	}
	sTime = sTime.replace(/^\s+/, '').replace(/\s+$/, '');
	// Parse time
	var aMatches = sTime.match(zapatecDate.dateRegexpTime);
	if (aMatches && aMatches[1]) {
		// Hours
		var iHours = aMatches[1] * 1;
		if (aMatches[6]) {
			var sAmPm = aMatches[6].toUpperCase();
			if (sAmPm == 'PM' || sAmPm == 'P') {
				if (iHours < 12) {
					iHours += 12;
				}
			} else { // AM
				if (iHours == 12) {
					iHours = 0;
				}
			}
		}
		oResult.hours = iHours;
		// Minutes
		oResult.minutes = aMatches[3] ? aMatches[3] * 1 : 0;
		// Tail
		oResult.tail = aMatches[7];
	}
	return oResult;
};

/**
 * Converts number to string and adds '0' in the beginning if number < 10.
 *
 * @param {number} i Integer > 0
 * @return String with length >= 2
 * @type string
 */
Zapatec.Date.padTwo = function(i) {
	return (i < 10 ? '0' : '') + i;
};

/**
 * Keeps regexp used in {@link Zapatec.Date#isFloatingDate}.
 * @private
 * @final
 */
Zapatec.Date.dateRegexpNotFloating = /(?:Z|[+-]\d{1,2}(?::\d{1,2})?)$/;

/**
 * Checks if date in RFC 2445 or ISO 8601 format is floating (not bound to any
 * timezone).
 *
 * @private
 * @param {string} sDTStamp date in RFC 2445 format
 * @return true if sDTStamp is floating, false otherwise
 * @type boolean
 */
Zapatec.Date.isFloatingDate = function(sDTStamp) {
	if (!sDTStamp) {
		return false;
	}
	return !zapatecDate.dateRegexpNotFloating.test(sDTStamp);
};

/**
 * Converts Date object to date-time string in RFC 2445 format. Conversion is
 * done according to http://tools.ietf.org/html/rfc2445#section-4.3.5
 *
 * <pre>
 * Arguments format:
 * {
 *   date: [object] Date object,
 *   floating: [boolean, optional] if true, result value will be floating (not
 *    bound to any time zone)
 * }
 * </pre>
 *
 * @param {object} oArg Arguments
 * @return Date-time in RFC 2445 format or empty string in case of invalid
 * arguments
 * @type string
 */
Zapatec.Date.dateToTimeStamp = function(oArg) {
	// Check arguments
	if (!oArg) {
		return '';
	}
	var oDate = oArg.date;
	if (!(oDate instanceof Date)) {
		return oDate + '';
	}
	// Convert
	var fPadTwo = zapatecDate.padTwo;
	if (!oArg.floating) {
		// Convert to UTC
		oDate = new Date(oDate.getTime() + (oDate.getTimezoneOffset() * 60000));
	}
	return [
		oDate.getFullYear(),
		fPadTwo(oDate.getMonth() + 1),
		fPadTwo(oDate.getDate()),
		'T',
		fPadTwo(oDate.getHours()),
		fPadTwo(oDate.getMinutes()),
		fPadTwo(oDate.getSeconds()),
		oArg.floating ? '' : 'Z'
	].join('');
};

/**
 * Converts Date object to date string in RFC 2445 format. Conversion is done
 * according to http://tools.ietf.org/html/rfc2445#section-4.3.4
 *
 * <pre>
 * Arguments format:
 * {
 *   date: [object] Date object
 * }
 * </pre>
 *
 * @param {object} oArg Arguments
 * @return Date in RFC 2445 format or empty string in case of invalid arguments
 * @type string
 */
Zapatec.Date.dateToDateStamp = function(oArg) {
	// Check arguments
	if (!oArg) {
		return '';
	}
	var oDate = oArg.date;
	if (!(oDate instanceof Date)) {
		return oDate + '';
	}
	// Convert
	var fPadTwo = zapatecDate.padTwo;
	return [
		oDate.getFullYear(),
		fPadTwo(oDate.getMonth() + 1),
		fPadTwo(oDate.getDate())
	].join('');
};

/**
 * Keeps regexp used in {@link Zapatec.Date#timeStampToDate}.
 * @private
 * @final
 */
Zapatec.Date.dateRegexpTimeStamp =
 /^(\d{4})(\d{2})(\d{2})T?(\d{2})?(\d{2})?(\d{2})?(Z)?$/;

/**
 * Converts date-time in RFC 2445 format to Date object. Conversion is done
 * according to http://tools.ietf.org/html/rfc2445#section-4.3.5
 *
 * <pre>
 * Arguments format:
 * {
 *   dtstamp: [string] date-time in RFC 2445 format
 * }
 * </pre>
 *
 * @param {object} oArg Arguments
 * @return Date object or undefined in case of invalid arguments
 * @type object
 */
Zapatec.Date.timeStampToDate = function(oArg) {
	if (!oArg) {
		return;
	}
	var sDTStamp = oArg.dtstamp;
	if (typeof sDTStamp != 'string') {
		return;
	}
	// Parse
	var aMatches = sDTStamp.match(zapatecDate.dateRegexpTimeStamp);
	if (!aMatches) {
		return;
	}
	var iYear = parseInt(aMatches[1], 10);
	var iMonth = parseInt(aMatches[2], 10) - 1;
	var iDay = parseInt(aMatches[3], 10);
	var iHour = parseInt(aMatches[4], 10);
	if (isNaN(iHour)) {
		return new Date(iYear, iMonth, iDay);
	}
	iHour = parseInt(iHour, 10);
	var iMinute = parseInt(aMatches[5], 10);
	var iSecond = parseInt(aMatches[6], 10);
	if (aMatches[7]) {
		// Floating
		return new Date(Date.UTC(iYear, iMonth, iDay, iHour, iMinute, iSecond));
	}
	return new Date(iYear, iMonth, iDay, iHour, iMinute, iSecond);
};

/**
 * Converts Date object to date-time string ISO 8601 format. Conversion is done
 * according to http://tools.ietf.org/html/rfc3339
 *
 * <pre>
 * Arguments format:
 * {
 *   date: [object] Date object,
 *   floating: [boolean, optional] if true, result value will be floating (not
 *    bound to any time zone)
 * }
 * </pre>
 *
 * @param {object} oArg Arguments
 * @return Date-time in ISO 8601 format or empty string in case of invalid
 * arguments
 * @type string
 */
Zapatec.Date.dateToTimeIso = function(oArg) {
	// Check arguments
	if (!oArg) {
		return '';
	}
	var oDate = oArg.date;
	if (!(oDate instanceof Date)) {
		return oDate + '';
	}
	// Convert
	var fPadTwo = zapatecDate.padTwo;
	// Convert to UTC
	oDate = new Date(oDate.getTime() + (oDate.getTimezoneOffset() * 60000));
	return [
		oDate.getFullYear(),
		'-',
		fPadTwo(oDate.getMonth() + 1),
		'-',
		fPadTwo(oDate.getDate()),
		'T',
		fPadTwo(oDate.getHours()),
		':',
		fPadTwo(oDate.getMinutes()),
		':',
		fPadTwo(oDate.getSeconds()),
		oArg.floating ? '' : 'Z'
	].join('');
};

/**
 * Converts Date object to date string ISO 8601 format. Conversion is done
 * according to http://tools.ietf.org/html/rfc3339
 *
 * <pre>
 * Arguments format:
 * {
 *   date: [object] Date object
 * }
 * </pre>
 *
 * @param {object} oArg Arguments
 * @return Date in ISO 8601 format or empty string in case of invalid arguments
 * @type string
 */
Zapatec.Date.dateToDateIso = function(oArg) {
	// Check arguments
	if (!oArg) {
		return '';
	}
	var oDate = oArg.date;
	if (!(oDate instanceof Date)) {
		return oDate + '';
	}
	// Convert
	var fPadTwo = zapatecDate.padTwo;
	return [
		oDate.getFullYear(),
		fPadTwo(oDate.getMonth() + 1),
		fPadTwo(oDate.getDate())
	].join('-');
};

/**
 * Keeps regexp used in {@link Zapatec.Date#dateIsoToDate}.
 * @private
 * @final
 */
Zapatec.Date.dateRegexpTimeIso =
 /(\d{4,})(?:-(\d{1,2})(?:-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?(?:(Z)|([+-])(\d{1,2})(?::(\d{1,2}))?)?)?)?)?/;

/**
 * Converts date-time in ISO 8601 format to Date object. Conversion is done
 * according to http://tools.ietf.org/html/rfc3339
 *
 * <pre>
 * Arguments format:
 * {
 *   dateIso: [string] date-time in ISO 8601 format
 * }
 * </pre>
 *
 * @param {object} oArg Arguments
 * @return Date object or undefined in case of invalid arguments
 * @type object
 */
Zapatec.Date.timeIsoToDate = function(oArg) {
	// Check arguments
	if (!oArg) {
		return;
	}
	var sDateIso = oArg.dateIso + '';
	if (typeof sDateIso != 'string' || !sDateIso.length) {
		return;
	}
	// Parse
	var aMatches = sDateIso.match(zapatecDate.dateRegexpTimeIso);
	if (!aMatches) {
		return;
	}
	// Year
	var iYear = parseInt(aMatches[1], 10);
	// Month
	var iMonth = aMatches[2];
	if (typeof iMonth == 'undefined' || iMonth === '') {
		return new Date(iYear);
	}
	iMonth = parseInt(iMonth, 10) - 1;
	// Date
	var iDay = parseInt(aMatches[3], 10);
	// Hours
	var iHour = aMatches[4];
	if (typeof iHour == 'undefined' || iHour === '') {
		return new Date(iYear, iMonth, iDay);
	}
	iHour = parseInt(iHour, 10);
	// Minutes
	var iMinute = parseInt(aMatches[5], 10);
	// Seconds
	var iSecond = aMatches[6];
	if (typeof iSecond == 'undefined' || iSecond === '') {
		iSecond = 0;
	} else {
		iSecond = parseInt(iSecond, 10);
	}
	// Milliseconds
	var iMSecond = aMatches[7];
	if (typeof iMSecond == 'undefined' || iMSecond === '') {
		iMSecond = 0;
	} else {
		iMSecond = Math.round(1000.0 * parseFloat('0.' + iMSecond));
	}
	// Time zone
	var iTimezoneOffset = 0;
	// Z means UTC
	var sTimezoneZ = aMatches[8];
	if (typeof sTimezoneZ == 'undefined' || sTimezoneZ === '') {
		// Not UTC
		var sTimezoneSign = aMatches[9];
		if (typeof sTimezoneSign == 'undefined' || sTimezoneSign === '') {
			// No time zone
			return new Date(iYear, iMonth, iDay, iHour, iMinute, iSecond, iMSecond);
		}
		// Time zone hours
		iTimezoneOffset = parseInt(aMatches[10], 10) * 3600000;
		// Time zone minutes
		var iTimezoneMinute = aMatches[11];
		if (typeof iTimezoneMinute != 'undefined' && iTimezoneMinute !== '') {
			iTimezoneOffset += parseInt(iTimezoneMinute, 10) * 60000;
		}
		if (sTimezoneSign == '-') {
			iTimezoneOffset *= -1;
		}
	}
	return new Date(Date.UTC(iYear, iMonth, iDay, iHour, iMinute, iSecond,
	 iMSecond) - iTimezoneOffset);
};

/**
 * Converts date or date-time from RFC 2445 to ISO 8601 format.
 *
 * <pre>
 * Arguments format:
 * {
 *   dtstamp: [string] date or date-time in RFC 2445 format
 * }
 * </pre>
 *
 * @param {object} oArg Arguments
 * @return Date or date-time in ISO 8601 format or empty string in case of
 * invalid arguments
 * @type string
 */
Zapatec.Date.timeStampToTimeIso = function(oArg) {
	// Check arguments
	if (!oArg) {
		return '';
	}
	var sDTStamp = oArg.dtstamp;
	if (!sDTStamp) {
		return '';
	}
	if (sDTStamp.length == 8) {
		// Date
		return sDTStamp.substr(0, 4) + '-' + sDTStamp.substr(4, 2) + '-' +
			sDTStamp.substr(6, 2);
	} else {
		// Date/Time
		return zapatecDate.dateToTimeIso({
			date: zapatecDate.timeStampToDate(oArg),
			floating: zapatecDate.isFloatingDate(sDTStamp)
		});
	}
};

/**
 * Converts date-time from ISO 8601 to RFC 2445 format.
 *
 * <pre>
 * Arguments format:
 * {
 *   dateIso: [string] date in ISO 8601 format
 * }
 * </pre>
 *
 * @private
 * @param {object} oArg Arguments
 * @return Date-time in RFC 2445 format or empty string in case of invalid
 * arguments
 * @type string
 */
Zapatec.Date.timeIsoToTimeStamp = function(oArg) {
	// Check arguments
	if (!oArg) {
		return '';
	}
	var sDateIso = oArg.dateIso + '';
	if (typeof sDateIso != 'string' || !sDateIso.length) {
		return '';
	}
	// Convert
	if (sDateIso.indexOf('-') > 0) {
		if (sDateIso.length == 10) {
			// Date
			return sDateIso.substr(0, 4) + sDateIso.substr(5, 2) +
				sDateIso.substr(8, 2);
		} else {
			// Date/Time
			return zapatecDate.dateToTimeStamp({
				date: zapatecDate.timeIsoToDate(oArg),
				floating: zapatecDate.isFloatingDate(sDateIso)
			});
		}
	} else {
		// Not ISO format
		return sDateIso;
	}
};

/**
 * Calculates date of specified week day on the same week as passed date.
 *
 * <pre>
 * Arguments format:
 * {
 *   date: [object, optional] Date object, default: today,
 *   weekDay: [number, optional] zero-based number of day from 0 (Sunday) to 6
 *    (Saturday), default: 0 (Sunday)
 * }
 * </pre>
 *
 * @param {object} oArg Arguments
 * @return Date object
 * @type object
 */
Zapatec.Date.getWeekDay = function(oArg) {
	if (!oArg) {
		oArg = {};
	}
	var oDate = oArg.date;
	if (!oDate) {
		oDate = new Date();
	}
	var iWeekDay = oArg.weekDay;
	if (typeof iWeekDay != 'number' || iWeekDay < 0 || iWeekDay > 6) {
		iWeekDay = 0;
	}
	return zapatecDate.getTomorrow({
		date: oDate,
		days: iWeekDay - oDate.getDay()
	});
};

/**
 * Calculates date of specified day of the month. The month is same as month of
 * passed date.
 *
 * <pre>
 * Arguments format:
 * {
 *   date: [object, optional] Date object, default: today,
 *   day: [number, optional] number of day between 1 and 31 or -31 and -1,
 *    default: 1
 * }
 * Negative day means day starting from the end of month. For example, -1 is the
 * last day of month.
 * </pre>
 *
 * @param {object} oArg Arguments
 * @return Date object
 * @type object
 */
Zapatec.Date.getMonthDay = function(oArg) {
	if (!oArg) {
		oArg = {};
	}
	var oDate = oArg.date;
	if (!oDate) {
		oDate = new Date();
	}
	var iDay = oArg.day;
	if (typeof iDay != 'number') {
		iDay = 1;
	}
	var iMonth = oDate.getMonth();
	if (iDay < 1) {
		if (iDay < 0) {
			// Negative day
			iDay++;
		}
		iMonth++;
	}
	return new Date(oDate.getFullYear(), iMonth, iDay);
};

/**
 * Calculates tomorrow date from the passed date.
 *
 * <pre>
 * Arguments format:
 * {
 *   date: [object, optional] Date object, default: today,
 *   days: [number, optional] number of days to add, default: 1
 * }
 * </pre>
 *
 * @param {object} oDate Date object
 * @return Tomorrow date
 * @type object
 */
Zapatec.Date.getTomorrow = function(oArg) {
	if (!oArg) {
		oArg = {};
	}
	var oDate = oArg.date;
	if (oDate) {
		oDate = new Date(oDate.getTime());
	} else {
		oDate = new Date();
	}
	var iDays = oArg.days;
	if (typeof iDays != 'number') {
		iDays = 1;
	}
	if (iDays) {
		oDate.setDate(oDate.getDate() + iDays);
	}
	return oDate;
};

/**
 * Compares two dates and returns difference between them in days.
 *
 * @param {object} oDate1 Date object
 * @param {object} oDate2 Date object
 * @return Difference between oDate1 and oDate2 in days: < 0 if oDate1 < oDate2;
 * > 0 if oDate1 > oDate2; 0 if oDate1 == oDate2
 * @type number
 */
Zapatec.Date.compareDates = function(oDate1, oDate2) {
	oDate1 = new Date(oDate1.getFullYear(), oDate1.getMonth(), oDate1.getDate());
	oDate2 = new Date(oDate2.getFullYear(), oDate2.getMonth(), oDate2.getDate());
	var iDays = (oDate1.getTime() - oDate2.getTime()) / 86400000;
	return Math.round(iDays);
};

}
