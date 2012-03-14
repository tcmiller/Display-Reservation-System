<?php

/**
* index.php - Reservation Screen Index
*
* @name       - index.php
* @author     - Tim Chang-Miller <tcmiller@u.washington.edu>
*
* @package    - UW Marketing Resources
* @subpackage - Mobile Display Reservation System
*/

// get the parent calendar ID from the URL
if (!empty($_GET['id'])) {
	$resourceID = $_GET['id'];
} else {
	$resourceID = '';
}

// include files
require_once 'HTML/QuickForm.php';
require_once '../include/global.inc.php';

// instantiate an object of the Resource class
$calendar = new Resource($resourceID);
$calendarInfo = $calendar->getCombinedInfo(true, false);

// get and store the parent calendar info
$parentCalendarInfo = $calendar->getGoogleInfo(true, true);
$parentCalendarTitle = $parentCalendarInfo[$calendar->getParentID()]['title'];

// begin building the form
$form =& new HTML_QuickForm('reservationForm', 'post', 'index.php?id='.$resourceID);

// D E F A U L T S
$form->setDefaults(array('resource' => '0', 'agreement' => '0'));

// H I D D E N  E L E M E N T S
$form->addElement('hidden','parentID',$resourceID);

// P E R S O N A L  I N F O R M A T I O N
$form->addElement('text', 'fname', 'First name:', array('size' => 17, 'maxlength' => 25, 'id' => 'fname'));
$form->addElement('text', 'lname', 'Last name:', array('size' => 17, 'maxlength' => 25, 'id' => 'lname'));
$form->addElement('text', 'email', 'Email:', array('size' => 30, 'maxlength' => 40, 'id' => 'email'));
$form->addElement('text', 'phone', 'Daytime phone:', array('size' => 15, 'maxlength' => 30, 'id' => 'phone'));

$j=1;

// R E S O U R C E  I N F O R M A T I O N
if (!empty($calendarInfo) && is_array($calendarInfo)) {

	foreach ($calendarInfo as $calendarKey => $calendarArray) {

		$extraHTML[$j] = array('link'  => '<a href="#" onclick="launch(\'resource.php?id='.$calendarArray['id'].'&amp;parentID='.$resourceID.'\',\'resourceDesc\',\'left=10,top=10,height=600,width=500,channelmode=0,dependent=0,directories=0,fullscreen=0,location=0,menubar=1,resizable=0,scrollbars=1,status=0,toolbar=0\',\'UW\'); return false;" title="Click to learn more about this resource" style="background-color: '.$calendarArray['color'].';">'.$calendarArray['title'].'</a>',
		                       'thumb' => '<a href="#" onclick="launch(\'resource.php?id='.$calendarArray['id'].'&amp;parentID='.$resourceID.'\',\'resourceDesc\',\'left=10,top=10,height=600,width=500,channelmode=0,dependent=0,directories=0,fullscreen=0,location=0,menubar=1,resizable=0,scrollbars=1,status=0,toolbar=0\',\'UW\'); return false;" title="Click to learn more about this resource"><img src="'.RESOURCE_IMAGES_FOLDER.$calendarArray['images'][0]['new_file'].'" width="75" height="113" alt="Resource photo" /></a>',
		                       'days' => $calendarArray['days_available'],
		                       'resource_id' => $calendarArray['id']);

		if ($calendarArray['id'] == 1 || $calendarArray['id'] == 2 || $calendarArray['id'] == 3 || $calendarArray['id'] == 4 || $calendarArray['id'] == 36) {
			$options = array('onclick' => 'if (this.checked == true) alert(\'Note: stand not included. Please select one from above.\')');
		} else {
			$options = null;
		}
		
		$resource[] =& HTML_QuickForm::createElement('checkbox',$calendarArray['id'],$calendarArray['title'], null, $options);
		
		$j++;

	}

}

$form->addGroup($resource,'resource','Resource: ','<br />');

$form->addElement('text', 'check_out', 'Check-out:', array('size' => 15, 'maxlength' => 30, 'id' => 'check_out', 'onfocus' => 'document.getElementById(\'trigger_out_field\').click()', 'readonly' => 'readonly'));
$form->addElement('text', 'check_in', 'Check-in:', array('size' => 15, 'maxlength' => 30, 'id' => 'check_in', 'onfocus' => 'document.getElementById(\'trigger_in_field\').click()', 'readonly' => 'readonly'));
$form->addElement('text', 'location', 'Use location:', array('size' => 15, 'maxlength' => 30, 'id' => 'location'));
$form->addElement('text', 'department', 'Department:', array('size' => 20, 'maxlength' => 40, 'id' => 'department'));
$form->addElement('text', 'budget_num1', 'Budget #:', array('size' => 2, 'maxlength' => 2, 'id' => 'budget_num1'));
$form->addElement('text', 'budget_num2', null, array('size' => 4, 'maxlength' => 4, 'id' => 'budget_num2'));

