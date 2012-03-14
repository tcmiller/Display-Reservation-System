<?php

/**
* functions.inc.php - Contains the majority of our helper functions and form functions
*
* @name       - functions.inc.php
* @author     - Tim Chang-Miller <tcmiller@u.washington.edu>
*
* @package    - UW Marketing Resources
* @subpackage - Mobile Display Reservation System
*/

// include files
require_once 'global.inc.php';
require_once 'displays-db.inc.php';

/**
 * function build_display() - Build the html from a template
 *
 * @param string $template_inbd The name of the template in the templates/ folder.
 * @param array $d Associative array with all the fields to pass to the template. 
 * @return string $html_inbd - template and data merged.
 */
function build_display($template_inbd, &$d) {
    $html_inbd = '';
    
    ob_start();
    
    include(TEMPLATE_FOLDER.$template_inbd);
    
    $html_inbd = ob_get_contents();
    ob_end_clean();
    return $html_inbd;
}

/**
 * function cleanUpFormArray() - 
 * 
 * Given an array that represents an HTML_Quickform object, turn it into something
 * that is easier to work with.  This only goes 1 level deep, it doesn't fix groups.
 *
 * @param mixed $form - an array from an HTML_Quickform::toArray() call.
 * 
 * @return mixed $form - an array with a simplified structure.
 */
function cleanUpFormArray($form) {
    
    if (!empty($form['elements']) and is_array($form['elements'])) {
        $form['items'] = array();
        $form['hiddenItems'] = '';
        foreach($form['elements'] as $i => $element) {
            if ($element['type'] == 'hidden') {
                $form['hiddenItems'] .= $element['html']."\n\r";
            } 
            $form['items'][$element['name']] = $element;
            $form['elements'][$i] = false;
        }
        $form['elements'] = false;
    }
    
    return $form;
}

/**
 * function buildSubNav() - returns a subNavHTML string for use in our sub nav bar
 *
 * @param string $url - the current url, as returned by curPageURL()
 * 
 * @return string $subNavHTML
 */
function buildSubNav($url) {
	
	// our sub navbar listing
	$subNavArray = array('public'  => array('Home' => 'index.php',
	                                        'Retractable Banners' => 'description.php?id=1',
	                                        'Media Backdrops' => 'description.php?id=2',
	                                        'FAQs' => 'faq.php',
	                                        'Contact' => 'mailto:displays@u.washington.edu'),
	                     'admin'   => array('Admin Home' => 'index.php',
	                                        'Add a Resource' => 'add.php',
	                                        'Resources' => 'view.php?mode=resource',
	                                        'Reservations' => 'view.php?mode=reservation',
	                                        'Home' => FULL_URL.'index.php'));
	                                       
	// look for the 'admin' or 'reserve' string in our $url, so that we know which subNav to return
	if (strstr($url, 'admin')) {
		
		$subNav = $subNavArray['admin'];
		$folderPrefix = 'admin/';
		
	} else {
		
		$subNav = $subNavArray['public'];
		$folderPrefix = '';
		
	}
	
	$subNavHTML = '';

	$subNavHTML = '<ul id="subnav">';
	
	foreach($subNav as $key => $value) {
		$subNavHTML .= '<li>';
		if (strstr($url,'reserve')) {
			$subNavHTML .= '<a href="'.BASE_FOLDER.$folderPrefix.$value.'">'.$key.'</a>';
		} elseif (strstr($url,$value)) {
			$subNavHTML .= '<a class="selected">'.$key.'</a>';			
		} elseif (strstr($value,'mailto') || $key == 'Home') {
			$subNavHTML .= '<a href="'.$value.'">'.$key.'</a>';
		} else {
			$subNavHTML .= '<a href="'.BASE_FOLDER.$folderPrefix.$value.'">'.$key.'</a>';
		}
		$subNavHTML .= '</li>';
	}
	
	$subNavHTML .= '</ul>';
	
	return $subNavHTML;
	
}

/**
 * getParentID() - this function acts like a lookup table so we don't have to drastically change our data model for reservations
 *                 it lets us look up a parentID given a google email address
 *
 * @param string $googleAddress
 * 
 * @todo change the data model to include the actual integer parent ID instead of the gmail address (which we could/should replace)
 */
function getParentID($googleAddress) {
	
	switch ($googleAddress) {
		
		case "uwbanners@gmail.com":
			$parentID = 1;
			break;
		/*case "uwsummitstandhardware@gmail.com":
			$parentID = 2;
			break;*/
		/*case "uwshowcasewall@gmail.com":
			$parentID = 2;
			break;*/
		case "uwmediabackdrop@gmail.com":
			$parentID = 2;
			break;		
	}
	
	return $parentID;
	
}

