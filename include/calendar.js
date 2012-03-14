/*
 *
 * Copyright (c) 2004-2009 by Zapatec, Inc.
 * http://www.zapatec.com
 * 1700 MLK Way, Berkeley, California,
 * 94709, U.S.A.
 * All rights reserved.
 *
 *
 */
if (!window.Zapatec || (Zapatec && !Zapatec.include)) { alert("You need to include zapatec.js file!"); } else { Zapatec.calendarPath = Zapatec.getPath("Zapatec.CalendarWidget"); }

zapatecUtils.emulateWindowEvent(['dblclick']);Zapatec.Calendar=function(oArg,date,onSelect,onClose){if(typeof oArg!='object'){var firstDay=oArg;oArg={};if(firstDay!=null)oArg.firstDay=firstDay;if(date)oArg.date=date;if(onSelect)oArg.onSelect=onSelect;if(onClose)oArg.onClose=onClose;}
zapatecCalendar.SUPERconstructor.call(this,oArg);};zapatecCalendar=Zapatec.Calendar;Zapatec.Calendar.activeCalendar=null;Zapatec.Calendar.id="Zapatec.Calendar";Zapatec.inherit(zapatecCalendar,zapatecWidget);Zapatec.Calendar.prototype.init=function(oArg){zapatecCalendar.SUPERclass.init.call(this,oArg);var oConfig=this.config;this.activeDiv=null;this.historyDateFormat=oConfig.ifFormat||oConfig.daFormat||'%B %d, %Y';this.currentDateEl=null;this.getDateStatus=null;this.getDateToolTip=null;this.timeout=null;this.dragging=false;this.hidden=false;this.minYear=1970;this.maxYear=2050;this.minMonth=0;this.maxMonth=11;this.isPopup=false;this.hiliteToday=true;this.table=null;this.element=null;this.tbody=[];this.firstDayName=null;this.monthsCombo=null;this.hilitedMonth=null;this.activeMonth=null;this.yearsCombo=null;this.hilitedYear=null;this.activeYear=null;this.histCombo=null;this.hilitedHist=null;this.dateClicked=false;this.titles=[];this.rowsOfDayNames=[];this.lastRowHilite=null;this.closeButton=null;this.helpButton=null;this.triggerEl=null;if(!this.isCreate)
this.isCreate=false;if(typeof oConfig.setDateToolTip=="function")
this.setDateToolTipHandler(oConfig.setDateToolTip);this.setRange(oConfig.range[0],oConfig.range[1]);if(Zapatec.Langs){if(!this.langStr)
this.langStr=oConfig.lang;}
else
Zapatec.Calendar._initSDN();this.dateFormat=Zapatec.Calendar.i18n("DEF_DATE_FORMAT",null,this);this.ttDateFormat=Zapatec.Calendar.i18n("TT_DATE_FORMAT",null,this);this.dateStr=oConfig.date;if(oConfig.themeSize.length>0)
Zapatec.Transport.loadCss({url:oConfig.themePath+oConfig.themeSize.toLowerCase()+".css",async:false});if(!oConfig.flat)
this.isPopup=true;if(typeof oConfig.onSelect=="function"){this.onSelected=oConfig.onSelect;}else{this.onSelected=this.onSelectInner;}
if(typeof oConfig.onClose!="function")
oConfig.onClose=this.onCloseInner;this.time24=(oConfig.timeFormat=='24');if(oConfig.multiple){this.setMultipleDates(oConfig.multiple);}
if(typeof oConfig.disableFunc=='function')
this.setDisabledHandler(oConfig.disableFunc);if(typeof oConfig.dateStatusFunc=='function')
this.setDateStatusHandler(oConfig.dateStatusFunc);oConfig.inputField=Zapatec.Widget.getElementById(oConfig.inputField);oConfig.displayArea=Zapatec.Widget.getElementById(oConfig.displayArea);oConfig.button=Zapatec.Widget.getElementById(oConfig.button);if(!oConfig.inputField){oConfig.canType=false;}else{oConfig.inputField.setAttribute("autocomplete","off");}
var oError=new Object;oError.source="setup";oError.id=oConfig.id;if(!(oConfig.flat||oConfig.multiple||oConfig.inputField||oConfig.displayArea||oConfig.button)){oError.errorDescription="Nothing to setup (no fields found). Please check your code.";}
if(((oConfig.timeInterval)&&((oConfig.timeInterval!==Math.floor(oConfig.timeInterval))||((60%oConfig.timeInterval!==0)&&(oConfig.timeInterval%60!==0))))||(oConfig.timeInterval>360)){oError.errorDescription="timeInterval option can only have the following number of minutes:\n1, 2, 3, 4, 5, 6, 10, 15, 30,  60, 120, 180, 240, 300, 360 ";Zapatec.Calendar.submitErrorFunc(oError);oConfig.timeInterval=null;}
if(oConfig.date&&!Date.parse(oConfig.date)){oError.errorDescription="Start Date Invalid. See date option.\nDefaulting to today.";Zapatec.Calendar.submitErrorFunc(oError);oConfig.date=null;}
this.setCookie();if(oConfig.multiple&&oConfig.maxSelection>0&&this._getMultipleLength()>oConfig.maxSelection){this._delUnnecessaryMultiple(oConfig.maxSelection);}
if(oConfig.flat!=null){oConfig.flat=Zapatec.Widget.getElementById(oConfig.flat);if(!oConfig.flat){Zapatec.Calendar.submitErrorFunc({sourse:"setup",id:oConfig.id,errorDescription:"Flat specified but can't find parent."});return false;}
if(oConfig.ifFormat){this.setDateFormat(oConfig.ifFormat);}}else
if(oConfig.canType){Zapatec.Utils.addEvent(oConfig.inputField,"mousedown",Zapatec.Calendar.cancelBubble);Zapatec.Utils.addEvent(oConfig.inputField,"keydown",Zapatec.Calendar.cancelBubble);Zapatec.Utils.addEvent(oConfig.inputField,"keypress",Zapatec.Calendar.cancelBubble);Zapatec.Utils.addEvent(oConfig.inputField,"keyup",function(ev){var cal=Zapatec.Calendar.activeCalendar;var format=oConfig.inputField?oConfig.ifFormat:oConfig.daFormat;var parsedDate=zapatecDate.parseDate.call(this,oConfig.inputField.value,format);if(parsedDate&&!cal.hidden){if(cal.setDate(parsedDate)){cal.showHint(Zapatec.Calendar.i18n("SEL_DATE",null,cal));}}});Zapatec.Utils.addEvent(oConfig.inputField,"blur",function(ev){var cal=Zapatec.Calendar.activeCalendar;var format=oConfig.inputField?oConfig.ifFormat:oConfig.daFormat;var parsedDate=zapatecDate.parseDate.call(this,oConfig.inputField.value,format);if(!parsedDate){oConfig.inputField.value=cal.printWith2Time(cal.currentDate,cal.currentDateEnd,format);}});}
var triggerEl=oConfig.button||oConfig.displayArea||oConfig.inputField;if(triggerEl){var widget={};for(i=0;i<Zapatec.Widget.all.length-1;i++)
if(Zapatec.Widget.all[i]instanceof Zapatec.Calendar){if(oConfig.inputField)widget=Zapatec.Widget.all[i].config.inputField;if(oConfig.displayArea)widget=Zapatec.Widget.all[i].config.displayArea;if(oConfig.button)widget=Zapatec.Widget.all[i].config.button;if(widget==triggerEl){Zapatec.Widget.all[i].destroy();}}
var selfEff=this.config.showEffectOnFinish;this.triggerEl=triggerEl;this.config.showEffectOnFinish=function(){if("function"==typeof selfEff){selfEff();}
triggerEl.disabled=false;}
Zapatec.Utils.addEvent(triggerEl,oConfig.eventName,new Function("Zapatec.Widget.getWidgetById("+this.id+").unHide(this)"));}
if(oConfig.closeEventName&&!Zapatec.is_opera){Zapatec.Utils.addEvent(triggerEl,oConfig.closeEventName,new Function("Zapatec.Widget.getWidgetById("+this.id+").callCloseHandler()"));}
if(this.config.showEffect.length>0&&typeof(Zapatec.Effects)=='undefined'){this.container=new Object;this.showContainer(this.config.showEffect,this.config.showEffectSpeed,this.config.showEffectOnFinish);}
if(this.config.closeButton){var cal=this;this.closeButton=new Zapatec.Button(this.config.closeButton);this.closeButton.config.clickAction=function(){if(typeof cal.config.closeButton['clickAction']=='function'){cal.config.closeButton['clickAction']();}
cal.callCloseHandler();};}
if(this.config.helpButton){var cal=this;this.helpButton=new Zapatec.Button(this.config.closeButton);this.helpButton.config.clickAction=function(){if(typeof cal.config.helpButton['clickAction']=='function'){cal.config.helpButton['clickAction']();}
cal.callHelpHandler();};}
this.container=oConfig.flat||this.element;if(!this.isPopup){Zapatec.Calendar.activeCalendar=this;this.create(oConfig.flat);if(oConfig.inputField&&oConfig.inputField.type=="text"&&typeof oConfig.inputField.value=="string"){this.parseDate(oConfig.inputField.value);}
this.show();}else if(oConfig.showAfterCreation){this.unHide(triggerEl);}};Zapatec.Calendar.prototype.reconfigure=function(oArg){zapatecCalendar.SUPERclass.reconfigure.call(this,oArg);this.show();};Zapatec.Calendar.prototype.configure=function(oArg){this.defineConfigOption('inputField',null);this.defineConfigOption('displayArea',null);this.defineConfigOption('button',null);this.defineConfigOption('eventName','click');this.defineConfigOption('closeEventName',null);this.defineConfigOption('ifFormat','%Y/%m/%d');this.defineConfigOption('daFormat','%Y/%m/%d');this.defineConfigOption('singleClick',true);this.defineConfigOption('disableFunc',null);this.defineConfigOption('dateStatusFunc',oArg.disableFunc?oArg.disableFunc:null);this.defineConfigOption('dateText',null);this.defineConfigOption('firstDay',null);this.defineConfigOption('align','Br');this.defineConfigOption('range',[1900,2999]);this.defineConfigOption('weekNumbers',true);this.defineConfigOption('flat',null);this.defineConfigOption('flatCallback',null);this.defineConfigOption('onSelect',null);this.defineConfigOption('onClose',null);this.defineConfigOption('onUpdate',null);this.defineConfigOption('onFDOW',null);this.defineConfigOption('noGrab',false);this.defineConfigOption('date','');this.defineConfigOption('dateEnd','');this.defineConfigOption('showsTime',false);this.defineConfigOption('sortOrder','asc');this.defineConfigOption('timeFormat','24');this.defineConfigOption('timeInterval',null);this.defineConfigOption('electric',true);this.defineConfigOption('step',2);this.defineConfigOption('position',null);this.defineConfigOption('cache',true);this.defineConfigOption('showOthers',false);this.defineConfigOption('multiple',null);this.defineConfigOption('multipleRange',null);this.defineConfigOption('multipleSelection',false);this.defineConfigOption('saveDate',null);this.defineConfigOption('fdowClick',false);this.defineConfigOption('titleHtml',null);this.defineConfigOption('noHelp',false);this.defineConfigOption('noCloseButton',false);this.defineConfigOption('disableYearNav',false);this.defineConfigOption('disableFdowChange',false);this.defineConfigOption('multiple',null);this.defineConfigOption('disableDrag',false);this.defineConfigOption('numberMonths',1);this.defineConfigOption('stepMonths');this.defineConfigOption('monthsInRow',oArg.numberMonths?oArg.numberMonths:1);this.defineConfigOption('controlMonth',1);this.defineConfigOption('vertical',false);this.defineConfigOption('canType',false);this.defineConfigOption('theme','bluexp');this.defineConfigOption('themeSize','');if(Zapatec.Langs){this.defineConfigOption('langId',Zapatec.Calendar.id);this.defineConfigOption('lang','en');}
this.defineConfigOption('showEffect','');this.defineConfigOption('showEffectSpeed',100);this.defineConfigOption('showEffectOnFinish',null);this.defineConfigOption('hideEffect','');this.defineConfigOption('hideEffectSpeed',100);this.defineConfigOption('hideEffectOnFinish',null);this.defineConfigOption('showAfterCreation',false);this.defineConfigOption('noHistory',false);this.defineConfigOption('noStatus',false);this.defineConfigOption('minimal',false);this.defineConfigOption('maxSelection',-1);this.defineConfigOption('onWeekClick',null);this.defineConfigOption('onTodayClick',null);this.defineConfigOption('onMonthSelect',null);this.defineConfigOption('onYearSelect',null);this.defineConfigOption('onHistorySelect',null);this.defineConfigOption('setDateToolTip',null);this.defineConfigOption('timeRange',false);this.defineConfigOption('onCreate',null);this.defineConfigOption('closeButton',null);this.defineConfigOption('helpButton',null);this.defineConfigOption('loadPrefs',false);this.defineConfigOption('historySize',9);this.defineConfigOption('hideNavPanel',false);zapatecCalendar.SUPERclass.configure.call(this,oArg);var oConfig=this.config;if(!oConfig.prefs)
oConfig.prefs={fdow:null,history:"",hsize:oConfig.historySize};if(oConfig.loadPrefs){Zapatec.Calendar.loadPrefs(oConfig);}
oConfig.themeSize=oConfig.themeSize.toLowerCase();if(oConfig.themeSize=='normal')
oConfig.themeSize='';var firstLetter=oConfig.themeSize.substr(0,1);oConfig.themeSize=firstLetter.toUpperCase()+oConfig.themeSize.substr(1);if(oConfig.prefs.fdow||(oConfig.prefs.fdow==0)){oConfig.firstDay=parseInt(oConfig.prefs.fdow,10);}else{var fd=1;if(typeof oConfig.firstDay=="number"){fd=oConfig.firstDay;}else if(typeof this._FD=='number'){fd=this._FD;}
oConfig.firstDay=fd;}
if(oConfig.weekNumbers){oConfig.disableFdowChange=true;}else{oConfig.onWeekClick=null;}
if((oConfig.numberMonths>12)||(oConfig.numberMonths<1)){oConfig.numberMonths=1;}
oConfig.numberMonths=parseInt(oConfig.numberMonths,10);oConfig.stepMonths=parseInt(oConfig.stepMonths);if(isNaN(oConfig.stepMonths)||oConfig.stepMonths<1){oConfig.stepMonths=oConfig.numberMonths;}
if((oConfig.controlMonth>oConfig.numberMonths)||(oConfig.controlMonth<1)){oConfig.controlMonth=1;}
oConfig.controlMonth=parseInt(oConfig.controlMonth,10);if(oConfig.monthsInRow>oConfig.numberMonths){oConfig.monthsInRow=oConfig.numberMonths;}
oConfig.monthsInRow=parseInt(oConfig.monthsInRow,10);if(oConfig.multipleSelection&&!oConfig.multiple){oConfig.multiple=[];}
if(oConfig.multiple&&!oConfig.multipleSelection){oConfig.multipleSelection=true;}
if(oConfig.multipleRange&&!oConfig.multiple){oConfig.multipleRange=null;}
if(oConfig.multiple){oConfig.singleClick=false;}
oConfig.sortOrder=oConfig.sortOrder.toLowerCase();oConfig.showEffectSpeed=parseInt(oConfig.showEffectSpeed,10);oConfig.hideEffectSpeed=parseInt(oConfig.hideEffectSpeed,10);if(oConfig.multipleRange&&!oConfig.timeRange){oConfig.timeRange=true;}
if(oConfig.timeRange&&!oConfig.showsTime){oConfig.showsTime=true;}
if(oConfig.minimal){oConfig.noHelp=true;oConfig.noCloseButton=true;oConfig.noHistory=true;oConfig.noStatus=true;oConfig.disableYearNav=true;oConfig.disableFdowChange=true;oConfig.weekNumbers=false;oConfig.fdowClick=false;oConfig.showsTime=false;oConfig.timeRange=false;}
if(oConfig.noCloseButton||!Zapatec.Button){oConfig.closeButton=null;}
if(oConfig.noHelp||!Zapatec.Button){oConfig.helpButton=null;}
if(oConfig.hideNavPanel){oConfig.minimal=true;}};Zapatec.Calendar.prototype.unHide=function(triggerEl){var cal=this;cal.lastRowHilite=null;if(!cal)
return;if(!cal.isCreate){if(cal.config.date&&cal.config.cache)
cal.setDate(cal.config.date);cal.create(cal.config.flat);}else{if(cal.config.date&&cal.config.cache)
cal.setDate(cal.config.date);cal.reconfigure(cal.config);cal.reinit();}
var oConfig=cal.config;var dateEl=oConfig.inputField||oConfig.displayArea;if(!Zapatec.is_ie&&(!oConfig.canType||oConfig.inputField!=triggerEl)&&triggerEl.blur){triggerEl.blur();}
var dateFmt=oConfig.inputField?oConfig.ifFormat:oConfig.daFormat;if(oConfig.canType&&(oConfig.inputField==triggerEl)&&cal&&!cal.hidden){}
if(dateEl){var dateValue;if(dateEl.value){dateValue=dateEl.value;}else{dateValue=dateEl.innerHTML;}
if(dateValue!=""){Zapatec.Calendar.activeCalendar=this;var parsedDate=zapatecDate.parseDate.call(this,dateEl.value||dateEl.innerHTML,dateFmt);if(parsedDate!=null){if(!(typeof cal.config.dateStatusFunc=="function"&&cal.config.dateStatusFunc(parsedDate))&&!cal.setDate(parsedDate))
oConfig.inputField.value=cal.printWith2Time(cal.currentDate,cal.currentDateEnd,cal.config.ifFormat);}
else
oConfig.inputField.value=cal.printWith2Time(cal.currentDate,cal.currentDateEnd,cal.config.ifFormat);}}
if(triggerEl){triggerEl.disabled=true;}
if(!oConfig.position)
cal.showAtElement(oConfig.button||oConfig.displayArea||oConfig.inputField,oConfig.align);else
cal.showAt(oConfig.position[0],oConfig.position[1]);return false;};Zapatec.Calendar.prototype.setCookie=function(){if(this.config.saveDate){this.cookiePrefix=window.location.href+"--"+this.config.button.id
var cookieName=this.cookiePrefix;var newdate=Zapatec.Utils.getCookie(cookieName);if(newdate!=null){Zapatec.Widget.getElementById(this.config.inputField.id).value=newdate;}}};Zapatec.Calendar.prototype._getMultipleLength=function(){var counter=0;for(var item in this.config.multiple){counter++;}
return counter;}
Zapatec.Calendar.prototype._delUnnecessaryMultiple=function(number){var cal=this;var counter=1;if(number>0&&cal._getMultipleLength()>number){for(var item in cal.config.multiple){if(counter++>number){delete cal.config.multiple[item];}}}}
Zapatec.Calendar.prototype.onSelectInner=function(cal,date){var p=cal.config;for(var prop in p){cal[prop]=p[prop];}
var update=(cal.dateClicked||p.electric);if(update&&p.flat){if(typeof p.flatCallback=="function"){if(!p.multiple){p.flatCallback(cal);}}
return false;}
if(update&&p.inputField){p.inputField.value=this.printWith2Time(cal.currentDate,cal.currentDateEnd,p.ifFormat);if(typeof p.inputField.onchange=="function")
p.inputField.onchange();}
if(update&&p.displayArea){p.displayArea.innerHTML=this.printWith2Time(cal.currentDate,cal.currentDateEnd,p.daFormat);}
if(update&&p.singleClick&&cal.dateClicked){cal.callCloseHandler();}
if(update&&typeof p.onUpdate=="function")
p.onUpdate(cal);if(p.saveDate){var cookieName=this.cookiePrefix;Zapatec.Utils.writeCookie(cookieName,p.inputField.value,null,'/',p.saveDate);}};Zapatec.Calendar.prototype.onCloseInner=function(cal){if(!cal.config.flat)
cal.hide();};Zapatec.Calendar.cancelBubble=function(event){event=event||window.event;if(Zapatec.is_ie){event.cancelBubble=true;}else{event.stopPropagation();}};Zapatec.Calendar._initSDN=function(){if(typeof Zapatec.Calendar._TT=="undefined"){Zapatec.Calendar._TT={};}
if(typeof Zapatec.Calendar._TT._SDN=="undefined"){if(typeof Zapatec.Calendar._TT._SDN_len=="undefined")
Zapatec.Calendar._TT._SDN_len=3;var ar=[];for(var i=8;i>0;){if(Zapatec.Calendar._TT._DN)
ar[--i]=Zapatec.Calendar._TT._DN[i].substr(0,Zapatec.Calendar._TT._SDN_len);else
ar[--i]="";}
Zapatec.Calendar._TT._SDN=ar;if(typeof Zapatec.Calendar._TT._SMN_len=="undefined")
Zapatec.Calendar._TT._SMN_len=3;ar=[];for(var i=12;i>0;){if(Zapatec.Calendar._TT._MN)
ar[--i]=Zapatec.Calendar._TT._MN[i].substr(0,Zapatec.Calendar._TT._SMN_len);else
ar[--i]="";}
Zapatec.Calendar._TT._SMN=ar;}
if(typeof Zapatec.Calendar._TT._AMPM=="undefined"){Zapatec.Calendar._TT._AMPM={am:"am",pm:"pm"};}};Zapatec.Calendar.i18nOld=function(str,type){var tr='';if(!Zapatec.Calendar._TT){Zapatec.Calendar._initSDN();}
if(!type){if(Zapatec.Calendar._TT){tr=Zapatec.Calendar._TT[str];}
if(!tr&&Zapatec.Calendar._TT_en){tr=Zapatec.Calendar._TT_en[str];}}else switch(type){case"dn":if(Zapatec.Calendar._TT._DN)tr=Zapatec.Calendar._TT._DN[str];break;case"sdn":if(Zapatec.Calendar._TT._SDN)tr=Zapatec.Calendar._TT._SDN[str];break;case"mn":if(Zapatec.Calendar._TT._MN)tr=Zapatec.Calendar._TT._MN[str];break;case"smn":if(Zapatec.Calendar._TT._SMN)tr=Zapatec.Calendar._TT._SMN[str];break;case"ampm":if(Zapatec.Calendar._TT._AMPM)tr=Zapatec.Calendar._TT._AMPM[str];break;}
if(!tr){tr=""+str;}
return tr;};Zapatec.Calendar.i18n=function(str,type,calendar){var newType="";var cal=null;if(typeof calendar=='undefined'){cal=Zapatec.Calendar.activeCalendar;}else{cal=calendar;}
if(cal!=null&&Zapatec.Langs&&Zapatec.Langs["Zapatec.Calendar"]){if(typeof type!='undefined'&&type){newType="_"+type.toUpperCase();return cal.getMessage(newType)[str];}else{return cal.getMessage(str);}}
return Zapatec.Calendar.i18nOld(str,type);};Zapatec.Calendar.savePrefs=function(calendarId){var cal=Zapatec.Widget.getWidgetById(calendarId);Zapatec.Utils.writeCookie("ZP_CAL",Zapatec.Utils.makePref(cal.config.prefs),null,'/',30);};Zapatec.Calendar.loadPrefs=function(oConfig){var txt=Zapatec.Utils.getCookie("ZP_CAL"),tmp;if(txt){tmp=Zapatec.Utils.loadPref(txt);if(tmp){Zapatec.Utils.mergeObjects(oConfig.prefs,tmp);}}};Zapatec.Calendar._add_evs=function(el){var C=Zapatec.Calendar;el.onmouseover=C.dayMouseOver;el.onmousedown=C.dayMouseDown;el.onmouseout=C.dayMouseOut;el.ondblclick=C.dayMouseDblClick;};Zapatec.Calendar._del_evs=function(el){if(!el){return null;}
el.onmouseover=null;el.onmousedown=null;el.onmouseout=null;if(Zapatec.is_ie){el.ondblclick=null;}};Zapatec.Calendar.findMonth=function(el){if(!el){return null;}
if(typeof el.month!="undefined"){return el;}else if(el.parentNode&&typeof el.parentNode.month!="undefined"){return el.parentNode;}
return null;};Zapatec.Calendar.findHist=function(el){if(!el){return null;}
if(typeof el.histDate!="undefined"){return el;}else if(el.parentNode&&typeof el.parentNode.histDate!="undefined"){return el.parentNode;}
return null;};Zapatec.Calendar.findYear=function(el){if(!el){return null;}
if(typeof el.year!="undefined"){return el;}else if(el.parentNode&&typeof el.parentNode.year!="undefined"){return el.parentNode;}
return null;};Zapatec.Calendar.showMonthsCombo=function(){var cal=Zapatec.Calendar.activeCalendar;if(!cal){return false;}
var cd=cal.activeDiv;var mc=cal.monthsCombo;var date=cal.config.date,MM=cal.config.date.getMonth(),YY=cal.config.date.getFullYear(),min=(YY==cal.minYear),max=(YY==cal.maxYear);for(var i=mc.firstChild;i;i=i.nextSibling){var m=i.month;Zapatec.Utils.removeClass(i,"hilite");Zapatec.Utils.removeClass(i,"active");Zapatec.Utils.removeClass(i,"disabled");i.disabled=false;if((min&&m<cal.minMonth)||(max&&m>cal.maxMonth)){Zapatec.Utils.addClass(i,"disabled");i.disabled=true;}
if(m==MM)
Zapatec.Utils.addClass(cal.activeMonth=i,"active");}
var oOffset=zapatecUtils.getElementOffsetRelative(cd);var s=mc.style;s.display="block";if(cd.navtype<0){s.left=oOffset.left+"px";}else{var mcw=mc.offsetWidth;if(typeof mcw=="undefined"){mcw=50;}
s.left=oOffset.left+oOffset.width-mcw+"px";}
s.top=oOffset.top+oOffset.height+"px";cal.updateWCH(mc);};Zapatec.Calendar.showHistoryCombo=function(){var cal=Zapatec.Calendar.activeCalendar;var a,h,i,cd,hc,s,tmp,div;if(!cal)
return false;hc=cal.histCombo;while(hc.firstChild)
hc.removeChild(hc.lastChild);if(cal.config.prefs.history){a=cal.config.prefs.history.split(/,/);i=0;while(tmp=a[i++]){tmp=tmp.split(/\//);h=Zapatec.Utils.createElement("div");h.className=Zapatec.is_ie?"label-IEfix":"label";h.id="zpCal"+cal.id+"HistoryDropdownItem"+(i-1);h.histDate=new Date(parseInt(tmp[0],10),parseInt(tmp[1],10)-1,parseInt(tmp[2],10),tmp[3]?parseInt(tmp[3],10):0,tmp[4]?parseInt(tmp[4],10):0);h.appendChild(window.document.createTextNode(zapatecDate.print.call(cal,h.histDate,cal.historyDateFormat)));hc.appendChild(h);if(Zapatec.Date.dateEqualsTo(h.histDate,cal.config.date))
Zapatec.Utils.addClass(h,"active");}}
cd=cal.activeDiv;var oOffset=zapatecUtils.getElementOffsetRelative(cd);s=hc.style;s.display="block";s.left=Math.floor(oOffset.left+(oOffset.width-hc.offsetWidth)/2)+"px";s.top=oOffset.top+oOffset.height+"px";cal.updateWCH(hc);cal.bEventShowHistory=true;};Zapatec.Calendar.showYearsCombo=function(fwd){var cal=Zapatec.Calendar.activeCalendar;if(!cal){return false;}
var cd=cal.activeDiv;var yc=cal.yearsCombo;if(cal.hilitedYear){Zapatec.Utils.removeClass(cal.hilitedYear,"hilite");}
if(cal.activeYear){Zapatec.Utils.removeClass(cal.activeYear,"active");}
cal.activeYear=null;var Y=cal.config.date.getFullYear()+(fwd?1:-1);var yr=yc.firstChild;var show=false;for(var i=12;i>0;--i){if(Y>=cal.minYear&&Y<=cal.maxYear){yr.firstChild.data=Y;yr.year=Y;yr.style.display="block";show=true;}else{yr.style.display="none";}
yr=yr.nextSibling;Y+=fwd?cal.config.step:-cal.config.step;}
if(show){var oOffset=zapatecUtils.getElementOffsetRelative(cd);var s=yc.style;s.display="block";if(cd.navtype<0){s.left=oOffset.left+"px";}else{var ycw=yc.offsetWidth;if(typeof ycw=="undefined"){ycw=50;}
s.left=oOffset.left+oOffset.width-ycw+"px";}
s.top=oOffset.top+oOffset.height+"px";}
cal.updateWCH(yc);};Zapatec.Calendar.tableMouseDown=function(ev){if(Zapatec.Utils.getTargetElement(ev)==Zapatec.Utils.getElement(ev)){return Zapatec.Utils.stopEvent(ev);}};Zapatec.Calendar.dayMouseDown=function(ev){var canDrag=true;var el=Zapatec.Utils.getElement(ev);if(el.className.indexOf("disabled")!=-1||el.className.indexOf("true")!=-1){return false;}
var cal=el.calendar;var parent=el.parentNode;if(parent.className.indexOf("disabled")!=-1||parent.className.indexOf("true")!=-1){return false;}
while(!cal){el=el.parentNode;cal=el.calendar;}
cal.bEventShowHistory=false;cal.activeDiv=el;Zapatec.Calendar.activeCalendar=cal;if(el.navtype!=300){if(el.navtype==50||el.navtype==51){if(!((cal.config.timeInterval==null)||((cal.config.timeInterval<60)&&(el.className.indexOf("hour",0)!=-1)))){canDrag=false;}
el._current=el.firstChild.data;if(canDrag){Zapatec.Utils.addEvent(window.document,"mousemove",Zapatec.Calendar.tableMouseOver);}}else{if(((el.navtype==201)||(el.navtype==202)||(el.navtype==211)||(el.navtype==212))&&(cal.config.timeInterval>30)&&(el.timePart.className.indexOf("minute",0)!=-1)){canDrag=false;}
if(canDrag){Zapatec.Utils.addEvent(window.document,Zapatec.is_ie5?"mousemove":"mouseover",Zapatec.Calendar.tableMouseOver);}}
if(canDrag&&!(el.navtype==200&&cal.closeButton)&&!(el.navtype==400&&cal.helpButton)){Zapatec.Utils.addClass(el,"hilite");Zapatec.Utils.addClass(el,"active");}
Zapatec.Utils.addEvent(window.document,"mouseup",Zapatec.Calendar.tableMouseUp);}else if(cal.isPopup){cal._dragStart(ev);}else{Zapatec.Calendar.activeCalendar=null;}
if(el.navtype==-1||el.navtype==1){if(cal.timeout)clearTimeout(cal.timeout);cal.timeout=setTimeout("Zapatec.Calendar.showMonthsCombo()",250);}else if(el.navtype==-2||el.navtype==2){if(cal.timeout)clearTimeout(cal.timeout);cal.timeout=setTimeout((el.navtype>0)?"Zapatec.Calendar.showYearsCombo(true)":"Zapatec.Calendar.showYearsCombo(false)",250);}else if(el.navtype==0&&cal.config.prefs.history){if(cal.timeout)clearTimeout(cal.timeout);cal.timeout=setTimeout("Zapatec.Calendar.showHistoryCombo()",250);}else{cal.timeout=null;}
return Zapatec.Utils.stopEvent(ev);};Zapatec.Calendar.dayMouseDblClick=function(){var oEv=window.event;var oEl=oEv.currentTarget||oEv.srcElement;var oCal=oEl.calendar;while(!oCal){oEl=oEl.parentNode;oCal=oEl.calendar;}
if(typeof oEl.navtype=='undefined'){oCal.fireEvent('calDateDblclicked',oCal.currentDate);}
if(Zapatec.is_ie){window.document.selection.empty();}};Zapatec.Calendar.dayMouseOver=function(ev){var el=Zapatec.Utils.getElement(ev);while(!el.calendar){el=el.parentNode;caldate=el.caldate;}
var cal=el.calendar;caldate=el.caldate;var cel=el.timePart;if(caldate){caldate=new Date(caldate[0],caldate[1],caldate[2]);if(caldate.getDate()!=el.caldate[2])caldate.setDate(el.caldate[2]);}
if(Zapatec.Utils.isRelated(el,ev)||el.className.indexOf("disabled")!=-1||el.className.indexOf("true")!=-1){return false;}
if(el.ttip){if(el.ttip.substr(0,1)=="_"){el.ttip=zapatecDate.print.call(cal,caldate,el.calendar.ttDateFormat)+el.ttip.substr(1);}
cal.showHint(el.ttip);}
if(el.navtype!=300){if(!((cal.config.timeInterval==null)||(el.className.indexOf("ampm",0)!=-1)||((cal.config.timeInterval<60)&&(el.className.indexOf("hour",0)!=-1)))&&(el.navtype==50)){return Zapatec.Utils.stopEvent(ev);}
if(((el.navtype==201)||(el.navtype==202))&&(cal.config.timeInterval>30)&&(cel.className.indexOf("minute",0)!=-1)){return Zapatec.Utils.stopEvent(ev);}
if(!(el.navtype==200&&cal.closeButton)&&!(el.navtype==400&&cal.helpButton))
Zapatec.Utils.addClass(el,"hilite");if(caldate&&el.className.indexOf("disabled")==-1&&el.className.indexOf("true")==-1){if(cal.lastRowHilite){Zapatec.Utils.removeClass(cal.lastRowHilite,"rowhilite");cal.lastRowHilite=null;}
Zapatec.Utils.addClass(el.parentNode,"rowhilite");}}
return Zapatec.Utils.stopEvent(ev);};Zapatec.Calendar.dayMouseOut=function(ev){var el=Zapatec.Utils.getElement(ev);while(!el.calendar){el=el.parentNode;caldate=el.caldate;}
var cal=el.calendar;caldate=el.caldate;if(Zapatec.Utils.isRelated(el,ev)||el.className.indexOf("disabled")!=-1||el.className.indexOf("true")!=-1)
return false;Zapatec.Utils.removeClass(el,"hilite");if(caldate)
Zapatec.Utils.removeClass(el.parentNode,"rowhilite");if(cal)
cal.showHint(Zapatec.Calendar.i18n("SEL_DATE",null,cal));return Zapatec.Utils.stopEvent(ev);};Zapatec.Calendar.cellClick=function(el,ev){var cal=el.calendar;var closing=false;var newdate=false;var date=null;while(!cal){el=el.parentNode;cal=el.calendar;}
if(el.className.indexOf("disabled")!=-1||el.className.indexOf("true")!=-1){Zapatec.Utils.removeClass(el,"hilite");return false;}
if(cal.config.multiple&&cal.config.maxSelection>0&&(cal._getMultipleLength()+1)>cal.config.maxSelection){return;}
if(typeof el.navtype=="undefined"){if(cal.currentDateEl){Zapatec.Utils.removeClass(cal.currentDateEl,"selected");Zapatec.Utils.addClass(el,"selected");closing=(cal.currentDateEl==el);if(!closing){cal.currentDateEl=el;}}
var tmpDate=new Date(el.caldate[0],el.caldate[1],el.caldate[2]);if(tmpDate.getDate()!=el.caldate[2]){tmpDate.setDate(el.caldate[2]);}
Zapatec.Date.setDateOnly(cal.config.date,tmpDate);Zapatec.Date.setDateOnly(cal.currentDate,tmpDate);if(cal.currentDateEnd){Zapatec.Date.setDateOnly(cal.currentDateEnd,tmpDate);}
date=cal.config.date;cal.dateClicked=true;if(cal.config.multiple){cal.toggleMultipleDate(new Date(cal.currentDate),new Date(cal.currentDateEnd));}
if(!cal.config.noHistory){cal.updateHistory();}
newdate=true;cal.onSetTime();if(ev){var iNow=Date.parse(new Date());if(!cal.calDateClicked||iNow-cal.calDateClicked>500){cal.fireEvent('calDateClicked',tmpDate);cal.calDateClicked=iNow;}}else{cal.fireEvent('calDateSwitched',tmpDate);}}else{if(el.navtype==200){if(!cal.closeButton){Zapatec.Utils.removeClass(el,"hilite");cal.callCloseHandler();}
return;}
date=new Date(cal.config.date);if(el.navtype==0&&!cal.bEventShowHistory){Zapatec.Date.setDateOnly(date,new Date());}
cal.dateClicked=false;var year=date.getFullYear();var mon=date.getMonth();function setMonth(m){var day=date.getDate();var max=Zapatec.Date.getMonthDays(date,m);if(day>max){date.setDate(max);}
date.setMonth(m);};var dateStart=null;switch(el.navtype){case 400:if(!cal.helpButton){Zapatec.Utils.removeClass(el,"hilite");cal.callHelpHandler();}
return;case-2:if(year>cal.minYear){Zapatec.Date.setFullYear(date,year-1);if(typeof cal.config.onYearSelect=="function")
cal.config.onYearSelect(year-1);}
break;case-1:if(mon>0){setMonth(mon-cal.config.stepMonths);}else if(year-->cal.minYear){Zapatec.Date.setFullYear(date,year);setMonth(11);}
if(typeof cal.config.onMonthSelect=="function"){cal.config.onMonthSelect(mon>0?mon-1:11);}
break;case 1:if(mon<11){setMonth(mon+cal.config.stepMonths);}else if(year<cal.maxYear){Zapatec.Date.setFullYear(date,year+1);setMonth(0);}
if(typeof cal.config.onMonthSelect=="function"){cal.config.onMonthSelect(mon<11?mon+1:0);}
break;case 2:if(year<cal.maxYear){Zapatec.Date.setFullYear(date,year+1);if(typeof cal.config.onYearSelect=="function"){cal.config.onYearSelect(year+1);}}
break;case 100:cal.setFirstDayOfWeek(el.fdow);cal.config.prefs.fdow=cal.config.firstDay;Zapatec.Calendar.savePrefs(cal.id);if(cal.config.onFDOW){cal.config.onFDOW(cal.config.firstDay);}
return;case 150:if(cal.config.onWeekClick){cal.config.onWeekClick(el.innerHTML);}
return;case 50:case 51:var date=cal.currentDate;if(el.navtype==51){date=cal.currentDateEnd;dateStart=cal.currentDate;}
if(el.className.indexOf("ampm",0)<0&&!((cal.config.timeInterval==null)||((cal.config.timeInterval<60)&&(el.className.indexOf("hour",0)!=-1)))){break;}
var range=el._range;var current=el.firstChild.data;var pm=(date.getHours()>=12);for(var i=range.length;--i>=0;){if(range[i]==current){break;}}
if(ev&&ev.shiftKey){if(--i<0){i=range.length-1;}}else if(++i>=range.length){i=0;}
var minute=null;var hour=null;var new_date=new Date(date);if(el.className.indexOf("ampm",0)!=-1){minute=date.getMinutes();hour=(range[i]==Zapatec.Calendar.i18n("pm","ampm",cal))?((date.getHours()==12)?(date.getHours()):(date.getHours()+12)):(date.getHours()-12);if(cal.getDateStatus&&cal.getDateStatus(new_date,date.getFullYear(),date.getMonth(),date.getDate(),parseInt(hour,10),parseInt(minute,10))){var dirrect;if(range[i]==Zapatec.Calendar.i18n("pm","ampm",cal)){dirrect=-5;}else{dirrect=5;}
hours=hour;minutes=minute;do{minutes+=dirrect;if(minutes>=60){minutes-=60;++hours;if(hours>=24){hours-=24;}
new_date.setHours(hours);}
if(minutes<0){minutes+=60;--hours;if(hours<0){hours+=24;}
new_date.setHours(hours);}
new_date.setMinutes(minutes);if(dateStart){if(new_date.getHours()>dateStart.getHourse()){new_date.setHours(dateStart.getHourse());}
if(new_date.Minutes()>dateStart.Minutes()){new_date.setMinutes(dateStart.getMinutes()+1);}}
if(!cal.getDateStatus(new_date,date.getFullYear(),date.getMonth(),date.getDate(),parseInt(hours,10),parseInt(minutes,10))){hour=hours;minute=minutes;if(hour>12){i=1;}else{i=0;}
if(dateStart){var tmpDate=new Date(cal.config.dateEnd);tmpDate.setHours(hour);tmpDate.setMinutes(minute);if(hour>dateStart.getHours()){hour=dateStart.getHours();}
if(minute>dateStart.getMinutes()>dateStart.getMinutes()&&cal.config.dateEnd<dateStart){minute=dateStart.getMinutes();}
cal.config.dateEnd.setHours(hour);cal.config.dateEnd.setMinutes(minute);cal.onSetTime(cal.currentDateEnd);}else{cal.config.date.setHours(hour);cal.config.date.setMinutes(minute);cal.onSetTime();}}}while((hour!=hours)||(minute!=minutes));}
new_date.setHours(hour);}
if(el.className.indexOf("hour",0)!=-1){minute=date.getMinutes();hour=(!cal.time24)?((pm)?((range[i]!=12)?(parseInt(range[i],10)+12):(12)):((range[i]!=12)?(range[i]):(0))):(range[i]);new_date.setHours(hour);}
if(el.className.indexOf("minute",0)!=-1){hour=date.getHours();minute=range[i];new_date.setMinutes(minute);}
var status=false;if(cal.getDateStatus){status=cal.getDateStatus(new_date,date.getFullYear(),date.getMonth(),date.getDate(),parseInt(hour,10),parseInt(minute,10));if(dateStart&&(hour<dateStart.getHours()||minute<dateStart.getMinutes())){status=true;}}
if(dateStart){var testDate=new Date(new_date);testDate.setHours=parseInt(hour,10);testDate.setMinutes=parseInt(minute,10);if(testDate<cal.currentDate){status=true;}}
if(!status){el.firstChild.data=range[i];}
if(dateStart){cal.onUpdateTime(cal.currentDateEnd);}else{cal.onUpdateTime();}
return;case 211:case 212:dateStart=cal.currentDate;case 201:case 202:var cel=el.timePart;var date=null;if(dateStart){date=cal.currentDateEnd;}else{date=cal.currentDate;}
if((cel.className.indexOf("minute",0)!=-1)&&(cal.config.timeInterval>30)){break;}
var val=parseInt(cel.firstChild.data,10);var pm=(date.getHours()>=12);var range=cel._range;for(var i=range.length;--i>=0;){if(val==range[i]){val=i;break;}}
var step=cel._step;if(el.navtype==201||el.navtype==211){val=step*Math.floor(val/step);val+=step;if(val>=range.length){val=0;}}else{val=step*Math.ceil(val/step);val-=step;if(val<0){val=range.length-step;}}
var minute=null;var hour=null;var new_date=new Date(date);if(cel.className=="hour"){minute=date.getMinutes();hour=(!cal.time24)?((pm)?((range[val]!=12)?(parseInt(range[val],10)+12):(12)):((range[val]!=12)?(range[val]):(0))):(range[val]);new_date.setHours(hour);}
if(cel.className=="minute"){hour=date.getHours();minute=val;new_date.setMinutes(range[val]);}
var status=false;if(cal.getDateStatus){status=cal.getDateStatus(new_date,date.getFullYear(),date.getMonth(),date.getDate(),parseInt(hour,10),parseInt(minute,10));if(dateStart&&(hour<dateStart.getHours()||minute<dateStart.getMinutes())){status=true;}}
if(dateStart){var testDate=new Date(new_date);testDate.setHours=parseInt(hour,10);testDate.setMinutes=parseInt(minute,10);if(testDate<cal.currentDate){status=true;}}
if(!status){cel.firstChild.data=range[val];}
if(dateStart){cal.onUpdateTime(cal.currentDateEnd);}else{cal.onUpdateTime();}
return;case 0:if(cal.config.onTodayClick){cal.config.onTodayClick(el.innerHTML);}
if(cal.getDateStatus&&((cal.getDateStatus(date,date.getFullYear(),date.getMonth(),date.getDate())==true)||(cal.getDateStatus(date,date.getFullYear(),date.getMonth(),date.getDate())=="disabled"))){return false;}
break;}
if(!Zapatec.Date.equalsTo(date,cal.config.date)){if(el.navtype&&el.navtype>=-2&&el.navtype<=2){cal._init(cal.config.firstDay,date,true);return;}
cal.setDate(date);newdate=true;if(ev){var iNow=Date.parse(new Date());if(!cal.calDateClicked||iNow-cal.calDateClicked>500){cal.fireEvent('calDateClicked',date);cal.calDateClicked=iNow;}}else{cal.fireEvent('calDateSwitched',date);}}}
if(newdate){cal.callHandler();}
if(closing&&cal.isPopup){Zapatec.Utils.removeClass(el,"hilite");cal.callCloseHandler();}};Zapatec.Calendar.tableMouseUp=function(ev){var cal=Zapatec.Calendar.activeCalendar;if(!cal){return false;}
if(cal.timeout){clearTimeout(cal.timeout);}
var el=cal.activeDiv;if(!el){return false;}
var target=Zapatec.Utils.getTargetElement(ev);if(typeof(el.navtype)=="undefined"){while(target&&!target.calendar){target=target.parentNode;}}
ev||(ev=window.event);Zapatec.Utils.removeClass(el,"active");if(target&&(target==el||target.parentNode==el)){Zapatec.Calendar.cellClick(el,ev);}
var mon=Zapatec.Calendar.findMonth(target);var date=null;if(mon){if(!mon.disabled){date=new Date(cal.config.date);if(mon.month!=date.getMonth()){date.setMonth(mon.month);date.setMonth(mon.month);cal.setDate(date,true);cal.dateClicked=false;cal.callHandler();}}
if(typeof cal.config.onMonthSelect=="function")
cal.config.onMonthSelect(mon.month);}else{var year=Zapatec.Calendar.findYear(target);if(year){date=new Date(cal.config.date);if(year.year!=date.getFullYear()){Zapatec.Date.setFullYear(date,year.year);cal.setDate(date,true);cal.dateClicked=false;cal.callHandler();}
if(typeof cal.config.onYearSelect=="function")
cal.config.onYearSelect(year.year);}else{var hist=Zapatec.Calendar.findHist(target);if(hist&&!Zapatec.Date.dateEqualsTo(hist.histDate,cal.config.date)){date=new Date(hist.histDate);cal._init(cal.config.firstDay,cal.config.date=date);cal.dateClicked=false;cal.callHandler();if(typeof cal.config.onHistorySelect=="function")
cal.config.onHistorySelect(hist.histDate);}}}
Zapatec.Utils.removeEvent(window.document,"mouseup",Zapatec.Calendar.tableMouseUp);Zapatec.Utils.removeEvent(window.document,"mouseover",Zapatec.Calendar.tableMouseOver);Zapatec.Utils.removeEvent(window.document,"mousemove",Zapatec.Calendar.tableMouseOver);cal._hideCombos();return Zapatec.Utils.stopEvent(ev);};Zapatec.Calendar.tableMouseOver=function(ev){var cal=Zapatec.Calendar.activeCalendar;if(!cal){return;}
var el=cal.activeDiv;var target=Zapatec.Utils.getTargetElement(ev);if(target==el||target.parentNode==el){if(this.lastRowHilite){Zapatec.Utils.removeClass(this.lastRowHilite,"rowhilite");this.lastRowHilite=null;}
if(!(el.navtype==200&&cal.closeButton)&&!(el.navtype==400&&cal.helpButton))
Zapatec.Utils.addClass(el,"hilite");Zapatec.Utils.addClass(el,"active");if(el.navtype!=50&&el.navtype!=51)
Zapatec.Utils.addClass(el.parentNode,"rowhilite");}else{if(typeof el.navtype=="undefined"||((el.navtype!=50||el.navtype!=51)&&((el.navtype==0&&!cal.histCombo)||Math.abs(el.navtype)>2)))
Zapatec.Utils.removeClass(el,"active");Zapatec.Utils.removeClass(el,"hilite");Zapatec.Utils.removeClass(el.parentNode,"rowhilite");}
ev||(ev=window.event);if((el.navtype==50||el.navtype==51)&&target!=el){var pos=Zapatec.Utils.getAbsolutePos(el);var w=el.offsetWidth;var x=ev.clientX;var dx;var decrease=true;if(x>pos.x+w){dx=x-pos.x-w;decrease=false;}else
dx=pos.x-x;if(dx<0)dx=0;var range=el._range;var current=el._current;var date=null;var dateStart=null;if(el.navtype==51)
dateStart=cal.currentDate;if(dateStart)
date=cal.currentDateEnd;else
date=cal.currentDate;var pm=(date.getHours()>=12);var old=el.firstChild.data;var count=Math.floor(dx/10)%range.length;for(var i=range.length;--i>=0;)
if(range[i]==current)
break;while(count-->0)
if(decrease){if(--i<0){i=range.length-1;}}else if(++i>=range.length){i=0;}
var minute=null;var hour=null;var new_date=new Date(date);if(el.className.indexOf("ampm",0)!=-1){minute=date.getMinutes();if(old!=range[i]){hour=(range[i]==Zapatec.Calendar.i18n("pm","ampm",cal))?((date.getHours()==0)?(12):(date.getHours()+12)):(date.getHours()-12);}else{hour=date.getHours();}
new_date.setHours(hour);}
if(el.className.indexOf("hour",0)!=-1){minute=date.getMinutes();hour=(!cal.time24)?((pm)?((range[i]!=12)?(parseInt(range[i],10)+12):(12)):((range[i]!=12)?(range[i]):(0))):(range[i]);new_date.setHours(hour);}
if(el.className.indexOf("minute",0)!=-1){hour=date.getHours();minute=range[i];new_date.setMinutes(minute);}
var status=false;if(cal.getDateStatus){status=cal.getDateStatus(new_date,date.getFullYear(),date.getMonth(),date.getDate(),parseInt(hour,10),parseInt(minute,10));}
if(status==false){if(!((!cal.time24)&&(range[i]==Zapatec.Calendar.i18n("pm","ampm",cal))&&(hour>23))){el.firstChild.data=range[i];}}
cal.onUpdateTime();}
var mon=Zapatec.Calendar.findMonth(target);if(mon){if(!mon.disabled){if(mon.month!=cal.config.date.getMonth()){if(cal.hilitedMonth){Zapatec.Utils.removeClass(cal.hilitedMonth,"hilite");}
Zapatec.Utils.addClass(mon,"hilite");cal.hilitedMonth=mon;}else if(cal.hilitedMonth){Zapatec.Utils.removeClass(cal.hilitedMonth,"hilite");}}}else{if(cal.hilitedMonth){Zapatec.Utils.removeClass(cal.hilitedMonth,"hilite");}
var year=Zapatec.Calendar.findYear(target);if(year){if(year.year!=cal.config.date.getFullYear()){if(cal.hilitedYear){Zapatec.Utils.removeClass(cal.hilitedYear,"hilite");}
Zapatec.Utils.addClass(year,"hilite");cal.hilitedYear=year;}else if(cal.hilitedYear){Zapatec.Utils.removeClass(cal.hilitedYear,"hilite");}}else{if(cal.hilitedYear){Zapatec.Utils.removeClass(cal.hilitedYear,"hilite");}
var hist=Zapatec.Calendar.findHist(target);if(hist){if(!Zapatec.Date.dateEqualsTo(hist.histDate,cal.config.date)){if(cal.hilitedHist){Zapatec.Utils.removeClass(cal.hilitedHist,"hilite");}
Zapatec.Utils.addClass(hist,"hilite");cal.hilitedHist=hist;}else if(cal.hilitedHist){Zapatec.Utils.removeClass(cal.hilitedHist,"hilite");}}else if(cal.hilitedHist){Zapatec.Utils.removeClass(cal.hilitedHist,"hilite");}}}
return Zapatec.Utils.stopEvent(ev);};Zapatec.Calendar.calDragIt=function(ev){ev||(ev=window.event);var cal=Zapatec.Calendar.activeCalendar;if(!cal){Zapatec.Caslendar.calDragEnd();}
if(!cal.config.disableDrag){if(!(cal&&cal.dragging)){return false;}
var posX=ev.clientX+window.document.body.scrollLeft;var posY=ev.clientY+window.document.body.scrollTop;cal.hideShowCovered();var st=cal.element.style,L=posX-cal.xOffs,T=posY-cal.yOffs;st.left=L+"px";st.top=T+"px";Zapatec.Utils.setupWCH(cal.WCH,L,T);}
return Zapatec.Utils.stopEvent(ev);};Zapatec.Calendar.calDragEnd=function(ev){var cal=Zapatec.Calendar.activeCalendar;Zapatec.Utils.removeEvent(window.document,"mousemove",Zapatec.Calendar.calDragIt);Zapatec.Utils.removeEvent(window.document,"mouseover",Zapatec.Calendar.calDragIt);Zapatec.Utils.removeEvent(window.document,"mouseup",Zapatec.Calendar.calDragEnd);if(!cal){return false;}
cal.dragging=false;Zapatec.Calendar.tableMouseUp(ev);cal.hideShowCovered();};Zapatec.Calendar._zoomIn=function(elementId){var oZoom=document.getElementById(elementId);var newZoom=parseInt(oZoom.style.zoom)+10+'%'
oZoom.style.zoom=newZoom;}
Zapatec.Calendar._zoomOut=function(elementId){var oZoom=document.getElementById(elementId);var newZoom=parseInt(oZoom.style.zoom)-10+'%'
oZoom.style.zoom=newZoom;}
Zapatec.Calendar.zoomElement=function(event,elementId){if(!Zapatec.is_ie)
return;if(!document.getElementById(elementId).style.zoom)
document.getElementById(elementId).style.zoom="100%";var delta=0;if(!event)event=window.event;if(event.wheelDelta){delta=event.wheelDelta/120;if(window.opera)delta=-delta;}else if(event.detail){delta=-event.detail/3;}
if(delta&&event.ctrlKey){if(delta>0)
Zapatec.Calendar._zoomOut(elementId);if(delta<0)
Zapatec.Calendar._zoomIn(elementId);}
if(event.preventDefault)
event.preventDefault();event.returnValue=false;}
Zapatec.Calendar.prototype.create=function(_par){var parent=null;if(!_par){var oInputField=this.config.inputField;if(oInputField){parent=oInputField.parentNode;}else{parent=window.document.getElementsByTagName("body")[0];}
this.isPopup=true;this.WCH=Zapatec.Utils.createWCH(parent);}else{parent=_par;this.isPopup=false;}
this.currentDate=this.config.date=this.dateStr?new Date(this.dateStr):new Date();if(this.config.timeRange)
this.currentDateEnd=new Date(this.currentDate);var rootTable=Zapatec.Utils.createElement("table");rootTable.cellSpacing=0;rootTable.cellPadding=0;rootTable.id="zpCalendar"+this.id+"RootTable";rootTable.className='zpCalRootTable';this.table=rootTable;Zapatec.Utils.createProperty(rootTable,"calendar",this);Zapatec.Utils.addEvent(rootTable,"mousedown",Zapatec.Calendar.tableMouseDown);if(Zapatec.is_opera){rootTable.style.width=(this.config.monthsInRow*((this.config.weekNumbers)?(8):(7))*2+4.4*this.config.monthsInRow)+"em";}
var div=Zapatec.Utils.createElement("div");this.element=div;this.container=this.element;div.className="calendar "+this.getClassName({prefix:"zpCalendar"})+" zpCalendar"+this.config.themeSize;div.id="zpCal"+this.id+"Container";if(Zapatec.is_ie){Zapatec.Utils.addEvent(div,"mousewheel",new Function("Zapatec.Calendar.zoomElement(window.event,'"+div.id+"')"));}
if(this.isPopup){div.style.position="absolute";div.style.display="none";}
div.appendChild(rootTable);var cell=null;var row=null;var cal=this;var hh=function(text,cs,navtype,buttonType){cell=Zapatec.Utils.createElement("td",row);if(buttonType){cell.id="zpCal"+cal.id+buttonType+"ButtonStatus";}
cell.colSpan=cs;cell.className="button";if(Math.abs(navtype)<=2)
cell.className+=" nav";Zapatec.Calendar._add_evs(cell);Zapatec.Utils.createProperty(cell,"calendar",cal);cell.navtype=navtype;if(text.substr(0,1)!="&"){cell.appendChild(document.createTextNode(text));}
else{cell.innerHTML=text;}
return cell;};var hd=function(par,colspan,buttonType){cell=Zapatec.Utils.createElement("td",par);if(buttonType){cell.id="zpCal"+cal.id+buttonType+"ButtonStatus";}
cell.colSpan=colspan;cell.className="button";cell.innerHTML="<div>&nbsp</div>";return cell;};var title_length=((this.config.weekNumbers)?(8):(7))*this.config.monthsInRow-2;var rootTbody=Zapatec.Utils.createElement("tbody",rootTable);var trOfRootTable=Zapatec.Utils.createElement("tr",rootTbody);trOfRootTable.id="zpCalendar"+this.id+"RootTableTR1";var tdOfRootTable=Zapatec.Utils.createElement("td",trOfRootTable);tdOfRootTable.id="zpCalendar"+this.id+"RootTableTR1TD1";tdOfRootTable.className="RootTableTD";var table=Zapatec.Utils.createElement("table",tdOfRootTable);table.id="zpCalendar"+this.id+"Calendar1RootContainer";table.className='zpCalTable';table.cellSpacing=0;table.cellPadding=0;var thead=Zapatec.Utils.createElement("thead",table);if(this.config.numberMonths==1){this.title=thead;}else{}
row=Zapatec.Utils.createElement("tr",thead);var help_length=0,close_length=0;if(!this.config.minimal){if(this.config.closeButton||this.config.helpButton){cell=Zapatec.Utils.createElement("td",row);cell.colSpan=title_length+2;var table1=Zapatec.Utils.createElement("table",cell);table1.style.border="none";table1.width="100%";table1.cellPadding=0;table1.cellSpacing=0;table1=Zapatec.Utils.createElement("tbody",table1);row=Zapatec.Utils.createElement("tr",table1);row.vAlign="middle";}
if(!this.config.noHelp){if(this.config.helpButton){var calendarHelpButton=hh(this.config.helpButton?"":"?",1,400,"Help");calendarHelpButton.appendChild(this.helpButton.getContainer());if(this.helpButton.getContainer().style.width)
help_length=this.helpButton.getContainer().style.width;if(this.helpButton.img.width)
help_length=this.helpButton.img.width;}else{var calendarHelpButton=hh(this.config.helpButton?"":"?",1,400,"Help");}
calendarHelpButton.ttip=Zapatec.Calendar.i18n("INFO",null,this);}else{hd(row,1,"Help");}
this.title=hh("&nbsp;",title_length,300);this.title.className="title";this.title.id="zpCal"+this.id+"Title";if(this.isPopup){if(!this.config.disableDrag){this.title.ttip=Zapatec.Calendar.i18n("DRAG_TO_MOVE",null,this);this.title.style.cursor="move";}
if(!this.config.noCloseButton){if(this.config.closeButton){var calendarCloseButton=hh(this.config.closeButton?"":"&#x00d7;",1,200,"Close");calendarCloseButton.appendChild(this.closeButton.getContainer());if(this.closeButton.getContainer().style.width)
close_length=this.closeButton.getContainer().style.width;if(this.closeButton.img.width)
close_length=this.closeButton.img.width;}else{var calendarCloseButton=hh(this.config.closeButton?"":"&#x00d7;",1,200,"Close");}
calendarCloseButton.ttip=Zapatec.Calendar.i18n("CLOSE",null,this);}else{hd(row,1,"Close");}}else{hd(row,1,"Close");}
if(help_length>0||close_length>0){calendarHelpButton.width=calendarCloseButton.width=Math.max(help_length,close_length);}
row=Zapatec.Utils.createElement("tr",thead);this._nav_py=hh("&#x00ab;",1,-2,"PrevYear");this._nav_py.ttip=Zapatec.Calendar.i18n("PREV_YEAR",null,this);this._nav_pm=hh("&#x2039;",1,-1,"PrevMonth");this._nav_pm.ttip=Zapatec.Calendar.i18n("PREV_MONTH",null,this);this._nav_now=hh(Zapatec.Calendar.i18n("TODAY",null,this),title_length-2,0,"Today");this._nav_now.ttip=Zapatec.Calendar.i18n("GO_TODAY",null,this);this._nav_nm=hh("&#x203a;",1,1,"NextMonth");this._nav_nm.ttip=Zapatec.Calendar.i18n("NEXT_MONTH",null,this);this._nav_ny=hh("&#x00bb;",1,2,"NextYear");this._nav_ny.ttip=Zapatec.Calendar.i18n("NEXT_YEAR",null,this);}else{this._nav_py={disabled:true};this._nav_ny={disabled:true};if(this.config.hideNavPanel){this._nav_pm={disabled:true};this.title={disabled:true};this._nav_nm={disabled:true};}else{this._nav_pm=hh("&#x2039;",1,-1,"PrevMonth");this._nav_pm.ttip=Zapatec.Calendar.i18n("PREV_MONTH",null,this);this.title=hh("&nbsp;",title_length,300);this.title.className="title";this.title.id="zpCal"+this.id+"Title";if(this.isPopup){if(!this.config.disableDrag){this.title.ttip=Zapatec.Calendar.i18n("DRAG_TO_MOVE",null,this);this.title.style.cursor="move";}}
this._nav_nm=hh("&#x203a;",1,1,"NextMonth");this._nav_nm.ttip=Zapatec.Calendar.i18n("NEXT_MONTH",null,this);}}
var rowsOfMonths=Math.floor(this.config.numberMonths/this.config.monthsInRow);if(this.config.numberMonths%this.config.monthsInRow>0){++rowsOfMonths;}
var iId=this.id;var oConfig=this.config;var iMonths=oConfig.numberMonths;var iMonthInRow=oConfig.monthsInRow;var bHideNavPanel=oConfig.hideNavPanel;for(var l=1;l<=rowsOfMonths;++l){if(l>1){trOfRootTable=Zapatec.Utils.createElement("tr",rootTbody);trOfRootTable.id="zpCalendar"+this.id+"RootTableMarginTR"+(l-1);trOfRootTable.className="marginTR";tdOfRootTable=Zapatec.Utils.createElement("td",trOfRootTable);tdOfRootTable.id="zpCalendar"+this.id+"RootTableMarginTR"+(l-1)+"TD"+(l-1);tdOfRootTable.className="marginTD";trOfRootTable=Zapatec.Utils.createElement("tr",rootTbody);trOfRootTable.id="zpCalendar"+this.id+"RootTableTR"+l;tdOfRootTable=Zapatec.Utils.createElement("td",trOfRootTable);tdOfRootTable.id="zpCalendar"+this.id+"RootTableTR"+l+"TD"+l;tdOfRootTable.className="RootTableTD"+l;table=Zapatec.Utils.createElement("table",tdOfRootTable);table.id="zpCalendar"+this.id+"Calendar"+l+"RootContainer";table.className='zpCalTable';table.cellSpacing=0;table.cellPadding=0;}
var thead=Zapatec.Utils.createElement("thead",table);if(Zapatec.is_opera){thead.style.display="table-row-group";}
if(iMonths!=1){row=zapatecUtils.createElement("tr",thead);row.className="rowSubTitleContainer";var title_length=5;oConfig.weekNumbers&&++title_length;this.titles[l]=new Array();for(var k=1;(k<=iMonthInRow)&&((l-1)*iMonthInRow+k<=iMonths);++k){if(bHideNavPanel){if(l==1){cell=zapatecUtils.createElement("td",row);cell.colSpan=1;cell.className="zpCalPrevMonth";cell.navtype=-1;this._nav_pm={navtype:-1,calendar:this,className:""};cell.onclick=function(){zapatecCalendar.cellClick(cal._nav_pm)};cell.innerHTML='<div class="zpCalPrevMonthArrow"></div>';this.titles[l][k]=hh("&nbsp;",title_length,300);this.titles[l][k].className="title";this.titles[l][k].id="zpCal"+iId+"SubTitle"+((l-1)*iMonthInRow+k);cell=zapatecUtils.createElement("td",row);cell.colSpan=1;cell.className="zpCalNextMonth";this._nav_nm={navtype:1,calendar:this,className:""};cell.onclick=function(){zapatecCalendar.cellClick(cal._nav_nm)};cell.innerHTML='<div class="zpCalNextMonthArrow"></div>';}else{this.titles[l][k]=hh("&nbsp;",title_length+2,300);this.titles[l][k].className="title";this.titles[l][k].id="zpCal"+iId+"SubTitle"+((l-1)*iMonthInRow+k);}}else{hd(row,1);this.titles[l][k]=hh("&nbsp;",title_length,300);this.titles[l][k].className="title";this.titles[l][k].id="zpCal"+iId+"SubTitle"+((l-1)*iMonthInRow+k);hd(row,1);}}}
row=Zapatec.Utils.createElement("tr",thead);row.className="daynames";for(k=1;(k<=this.config.monthsInRow)&&((l-1)*this.config.monthsInRow+k<=this.config.numberMonths);++k){if(this.config.weekNumbers){cell=Zapatec.Utils.createElement("td",row);cell.className="name wn";cell.appendChild(window.document.createTextNode(Zapatec.Calendar.i18n("WK",null,this)));if(k>1){Zapatec.Utils.addClass(cell,"month-left-border");}
var cal_wk=Zapatec.Calendar.i18n("WK",null,this)
if(cal_wk==null){cal_wk="";}}
for(var i=7;i>0;--i){cell=Zapatec.Utils.createElement("td",row);cell.appendChild(document.createTextNode("&nbsp;"));cell.id="zpCal"+this.id+"WeekDayButton"+(7-i)+"Status";}}
this.firstDayName=row.childNodes[this.config.weekNumbers?1:0];this.rowsOfDayNames[l]=this.firstDayName;this._displayWeekdays();var tbody=Zapatec.Utils.createElement("tbody",table);this.tbody[l]=tbody;for(i=6;i>0;--i){row=Zapatec.Utils.createElement("tr",tbody);for(k=1;(k<=this.config.monthsInRow)&&((l-1)*this.config.monthsInRow+k<=this.config.numberMonths);++k){if(this.config.weekNumbers){cell=Zapatec.Utils.createElement("td",row);cell.id="zpCal"+this.id+"WeekNumber"+(6-i);if(typeof this.config.onWeekClick=="function"){cell.navtype=150;cell.calendar=this;cell.value=k;Zapatec.Calendar._add_evs(cell);}
cell.appendChild(document.createTextNode("&nbsp;"));}
for(var j=7;j>0;--j){cell=Zapatec.Utils.createElement("td",row);cell.id="zpCal"+this.id+"DateCell"+((l-1)*this.config.monthsInRow+k)+"-"+(6-i)+"-"+(7-j);cell.appendChild(document.createTextNode("&nbsp;"));Zapatec.Utils.createProperty(cell,"calendar",this);Zapatec.Calendar._add_evs(cell);}}}}
var tfoot=Zapatec.Utils.createElement("tfoot",table);if(this.config.showsTime){row=Zapatec.Utils.createElement("tr",tfoot);row.className="time";var emptyColspan;if(this.config.monthsInRow!=1){cell=Zapatec.Utils.createElement("td",row);emptyColspan=cell.colSpan=Math.ceil((((this.config.weekNumbers)?8:7)*(this.config.monthsInRow-1))/2);if(this.config.timeRange)cell.rowSpan=2;cell.className="timetext";cell.innerHTML="&nbsp";}
cell=Zapatec.Utils.createElement("td",row);cell.className="timetext";cell.colSpan=this.config.weekNumbers?2:1;if(this.config.timeRange)
cell.rowSpan=2;cell.innerHTML=Zapatec.Calendar.i18n("TIME",null,this)||"&nbsp;";var firstrow=row;Zapatec.Calendar.activeCalendar=this;(function(){function makeTimePart(className,partId,init,range_start,range_end,timeRange){var table,tbody,tr,tr2,part;if(range_end){cell=Zapatec.Utils.createElement("td",row);cell.colSpan=1;if(cal.config.showsTime!="seconds"){++cell.colSpan;}
cell.className="parent-"+className;table=Zapatec.Utils.createElement("table",cell);table.cellSpacing=table.cellPadding=0;if(className=="hour")
table.align="right";table.className="calendar-time-scroller";tbody=Zapatec.Utils.createElement("tbody",table);tr=Zapatec.Utils.createElement("tr",tbody);tr2=Zapatec.Utils.createElement("tr",tbody);if(timeRange)cell.style.border="none";}else
tr=row;part=Zapatec.Utils.createElement("td",tr);part.className=className;part.id="zpTime"+cal.id+partId+"SelectStatus";part.appendChild(window.document.createTextNode(init<10?'0'+init:init));Zapatec.Utils.createProperty(part,"calendar",cal);part.ttip=Zapatec.Calendar.i18n("TIME_PART",null);part.navtype=50;if(cal.config.timeRange&&partId.substr(partId.length-1)=='1')
part.navtype=51;part._range=[];if(!range_end)
part._range=range_start<10?'0'+range_start:range_start;else{part.rowSpan=2;for(var i=range_start;i<=range_end;++i){var txt;if(i<10&&range_end>=10)txt='0'+i;else txt=''+i;part._range[part._range.length]=txt;}
var up=Zapatec.Utils.createElement("td",tr);up.className="up";up.navtype=201;if(cal.config.timeRange&&partId.substr(partId.length-1)=='1')
up.navtype=211;up.id="zpTime"+cal.id+partId+"UpButtonStatus";Zapatec.Utils.createProperty(up,"calendar",cal);up.timePart=part;if(Zapatec.is_khtml)
up.innerHTML="&nbsp;";Zapatec.Calendar._add_evs(up);var down=Zapatec.Utils.createElement("td",tr2);down.className="down";down.navtype=202;if(cal.config.timeRange&&partId.substr(partId.length-1)=='1')
down.navtype=212;down.id="zpTime"+cal.id+partId+"DownButtonStatus";Zapatec.Utils.createProperty(down,"calendar",cal);down.timePart=part;if(Zapatec.is_khtml)
down.innerHTML="&nbsp;";Zapatec.Calendar._add_evs(down);}
Zapatec.Calendar._add_evs(part);return part;};var hrs=cal.currentDate.getHours();var mins=cal.currentDate.getMinutes();if(cal.config.showsTime=="seconds"){var secs=cal.currentDate.getSeconds();}
var t12=!cal.time24;var pm=(hrs>12);if(t12&&pm)hrs-=12;var H=makeTimePart("hour","Hours",hrs,t12?1:0,t12?12:23);H._step=(cal.config.timeInterval>30)?(cal.config.timeInterval/60):1;cell=Zapatec.Utils.createElement("td",row);cell.innerHTML=":";cell.className="colon";var M=makeTimePart("minute","Minutes",mins,0,59);M._step=((cal.config.timeInterval)&&(cal.config.timeInterval<60))?(cal.config.timeInterval):5;if(cal.config.showsTime=="seconds"){cell=Zapatec.Utils.createElement("td",row);cell.innerHTML=":";cell.className="colon";var S=makeTimePart("minute","Seconds",secs,0,59);S._step=5;}
var AP=null;if(t12){AP=makeTimePart("ampm","AMPM",pm?Zapatec.Calendar.i18n("pm","ampm",cal):Zapatec.Calendar.i18n("am","ampm",cal),[Zapatec.Calendar.i18n("am","ampm",cal),Zapatec.Calendar.i18n("pm","ampm",cal)]);AP.className+=" button";}else{AP=Zapatec.Utils.createElement("td",row).innerHTML="&nbsp;";}
if(cal.config.timeRange){row=Zapatec.Utils.createElement("tr",tfoot);row.className="time";hrs=cal.currentDateEnd.getHours();mins=cal.currentDateEnd.getMinutes();if(cal.showsTime=="seconds"){secs=cal.currentDateEnd.getSeconds();}
t12=!cal.time24;pm=(hrs>12);if(t12&&pm)hrs-=12;var H1=makeTimePart("hour","Hours1",hrs,t12?1:0,t12?12:23,cal.config.timeRange);H1._step=(cal.config.timeInterval>30)?(cal.config.timeInterval/60):1;cell=Zapatec.Utils.createElement("td",row);cell.innerHTML=":";cell.className="colon";cell.style.border="none";var M1=makeTimePart("minute","Minutes1",mins,0,59,cal.config.timeRange);M1._step=((cal.config.timeInterval)&&(cal.config.timeInterval<60))?(cal.config.timeInterval):5;if(cal.config.showsTime=="seconds"){cell=Zapatec.Utils.createElement("td",row);cell.innerHTML=":";cell.className="colon";cell.style.border="none";var S1=makeTimePart("minute","Seconds1",secs,0,59,cal.config.timeRange);S1._step=5;}
var AP1=null
if(t12){AP1=makeTimePart("ampm","AMPM1",pm?Zapatec.Calendar.i18n("pm","ampm",cal):Zapatec.Calendar.i18n("am","ampm",cal),[Zapatec.Calendar.i18n("am","ampm",cal),Zapatec.Calendar.i18n("pm","ampm",cal)],false,cal.config.timeRange);AP1.className+=" button";}else{AP1=Zapatec.Utils.createElement("td",row).innerHTML="&nbsp;";}}
cal.onSetTime=function(currentDate){var dateStartH=dateStartM=null;var thisH=H;var thisM=M;var thisS=S;var thisAP=AP;if(!currentDate){currentDate=this.currentDate;}
else{dateStartH=this.currentDate.getHours();dateStartM=this.currentDate.getMinutes();thisH=H1;thisM=M1;thisS=S1;thisAP=AP1;}
var hrs=currentDate.getHours();var mins=currentDate.getMinutes();if(this.config.showsTime=="seconds"){var secs=cal.currentDate.getSeconds();}
if(this.config.timeInterval){mins+=this.config.timeInterval-((mins-1+this.config.timeInterval)%this.config.timeInterval)-1;}
while(mins>=60){mins-=60;++hrs;}
if(this.config.timeInterval>60){var interval=this.config.timeInterval/60;if(hrs%interval!=0){hrs+=interval-((hrs-1+interval)%interval)-1;}
if(hrs>=24){hrs-=24;}}
var new_date=new Date(currentDate);if(this.getDateStatus&&this.getDateStatus(currentDate,currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate(),hrs,mins)){hours=hrs;minutes=mins;var thresholdDate;var now=new Date();do{if(this.config.timeInterval){if(this.config.timeInterval<60){minutes+=this.config.timeInterval;thresholdDate=new Date(now.getTime()+Date.MINUTE*this.config.timeInterval);}else{hrs+=this.config.timeInterval/60;}}else{minutes+=5;thresholdDate=new Date(now.getTime()+Date.MINUTE*5);}
if(dateStartH){if(hours>dateStartH)hours=dateStartH;if(minutes>dateStartM)minutes=dateStartM+1;}
if(minutes>=60){minutes-=60;hours+=1;}
if(hours>=24){hours-=24;}
new_date.setMinutes(minutes);new_date.setHours(hours);if(thresholdDate.getDate()!=now.getDate()||!this.getDateStatus(new_date,currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate(),hours,minutes)){hrs=hours;mins=minutes;}}while((hrs!=hours)||(mins!=minutes));}
if(dateStartH){var tmpDate=new Date(new_date);tmpDate.setHours(hrs);tmpDate.setMinutes(mins);if(hrs<dateStartH)hrs=dateStartH;if(mins<dateStartM&&tmpDate<this.currentDate)mins=dateStartM;}
currentDate.setMinutes(mins);currentDate.setHours(hrs);var pm=(hrs>=12);if(pm&&t12&&hrs!=12)hrs-=12;if(!pm&&t12&&hrs==0)hrs=12;thisH.firstChild.data=(hrs<10)?("0"+hrs):hrs;thisM.firstChild.data=(mins<10)?("0"+mins):mins;if(this.config.showsTime=="seconds"){thisS.firstChild.data=(secs<10)?("0"+secs):secs;}
if(t12)
thisAP.firstChild.data=pm?Zapatec.Calendar.i18n("pm","ampm",this):Zapatec.Calendar.i18n("am","ampm",this);};cal.onUpdateTime=function(currentDate){var date=dateStart=null;var thisH=H;var thisM=M;var thisS=S;var thisAP=AP;if(!currentDate)
date=this.currentDate;else{date=currentDate;dateStart=this.currentDate;thisH=H1;thisM=M1;thisS=S1;thisAP=AP1;}
var h=parseInt(thisH.firstChild.data,10);if(t12){if(/pm/i.test(thisAP.firstChild.data)&&h<12)
h+=12;else if(/am/i.test(thisAP.firstChild.data)&&h==12)
h=0;}
var d=date.getDate();var m=date.getMonth();var y=date.getFullYear();date.setHours(h);if(dateStart){if(date.setMinutes(parseInt(thisM.firstChild.data,10))<dateStart)
date.setMinutes(dateStart.getMinutes());}
else
date.setMinutes(parseInt(thisM.firstChild.data,10));if(this.config.showsTime=="seconds"){date.setSeconds(parseInt(thisS.firstChild.data,10));}
Zapatec.Date.setFullYear(date,y);date.setMonth(m);date.setDate(d);this.dateClicked=false;this.callHandler();if(!currentDate)
this.onSetTime(this.currentDateEnd);};})();if(this.config.monthsInRow!=1){if(this.config.timeRange)row=firstrow;cell=Zapatec.Utils.createElement("td",row);cell.colSpan=((this.config.weekNumbers)?8:7)*(this.config.monthsInRow-1)-Math.ceil(emptyColspan);if(this.config.timeRange)cell.rowSpan=2;cell.className="timetext";cell.innerHTML="&nbsp";}}else{this.onSetTime=this.onUpdateTime=function(){};}
if(!this.config.noStatus){row=Zapatec.Utils.createElement("tr",tfoot);row.className="footrow";cell=hh(Zapatec.Calendar.i18n("SEL_DATE",null,this),this.config.weekNumbers?(8*this.config.numberMonths):(7*this.config.numberMonths),300);cell.className="ttip";cell.id="zpCal"+this.id+"Status";if(this.isPopup&&!this.config.disableDrag){cell.ttip=Zapatec.Calendar.i18n("DRAG_TO_MOVE",null,this);cell.style.cursor="move";}
this.tooltips=cell;}
div=this.monthsCombo=Zapatec.Utils.createElement("div",this.element);div.className="combo";div.id="zpCal"+this.id+"MonthDropdownCombo";for(i=0;i<12;++i){var mn=Zapatec.Utils.createElement("div");mn.className=Zapatec.is_ie?"label-IEfix":"label";mn.id="zpCal"+this.id+"MonthDropdownItem"+i;mn.month=i;mn.appendChild(window.document.createTextNode(Zapatec.Calendar.i18n(i,"smn",this)));div.appendChild(mn);}
div=this.yearsCombo=Zapatec.Utils.createElement("div",this.element);div.className="combo";div.id="zpCal"+this.id+"YearDropdownCombo";for(i=0;i<12;++i){var yr=Zapatec.Utils.createElement("div");yr.className=Zapatec.is_ie?"label-IEfix":"label";yr.id="zpCal"+this.id+"YearDropdownItem"+i;yr.appendChild(window.document.createTextNode("&nbsp;"));div.appendChild(yr);}
div=Zapatec.Utils.createElement("div",this.element);div.id="zpCal"+cal.id+"HistoryDropdownCombo";div.className="combo history";this.histCombo=div;this.element=this.container;this._init(this.config.firstDay,this.config.date);parent.appendChild(this.element);this.isCreate=true;if(typeof this.config.onCreate=='function')
this.config.onCreate(this);};Zapatec.Calendar._keyEvent=function(ev){var cal=Zapatec.Calendar.activeCalendar;if(!cal){return false;}
if(Zapatec.is_ie){ev=window.event;}
var act=(Zapatec.is_ie||ev.type=="keypress");var K=ev.keyCode;var date=new Date(cal.currentDate);if(ev.ctrlKey){switch(K){case 37:act&&Zapatec.Calendar.cellClick(cal._nav_pm);break;case 38:act&&Zapatec.Calendar.cellClick(cal._nav_py);break;case 39:act&&Zapatec.Calendar.cellClick(cal._nav_nm);break;case 40:act&&Zapatec.Calendar.cellClick(cal._nav_ny);break;default:return false;}}else switch(K){case 32:Zapatec.Calendar.cellClick(cal._nav_now);break;case 27:act&&cal.callCloseHandler();break;case 37:if(act&&!cal.multiple){date.setTime(date.getTime()-86400000);cal.setDate(date);}
break;case 38:if(act&&!cal.multiple){date.setTime(date.getTime()-7*86400000);cal.setDate(date);}
break;case 39:if(act&&!cal.multiple){date.setTime(date.getTime()+86400000);cal.setDate(date);}
break;case 40:if(act&&!cal.multiple){date.setTime(date.getTime()+7*86400000);cal.setDate(date);}
break;case 13:if(act){Zapatec.Calendar.cellClick(cal.currentDateEl);}
break;default:Zapatec.Calendar._checkCalendar;return false;}
return Zapatec.Utils.stopEvent(ev);};Zapatec.Calendar.prototype._init=function(firstDay,date,last){var today=new Date();var TD=today.getDate();var TY=today.getFullYear();var TM=today.getMonth();var status,toolTip,k,tmpDate;if(this.getDateStatus&&!last){status=this.getDateStatus(date,date.getFullYear(),date.getMonth(),date.getDate());var backupDate=new Date(date);while(((status==true)||(status=="disabled"))&&(backupDate.getMonth()==date.getMonth())){date.setTime(date.getTime()+86400000);status=this.getDateStatus(date,date.getFullYear(),date.getMonth(),date.getDate());}
if(backupDate.getMonth()!=date.getMonth()){date=new Date(backupDate);while(((status==true)||(status=="disabled"))&&(backupDate.getMonth()==date.getMonth())){date.setTime(date.getTime()-86400000);status=this.getDateStatus(date,date.getFullYear(),date.getMonth(),date.getDate());}}
if(backupDate.getMonth()!=date.getMonth()){last=true;date=new Date(backupDate);}}
var year=date.getFullYear();var month=date.getMonth();var rowsOfMonths=Math.floor(this.config.numberMonths/this.config.monthsInRow);var minMonth;var diffMonth,last_row,before_control;if(!this.config.vertical){diffMonth=(this.config.controlMonth-1);minMonth=month-diffMonth;}else{last_row=((this.config.numberMonths-1)%this.config.monthsInRow)+1;before_control=(this.config.controlMonth-1)%this.config.monthsInRow;bottom=(before_control>=(last_row)?(last_row):(before_control));diffMonth=(before_control)*(rowsOfMonths-1)+Math.floor((this.config.controlMonth-1)/this.config.monthsInRow)+bottom;minMonth=month-diffMonth;}
var minYear=year;if(minMonth<0){minMonth+=12;--minYear;}
var maxMonth=minMonth+this.config.numberMonths-1;var maxYear=minYear;if(maxMonth>11){maxMonth-=12;++maxYear;}
function disableControl(ctrl){Zapatec.Calendar._del_evs(ctrl);ctrl.disabled=true;ctrl.className="button";ctrl.innerHTML="<div>&nbsp</div>";}
function enableControl(ctrl,sign){Zapatec.Calendar._add_evs(ctrl);ctrl.disabled=false;ctrl.className="button nav";ctrl.innerHTML=sign;}
if((minYear<=this.minYear)||this.config.disableYearNav){if(!this._nav_py.disabled){disableControl(this._nav_py);}}else{if(this._nav_py.disabled){enableControl(this._nav_py,"&#x00ab;");}}
if(maxYear>=this.maxYear||this.config.disableYearNav){if(!this._nav_ny.disabled){disableControl(this._nav_ny);}}else{if(this._nav_ny.disabled){enableControl(this._nav_ny,"&#x00bb;");}}
if(((minYear==this.minYear)&&(minMonth<=this.minMonth))||(minYear<this.minYear)){if(!this._nav_pm.disabled){disableControl(this._nav_pm);}}else{if(this._nav_pm.disabled){enableControl(this._nav_pm,"&#x2039;");}}
if(((maxYear==this.maxYear)&&(maxMonth>=this.maxMonth))||(maxYear>this.maxYear)){if(!this._nav_nm.disabled){disableControl(this._nav_nm);}}else{if(this._nav_nm.disabled){enableControl(this._nav_nm,"&#x203a;");}}
upperMonth=this.maxMonth+1;upperYear=this.maxYear;if(upperMonth>11){upperMonth-=12;++upperYear;}
bottomMonth=this.minMonth-1;bottomYear=this.minYear;if(bottomMonth<0){bottomMonth+=12;--bottomYear;}
maxDate1=new Date(maxYear,maxMonth,Zapatec.Date.getMonthDays(date,maxMonth),23,59,59,999);maxDate2=new Date(upperYear,upperMonth,1,0,0,0,0);minDate1=new Date(minYear,minMonth,1,0,0,0,0);minDate2=new Date(bottomYear,bottomMonth,Zapatec.Date.getMonthDays(date,bottomMonth),23,59,59,999);var today=new Date();if(maxDate1.getTime()>maxDate2.getTime()){if(today<maxDate2.getTime())
date.setTime(today.getTime());else
date.setTime(date.getTime()-(maxDate1.getTime()-maxDate2.getTime())-4);}
if(minDate1.getTime()<minDate2.getTime()){if(today>minDate2.getTime())
date.setTime(today.getTime());else
date.setTime(date.getTime()+(minDate2.getTime()-minDate1.getTime())+4);}
delete maxDate1;delete maxDate2;delete minDate1;delete minDate2;this.config.firstDay=firstDay;if(!last){this.currentDate=date;if(this.config.timeRange&&!this.currentDateEnd)this.currentDateEnd=new Date(date);}
this.config.date=date;Zapatec.Date.setDateOnly((this.config.date=new Date(this.config.date)),date);year=this.config.date.getFullYear();month=this.config.date.getMonth();var initMonth=date.getMonth();var mday=this.config.date.getDate();var no_days=Zapatec.Date.getMonthDays(date);var months=new Array();var validMonths=new Array();if(this.config.numberMonths%this.config.monthsInRow>0){++rowsOfMonths;}
var validMonth,day1,hrs;for(var l=1;l<=rowsOfMonths;++l){months[l]=new Array();validMonths[l]=new Array();for(k=1;(k<=this.config.monthsInRow)&&((l-1)*this.config.monthsInRow+k<=this.config.numberMonths);++k){tmpDate=new Date(date);if(this.config.vertical){validMonth=date.getMonth()-diffMonth+((k-1)*(rowsOfMonths-1)+(l-1)+((last_row<k)?(last_row):(k-1)));}else{validMonth=date.getMonth()-diffMonth+(l-1)*this.config.monthsInRow+k-1;}
if(validMonth<0){zapatecDate.setFullYear(tmpDate,tmpDate.getFullYear()-1);validMonth=validMonth+12;}
if(validMonth>11){zapatecDate.setFullYear(tmpDate,tmpDate.getFullYear()+1);validMonth=validMonth-12;}
validMonths[l][k]=validMonth;tmpDate.setDate(1);tmpDate.setMonth(validMonth);day1=(tmpDate.getDay()-this.config.firstDay)%7;if(day1<0){day1+=7;}
hrs=tmpDate.getHours();tmpDate.setDate(-day1);tmpDate.setDate(tmpDate.getDate()+1);if(hrs!=tmpDate.getHours()){tmpDate.setDate(1);tmpDate.setMonth(validMonth);tmpDate.setDate(-day1);tmpDate.setDate(tmpDate.getDate()+1);}
months[l][k]=tmpDate;}}
var oRange=this.calRange={from:new Date(months[1][1])};var MN=Zapatec.Calendar.i18n(month,"smn",this);var weekend=Zapatec.Calendar.i18n("WEEKEND",null,this);var dates=this.config.multiple?(this.datesCells={}):null;var DATETXT=this.config.dateText;var row,i,k,cell,hasdays,iday,wday,dmonth,dyear,current_month;for(var l=1;l<=rowsOfMonths;++l){row=this.tbody[l].firstChild;for(i=7;--i>0;row=row.nextSibling){cell=row.firstChild;hasdays=false;for(k=1;(k<=this.config.monthsInRow)&&((l-1)*this.config.monthsInRow+k<=this.config.numberMonths);++k){date=months[l][k];if(this.config.weekNumbers){cell.className="day wn";cell.innerHTML=zapatecDate.getWeekNumber(date);if(k>1){cell.className+=" month-left-border";}
cell=cell.nextSibling;}
row.className="daysrow";row.id="zpCal"+this.id+"Daysrow"+(6-i);if(this.config.hideNavPanel){hasdays=false;}
for(j=7;cell&&(iday=date.getDate())&&(j>0);date.setDate(iday+1),((date.getDate()==iday)?(date.setHours(1)&&date.setDate(iday+1)):(false)),cell=cell.nextSibling,--j){wday=date.getDay();dmonth=date.getMonth();dyear=date.getFullYear();cell.className="day";if((!this.config.weekNumbers)&&(j==7)&&(k!=1)){cell.className+=" month-left-border";}
if((j==1)&&(k!=this.config.monthsInRow)){cell.className+=" month-right-border";}
current_month=!(cell.otherMonth=!(dmonth==validMonths[l][k]));if(!current_month){if(this.config.showOthers){cell.className+=" othermonth";}else{cell.className+=" true";cell.innerHTML="&nbsp;";continue;}}else{hasdays=true;}
cell.innerHTML=DATETXT?DATETXT(date,dyear,dmonth,iday):iday;dates&&(dates[zapatecDate.print.call(this,date,"%Y%m%d")]=cell);if(!cell.disabled){cell.caldate=[dyear,dmonth,iday];cell.ttip="_";if((weekend!=null)&&(weekend.indexOf(wday.toString())!=-1)){cell.className+=cell.otherMonth?" oweekend":" weekend";}
if(dyear==TY&&dmonth==TM&&iday==TD){cell.className+=" today";if(!current_month&&this.config.showOthers){cell.className+=" othermonthtoday";}
cell.ttip+=Zapatec.Calendar.i18n("PART_TODAY",null,this);}
if(!this.config.multiple&&current_month&&iday==this.currentDate.getDate()&&this.hiliteToday&&(dmonth==this.currentDate.getMonth())&&(dyear==this.currentDate.getFullYear())){cell.className+=" selected";row.className+=" rowhilite";this.lastRowHilite=row;this.currentDateEl=cell;}}
if(this.getDateStatus){status=this.getDateStatus(date,dyear,dmonth,iday);if(this.getDateToolTip){toolTip=this.getDateToolTip(date,dyear,dmonth,iday);if(toolTip){cell.title=toolTip;}}
if(status==true){cell.className+=" disabled";}else{cell.className+=" "+status;}}}
if(!(hasdays||!this.config.hideNavPanel&&this.config.showOthers)){row.className="emptyrow";}}
if((i==1)&&(l<rowsOfMonths)){if(row.className=="emptyrow"){row=row.previousSibling;}
cell=row.firstChild;while(cell!=null){cell.className+=" month-bottom-border";cell=cell.nextSibling;}}}}
oRange.to=new Date(date.setDate(date.getDate()-1));if(this.config.numberMonths==1){this.title.innerHTML=Zapatec.Calendar.i18n(month,"mn",this)+" "+year;if(this.config&&this.config.titleHtml)
if(typeof this.config.titleHtml=='function')
this.title.innerHTML=this.config.titleHtml(this.title.innerHTML,month,year)
else
this.title.innerHTML+=this.config.titleHtml}else{if(this.config&&this.config.titleHtml)
if(typeof this.config.titleHtml=='function')
this.title.innerHTML=this.config.titleHtml(Zapatec.Calendar.i18n(month,"mn",this)+", "+year,month,year)
else
this.title.innerHTML=this.config.titleHtml
for(var l=1;l<=rowsOfMonths;++l){for(k=1;(k<=this.config.monthsInRow)&&((l-1)*this.config.monthsInRow+k<=this.config.numberMonths);++k){if(this.config.vertical){validMonth=month-diffMonth+((k-1)*(rowsOfMonths-1)+(l-1)+((last_row<k)?(last_row):(k-1)));}else{validMonth=month-diffMonth+(l-1)*this.config.monthsInRow+k-1;}
validYear=year;if(validMonth<0){--validYear;validMonth=12+validMonth;}
if(validMonth>11){++validYear;validMonth=validMonth-12;}
this.titles[l][k].onclick=new Function('zapatecWidgetCallMethod('+this.id+',"fireEvent","calMonthClicked",{fullYear:"'+validYear+'",month:"'+validMonths[l][k]+'"})');this.titles[l][k].innerHTML=Zapatec.Calendar.i18n(validMonths[l][k],"mn",this)+" "+validYear;}}}
this.onSetTime();if(this.config.timeRange)
this.onSetTime(this.currentDateEnd);this._initMultipleDates();this.updateWCH();};Zapatec.Calendar.prototype.getRange=function(){return this.calRange;};Zapatec.Calendar.prototype._findDateFormMultiple=function(date,multipleRange){var d=null;for(var i in multipleRange){d=multipleRange[i];if(date.substr(0,8)==zapatecDate.print.call(this,d,"%Y%m%d")){this.config.multipleRange[date]=multipleRange[i];return this.config.multipleRange[date];}}
this.config.multipleRange[date]=date;return;}
Zapatec.Calendar.prototype._initMultipleDates=function(){if(this.config.multiple){var d=null;var dateEnd=null;for(var i in this.config.multiple){d=this.config.multiple[i];if(this.config.timeRange)dateEnd=this.config.multiple[i];var cell=this.datesCells[zapatecDate.print.call(this,d,"%Y%m%d")];if(!this.config.multiple[zapatecDate.print.call(this,d,"%Y%m%d")]){this.config.multiple[zapatecDate.print.call(this,d,"%Y%m%d")]=d;delete(this.config.multiple[i]);}
if(!d)
continue;if(cell){Zapatec.Utils.addClass(cell,"selected");}}
if(d!=null&&this.config.showsTime){this.currentDate=new Date(d);this.onSetTime();if(this.config.timeRange){this.currentDateEnd=new Date(dateEnd);this.onSetTime(this.currentDateEnd);}}}};Zapatec.Calendar.prototype._toggleMultipleDate=Zapatec.Calendar.prototype.toggleMultipleDate=function(date,date1){if(this.config.multiple){var ds=zapatecDate.print.call(this,date,"%Y%m%d");var cell=this.datesCells[zapatecDate.print.call(this,date,"%Y%m%d")];if(cell){var d=this.config.multiple[ds];if(!d){Zapatec.Utils.addClass(cell,"selected");this.config.multiple[ds]=date;if(this.config.timeRange){this.config.multipleRange[ds]=(date1?date1:date);}}else{Zapatec.Utils.removeClass(cell,"selected");delete this.config.multiple[ds];if(this.config.timeRange)delete this.config.multipleRange[ds];}}}};Zapatec.Calendar.prototype.navigateTo=function(date){if(this.setDate(date,false)&&Zapatec.Calendar.cellClick(this.currentDateEl))
return true;return false;}
Zapatec.Calendar.prototype.getNavigationPos=function(){if(!this.currentDate)
return null;return this.currentDate;}
Zapatec.Calendar.prototype.nextMonth=function(){if(this._nav_nm&&Zapatec.Calendar.cellClick(this._nav_nm))
return true;return false;}
Zapatec.Calendar.prototype.prevMonth=function(){if(this._nav_pm&&Zapatec.Calendar.cellClick(this._nav_pm))
return true;return false;}
Zapatec.Calendar.prototype.nextYear=function(){if(this._nav_ny&&Zapatec.Calendar.cellClick(this._nav_ny))
return true;return false;}
Zapatec.Calendar.prototype.prevYear=function(){if(this._nav_py&&Zapatec.Calendar.cellClick(this._nav_py))
return true;return false;}
Zapatec.Calendar.prototype.setDateToolTipHandler=function(unaryFunction){this.getDateToolTip=unaryFunction;};Zapatec.Calendar.prototype.setDate=function(date,justInit){if(!date)
date=new Date();if(!Zapatec.Date.equalsTo(date,this.config.date)){var year=date.getFullYear(),m=date.getMonth();if(year<this.minYear||(year==this.minYear&&m<this.minMonth))
this.showHint("<div class='error'>"+Zapatec.Calendar.i18n("E_RANGE",null,this)+" \>\>\></div>");else if(year>this.maxYear||(year==this.maxYear&&m>this.maxMonth))
this.showHint("<div class='error'>\<\<\< "+Zapatec.Calendar.i18n("E_RANGE",null,this)+"</div>");else{this._init(this.config.firstDay,date,justInit);return true;}
return false;}
return true;};Zapatec.Calendar.prototype.showHint=function(text){if(!this.config.noStatus)
this.tooltips.innerHTML=text;};Zapatec.Calendar.prototype.reinit=function(){this._init(this.config.firstDay,this.config.date);};Zapatec.Calendar.prototype.refresh=function(){var p=this.isPopup?null:this.element.parentNode;var x=parseInt(this.element.style.left);var y=parseInt(this.element.style.top);this.destroy();this.isCreate=false;this.init(this.config);if(this.isPopup){this.showAt(x,y);}};Zapatec.Calendar.prototype.setFirstDayOfWeek=function(firstDay){if(this.config.firstDay!=firstDay){this._init(firstDay,this.config.date);var rowsOfMonths=Math.floor(this.config.numberMonths/this.config.monthsInRow);if(this.config.numberMonths%this.config.monthsInRow>0){++rowsOfMonths;}
for(var l=1;l<=rowsOfMonths;++l){this.firstDayName=this.rowsOfDayNames[l];this._displayWeekdays();}}};Zapatec.Calendar.prototype.setDateStatusHandler=Zapatec.Calendar.prototype.setDisabledHandler=function(unaryFunction){this.getDateStatus=unaryFunction;};Zapatec.Calendar.prototype.setRange=function(A,Z){var m,a=Math.min(A,Z),z=Math.max(A,Z);this.minYear=m=Math.floor(a);this.minMonth=(m==a)?0:Math.ceil((a-m)*100-1);this.maxYear=Math.floor(z);this.maxMonth=(this.maxYear==z)?11:Math.ceil(Math.round((z-this.maxYear)*100)-1);};Zapatec.Calendar.prototype.setMultipleDates=function(multiple){if(!multiple||typeof multiple=="undefined")return;this.config.multiple=[];if(this.config.timeRange){var multipleRange=this.config.multipleRange;this.config.multipleRange=[];}
Zapatec.Calendar.activeCalendar=this;var ds=null;for(var i=multiple.length;--i>=0;){var d=multiple[i];ds=zapatecDate.print.call(this,d,"%Y%m%d");this.config.multiple[ds]=d;if(this.config.timeRange)this._findDateFormMultiple(ds,multipleRange);}};Zapatec.Calendar.prototype.selectDate=function(dates){var cal=this;function setDateRange(dateRange){var count=0;for(var i in dateRange)
count++;if(count==0){dateRange[0]=dateRange;}
if(count!=2){for(var i in dateRange)
if(typeof dateRange[i]!='array')
cal.toggleMultipleDate(new Date(dateRange[i]))
else
return false;return true;}
var maxDate=dateRange[0]<dateRange[1]?dateRange[1]:dateRange[0];var minDate=dateRange[0]<dateRange[1]?dateRange[0]:dateRange[1];for(var i=new Date(minDate);i<=maxDate;i.setDate(i.getDate()+1))
cal.toggleMultipleDate(new Date(i));return true;}
var count=0;for(var i in dates)
count++;if(count==0)
dates[0]=dates;if(this.config.multiple)
for(var i in dates){if(!setDateRange(dates[i]))
return false;}
else{var tmpDate=dates[0];while(tmpDate[0])
tmpDate=tmpDate[0];this.navigateTo(tmpDate);}}
Zapatec.Calendar.deselectDate=function(dates){}
Zapatec.Calendar.prototype.submitFlatDates=function()
{if(typeof this.config.flatCallback=="function"){Zapatec.Calendar.sortOrder=(this.config.sortOrder!="asc"&&this.config.sortOrder!="desc"&&this.config.sortOrder!="none")?"none":this.config.sortOrder;if(this.config.multiple&&(Zapatec.Calendar.sortOrder!="none")){var dateArray=new Array();for(var i in this.config.multiple){var currentDate=this.config.multiple[i];if(currentDate){dateArray[dateArray.length]=currentDate;}
dateArray.sort(Zapatec.Calendar.compareDates);}
this.config.multiple={};for(var i=0;i<dateArray.length;i++){var d=dateArray[i];var ds=zapatecDate.print.call(this,d,"%Y%m%d");this.config.multiple[ds]=d;if(this.config.timeRange)this._findDateFormMultiple(ds);}}
this.config.flatCallback(this);}}
Zapatec.Calendar.prototype.callHandler=function(){if(this.onSelected){this.onSelected(this,zapatecDate.print.call(this,this.config.date,this.dateFormat));}};Zapatec.Calendar.prototype.updateHistory=function(){var a,i,d,tmp,s,str="",len=this.config.prefs.hsize-1;if(this.config.prefs.history){a=this.config.prefs.history.split(/,/);i=0;while(i<len&&(tmp=a[i++])){s=tmp.split(/\//);d=new Date(parseInt(s[0],10),parseInt(s[1],10)-1,parseInt(s[2],10),parseInt(s[3],10),parseInt(s[4],10));if(!Zapatec.Date.dateEqualsTo(d,this.config.date))
str+=","+tmp;}}
this.config.prefs.history=zapatecDate.print.call(this,this.config.date,"%Y/%m/%d/%H/%M")+str;Zapatec.Calendar.savePrefs(this.id);};Zapatec.Calendar.prototype.callHelpHandler=function(){var cal=this;var text=Zapatec.Calendar.i18n("ABOUT",null,cal);if(typeof text!="undefined"){text+=cal.config.showsTime?Zapatec.Calendar.i18n("ABOUT_TIME",null,cal):"";}else{text="Help and about box text is not translated into this language.\n"+"If you know this language and you feel generous please update\n"+"the corresponding file in \"lang\" subdir to match calendar-en.js\n"+"and send it back to <support@zapatec.com> to get it into the distribution  ;-)\n\n"+"Thank you!\n"+"http://www.zapatec.com\n";}
alert(text);}
Zapatec.Calendar.prototype.callCloseHandler=function(){if(this.dateClicked&&!this.config.noHistory){this.updateHistory();}
if(this.config.onClose){this.config.onClose(this);}
this.hideShowCovered();};Zapatec.Calendar.prototype.destroy=function(){this.hide();Zapatec.Utils.destroy(this.element);Zapatec.Utils.destroy(this.WCH);Zapatec.Calendar.activeCalendar=null;};Zapatec.Calendar.prototype.reparent=function(new_parent){var el=this.element;el.parentNode.removeChild(el);new_parent.appendChild(el);};Zapatec.Calendar._checkCalendar=function(ev){var cal=Zapatec.Calendar.activeCalendar;if(!cal){return false;}
var el=Zapatec.is_ie?Zapatec.Utils.getElement(ev):Zapatec.Utils.getTargetElement(ev);for(;el!=null&&el!=cal.element;el=el.parentNode);if(el==null){cal.callCloseHandler();}};Zapatec.Calendar.prototype.updateWCH=function(other_el){Zapatec.Utils.setupWCH_el(this.WCH,this.element,other_el);};Zapatec.Calendar.prototype.show=function(){if(!this.table)
this.create();var rows=this.table.getElementsByTagName("tr");for(var i=rows.length;i>0;){var row=rows[--i];if(/zpCalendar\d{1,3}RootTableTR\d{1,2}/.test(row.id)){continue;}
Zapatec.Utils.removeClass(row,"rowhilite");var cells=row.getElementsByTagName("td");for(var j=cells.length;j>0;){var cell=cells[--j];if(/zpCalendar\d{1,3}RootTableTR\d{1,2}TD\d{1,2}/.test(cell.id)){continue;}
Zapatec.Utils.removeClass(cell,"hilite");Zapatec.Utils.removeClass(cell,"active");}}
if(this.element.style.display!="block"){this.element.style.visibility="hidden";this.element.style.display="block";}
if(this.config.showEffect.length>0){this.showContainer(this.config.showEffect,this.config.showEffectSpeed,this.config.showEffectOnFinish);}else{if(this.triggerEl){this.triggerEl.disabled=false;}}
if(this.element.style.visibility=="hidden"){this.element.style.visibility="";}
this.hidden=false;if(this.isPopup){this.updateWCH();Zapatec.Calendar.activeCalendar=this;if(!this.config.noGrab){Zapatec.Utils.addEvent(window.document,"keydown",Zapatec.Calendar._keyEvent);Zapatec.Utils.addEvent(window.document,"keypress",Zapatec.Calendar._keyEvent);Zapatec.Utils.addEvent(window.document,"mousedown",Zapatec.Calendar._checkCalendar);}}
this.hideShowCovered();};Zapatec.Calendar.prototype.onHide=function(){Zapatec.Calendar.activeCalendar=null;if(this.lastRowHilite){Zapatec.Utils.removeClass(this.lastRowHilite,"rowhilite");}
if(this.config.hideEffectOnFinish)
this.config.hideEffectOnFinish
if(Zapatec.Utils.__wch_id>0)
Zapatec.Utils.hideWCH(document.getElementById("WCH"+Zapatec.Utils.__wch_id));if(this.triggerEl){this.triggerEl.disabled=false;}}
Zapatec.Calendar.prototype.hide=function(){if(this.isPopup){Zapatec.Utils.removeEvent(window.document,"keydown",Zapatec.Calendar._keyEvent);Zapatec.Utils.removeEvent(window.document,"keypress",Zapatec.Calendar._keyEvent);Zapatec.Utils.removeEvent(window.document,"mousedown",Zapatec.Calendar._checkCalendar);}
Zapatec.Utils.hideWCH(this.WCH);this.hidden=true;this.hideShowCovered();if(this.config.hideEffect.length>0){if(this.triggerEl){this.triggerEl.disabled=true;}
this.hideContainer(this.config.hideEffect,this.config.hideEffectSpeed,new Function("Zapatec.Widget.getWidgetById("+this.id+").onHide()"));}
else if(this.element){this.element.style.display="none";if(this.lastRowHilite){Zapatec.Utils.removeClass(this.lastRowHilite,"rowhilite");}}};Zapatec.Calendar.prototype.showAt=function(x,y){if(this.element){var s=this.element.style;s.left=x+"px";s.top=y+"px";}
this.show();};Zapatec.Calendar.prototype.showAtElement=function(el,opts){var self=this;var p=Zapatec.Utils.getElementOffsetRelative(el);if(!opts||typeof opts!="string"){this.showAt(p.x,p.y+el.offsetHeight);return true;}
self.element.style.visibility="hidden";self.element.style.display="block";var w=self.element.offsetWidth;var h=self.element.offsetHeight;self.element.style.display="none";self.element.style.visibility="";var valign=opts.substr(0,1);var halign="l";if(opts.length>1){halign=opts.substr(1,1);}
switch(valign){case"T":p.y-=h;break;case"B":p.y+=el.offsetHeight;break;case"C":p.y+=(el.offsetHeight-h)/2;break;case"t":p.y+=el.offsetHeight-h;break;case"b":break;}
switch(halign){case"L":p.x-=w;break;case"R":p.x+=el.offsetWidth;break;case"C":p.x+=(el.offsetWidth-w)/2;break;case"l":p.x+=el.offsetWidth-w;break;case"r":break;}
p.width=w;p.height=h;self.monthsCombo.style.display="none";self.showAt(p.x,p.y);};Zapatec.Calendar.prototype.printWith2Time=function(date,date1,format){if(this.config.timeRange){if(!date1)date1=date;var s={};var hr=date1.getHours();var pm=(hr>=12);var ir=(pm)?(hr-12):hr;var dy=Zapatec.Date.getDayOfYear(date1);if(ir==0)
ir=12;var min=date1.getMinutes();var sec=date1.getSeconds();s["%H1"]=(hr<10)?("0"+hr):hr;s["%I1"]=(ir<10)?("0"+ir):ir;s["%k1"]=hr?hr:"0";s["%l1"]=ir;s["%M1"]=(min<10)?("0"+min):min;s["%s1"]=Math.floor(date.getTime()/1000);s["%S1"]=(sec<10)?("0"+sec):sec;var str=format;var re=/%.1/g;var a=str.match(re)||[];for(var i=0;i<a.length;i++){var tmp=s[a[i]];if(tmp){re=new RegExp(a[i],'g');str=str.replace(re,tmp);}}
return zapatecDate.print.call(this,date,str);}
else
return zapatecDate.print.call(this,date,format);}
Zapatec.Calendar.prototype.setDateFormat=function(str){this.dateFormat=str;};Zapatec.Calendar.prototype.setTtDateFormat=function(str){this.ttDateFormat=str;};Zapatec.Calendar.prototype.parseDate=function(str,fmt){if(!str)
return this.setDate(this.config.date);if(!fmt)
fmt=this.dateFormat;var date=zapatecDate.parseDate.call(this,str,fmt);return this.setDate(date);};Zapatec.Calendar.prototype.hideShowCovered=function(){if(!Zapatec.is_ie5)
return;var self=this;function getVisib(obj){var value=obj.style.visibility;if(!value){if(window.document.defaultView&&typeof(window.document.defaultView.getComputedStyle)=="function"){if(!Zapatec.is_khtml)
value=window.document.defaultView.getComputedStyle(obj,"").getPropertyValue("visibility");else
value='';}else if(obj.currentStyle){value=obj.currentStyle.visibility;}else
value='';}
return value;};var tags=["applet","iframe","select"];var el=self.element;var p=Zapatec.Utils.getAbsolutePos(el);var EX1=p.x;var EX2=el.offsetWidth+EX1;var EY1=p.y;var EY2=el.offsetHeight+EY1;for(var k=tags.length;k>0;){var ar=window.document.getElementsByTagName(tags[--k]);var cc=null;for(var i=ar.length;i>0;){cc=ar[--i];p=Zapatec.Utils.getAbsolutePos(cc);var CX1=p.x;var CX2=cc.offsetWidth+CX1;var CY1=p.y;var CY2=cc.offsetHeight+CY1;if(self.hidden||(CX1>EX2)||(CX2<EX1)||(CY1>EY2)||(CY2<EY1)){if(!cc.__msh_save_visibility){cc.__msh_save_visibility=getVisib(cc);}
cc.style.visibility=cc.__msh_save_visibility;}else{if(!cc.__msh_save_visibility){cc.__msh_save_visibility=getVisib(cc);}
cc.style.visibility="hidden";}}}};Zapatec.Calendar.prototype._displayWeekdays=function(){var fdow=this.config.firstDay;var cell=this.firstDayName;var weekend=Zapatec.Calendar.i18n("WEEKEND",null,this);for(k=1;(k<=this.config.monthsInRow)&&(cell);++k){for(var i=0;i<7;i++){cell.className="day name";if((!this.config.weekNumbers)&&(i==0)&&(k!=1)){Zapatec.Utils.addClass(cell,"month-left-border");}
if((i==6)&&(k!=this.config.monthsInRow)){Zapatec.Utils.addClass(cell,"month-right-border");}
var realday=(i+fdow)%7;if((!this.config.disableFdowChange)&&((this.config&&this.config.fdowClick)||i)){if(Zapatec.Calendar.i18n("DAY_FIRST",null,this)!=null){cell.ttip=Zapatec.Calendar.i18n("DAY_FIRST",null,this).replace("%s",Zapatec.Calendar.i18n(realday,"dn",this));}
cell.navtype=100;cell.calendar=this;cell.fdow=realday;Zapatec.Calendar._add_evs(cell);}
if((weekend!=null)&&(weekend.indexOf(realday.toString())!=-1)){Zapatec.Utils.addClass(cell,"weekend");}
cell.innerHTML=Zapatec.Calendar.i18n((i+fdow)%7,"sdn",this);cell=cell.nextSibling;}
if(this.config.weekNumbers&&cell){cell=cell.nextSibling;}}};Zapatec.Calendar.compareDates=function(date1,date2)
{if(Zapatec.Calendar.sortOrder=="asc")
return date1-date2;else
return date2-date1;}
Zapatec.Calendar.prototype._hideCombos=function(){if(this.monthsCombo.style.display!="none")
var combo=this.monthsCombo;else if(this.yearsCombo.style.display!="none")
var combo=this.yearsCombo;else if(this.histCombo.style.display!="none")
var combo=this.histCombo;if(combo)
for(var i=combo.firstChild;i;i=i.nextSibling){var m=i.month;Zapatec.Utils.removeClass(i,"hilite");Zapatec.Utils.removeClass(i,"active");Zapatec.Utils.removeClass(i,"disabled");}
this.monthsCombo.style.display="none";this.yearsCombo.style.display="none";this.histCombo.style.display="none";this.updateWCH();};Zapatec.Calendar.prototype._dragStart=function(ev){ev||(ev=window.event);if(this.dragging){return;}
this.dragging=true;var posX=ev.clientX+window.document.body.scrollLeft;var posY=ev.clientY+window.document.body.scrollTop;var st=this.element.style;this.xOffs=posX-parseInt(st.left);this.yOffs=posY-parseInt(st.top);Zapatec.Utils.addEvent(window.document,"mousemove",Zapatec.Calendar.calDragIt);Zapatec.Utils.addEvent(window.document,"mouseover",Zapatec.Calendar.calDragIt);Zapatec.Utils.addEvent(window.document,"mouseup",Zapatec.Calendar.calDragEnd);};Zapatec.Calendar.submitErrorFunc=function(oError){var oMsg="Calendar ";if(typeof oError.id!="undefined")
oMsg+="("+oError.id+") ";if(typeof oError.source!="undefined")
oMsg+=oError.source;else
oMsg+="unknown";oMsg+=" error";oMsg+="\n"+oError.errorDescription;alert(oMsg);};Zapatec.Calendar.setup=function(oArg){return new Zapatec.Calendar(oArg);};Zapatec.Calendar.setup.id="Zapatec.Calendar.setup";Zapatec.inherit(Zapatec.Calendar.setup,Zapatec.Calendar);Zapatec.Utils.createNestedHash(Zapatec,["Langs","Zapatec.Calendar","en"],{"_DN":new Array
("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"),"_SDN":new Array
("Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun"),"_FD":0,"_MN":new Array
("January","February","March","April","May","June","July","August","September","October","November","December"),"_SMN":new Array
("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"),"INFO":"About the calendar","ABOUT":"DHTML Date/Time Selector\n"+"(c) zapatec.com 2002-2007\n"+"For latest version visit: http://www.zapatec.com/"+"\n\n"+"Date selection:\n"+"- Use the \xab, \xbb buttons to select year\n"+"- Use the "+String.fromCharCode(0x2039)+", "+String.fromCharCode(0x203a)+" buttons to select month\n"+"- Hold mouse button on any of the above buttons for faster selection.","ABOUT_TIME":"\n\n"+"Time selection:\n"+"- Click on any of the time parts to increase it\n"+"- or Shift-click to decrease it\n"+"- or click and drag for faster selection.","PREV_YEAR":"Prev. year (hold for menu)","PREV_MONTH":"Prev. month (hold for menu)","GO_TODAY":"Go Today (hold for history)","NEXT_MONTH":"Next month (hold for menu)","NEXT_YEAR":"Next year (hold for menu)","SEL_DATE":"Select date","DRAG_TO_MOVE":"Drag to move","PART_TODAY":" (today)","DAY_FIRST":"Display %s first","WEEKEND":"0,6","CLOSE":"Close","TODAY":"Today","TIME_PART":"(Shift-)Click or drag to change value","DEF_DATE_FORMAT":"%Y-%m-%d","TT_DATE_FORMAT":"%a, %b %e","WK":"wk","TIME":"Time:","E_RANGE":"Outside the range","_AMPM":{am:"am",pm:"pm",AM:"AM",PM:"PM"}});if(typeof zapatecDate!='function'){if(typeof Zapatec=='undefined'){Zapatec=function(){};}
Zapatec.Date=function(){};zapatecDate=Zapatec.Date;Zapatec.Date.dayNames=['date.day.sun','date.day.mon','date.day.tue','date.day.wed','date.day.thu','date.day.fri','date.day.sat','date.day.sun'];zapatecDateDayNames=zapatecDate.dayNames;Zapatec.Date.shortDayNames=['date.shortDay.sun','date.shortDay.mon','date.shortDay.tue','date.shortDay.wed','date.shortDay.thu','date.shortDay.fri','date.shortDay.sat','date.shortDay.sun'];zapatecDateShortDayNames=zapatecDate.shortDayNames;Zapatec.Date.monthNames=['date.month.jan','date.month.feb','date.month.mar','date.month.apr','date.month.may','date.month.jun','date.month.jul','date.month.aug','date.month.sep','date.month.oct','date.month.nov','date.month.dec'];zapatecDateMonthNames=zapatecDate.monthNames;Zapatec.Date.shortMonthNames=['date.shortMonth.jan','date.shortMonth.feb','date.shortMonth.mar','date.shortMonth.apr','date.shortMonth.may','date.shortMonth.jun','date.shortMonth.jul','date.shortMonth.aug','date.shortMonth.sep','date.shortMonth.oct','date.shortMonth.nov','date.shortMonth.dec'];zapatecDateShortMonthNames=zapatecDate.shortMonthNames;Zapatec.Date.AM='date.misc.AM';zapatecDateAM=zapatecDate.AM;Zapatec.Date.PM='date.misc.PM';zapatecDatePM=zapatecDate.PM;Zapatec.Date.am='date.misc.am';zapatecDateAm=zapatecDate.am;Zapatec.Date.pm='date.misc.pm';zapatecDatePm=zapatecDate.pm;Zapatec.Date.translate=function(){zapatecTranslateArray(zapatecDateDayNames);zapatecTranslateArray(zapatecDateShortDayNames);zapatecTranslateArray(zapatecDateMonthNames);zapatecTranslateArray(zapatecDateShortMonthNames);zapatecDateAM=zapatecDate.AM=zapatecTranslate(zapatecDateAM);zapatecDatePM=zapatecDate.PM=zapatecTranslate(zapatecDatePM);zapatecDateAm=zapatecDate.am=zapatecTranslate(zapatecDateAm);zapatecDatePm=zapatecDate.pm=zapatecTranslate(zapatecDatePm);};zapatecDate.translate();Zapatec.Date._MD=[31,28,31,30,31,30,31,31,30,31,30,31];Zapatec.Date.isLeapYear=function(date,year){if(typeof year=="undefined"){var year=date.getFullYear();}
if((0==(year%4))&&((0!=(year%100))||(0==(year%400)))){return true;}else{return false;}}
Zapatec.Date.getMonthDays=function(date,month){var year=date.getFullYear();if(typeof month=="undefined"){month=date.getMonth();}
if(Zapatec.Date.isLeapYear(date)&&month==1){return 29;}else{return zapatecDate._MD[month];}};Zapatec.Date.getYearDays=function(date,year){var days=365;if(Zapatec.Date.isLeapYear(date,year)){days++;}
return days;};Zapatec.Date.getDayOfYear=function(date){var now=new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);var then=new Date(date.getFullYear(),0,0,0,0,0);var time=now-then;return Math.round(time/86400000);};Zapatec.Date.getWeekNumber=function(date){var d=new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);var DoW=d.getDay();d.setDate(d.getDate()-(DoW+6)%7+3);var ms=d.valueOf();d.setMonth(0);d.setDate(4);return Math.round((ms-d.valueOf())/(7*864e5))+1;};Zapatec.Date.getWeekAndYearNumber=function(date){var wn=Zapatec.Date.getWeekNumber(date);var day=date.getDate();var year=date.getFullYear();if(day>28&&wn==1){year=Math.round(year)+1;};if(day<4&&wn>51){year=Math.round(year)-1;};return(year+" W"+wn);};Zapatec.Date.equalsTo=function(date1,date2){if(!date1||!date2){return false;}
return((date1.getFullYear()==date2.getFullYear())&&(date1.getMonth()==date2.getMonth())&&(date1.getDate()==date2.getDate())&&(date1.getHours()==date2.getHours())&&(date1.getMinutes()==date2.getMinutes()));};Zapatec.Date.dateEqualsTo=function(date1,date2){if(!date1||!date2){return false;}
return((date1.getFullYear()==date2.getFullYear())&&(date1.getMonth()==date2.getMonth())&&(date1.getDate()==date2.getDate()));};Zapatec.Date.setDateOnly=function(date1,date2){var tmp=new Date(date2);date1.setDate(1);date1.setFullYear(tmp.getFullYear());date1.setMonth(tmp.getMonth());date1.setDate(tmp.getDate());};Zapatec.Date.print=function(date,str){var m=date.getMonth();var d=date.getDate();var y=date.getFullYear();var wn=/%U|%W|%V/.test(str)?zapatecDate.getWeekNumber(date):"";var w=date.getDay();var s={};var hr=date.getHours();var pm=(hr>=12);var ir=(pm)?(hr-12):hr;var dy=/%j/.test(str)?zapatecDate.getDayOfYear(date):"";if(ir==0){ir=12;}
var min=date.getMinutes();var sec=date.getSeconds();if(Zapatec.Calendar&&this instanceof Zapatec.Calendar){s["%a"]=/%a/.test(str)?Zapatec.Calendar.i18n(w,"sdn",this):"";s["%A"]=/%A/.test(str)?Zapatec.Calendar.i18n(w,"dn",this):"";s["%b"]=/%b/.test(str)?Zapatec.Calendar.i18n(m,"smn",this):"";s["%B"]=/%B/.test(str)?Zapatec.Calendar.i18n(m,"mn",this):"";}else{s["%a"]=/%a/.test(str)?zapatecDateShortDayNames[w]:"";s["%A"]=/%A/.test(str)?zapatecDateDayNames[w]:"";s["%b"]=/%b/.test(str)?zapatecDateShortMonthNames[m]:"";s["%B"]=/%B/.test(str)?zapatecDateMonthNames[m]:"";}
s["%C"]=1+Math.floor(y/100);s["%d"]=(d<10)?("0"+d):d;s["%e"]=d;s["%H"]=(hr<10)?("0"+hr):hr;s["%I"]=(ir<10)?("0"+ir):ir;s["%j"]=(dy<100)?((dy<10)?("00"+dy):("0"+dy)):dy;s["%k"]=hr?hr:"0";s["%l"]=ir;s["%m"]=(m<9)?("0"+(1+m)):(1+m);s["%M"]=(min<10)?("0"+min):min;s["%n"]="\n";if(Zapatec.Calendar&&this instanceof Zapatec.Calendar){s["%p"]=pm?Zapatec.Calendar.i18n("PM","AMPM",this):Zapatec.Calendar.i18n("AM","AMPM",this);s["%P"]=pm?Zapatec.Calendar.i18n("pm","AMPM",this):Zapatec.Calendar.i18n("am","AMPM",this);if(!s["%p"]){s["%p"]=s["%P"];}}else{s["%p"]=pm?zapatecDatePM:zapatecDateAM;s["%P"]=pm?zapatecDatePm:zapatecDateAm;}
s["%o"]=/%o/.test(str)?Zapatec.Date.getWeekAndYearNumber(date):"";s["%s"]=Math.floor(date.getTime()/1000);s["%S"]=(sec<10)?("0"+sec):sec;s["%t"]="\t";s["%U"]=s["%W"]=s["%V"]=(wn<10)?("0"+wn):wn;s["%u"]=(w==0)?7:w;s["%w"]=w?w:"0";s["%y"]=''+y%100;if(s["%y"]<10){s["%y"]="0"+s["%y"];}
s["%Y"]=y;s["%%"]="%";if(/%z/.test(str)){var minutes=new String(date.getTimezoneOffset()%60);var hours=new String(Math.abs(date.getTimezoneOffset()/60));s["%z"]="GMT"+(date.getTimezoneOffset()>0?"-":"+");hours.length<2?s["%z"]+="0":"";s["%z"]+=Math.abs(date.getTimezoneOffset()/60)+":"+date.getTimezoneOffset()%60;minutes.length<2?s["%z"]+="0":"";}
if(/%Z/.test(str)){s["%Z"]=(date.getTimezoneOffset()>0?"-":"+");hours.length<2?s["%Z"]+="0":"";s["%Z"]+=Math.abs(date.getTimezoneOffset()/60)+""+date.getTimezoneOffset()%60;minutes.length<2?s["%Z"]+="0":"";}
var re=/%./g;var a=str.match(re)||[];var tmp,ln=a.length;for(var i=0;i<ln;i++){tmp=s[a[i]];if(tmp){re=new RegExp(a[i],'g');str=str.replace(re,tmp);}}
return str;};Zapatec.Date.parseDate=function(str,format){var fmt=format,strPointer=0,token=null,parseFunc=null,valueLength=null,valueRange=null,date=new Date(),values={},valueType='';var numberRules=["%d","%H","%I","%m","%M","%S","%s","%W","%u","%w","%y","%e","%k","%l","%s","%Y","%C","%z","%Z"];var aNames;function parseString(){for(var iString=valueRange[0];iString<valueRange[1];++iString){var value;if(Zapatec.Calendar&&this instanceof Zapatec.Calendar){value=Zapatec.Calendar.i18n(iString,valueType,this);}else{value=aNames[iString];}
if(!value){return null;}
if(value==str.substr(strPointer,value.length)){valueLength=value.length;return iString;}}
return null;}
function parseNumber(){var val=str.substr(strPointer,valueLength);if(val.length!=valueLength||/$\d+^/.test(val)){return null;}
return parseInt(val,10);}
function parseAMPM(){var result=str.substr(strPointer,valueLength).toLowerCase()==Zapatec.Date.Pm?true:false;return result||(str.substr(strPointer,valueLength).toLowerCase()==Zapatec.Date.Am?false:null);}
function parseGMT(){var val=str.substr(strPointer,valueLength);if(val.length!=valueLength||!/(\w){3}(\+|-)+((\d){4}|(\d)+:(\d))+/.test(val)){return null;}
var sgn=val.substr(3,1);values["%zm"]=(sgn=="-"?(-1)*parseInt(val.substr(7,2),10):parseInt(val.substr(7,2),10));return parseInt(val.substr(3,3),10);}
function parseRFC(){var val=str.substr(strPointer,valueLength);if(val.length!=valueLength||!/(\+|-)+((\d){4}|(\d)+:(\d))+/.test(val)){return null;}
var sgn=val.substr(0,1);values["%Zm"]=(sgn=="-"?(-1)*parseInt(val.substr(3,2),10):parseInt(val.substr(3,2),10));return parseInt(val.substr(0,3),10);}
function wasParsed(rule){if(typeof rule=="undefined"||rule===null){return false;}
return true;}
function getValue(){for(var i=0;i<arguments.length;++i){if(arguments[i]!==null&&typeof arguments[i]!="undefined"&&!isNaN(arguments[i])){return arguments[i];}}
return null;}
if(typeof fmt!="string"||typeof str!="string"||str==""||fmt==""){return null;}
while(fmt){parseFunc=parseNumber;valueLength=fmt.indexOf("%");valueLength=(valueLength==-1)?fmt.length:valueLength;token=fmt.slice(0,valueLength);if(token!=str.substr(strPointer,valueLength)){return null;}
strPointer+=valueLength;fmt=fmt.slice(valueLength);if(fmt==""){break;}
token=fmt.slice(0,2);valueLength=2;switch(token){case"%A":case"%a":{if("%A"==token){aNames=zapatecDateDayNames;valueType="dn";}else{aNames=zapatecDateShortDayNames;valueType="sdn";}
valueRange=[0,7];parseFunc=parseString;break;}
case"%B":case"%b":{if("%B"==token){aNames=zapatecDateMonthNames;valueType="mn";}else{aNames=zapatecDateShortMonthNames;valueType="smn";}
valueRange=[0,12];parseFunc=parseString;break;}
case"%p":case"%P":{parseFunc=parseAMPM;break;}
case"%Y":{valueLength=4;if(zapatecUtils.arrIndexOf(numberRules,fmt.substr(2,2))!=-1){return null;}
while(isNaN(parseInt(str.charAt(strPointer+valueLength-1)))&&valueLength>0){--valueLength;}
if(valueLength==0){break;}
break;}
case"%C":case"%s":{valueLength=1;if(zapatecUtils.arrIndexOf(numberRules,fmt.substr(2,2))!=-1){return null;}
while(!isNaN(parseInt(str.charAt(strPointer+valueLength)))){++valueLength;}
break;}
case"%k":case"%l":case"%e":{valueLength=1;if(zapatecUtils.arrIndexOf(numberRules,fmt.substr(2,2))!=-1){return null;}
if(!isNaN(parseInt(str.charAt(strPointer+1)))){++valueLength;}
break;}
case"%j":valueLength=3;break;case"%u":case"%w":valueLength=1;case"%y":case"%m":case"%d":case"%W":case"%H":case"%I":case"%M":case"%S":{break;}
case"%z":valueLength=9;parseFunc=parseGMT;break;case"%Z":if(values["%z"])break;valueLength=5;parseFunc=parseRFC;break;}
if((values[token]=parseFunc())===null){return null;}
strPointer+=valueLength;fmt=fmt.slice(2);}
if(wasParsed(values["%s"])){date.setTime(values["%s"]*1000);}else{var year=getValue(values["%Y"],values["%y"]+--values["%C"]*100,values["%y"]+(date.getFullYear()-date.getFullYear()%100),values["%C"]*100+date.getFullYear()%100);var month=getValue(values["%m"]-1,values["%b"],values["%B"]);var day=getValue(values["%d"]||values["%e"]);if(day===null||month===null){var dayOfWeek=getValue(values["%a"],values["%A"],values["%u"]==7?0:values["%u"],values["%w"]);}
var hour=getValue(values["%H"],values["%k"]);if(hour===null&&(wasParsed(values["%p"])||wasParsed(values["%P"]))){var pm=getValue(values["%p"],values["%P"]);hour=getValue(values["%I"],values["%l"]);hour=pm?((hour==12)?12:(hour+12)):((hour==12)?(0):hour);}
if(year||year===0){date.setFullYear(year);}
if(month||month===0){date.setMonth(month,1);}
if(day||day===0){date.setDate(day);}
if(wasParsed(values["%j"])){date.setMonth(0);date.setDate(1);date.setDate(values["%j"]);}
if(wasParsed(dayOfWeek)){date.setDate(date.getDate()+(dayOfWeek-date.getDay()));}
if(wasParsed(values["%W"])){var weekNumber=zapatecDate.getWeekNumber(date);if(weekNumber!=values["%W"]){date.setDate(date.getDate()+(values["%W"]-weekNumber)*7);}}
if(hour!==null){date.setHours(hour);}
if(wasParsed(values["%M"])){date.setMinutes(values["%M"]);}
if(wasParsed(values["%S"])){date.setSeconds(values["%S"]);}
if(wasParsed(values["%z"])){date.setUTCHours(date.getUTCHours()+(date.getTimezoneOffset()/60+parseInt(values["%z"],10)));date.setUTCMinutes(date.getUTCMinutes()+(-1)*(date.getTimezoneOffset()%60-parseInt(values["%zm"],10)))}
if(wasParsed(values["%Z"])){date.setUTCHours(date.getUTCHours()+(date.getTimezoneOffset()/60+parseInt(values["%Z"],10)));date.setUTCMinutes(date.getUTCMinutes()+(-1)*(date.getTimezoneOffset()%60-parseInt(values["%Zm"],10)))}}
if(zapatecDate.print(date,format)!=str){return null;}
return date;};Zapatec.Date.setFullYear=function(date,y){var d=new Date(date);d.setFullYear(y);if(d.getMonth()!=date.getMonth()){date.setDate(28);}
date.setFullYear(y);};Zapatec.Date.compareDatesOnly=function(date1,date2){var year1=date1.getYear();var year2=date2.getYear();var month1=date1.getMonth();var month2=date2.getMonth();var day1=date1.getDate();var day2=date2.getDate();if(year1>year2){return-1;}
if(year2>year1){return 1;}
if(month1>month2){return-1;}
if(month2>month1){return 1;}
if(day1>day2){return-1;}
if(day2>day1){return 1;}
return 0;};Zapatec.Date.dateRegexpTime=/^(\d{1,2})(\D+(\d{1,2}))?(\D+(\d{1,2}))?\W*(AM|PM|A|P)?\s*(.*)/i;Zapatec.Date.parseTime=function(sTime){var oResult={tail:sTime};if(!sTime){return oResult;}
sTime=sTime.replace(/^\s+/,'').replace(/\s+$/,'');var aMatches=sTime.match(zapatecDate.dateRegexpTime);if(aMatches&&aMatches[1]){var iHours=aMatches[1]*1;if(aMatches[6]){var sAmPm=aMatches[6].toUpperCase();if(sAmPm=='PM'||sAmPm=='P'){if(iHours<12){iHours+=12;}}else{if(iHours==12){iHours=0;}}}
oResult.hours=iHours;oResult.minutes=aMatches[3]?aMatches[3]*1:0;oResult.tail=aMatches[7];}
return oResult;};Zapatec.Date.padTwo=function(i){return(i<10?'0':'')+i;};Zapatec.Date.dateRegexpNotFloating=/(?:Z|[+-]\d{1,2}(?::\d{1,2})?)$/;Zapatec.Date.isFloatingDate=function(sDTStamp){if(!sDTStamp){return false;}
return!zapatecDate.dateRegexpNotFloating.test(sDTStamp);};Zapatec.Date.dateToTimeStamp=function(oArg){if(!oArg){return'';}
var oDate=oArg.date;if(!(oDate instanceof Date)){return oDate+'';}
var fPadTwo=zapatecDate.padTwo;if(!oArg.floating){oDate=new Date(oDate.getTime()+(oDate.getTimezoneOffset()*60000));}
return[oDate.getFullYear(),fPadTwo(oDate.getMonth()+1),fPadTwo(oDate.getDate()),'T',fPadTwo(oDate.getHours()),fPadTwo(oDate.getMinutes()),fPadTwo(oDate.getSeconds()),oArg.floating?'':'Z'].join('');};Zapatec.Date.dateToDateStamp=function(oArg){if(!oArg){return'';}
var oDate=oArg.date;if(!(oDate instanceof Date)){return oDate+'';}
var fPadTwo=zapatecDate.padTwo;return[oDate.getFullYear(),fPadTwo(oDate.getMonth()+1),fPadTwo(oDate.getDate())].join('');};Zapatec.Date.dateRegexpTimeStamp=/^(\d{4})(\d{2})(\d{2})T?(\d{2})?(\d{2})?(\d{2})?(Z)?$/;Zapatec.Date.timeStampToDate=function(oArg){if(!oArg){return;}
var sDTStamp=oArg.dtstamp;if(typeof sDTStamp!='string'){return;}
var aMatches=sDTStamp.match(zapatecDate.dateRegexpTimeStamp);if(!aMatches){return;}
var iYear=parseInt(aMatches[1],10);var iMonth=parseInt(aMatches[2],10)-1;var iDay=parseInt(aMatches[3],10);var iHour=parseInt(aMatches[4],10);if(isNaN(iHour)){return new Date(iYear,iMonth,iDay);}
iHour=parseInt(iHour,10);var iMinute=parseInt(aMatches[5],10);var iSecond=parseInt(aMatches[6],10);if(aMatches[7]){return new Date(Date.UTC(iYear,iMonth,iDay,iHour,iMinute,iSecond));}
return new Date(iYear,iMonth,iDay,iHour,iMinute,iSecond);};Zapatec.Date.dateToTimeIso=function(oArg){if(!oArg){return'';}
var oDate=oArg.date;if(!(oDate instanceof Date)){return oDate+'';}
var fPadTwo=zapatecDate.padTwo;oDate=new Date(oDate.getTime()+(oDate.getTimezoneOffset()*60000));return[oDate.getFullYear(),'-',fPadTwo(oDate.getMonth()+1),'-',fPadTwo(oDate.getDate()),'T',fPadTwo(oDate.getHours()),':',fPadTwo(oDate.getMinutes()),':',fPadTwo(oDate.getSeconds()),oArg.floating?'':'Z'].join('');};Zapatec.Date.dateToDateIso=function(oArg){if(!oArg){return'';}
var oDate=oArg.date;if(!(oDate instanceof Date)){return oDate+'';}
var fPadTwo=zapatecDate.padTwo;return[oDate.getFullYear(),fPadTwo(oDate.getMonth()+1),fPadTwo(oDate.getDate())].join('-');};Zapatec.Date.dateRegexpTimeIso=/(\d{4,})(?:-(\d{1,2})(?:-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?(?:(Z)|([+-])(\d{1,2})(?::(\d{1,2}))?)?)?)?)?/;Zapatec.Date.timeIsoToDate=function(oArg){if(!oArg){return;}
var sDateIso=oArg.dateIso+'';if(typeof sDateIso!='string'||!sDateIso.length){return;}
var aMatches=sDateIso.match(zapatecDate.dateRegexpTimeIso);if(!aMatches){return;}
var iYear=parseInt(aMatches[1],10);var iMonth=aMatches[2];if(typeof iMonth=='undefined'||iMonth===''){return new Date(iYear);}
iMonth=parseInt(iMonth,10)-1;var iDay=parseInt(aMatches[3],10);var iHour=aMatches[4];if(typeof iHour=='undefined'||iHour===''){return new Date(iYear,iMonth,iDay);}
iHour=parseInt(iHour,10);var iMinute=parseInt(aMatches[5],10);var iSecond=aMatches[6];if(typeof iSecond=='undefined'||iSecond===''){iSecond=0;}else{iSecond=parseInt(iSecond,10);}
var iMSecond=aMatches[7];if(typeof iMSecond=='undefined'||iMSecond===''){iMSecond=0;}else{iMSecond=Math.round(1000.0*parseFloat('0.'+iMSecond));}
var iTimezoneOffset=0;var sTimezoneZ=aMatches[8];if(typeof sTimezoneZ=='undefined'||sTimezoneZ===''){var sTimezoneSign=aMatches[9];if(typeof sTimezoneSign=='undefined'||sTimezoneSign===''){return new Date(iYear,iMonth,iDay,iHour,iMinute,iSecond,iMSecond);}
iTimezoneOffset=parseInt(aMatches[10],10)*3600000;var iTimezoneMinute=aMatches[11];if(typeof iTimezoneMinute!='undefined'&&iTimezoneMinute!==''){iTimezoneOffset+=parseInt(iTimezoneMinute,10)*60000;}
if(sTimezoneSign=='-'){iTimezoneOffset*=-1;}}
return new Date(Date.UTC(iYear,iMonth,iDay,iHour,iMinute,iSecond,iMSecond)-iTimezoneOffset);};Zapatec.Date.timeStampToTimeIso=function(oArg){if(!oArg){return'';}
var sDTStamp=oArg.dtstamp;if(!sDTStamp){return'';}
if(sDTStamp.length==8){return sDTStamp.substr(0,4)+'-'+sDTStamp.substr(4,2)+'-'+
sDTStamp.substr(6,2);}else{return zapatecDate.dateToTimeIso({date:zapatecDate.timeStampToDate(oArg),floating:zapatecDate.isFloatingDate(sDTStamp)});}};Zapatec.Date.timeIsoToTimeStamp=function(oArg){if(!oArg){return'';}
var sDateIso=oArg.dateIso+'';if(typeof sDateIso!='string'||!sDateIso.length){return'';}
if(sDateIso.indexOf('-')>0){if(sDateIso.length==10){return sDateIso.substr(0,4)+sDateIso.substr(5,2)+
sDateIso.substr(8,2);}else{return zapatecDate.dateToTimeStamp({date:zapatecDate.timeIsoToDate(oArg),floating:zapatecDate.isFloatingDate(sDateIso)});}}else{return sDateIso;}};Zapatec.Date.getWeekDay=function(oArg){if(!oArg){oArg={};}
var oDate=oArg.date;if(!oDate){oDate=new Date();}
var iWeekDay=oArg.weekDay;if(typeof iWeekDay!='number'||iWeekDay<0||iWeekDay>6){iWeekDay=0;}
return zapatecDate.getTomorrow({date:oDate,days:iWeekDay-oDate.getDay()});};Zapatec.Date.getMonthDay=function(oArg){if(!oArg){oArg={};}
var oDate=oArg.date;if(!oDate){oDate=new Date();}
var iDay=oArg.day;if(typeof iDay!='number'){iDay=1;}
var iMonth=oDate.getMonth();if(iDay<1){if(iDay<0){iDay++;}
iMonth++;}
return new Date(oDate.getFullYear(),iMonth,iDay);};Zapatec.Date.getTomorrow=function(oArg){if(!oArg){oArg={};}
var oDate=oArg.date;if(oDate){oDate=new Date(oDate.getTime());}else{oDate=new Date();}
var iDays=oArg.days;if(typeof iDays!='number'){iDays=1;}
if(iDays){oDate.setDate(oDate.getDate()+iDays);}
return oDate;};Zapatec.Date.compareDates=function(oDate1,oDate2){oDate1=new Date(oDate1.getFullYear(),oDate1.getMonth(),oDate1.getDate());oDate2=new Date(oDate2.getFullYear(),oDate2.getMonth(),oDate2.getDate());var iDays=(oDate1.getTime()-oDate2.getTime())/86400000;return Math.round(iDays);};}