// N O T E S
$form->addElement('textarea','notes','Notes:', array('rows' => 4, 'cols' => 25, 'id' => 'notes'));

// A G R E E M E N T
$form->addElement('checkbox','agreement','I agree to the<br /><a href="#" onclick="launch(\'termsandconditions.php\',\'trmsandcondtns\',\'left=10,top=10,height=600,width=500,channelmode=0,dependent=0,directories=0,fullscreen=0,location=0,menubar=1,resizable=0,scrollbars=1,status=0,toolbar=0\',\'UW\'); return false;">terms and conditions</a>.','');

// S U B M I T
if (!empty($_SESSION['calendardown']) && $_SESSION['calendardown'] == 1) {
	// if the Google Calendar is down
	$form->addElement('submit', 'submit', 'Reservation form disabled', array('class' => 'submit', 'disabled' => 'disabled'));
} else {
	// if the Google Calendar is up
	$form->addElement('submit', 'submit', 'Make this reservation!', array('class' => 'submit'));
}

// G E N E R A L  R U L E S
$form->addRule('fname', 'Please enter your first name.', 'required');
$form->addRule('lname', 'Please enter your last name.', 'required');
$form->addRule('email', 'Please enter your email.', 'required');
$form->addRule('email', 'Please provide a valid email address.', 'email', true);
$form->addRule('phone', 'Please enter your daytime phone.', 'required');
$form->addRule('check_out', 'Please provide a check-out date for your selected resource(s).', 'required');
$form->addRule('check_in', 'Please provide a check-in date for your selected resource(s).', 'required');
$form->addRule('location', 'Please provide a location where this resource will be used.', 'required');
$form->addRule('department', 'Please provide your department.', 'required');
$form->addRule('agreement', 'Please check the agreement box after reading the terms and conditions.', 'required');

// S P E C I F I C  R U L E S
$form->addFormRule('checkResourceSelection');
$form->addFormRule('checkReservationDates');
$form->addFormRule('checkBudgetNum');

// R E S O U R C E  S P E C I F I C  R U L E S
switch ($resourceID) {		
	
	case "1";
		$form->addFormRule('isBannerStandAvailable');
		break;
	
	case "3";
		$form->addFormRule('whichShowcaseWall');
		break;
}

// F I L T E R S
$form->applyFilter('__ALL__','trim');


// H E L P E R   F U N C T I O N S

/**
 * getPresentAndFutureUWHolidays
 *
 * This function parses and returns all present and future UW holidays in the current and following year
 * 
 * @return array $present_and_future_holidays
 */
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

	return $present_and_future_holidays;
	
}