/**
 * function createGoogleEvent()
 *
 * @param $client object
 * @param $title string
 * @param $desc string
 * @param $where string
 * @param $startDate string
 * @param $startTime string
 * @param $endDate string
 * @param $endTime string
 * @param $tzOffset string
 * 
 * @return string $createdEvent->id->text
 */
function createGoogleEvent ($client, $title, $desc, $where, $startDate, $startTime, $endDate, $endTime, $tzOffset, $calendarID) {

	$calendarURL = 'http://www.google.com/calendar/feeds/'.$calendarID.'/private/full/';
	
	$gdataCal = new Zend_Gdata_Calendar($client);
	$newEvent = $gdataCal->newEventEntry();

	$newEvent->title = $gdataCal->newTitle($title);	
	$newEvent->where = array($gdataCal->newWhere($where));
	$newEvent->content = $gdataCal->newContent("$desc", 'html');

	$when = $gdataCal->newWhen();	
	$when->startTime = "{$startDate}T{$startTime}:00.000{$tzOffset}:00";
	$when->endTime = "{$endDate}T{$endTime}:00.000{$tzOffset}:00";
	$newEvent->when = array($when);

	// Upload the event to the calendar server
	// A copy of the event as it is recorded on the server is returned
	$createdEvent = $gdataCal->insertEvent($newEvent, $calendarURL);
	
	return $createdEvent->id->text;
}

/**
 * updateGoogleEvent() - updates a google event (primarily check out and check in times)
 *
 * @param object $client
 * @param string $eventId
 * @param string $title - optional
 * @param string $startDate
 * @param string $startTime
 * @param string $endDate
 * @param string $endTime
 * @param string $tzOffset
 * @param string $calendarID
 * @return bool true
 */
function updateGoogleEvent ($client, $eventID, $title = false, $startDate, $startTime, $endDate, $endTime, $tzOffset, $calendarID) {
	
	$gdataCal = new Zend_Gdata_Calendar($client);
    
	try {
		$event = $gdataCal->getCalendarEventEntry('http://www.google.com/calendar/feeds/'.$calendarID.'/private/full/'.$eventID);
		if (!empty($title) && isset($title)) {
			$event->title = $gdataCal->newTitle($title);
		}
		$when = $gdataCal->newWhen();
		$when->startTime = "{$startDate}T{$startTime}:00.000{$tzOffset}:00";
		$when->endTime = "{$endDate}T{$endTime}:00.000{$tzOffset}:00";
		$event->when = array($when);         
		$event->save();   
	} catch (Zend_Gdata_App_Exception $e) {
		die("Error: " . $e->getResponse());
	}	
	
	return true;
}

/**
 * deleteGoogleEvent() - removes a reservation from the Google calendar
 *
 * @param object $client
 * @param string $calendarID
 * @param string $eventID
 * 
 * @return bool true
 */
function deleteGoogleEvent ($client, $calendarID, $eventID) {
	
	$gdataCal = new Zend_Gdata_Calendar($client);
    
	try {
  		$event = $gdataCal->getCalendarEventEntry('http://www.google.com/calendar/feeds/'.$calendarID.'/private/full/'.$eventID);
  		$event->delete();
  		
	} catch (Zend_Gdata_App_Exception $e) {
		die("Error: " . $e->getResponse());
	}
	return true;
	
}

/**
 *  processReservation - performs two important tasks
 *  1) inserts all user reservation data into mktng_reservations table (for local storage)
 *  2) calls createGoogleEvent to insert relevant reservation data into the appropriate Google Calendar
 *
 * @param mixed $values
 * 
 * @return boolean true 
 */
