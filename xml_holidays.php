<?php
/*require_once "XML/RSS.php";

$rss =& new XML_RSS("http://myuw.washington.edu/cal/doExport.rdo?export.action=execute&export.format=rss&export.compress=false&export.name=Holidays&export.start.date=20090101&export.end.date=20091231");
$rss->parse();

echo '<pre>';
print_r($rss->getItems());
echo '</pre>';*/

/*function parseAndReturnPresentAndFutureUWHolidays() {
	
	require_once "XML/RSS.php";
	
	$current_yr = date("Y");
	$next_yr = date("Y")+1;
	
	$rss_holidays_current_yr =& new XML_RSS('http://myuw.washington.edu/cal/doExport.rdo?export.action=execute&export.format=rss&export.compress=false&export.name=Holidays&export.start.date='.$current_yr.'0101&export.end.date='.$current_yr.'1231');
	$rss_holidays_current_yr->parse();
	$current_yr_holidays = $rss_holidays_current_yr->getItems();
	
	$rss_holidays_next_yr =& new XML_RSS('http://myuw.washington.edu/cal/doExport.rdo?export.action=execute&export.format=rss&export.compress=false&export.name=Holidays&export.start.date='.$next_yr.'0101&export.end.date='.$next_yr.'1231');
	$rss_holidays_next_yr->parse();
	$next_yr_holidays = $rss_holidays_next_yr->getItems();
	
	$all_holidays = array_merge($current_yr_holidays,$next_yr_holidays);
	
	$present_and_future_holidays = array();
	
	
	foreach ($all_holidays as $key => $value) {
		
		if (strtotime("today") < strtotime(substr($value['pubdate'],0,-13))) {
			
			$present_and_future_holidays[] = strtotime(substr($value['pubdate'],0,-13));
			
		}
		
	}

}*/

//parseAndReturnPresentAndFutureUWHolidays();


function getPresentAndFutureUWHolidays() {
	
	require_once "XML/RSS.php";
	
	// how many years forward do we want
	$yrs_forward = 2;
	
	// get the current yr
	$current_yr = date("Y");
	
	// add number of years forward
	$two_years_forward = date("Y")+$yrs_forward;
	
	// construct and store the calendar URL
	$calendarURL = 'http://myuw.washington.edu/cal/doExport.rdo?export.action=execute&export.format=rss&export.compress=false&export.name=Holidays&export.start.date='.date("Ymd").'&export.end.date='.$two_years_forward.'1231';
	
	// instantiate a new $rss object with the $calendarURL input
	$rss =& new XML_RSS($calendarURL);
	
	// parse the incoming RSS data
	$rss->parse();
	
	// store the parsed data
	$all_holidays = $rss->getItems();
	
	// set up an empty $present_and_future_holidays array
	$present_and_future_holidays = array();
	
	// for each date, clean it up, convert it to a UNIX timestamp and store it in the $present_and_future_holidays array
	foreach ($all_holidays as $key => $value) {
			
		$present_and_future_holidays[] = strtotime(substr($value['pubdate'],0,-13));
		
	}
	
	/*echo '<pre>';
	print_r($all_holidays);
	echo '</pre>';*/
	
	echo '<pre>';
	print_r($present_and_future_holidays);
	echo '</pre>';
	
	

	//return $present_and_future_holidays;
	
}

getPresentAndFutureUWHolidays();

?> 