// R U L E  F U N C T I O N S
function checkReservationDates ($values) {

	global $resourceID;
	$resource = new Resource($resourceID);

	$error_array = array();
	
	// test 0: make sure check-out date is greater than today so the team has time to prep and load the locker with the user's items
	if (strtotime($values['check_out']) > strtotime("today")) {
		
		// test 1: make sure check-in date is in the future
		if ($resource->in_future($values['check_out'],$values['check_in'])) {
			
			$error_array['check_in'] = 'Please select a check-in date greater than or equal to the check-out date.';
		
		} else {
			
			// test 2: make sure they aren't checking out or checking in the item(s) on a weekend
			if ((date('D',strtotime($values['check_out'])) == 'Sun' || date('D',strtotime($values['check_out'])) == 'Sat') && (date('D',strtotime($values['check_in'])) == 'Sun' || date('D',strtotime($values['check_in'])) == 'Sat')) {
				
				$error_array['check_out'] = 'Please choose a non-weekend check-out date';
				$error_array['check_in'] = 'Please choose a non-weekend<br />check-in date';
				
			} elseif (date('D',strtotime($values['check_out'])) == 'Sun' || date('D',strtotime($values['check_out'])) == 'Sat') {
			
				$error_array['check_out'] = 'Please choose a non-weekend check-out date';
				
			} elseif (date('D',strtotime($values['check_in'])) == 'Sun' || date('D',strtotime($values['check_in'])) == 'Sat') {
			    
				$error_array['check_in'] = 'Please choose a non-weekend<br />check-in date';
				
			} // end test 2
			
			
			// test 3: make sure they aren't checking out or checking in item(s) on an official UW holiday
			
			// store all current and future UW holidays (as UNIX timestamps) into an array container
			$present_and_future_UW_holidays = getPresentAndFutureUWHolidays();
			
			for($i=0;$i<count($present_and_future_UW_holidays);$i++) {
				
				// check for a check-out and check-in date equal to a UW holiday				
				if (($present_and_future_UW_holidays[$i] == strtotime($values['check_out'])) && ($present_and_future_UW_holidays[$i] == strtotime($values['check_in']))) {
				
					$error_array['check_out'] = 'Please choose a non-holiday<br />check-out date';
					$error_array['check_in'] = 'Please choose a non-holiday<br />check-in date';
					
				// check for a check-out date equal to a UW holiday
				} elseif($present_and_future_UW_holidays[$i] == strtotime($values['check_out'])) {
					
					$error_array['check_out'] = 'Please choose a non-holiday<br />check-out date';
					
				// check for a check-in date equal to a UW holiday
				} elseif($present_and_future_UW_holidays[$i] == strtotime($values['check_in'])) {
					
					$error_array['check_in'] = 'Please choose a non-holiday<br />check-in date';
					
				}
				
			}  // end test 3
						
			  
			// assuming they select a resource and provide a valid check-out and check-in date, let's perform 2 date-range tests
			if (!empty($values['resource']) && is_array($values['resource'])) {
	
				// test 4: make sure date range requested is less than the number of days available for each requested resource
				foreach ($values['resource'] as $key => $value) {
	
					if ($resource->is_over_days_available($key,$values['check_out'],$values['check_in'])) {
						$error_array['check_out'] = 'One of the requested resources isn\'t available for that many days.  Please shorten your request.';
					} else {
	
						// test 5: make sure each requested resource is actually available for the requested dates (not already checked out)
						if ($resource->not_available($key,$values['check_out'],$values['check_in'])) {
							$error_array['check_out'] = 'One of the requested resources isn\'t available for the dates you selected.  Please check the calendar for availability.';
						} // end test 5
					}
	
				} // end test 4
	
			} else {
		
				$error_array['resource'] = 'Please select at least one resource.';
		
			} // end check for a resource
	
		} // end test 1
		
	} else {
		
		$error_array['check_out'] = 'Please select tomorrow or a future date.';
		
	} // end test 0
	
	if (empty($error_array)) {
		return true;
	} else {
		return $error_array;
	}
}

function checkResourceSelection($values) {
	
	$error_array = array();
	
	if (!isset($values['resource'])) {
		$error_array['resource'] = 'Please select at least one resource.';
	}
	
	if (empty($error_array)) {
		return true;
	} else {
		return $error_array;
	}
	
}

/* not used anymore since the number of stands matches the number of banners now, only was an issue when there were more banners than stands in stock 10/18/2010 */
/*function isBannerStandAvailable($values) {
	
	global $resourceID;
	$resource = new Resource($resourceID);
	
	// store the number of banners requested
	$num_requested = count($values['resource']);

	$error_array = array();
	
	if ($resource->is_banner_stand_available($values['check_out'], $values['check_in'], $num_requested) == false) {
		$error_array['resource'] = 'All banner stands are checked out for the reservation dates requested OR you are reserving more banner stands than we have available ('.NUM_BANNER_STANDS.').  Try some new dates.';
	}
	
	if (empty($error_array)) {
		return true;
	} else {
		return $error_array;
	}
	
}*/

function whichShowcaseWall($values) {
	
	$error_array = array();
	
	// user is trying to select both showcase walls, which is not allowed
	if ($values['resource']['20'] == 1 && $values['resource']['21'] == 1) {
		$error_array['resource'] = 'Both showcase walls (4x4 and 5x4) are not reservable for the same period since they share components.  Please select one or the other.';		
	}
	
	if (empty($error_array)) {
		return true;
	} else {
		return $error_array;
	}
	
}