function processReservation ($values) {
	
	global $mdb2;
	
	$resource = new Resource($values['parentID']);
	
	foreach ($values['resource'] as $key => $value) {
		
		// there must be at least one value for us to run the insert query
		if (!empty($value) && $value > 0) {
			
			// first, insert data into google so we can get an event id back from them to insert into our own db
			$client = $resource->getGoogleClient();
			$localInfo = $resource->getLocalInfo($key);
			$location = 'private';
			$desc = 'private';
			
			// need to check whether the check_out date is the same as the check_in date
			if ($values['check_out'] == $values['check_in']) {
				// if so, send Google a check_in date that is in the future by one day... this way, we don't conflict with the check_out and check_in times don't conflict for a "same day" reservation
				$parts = explode('-',$values['check_in']);
				$check_in = $parts[0].'-'.$parts[1].'-'.($parts[2]+1);
			} else {
				// if not, report the check_in day as usual
				$check_in = $values['check_in'];
			}
			
			// call and execute createGoogleEvent(), then store the returned $eventIDstring (looks like 'http://www.google.com/calendar/feeds/5eu42poqi8jkbhhgl74tqhu7qo%40group.calendar.google.com/private/full/43orut4q3bdga07qlosve8q758')
			$eventIDstring = createGoogleEvent($client, $localInfo['title'], $desc, $location, $values['check_out'], '09:00', $check_in, '08:00', TZ_OFFSET, str_replace('%40','@',$localInfo['resource_id']));
			
			// before inserting, let's parse $eventIDstring, we only want the $eventID portion at the end
			$eventID = substr($eventIDstring,-26);
			
			// call and prepare the table and data for insertion
			$table_name = 'mktng_reservations';
	
			$fields_values = array(
			    'resource_id' => $key,
			    'event_id' => $eventID,
				'fname'    => $values['fname'],
				'lname' => $values['lname'],
				'email' => $values['email'],
				'phone' => $values['phone'],
				'location' => $values['location'],
			    'department' => $values['department'],
				'notes' => $values['notes'],
				'check_out' => $values['check_out'],
				'check_in' => $values['check_in'],
				'budget_num' => $values['budget_num1'].'-'.$values['budget_num2'],
				'agreement_signed' => $values['agreement'],
				'created_on' => date('Y-m-d H:i:s'),
				'modified_on' => date('Y-m-d H:i:s')
			);
		
			$types = array('integer', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'integer', 'text', 'text');
		
			$mdb2->loadModule('Extended');
			$affectedRows = $mdb2->extended->autoExecute($table_name, $fields_values,
									MDB2_AUTOQUERY_INSERT, null, $types);
		
			if (PEAR::isError($affectedRows)) {
				die($affectedRows->getMessage());
			}
			
		} // end if(!empty($value....
		
	} // end foreach
	
	return true;
	
}

/**
 * updateReservation() - This updates reservation data in two spots: (1) the local db, (2) the google xml file
 *
 * @param mixed $values
 * 
 * @return bool true
 * 
 */
function updateReservation($values) {
	
	// step 1: update information locally on uweb
	global $mdb2;
	
	$table_name = 'mktng_reservations';

	$fields_values = array('fname' => $values['fname'],
						   'lname' => $values['lname'],
						   'email' => $values['email'],
						   'phone' => $values['phone'],
						   'location' => $values['location'],
	                       'department' => $values['department'],
						   'notes' => $values['notes'],
						   'check_out' => $values['check_out'],
						   'check_in' => $values['check_in'],
						   'budget_num' => $values['budget_num'],
						   'modified_on' => date('Y-m-d H:i:s'));

	$types = array('text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text');

	$mdb2->loadModule('Extended');
	$affectedRows = $mdb2->extended->autoExecute($table_name, $fields_values,
							MDB2_AUTOQUERY_UPDATE, 'id = '.$mdb2->quote($values['id'], 'integer'), $types);

	if (PEAR::isError($affectedRows)) {
		die($affectedRows->getMessage());
	}
	
	// step 2: update information on the google calendar	
	$resource = new Resource(getParentID($values['parent_id']));
	$client = $resource->getGoogleClient();
	
	if (updateGoogleEvent($client, $values['event_id'], $title = '', $values['check_out'], '09:00', $values['check_in'], '08:00', TZ_OFFSET, str_replace('%40','@',$values['calendar_id']))) {
		return true;
	}
	
}

/**
 * function addResource() - Allows admin to enter a resource into the database
 * 
 * @param array $values
 * @return bool true 
 */
