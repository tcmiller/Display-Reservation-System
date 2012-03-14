<?php

/**
* edit.php    - UW Resource Scheduler Admin - edit screen
*
* @name       - edit.php
* @author     - Tim Chang-Miller <tcmiller@u.washington.edu>
*
* @package    - UW Marketing Resources
* @subpackage - Mobile Display Reservation System
*/

header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// get the data id
if (!empty($_GET['id'])) {
	$id = $_GET['id'];
} else {
	$id = '';
}

// get the edit mode
if (!empty($_GET['mode'])) {
	$mode = $_GET['mode'];
} else {
	$mode = '';
}

// set up our data array for easy passing to the template
$d = array();

$d['mode'] = $mode;

// include files
require_once 'HTML/QuickForm.php';
require_once 'HTML/QuickForm/altselect.php';
require_once 'HTML/QuickForm/Renderer/Tableless.php';
require_once '../include/global.inc.php';

// let's set all of the mode specific info here
switch ($mode) {
	
	case 'resource':
		$windowTitle = 'Edit an Existing Resource!';
		$d['pageTitle'] = 'Edit a Resource';		
		$query = sprintf('SELECT mres.id,
					             mres.parent_id,
		                 		 mres.resource_id,
						         mres.title,
						         mres.description,
						         mres.color,
						         mres.days_available,
						         mres.created_on,
						         mres.modified_on,
						         mimg.new_file as image_file,
						         mimg.id as image_id
						    FROM mktng_resources as mres,
						         mktng_images as mimg       
						   WHERE mres.id = \'%s\'
						     AND mres.resource_id = mimg.resource_id
						     AND mimg.deleted_p = 0',$id);
		break;
	
	case 'reservation':
		$windowTitle = 'Edit an Existing Reservation!';
		$d['pageTitle'] = 'Edit a Reservation';
		$query = sprintf('SELECT mrsvn.id,
		                 		 mrsvn.resource_id,
				                 mrsvn.event_id,
				                 mrsvn.fname,
				                 mrsvn.lname,
				                 mrsvn.email,
				                 mrsvn.phone,
				                 mrsvn.location,
				                 mrsvn.department,
				                 mrsvn.notes,
				                 mrsvn.check_out,
				                 mrsvn.check_in,
				                 mrsvn.budget_num,
				                 mrsvn.created_on,
				                 mrsvn.modified_on,
				                 mres.parent_id,
				                 mres.title,
				                 mres.resource_id as calendar_id,
				                 mimg.new_file as image
				            FROM mktng_reservations as mrsvn,
				            	 mktng_resources as mres,     
				            	 mktng_images as mimg
				           WHERE mrsvn.id = \'%s\'
				             AND mrsvn.resource_id = mres.id
				             AND mres.resource_id = mimg.resource_id
				             AND mimg.img_use = \'%s\'',$id,'thumb');
		break;	
}

// Proceed with getting some data...
$res =& $mdb2->query($query);

// Get each row of data on each iteration until
// there are no more rows
while (($row = $res->fetchRow(MDB2_FETCHMODE_ASSOC))) {
    $editData[] = $row;
}

// begin building the form
$form =& new HTML_QuickForm('admin_edit', 'post', 'edit.php?id='.$id.'&mode='.$mode, null, array('onsubmit' => 'disable(this)'));
$renderer =& new HTML_QuickForm_Renderer_Tableless();

switch ($mode) {
	
	case 'resource':
		
		// set our defaults to the database retrieved values for this resource
		$form->setDefaults(array('title' => $editData[0]['title'],
		                         'desc' => $editData[0]['description'],
		                         'days_available' => $editData[0]['days_available'],
		                         'deleteimage2' => 0,
		                         'deleteimage3' => 0));
		
		// set a hidden value to store the local resource id and the external resource id
		$form->addElement('hidden', 'id', $id);
		$form->addElement('hidden', 'parent_id', $editData[0]['parent_id']);
		$form->addElement('hidden', 'resource_id', $editData[0]['resource_id']);
		$form->addElement('hidden', 'cur_title', $editData[0]['title']);
		
		// change the default file upload size to 1MB, from 2MB
		$form->setMaxFileSize(1048576);
		
		// list our form elements
		$form->addElement('text','title',array('Title:','(takes awhile to update, don\'t be alarmed!)'),array('size' => 25, 'maxlength' => 40));
		$form->addElement('textarea','desc', 'Description:', array('rows' => 15, 'cols' => 50));
		$form->addElement('text', 'days_available', 'Days Available:', array('size' => 2, 'maxlength' => 4));
		
		// this is our image selecting elements
		for($i=0;$i<4;$i++) {
			
			// text for existing images, which go here
			if ($i<count($editData)) {
				
				$form->addElement('file', 'file-'.$editData[$i]['image_id'], 'Image '.$i.':<br /><img src="'.RESOURCE_IMAGES_FOLDER.$editData[$i]['image_file'].'" />',array('size' => 40));
				
				// we only want to add the delete checkbox for images 3 and 4, not the original thumb or full
				if ($i==2 || $i==3) {
					$form->addElement('checkbox','deleteimage-'.$editData[$i]['image_id'],'Check box to delete this image.');
				}
			
			// up to 4 images total are allowed, so we need to provide extra "file" fields for them
			} else {
				
				$form->addElement('file', 'file'.$i, 'Image '.$i.'');
			
			}
		}
		$form->addElement('submit', 'submit', 'Submit');
		
		// list our form rules
		$form->addRule('title', 'Please enter a title', 'required');
		$form->addRule('desc', 'Please enter a description', 'required');
		$form->addRule('days_available', 'Please enter a number of days', 'required');
		
		break;
		
	
	case 'reservation':
		
		// set our defaults to the database retrieved values for this reservation
		$form->setDefaults(array('fname' => $editData[0]['fname'],
		                         'lname' => $editData[0]['lname'],
		                         'email' => $editData[0]['email'],
		                         'phone' => $editData[0]['phone'],
		                         'check_out' => substr($editData[0]['check_out'],0,-9),
		                         'check_in' => substr($editData[0]['check_in'],0,-9),
		                         'location' => $editData[0]['location'],
								 'department' => $editData[0]['department'],
		                         'budget_num' => $editData[0]['budget_num'],
		                         'notes' => $editData[0]['notes']));
		                         
		// set a hidden value to store the reservation id and the resource id
		$form->addElement('hidden', 'id', $id);
		$form->addElement('hidden', 'parent_id', $editData[0]['parent_id']);
		$form->addElement('hidden', 'calendar_id', $editData[0]['calendar_id']);
		$form->addElement('hidden', 'event_id', $editData[0]['event_id']);
		
		// start listing our form elements
		$form->addElement('text','fname','First name:',array('size' => 17, 'maxlength' => 25));
		$form->addElement('text','lname','Last name:',array('size' => 17, 'maxlength' => 25));
		$form->addElement('text', 'email', 'Email address:', array('size' => 30, 'maxlength' => 40));
		$form->addElement('text', 'phone', 'Daytime phone:', array('size' => 15, 'maxlength' => 30));
		$form->addElement('text', 'check_out', array('Check-out:','<img src="../images/calendar.gif" class="cal-cursor" alt="Calendar icon" id="trigger_out_icon" onmouseover="this.style.cursor=\'pointer\'" onmouseout="this.style.cursor=\'default\'" border="0" />
    
		<script type="text/javascript">//<![CDATA[
     var cal = new Zapatec.Calendar({
        lang              : "en",
     	theme             : "winter",
     	showEffectSpeed   : 10,
     	hideEffectSpeed   : 10,
        showOthers        : true,
        step              : 1,
        electric          : false,
        inputField        : "check_out",
        button            : "trigger_out_field",
        ifFormat          : "%Y-%m-%d",
        daFormat          : "%Y/%m/%d"
      });
    //]]></script>
    <script type="text/javascript">//<![CDATA[
     var cal = new Zapatec.Calendar({
        lang              : "en",
     	theme             : "winter",
     	showEffectSpeed   : 10,
     	hideEffectSpeed   : 10,
        showOthers        : true,
        step              : 1,
        electric          : false,
        inputField        : "check_out",
        button            : "trigger_out_icon",
        ifFormat          : "%Y-%m-%d",
        daFormat          : "%Y/%m/%d"
      });
    //]]></script>'), array('size' => 15, 'maxlength' => 30, 'onfocus' => 'document.getElementById(\'trigger_out_field\').click()', 'readonly' => 'readonly'));
		$form->addElement('text', 'check_in', array('Check-in:','<img src="../images/calendar.gif" class="cal-cursor" alt="Calendar icon" id="trigger_in_icon" onmouseover="this.style.cursor=\'pointer\'" onmouseout="this.style.cursor=\'default\'" border="0" />
    
		<script type="text/javascript">//<![CDATA[
     var cal = new Zapatec.Calendar({
        lang              : "en",
     	theme             : "winter",
     	showEffectSpeed   : 10,
     	hideEffectSpeed   : 10,
        showOthers        : true,
        step              : 1,
        electric          : false,
        inputField        : "check_in",
        button            : "trigger_in_field",
        ifFormat          : "%Y-%m-%d",
        daFormat          : "%Y/%m/%d"
      });
    //]]></script>
    <script type="text/javascript">//<![CDATA[
     var cal = new Zapatec.Calendar({
        lang              : "en",
     	theme             : "winter",
     	showEffectSpeed   : 10,
     	hideEffectSpeed   : 10,
        showOthers        : true,
        step              : 1,
        electric          : false,
        inputField        : "check_in",
        button            : "trigger_in_icon",
        ifFormat          : "%Y-%m-%d",
        daFormat          : "%Y/%m/%d"
      });
    //]]></script>'), array('size' => 15, 'maxlength' => 30, 'onfocus' => 'document.getElementById(\'trigger_in_field\').click()', 'readonly' => 'readonly'));
		$form->addElement('text', 'location', 'Location:', array('size' => 15, 'maxlength' => 30));
		$form->addElement('text', 'department', 'Department:', array('size' => 20, 'maxlength' => 40));
		$form->addElement('text','budget_num','Budget #:', array('size' => 5, 'maxlength' => 7));
		$form->addElement('textarea','notes','Notes:', array('rows' => 6, 'cols' => 35));
		$form->addElement('submit', 'submit', 'Submit');
		
		// list our form rules
		$form->addRule('fname', 'Please enter a first name.', 'required');
		$form->addRule('lname', 'Please enter a last name.', 'required');
		$form->addRule('email', 'Please enter an email address.', 'required');
		$form->addRule('email', 'Please provide a valid email address.', 'email');
		$form->addRule('phone', 'Please enter a daytime phone.', 'required');
		$form->addRule('check_out', 'Please provide a check-out date.', 'required');
		$form->addRule('check_in', 'Please provide a check-in date.', 'required');
		$form->addRule('location', 'Please provide a location where this resource will be used.', 'required');
		$form->addRule('department', 'Please provide your department.', 'required');
		
		function checkBudgetNum($values) {
	
			$error_array = array();
			
			// pattern we want: 12-3456
			$pattern = '/^[0-9]{2}+-[0-9]{4}$/';
			$stringToCheck = $values['budget_num'];
			
			// test 1: make sure both budget num fields have been filled out
			if (!empty($values['budget_num'])) {
				
				// test 2: check our budget num string against the pattern we want
				if (!preg_match($pattern, $stringToCheck)) {
				
					$error_array['budget_num'] = 'Invalid budget #.<br />Please enter a # which<br />follows this pattern: 12-3456';
					
				}		
				
			} else {
				
				$error_array['budget_num'] = 'Please fill out the budget number field.';
				
			}
		
			if (empty($error_array)) {
				return true;
			} else {
				return $error_array;
			}
			
		}
		
		$form->addFormRule('checkBudgetNum');
		
		$d['rsvnData'] = $editData[0];
		
		break;
	
}

$form->applyFilter('__ALL__','trim');

// Try validating the form
if ($form->validate()) {

    // get and store the user's submitted values
    $submitValues = $form->getSubmitValues();

	switch ($mode) {
		
		case 'resource':
			$functionToCall = 'updateResource';	
			break;
			
		case 'reservation':
			$functionToCall = 'updateReservation';
			break;
	}
	
	$results = $form->process($functionToCall,false);
	
	if ($results) {
		
		// store a confirmation flag in the session, then redirect the user back to the form
		session_start();
		$_SESSION['success'] = 1;
		header('Location: edit.php?id='.$id.'&mode='.$mode);

	} else {

		// error, something didn't work
		$windowTitle = 'An error occurred.  Fix it dude!';
		$d['body'] = '<div id="confContainer">the data did not get updated, go find the problem</div>';
	}

} else {

  	// for full XHTML validity, you need to remove the 'name' attribute
	$form->removeAttribute('name');

	// accept the "tableless" renderer and store the form's HTML in $formBody
	$form->accept($renderer);
	$formBody = $renderer->toHtml();

	// get form as array so we can check for errors on submission
	$formArray = $form->toArray();
	
	// look for whether errors exist when the form is submitted, then notify user at top of page rather than just down below
	if (is_array($formArray['errors']) && !empty($formArray['errors'])) {
		$d['body']['errorOnSubmission'] .= '<p class="formError">There were errors with your submission.  Look below for an error message.</p>';
	}
	
	$d['body'] = $formBody;
	
	$pageBody = build_display('edit.tpl.php',$d);

}

$extra_stylesheet = FULL_URL.'include/admin.css';
$extra_stylesheet2 = FULL_URL.'include/winter.css';

// we need to include the extra css, javascript and html for the calendar selector popups
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
</script>
';

require(TEMPLATE_FOLDER.'mainpage.tpl.php');

?>