function checkBudgetNum($values) {
	
	$error_array = array();
	
	// pattern we want: 12-3456
	$pattern = '/^[0-9]{2}+-[0-9]{4}$/';
	$stringToCheck = $values['budget_num1'].'-'.$values['budget_num2'];
	
	// test 1: make sure both budget num fields have been filled out
	if (!empty($values['budget_num1']) && !empty($values['budget_num2'])) {
		
		// test 2: check our budget num string against the pattern we want
		if (!preg_match($pattern, $stringToCheck)) {
		
			$error_array['budget_num1'] = 'Invalid budget #.  Please enter a # which follows this pattern: 12-3456';
			
		}		
		
	} else {
		
		$error_array['budget_num1'] = 'Please fill out both budget number fields.';
		
	}

	if (empty($error_array)) {
		return true;
	} else {
		return $error_array;
	}
	
}

$d = array();

function buildReservationNav($resourceID) {
	
	$rsvnNavArray = array('Banner' => 'Retractable Banners',
	                      'Backdrop' => 'Media Backdrops');
	
	$rsvnNavHTML = '';
	$i=1;
	                      
	foreach($rsvnNavArray as $key => $value) {
		if ($resourceID == $i) {
			//$selected = ' class="selected"';
			$rsvnNavHTML .= '<li><a class="selected">'.$key.'</a></li>';
		} else {
			//$selected = '';
			$rsvnNavHTML .= '<li><a href="index.php?id='.$i.'" title="Reserve '.$value.'">'.$key.'</a></li>';
		}
		
		$i++;
	}
	
	return $rsvnNavHTML;
	
}

$d['body']['rsvnNavHTML'] = buildReservationNav($resourceID);

// Try validating the form
if ($form->validate()) {

    // get and store the user's submitted values
    $submitValues = $form->getSubmitValues();

    // insert the user's reservation data into the database and into the google calendar
    $results = $form->process('processReservation',false);
    
    $results = true;
    
	if ($results) {

		// success was had, email the contestant a confirmation message
		sendReservationConfirmationEmail($submitValues);

		// store a confirmation flag in the session, then redirect the user back to the form
		session_start();
		$_SESSION['success'] = 1;
		header('Location: index.php?id='.$resourceID);

	} else {

		// error, something didn't work
		$windowTitle = 'An error occurred.  Fix it dude!';
		$d['body'] = '<div id="confContainer">the data did not get inserted, go find the problem</div>';
	}

} else {

	$errorsInForm = $form->toArray();

	// set some HTML variables for the output below
	$d['body']['errorOnSubmission'] = '';

	// look for whether errors exist when the form is submitted, then notify user at top of page rather than just down below
	if (is_array($errorsInForm['errors']) && !empty($errorsInForm['errors'])) {
		$d['body']['errorOnSubmission'] .= '<div id="formErrorMsg">There were errors with your submission.  Look below for an error message.</div>';
	}
	
	// get form as a cleaned up array so we can format the fields individually
	$d['form'] = cleanUpFormArray($form->toArray());

	// extract out the calendar ID and calendar color for use in the group calendar string, for the iframe call
	if (!empty($calendarInfo) && is_array($calendarInfo)) {
		foreach ($calendarInfo as $calendarKey => $calendarArray) {

			$groupCalendarString .= 'src='.$calendarArray['googleID'].'&amp;color='.str_replace('#', '%23', $calendarArray['color']).'&amp;';

		}
	}

	// chop off the final ampersand symbol
	$calendarURIstring = substr($groupCalendarString, 0, -5);

	$windowTitle = 'Reserve a Resource Today!';

	$d['body']['extraHTML'] = $extraHTML;
	$d['body']['calendarURIstring'] = $calendarURIstring;
	$d['body']['parentCalendarTitle'] = $parentCalendarTitle;

	$pageBody = build_display('reservation-form.tpl.php',$d);

}

$extra_inline_js = '

<!-- Loading Calendar JavaScript files -->
<script type="text/javascript" src="../include/zapatec.js"></script>
<script type="text/javascript" src="../include/zpdate.js"></script>
<script type="text/javascript" src="../include/calendar.js"></script>

<!-- Loading language definition file -->
<script type="text/javascript" src="../include/calendar-en.js"></script>

<script type="text/javascript">
function disable(f) {
   var button = f.elements[\'submit\'];
   button.value = "Processing... please wait";
   button.disabled=true;
   return true;   
}
</script>'
;
$extra_stylesheet = '../include/winter.css';

// include an IE6 only stylesheet
if (strstr($_SERVER['HTTP_USER_AGENT'], 'MSIE 6.0')) {
	$extra_stylesheet2 = FULL_URL.'include/ie6.css';
}

require(TEMPLATE_FOLDER.'mainpage.tpl.php');

?>