function addResource($values) {

	global $mdb2;
	
	//require_once BASE_URL.BASE_FOLDER.'include/Resource.inc.php';

	// get and store an instance of the Calendar object
	$resource = new Resource($values['parentCalendarID']);
	
	// get and store calendar info into an array
	$resourceInfo = $resource->getGoogleInfo(false, false);
	
	// then, pick out the sub calendar info based on the incoming sub calendar ID
	$resourceInfo = $resourceInfo[$values['resource']];
	
	// prepare and insert resource info into mktng_resources
	$table_name = 'mktng_resources';

	$fields_values = array(
	    'parent_id'      => $resource->getEncodedParentID(),
		'resource_id'    => $resourceInfo['id'],
		'title' => $resourceInfo['title'],
		'description' => $values['desc'],
		'color' => $resourceInfo['color'],
		'days_available' => $values['days_available'],
		'created_on' => date('Y-m-d H:i:s'),
		'modified_on' => date('Y-m-d H:i:s')
	);

	$types = array('text', 'text', 'text', 'text', 'text', 'integer', 'text', 'text');

	$mdb2->loadModule('Extended');
	$affectedRows = $mdb2->extended->autoExecute($table_name, $fields_values,
							MDB2_AUTOQUERY_INSERT, null, $types);

	if (PEAR::isError($affectedRows)) {
		die($affectedRows->getMessage());
	}
	
	// for each file upload attempt, we do some things...
	foreach($_FILES as $file => $value){
		
		if (!empty($value['tmp_name'])) {
		
			// first: we get the last ID in the mktng_images table and add 1 to get the current ID
			$res = $mdb2->query('SELECT * FROM mktng_images');
					
			while ($row = $res->fetchRow(MDB2_FETCHMODE_ASSOC)) {
						
				$allIDs[] = $row['id'];
				
			}
			
			// if the table is not empty, then add 1, otherwise, start at 1
			if (!empty($allIDs) && is_array($allIDs)) {
				$cur_id = max($allIDs) + 1;
			} else {
				$cur_id = 1;
			}
	    	
	    	// here, we're taking each src_file and creating a new pointer to stick into the db
	    	switch ($value['type']) {
	    		
	    		case "image/jpeg":
	    			$ext = '.jpg';
	    			break;
	    		case "image/jpg":
	    			$ext = '.jpg';
	    			break;
	    		case "image/gif":
	    			$ext = '.gif';
	    			break;
	    	}
	    	
	    	// our new pointer is the $cur_id+$ext
	    	$new_file = $cur_id.$ext;
	    	
	    	$ch = curl_init();
			
			$data = array('file_name' => $new_file, 'file' => '@'.$value['tmp_name']);
			
			curl_setopt($ch, CURLOPT_URL, 'http://depts.washington.edu/mktg/displays/receive.php');
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_VERBOSE, 1); 
			curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
			
			curl_exec($ch);
			//$message = curl_exec($ch) ? 'Success!' : 'Failure';
			
			curl_close($ch);
	    	  
	        // if it's the first one, we mark it as the 'thumb'
	        if ($file == 'file1') {
				$img_use = 'thumb';
			} else {
				$img_use = 'full';
			}
	            
	        $table_name = 'mktng_images';
		
			$fields_values = array(
				'resource_id' => $values['resource'],
				'new_file' => $new_file,
				'src_file' => $value['name'],
				'type' => $value['type'],
				'size' => $value['size'],
				'img_use' => $img_use,
				'created_on' => date('Y-m-d H:i:s'),
				'modified_on' => date('Y-m-d H:i:s')
			);
		
			$types = array('text', 'text', 'text', 'text', 'integer', 'text', 'text', 'text');
		
			$mdb2->loadModule('Extended');
			$affectedRows = $mdb2->extended->autoExecute($table_name, $fields_values,
									MDB2_AUTOQUERY_INSERT, null, $types);
		
			if (PEAR::isError($affectedRows)) {
				die($affectedRows->getMessage());
			}
		    
		} else {
			
			// echo "<p>File does not Exist!</p>";
			
		}
	    
	}

	return true;

}

/**
 * function updateResource() - Allows admin to update a resource in the database
 * 
 * @param array $values
 * 
 * @return bool true
 * 
 * @todo - need to figure out how to update the title and color of the resource in the google calendar system, via this form
 */
function updateResource($values) {

	global $mdb2;
	
	// prepare and insert resource info into mktng_resources
	$table_name = 'mktng_resources';

	$fields_values = array('title' => $values['title'],
						   'description' => $values['desc'],
						   'days_available' => $values['days_available'],
						   'modified_on' => date('Y-m-d H:i:s'));

	$types = array('text', 'text', 'integer', 'text');

	$mdb2->loadModule('Extended');
	$affectedRows = $mdb2->extended->autoExecute($table_name, $fields_values,
							MDB2_AUTOQUERY_UPDATE, 'id = '.$mdb2->quote($values['id'], 'integer'), $types);

	if (PEAR::isError($affectedRows)) {
		die($affectedRows->getMessage());
	}
    
	// if the user is attempting to update the resource title by running two "costly" updates
    if ($values['title'] !== $values['cur_title']) {
    
    	// update 1: update the calendar title on Google
    	include_once('../class/CalendarExt.inc.php');

	    $strURL = 'http://www.google.com/calendar/feeds/default/owncalendars/full/'.$values['resource_id'];
	    $strGCalID = $values['parent_id'];
	    
	    // Section to update Calendar Title
	    $calendar = new CalendarExt($strGCalID);
	    // This would be whatever calendar id you want to update
	    $calendar->connect($strURL);
	    $calendar->title($values['title']);
	    // To implement later, if we feel like it
	    //$calendar->strColor = '#FFFFFF';
	    $calendar->save(); 
		// End Section to update Calendar Title    	
    	
		
    	// update 2: update all Google event titles associated with this resource
    	
    	// step 2a: select all event_ids and other necessary info associated with this resource id
    	$query = sprintf('SELECT mrsvn.event_id,
    	                         substring(mrsvn.check_out FROM 1 FOR 10) as check_out,
    	                         substring(mrsvn.check_in FROM 1 FOR 10) as check_in,
    	                         mres.resource_id as calendar_id
				            FROM mktng_reservations as mrsvn,
				                 mktng_resources as mres
				           WHERE mrsvn.resource_id = \'%s\'
				             AND mrsvn.resource_id = mres.id',$values['id']);
		
		// Proceed with getting some data...
		$res =& $mdb2->query($query);
			
		// build the event data array that we'll loop through to update each event on the Google calendar
		while (($row = $res->fetchRow(MDB2_FETCHMODE_ASSOC))) {
			$eventData[] = $row;
		}
		
		// get a Google $client object
		$resource = new Resource(getParentID($values['parent_id']));
		$client = $resource->getGoogleClient();
		
		// step 2b: loop through the $eventData array, calling updateGoogleEvent each time
		for($i=0;$i<count($eventData);$i++) {
		
			updateGoogleEvent($client, $eventData[$i]['event_id'], $values['title'], $eventData[$i]['check_out'], '09:00', $eventData[$i]['check_in'], '08:00', TZ_OFFSET, str_replace('%40','@',$eventData[$i]['calendar_id']));			
			
		}
    		
    }
        
	//extract out all the keys to see if we have an instance of deleteimage (for deleting image2 and image3)
	$formKeys = array_keys($values);
	
	for($j=0;$j<count($formKeys);$j++) {
		if (strstr($formKeys[$j],'deleteimage')) {
			$deleteNameArray = explode("-",$formKeys[$j]);
			//echo "delete image #".$deleteNameArray[1];
			$table_name = 'mktng_images';
			
			$fields_values = array(
			    'deleted_p' => 1,
				'modified_on' => date('Y-m-d H:i:s')
			);
		
			$types = array('integer', 'text');
		
			$mdb2->loadModule('Extended');
			$affectedRows = $mdb2->extended->autoExecute($table_name, $fields_values,
									MDB2_AUTOQUERY_UPDATE, 'id = '.$mdb2->quote($deleteNameArray[1], 'integer'), $types);
		
			if (PEAR::isError($affectedRows)) {
				die($affectedRows->getMessage());
			}
		}
	}
	
	// for each file upload attempt, we do some things...
	foreach($_FILES as $file => $value) {
	
	    if (!empty($value['tmp_name'])) {
	    	
	    	$fileNameArray = explode("-",$file);
	    	
	    	// here, we're taking each src_file and creating a new pointer to stick into the db
	    	switch ($value['type']) {
	    		
	    		case "image/jpeg":
	    			$ext = '.jpg';
	    			break;
	    		case "image/jpg":
	    			$ext = '.jpg';
	    			break;
	    		case "image/gif":
	    			$ext = '.gif';
	    			break;
	    	}
	    	
	    	////////////// here is where we need to break into new vs. existing image
	    	
	    	// if the form "name" file has a hyphen in it, then we know that it's an existing image and we're going to update it
	    	if (strstr($file, "-")) {
	    	
	    		// our new pointer is the $cur_id+$ext
		    	$new_file = $fileNameArray[1].$ext;
		        
		        $ch = curl_init();
		        
				$data = array('file_name' => $new_file, 'file' => '@'.$value['tmp_name']);
				
				curl_setopt($ch, CURLOPT_URL, 'http://depts.washington.edu/mktg/displays/receive.php');
				curl_setopt($ch, CURLOPT_POST, 1);
				curl_setopt($ch, CURLOPT_VERBOSE, 1); 
				curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
			
				curl_exec($ch);
				
				//$message = curl_exec($ch) ? 'Success!' : 'Failure';
				
				curl_close($ch);

		        $table_name = 'mktng_images';
			
				$fields_values = array(
					'src_file' => $value['name'],
					'type' => $value['type'],
					'size' => $value['size'],
					'modified_on' => date('Y-m-d H:i:s')
				);
			
				$types = array('text', 'text', 'integer', 'text');
			
				$mdb2->loadModule('Extended');
				$affectedRows = $mdb2->extended->autoExecute($table_name, $fields_values,
										MDB2_AUTOQUERY_UPDATE, 'id = '.$mdb2->quote($fileNameArray[1], 'integer'), $types);
			
				if (PEAR::isError($affectedRows)) {
					die($affectedRows->getMessage());
				}
	    		
	    	// otherwise, we have a totally new image, we need to append to the current index and write a new image to the file server
	    	} else {
	    		
	    		// first: we get the last ID in the mktng_images table and add 1 to get the current ID
				$res = $mdb2->query('SELECT * FROM mktng_images');
						
				while ($row = $res->fetchRow(MDB2_FETCHMODE_ASSOC)) {
							
					$allIDs[] = $row['id'];
					
				}
				
				// if the table is not empty, then add 1, otherwise, start at 1
				if (!empty($allIDs) && is_array($allIDs)) {
					$cur_id = max($allIDs) + 1;
				} else {
					$cur_id = 1;
				}
				
				// our new pointer is the $cur_id+$ext
		    	$new_file = $cur_id.$ext;
		        
		        $ch = curl_init();

				$data = array('file_name' => $new_file, 'file' => '@'.$value['tmp_name']);
				
				curl_setopt($ch, CURLOPT_URL, 'http://depts.washington.edu/mktg/displays/receive.php');
				curl_setopt($ch, CURLOPT_POST, 1);
				curl_setopt($ch, CURLOPT_VERBOSE, 1); 
				curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
			
				curl_exec($ch);				
				//$message = curl_exec($ch) ? 'Success!' : 'Failure';
				
				curl_close($ch);
		            
		        $table_name = 'mktng_images';
			
				$fields_values = array(
					'resource_id' => $values['resource_id'],
					'new_file' => $new_file,
					'src_file' => $value['name'],
					'type' => $value['type'],
					'size' => $value['size'],
					'img_use' => 'full',
					'created_on' => date('Y-m-d H:i:s'),
					'modified_on' => date('Y-m-d H:i:s')
				);
			
				$types = array('text', 'text', 'text', 'text', 'integer', 'text', 'text', 'text');
			
				$mdb2->loadModule('Extended');
				$affectedRows = $mdb2->extended->autoExecute($table_name, $fields_values,
										MDB2_AUTOQUERY_INSERT, null, $types);
			
				if (PEAR::isError($affectedRows)) {
					die($affectedRows->getMessage());
				}
	    		
	    	}
	    	
	    } else {
			//echo "<p>File does not Exist!</p>";
		}
	    
	}

	return true;

}

/**
 * function deleteResource() - mark a resource as deleted
 *
 * @param int $id
 * @return bool true
 */
function deleteResource($id) {
	
	global $mdb2;
	
	$table_name = 'mktng_resources';
			
	$fields_values = array(
	    'deleted_p' => 1,
		'modified_on' => date('Y-m-d H:i:s')
	);

	$types = array('integer', 'text');

	$mdb2->loadModule('Extended');
	$affectedRows = $mdb2->extended->autoExecute($table_name, $fields_values,
							MDB2_AUTOQUERY_UPDATE, 'id = '.$mdb2->quote($id, 'integer'), $types);

	if (PEAR::isError($affectedRows)) {
		die($affectedRows->getMessage());
	}
	
	return true;
	
}

/**
 * function restoreResource() - restore a resource (mark as undeleted)
 *
 * @param int $id
 * @return bool true
 */
function restoreResource($id) {
	
	global $mdb2;
	
	$table_name = 'mktng_resources';
			
	$fields_values = array(
	    'deleted_p' => 0,
		'modified_on' => date('Y-m-d H:i:s')
	);

	$types = array('integer', 'text');

	$mdb2->loadModule('Extended');
	$affectedRows = $mdb2->extended->autoExecute($table_name, $fields_values,
							MDB2_AUTOQUERY_UPDATE, 'id = '.$mdb2->quote($id, 'integer'), $types);

	if (PEAR::isError($affectedRows)) {
		die($affectedRows->getMessage());
	}
	
	return true;
	
}

/**
 * deleteReservation() - mark a reservation as deleted
 *
 * @param int $id
 * @param string $eventID
 * @param string $parentID
 * @param string $calendarID
 * 
 * @return bool true
 */
function deleteReservation($id, $eventID, $parentID, $calendarID) {
	
	// step 1: remove from uweb
	global $mdb2;
	
	$table_name = 'mktng_reservations';
			
	$fields_values = array(
	    'deleted_p' => 1,
		'modified_on' => date('Y-m-d H:i:s')
	);

	$types = array('integer', 'text');

	$mdb2->loadModule('Extended');
	$affectedRows = $mdb2->extended->autoExecute($table_name, $fields_values,
							MDB2_AUTOQUERY_UPDATE, 'id = '.$mdb2->quote($id, 'integer'), $types);

	if (PEAR::isError($affectedRows)) {
		die($affectedRows->getMessage());
	}
	
	// step 2: remove from Google calendar	
	$resource = new Resource(getParentID($parentID));
	$client = $resource->getGoogleClient();
	
	if (deleteGoogleEvent($client, $calendarID, $eventID)) {
		return true;
	}	
	
}

/**
 * function restoreReservation() - restore a reservation (mark as undeleted)
 *
 * @param int $id
 * 
 * @return bool true
 */
function restoreReservation($id) {
	
	global $mdb2;
	
	// step 1: "recreate" the event on Google so we get a new event_id to place into our local uweb db
	$query = 'SELECT mres.resource_id,
					 mres.parent_id,
	                 mres.title,
	                 substring(mrsvn.check_out FROM 1 FOR 10) as check_out,
	                 substring(mrsvn.check_in FROM 1 FOR 10) as check_in
			    FROM mktng_reservations as mrsvn,
			         mktng_resources as mres
			   WHERE mrsvn.id = \''.$id.'\'
			     AND mrsvn.resource_id = mres.id
			     AND mrsvn.deleted_p = 1';
	
	// Proceed with getting some data...
	$res =& $mdb2->query($query);
	
	// Get each row of data on each iteration until there are no more rows
	while (($row = $res->fetchRow(MDB2_FETCHMODE_ASSOC))) {
	    $restoreData[] = $row;
	}
	
	$location = 'private';
	$desc = 'private';
	
	// instantiate an object of the resource class using the given parent calendar ID
	$resource = new Resource(getParentID($restoreData[0]['parent_id']));
	$client = $resource->getGoogleClient();
	
	// call and execute createGoogleEvent(), then store the returned $eventIDstring (looks like 'http://www.google.com/calendar/feeds/5eu42poqi8jkbhhgl74tqhu7qo%40group.calendar.google.com/private/full/43orut4q3bdga07qlosve8q758')
	$eventIDstring = createGoogleEvent($client, $restoreData[0]['title'], $desc, $location, $restoreData[0]['check_out'], '09:00', $restoreData[0]['check_in'], '17:00', TZ_OFFSET, str_replace('%40','@',$restoreData[0]['resource_id']));
	
	// before updating, let's parse $eventIDstring and pull out the $new_event_id portion at the end
	$new_event_id = substr($eventIDstring,-26);
	
	// step 2: "undelete" the reservation and update its event_id
	$table_name = 'mktng_reservations';
			
	$fields_values = array(
	    'event_id' => $new_event_id,
		'deleted_p' => 0,
		'modified_on' => date('Y-m-d H:i:s')
	);

	$types = array('text', 'integer', 'text');

	$mdb2->loadModule('Extended');
	$affectedRows = $mdb2->extended->autoExecute($table_name, $fields_values,
							MDB2_AUTOQUERY_UPDATE, 'id = '.$mdb2->quote($id, 'integer'), $types);

	if (PEAR::isError($affectedRows)) {
		die($affectedRows->getMessage());
	}
	
	return true;
	
}

/**
 * function sendReservationConfirmationEmail() - sends a confirmation email to the user who made a reservation
 *
 * @param mixed $values
 * @return bool true/false
 * 
 * @todo - see if you can't abstract out the email content so it's more easily editable by content coordinators
 */
function sendReservationConfirmationEmail($values) {
	
	global $mdb2;
	
	require_once 'class.uwmailer.php';

	$mail = new UWMailer();
	
	// our banner IDs
	$bannerIDArray = array('34','30','31','12','26','27','28','29');
	
	// an array of the reservation IDs
	$reservedIDArray = array_keys($values['resource']);
	
	// check to see if there's a difference between our reservation IDs and the set of banner IDs
	$compareIDArray = array_diff($reservedIDArray, $bannerIDArray);

	// if there is no difference, then we must be reserving a banner
	if (count($compareIDArray) == 0) {
		
		$bannerIsBeingReserved = true;
		//echo 'a banner is being reserved, yes indeed';
	}
		
	// pull out each selected resource and create a query string on which to select additional data out of the database with
	foreach ($values['resource'] as $key => $value) {
		$resourceIDQueryString .= '\''.$key.'\',';		
	}
	$resourceIDQueryString = substr($resourceIDQueryString,0,-1);
	$res = $mdb2->query('SELECT title FROM mktng_resources WHERE id IN ('.$resourceIDQueryString.')');
	
	if ($values['check_out'] == $values['check_in']) {
		$dateRange = '<strong>'.date('l F j, Y',strtotime($values['check_out'])).'</strong>';
	} else {
		$dateRange = 'from <strong>'.date('l F j, Y',strtotime($values['check_out'])).'</strong> to <strong>'.date('l F j, Y',strtotime($values['check_in'])).'</strong>';
	}
	
	// build out check-out code string
	$checkOutCode = '#'.date('md',strtotime($values['check_out'])).'#';
	
	// need to check whether the check_out date is the same as the check_in date
	if ($values['check_out'] == $values['check_in']) {
		// if so, send Google a check_in date that is in the future by one day... this way, we don't conflict with the check_out and check_in times don't conflict for a "same day" reservation
		$parts = explode('-',$values['check_in']);
		$check_in = $parts[0].'-'.$parts[1].'-'.($parts[2]+1);
	} else {
		// if not, report the check_in day as usual
		$check_in = $values['check_in'];
	}
	
	/**
	 * Message Body
	 */
	$body = '<html>
			 <head>
			 <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
			 </head>
			 <body style="font-family: verdana, arial, times, sans-serif; font-size: 12px;">Your reservation for the following resource(s) was successfully made:
			 
			 <p>';

			 while ($row = $res->fetchRow(MDB2_FETCHMODE_ASSOC)) {
				
			     $body .= '<strong>'.$row['title'].'</strong><br />';
		
			 }
			 
			 $body .= '</p>Your reservation is for the following date(s): <p>'.$dateRange.'</p>';
			 
			 $body .= '<p>Your reservation code is: '.$checkOutCode.'</p>';
			
			 $body .= '<p>Your reservation will be available for pickup after <strong>10:00am</strong> on <strong>'.date('l F j, Y',strtotime($values['check_out'])).'</strong>.<br />
			              Please note: Your item(s) will <strong>NOT</strong> be available for pickup before or after your scheduled pickup date/time.  If you are unable or fail to pick up your item(s), your reservation will be canceled.</p>
			              
			           <p>Your item(s) are due back by <strong>9:00am</strong> on <strong>'.date('l F j, Y',strtotime($check_in)).'</strong>.  Items returned after <strong>9:00am</strong> are subject to late fees.</p>
			 
			           <p>Reservation pickup and return is located in the UW Tower, South Building, 4th floor.  The UW Tower is located at 4443 Brooklyn Avenue NE, on the southeast corner of Brooklyn and N.E. 45th.  When you arrive at the UW Tower, use your UW ID for access through the security system.  Proceed to the 4th floor (marked "M" for Mezzanine in the elevator). Turn to your left and walk through the Cafeteria. Entrance to S-4 is at the southeast side of the Cafeteria.  Reservation pickup and return will be the first door to your left.  Your order will be inside the locker. <span style="color: red"><strong>Please remember to bring your reservation code</strong> in order to access your displays.  Banners must be returned in the coordinating case.</span>  Please reference the banner graphic on the front of the case to ensure placement in the correct case.</p>

			 </body>
			 </html>';

	$mail->From = "displays@u.washington.edu";
	$mail->FromName = "UW Displays";

	$mail->Subject = "Your display reservation was successful";

	$mail->MsgHTML($body);
	
	// only attach instructions for the users checking out a banner
	if ($bannerIsBeingReserved === true) {
	
		$mail->AddAttachment('docs/quickscreen-roll-up-banner-instructions.pdf');
		
	}
	
	$mail->AddAddress($values['email'], $values['fname'].' '.$values['lname']);
	
	$mail->AddBCC('displays@u.washington.edu', 'UW Displays');
	//$mail->AddBCC('tcmiller@u.washington.edu', 'Tim Chang-Miller');

	if(!$mail->Send()) {
		return false;
	} else {
		return true;
	}
	
}

?>