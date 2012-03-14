<?php

/**
* add.php     - "add a resource" screen
*
* @name       - add.php
* @author     - Tim Chang-Miller <tcmiller@u.washington.edu>
*
* @package    - UW Marketing Resources
* @subpackage - Mobile Display Reservation System
*/

// get the parent calendar ID from the URL
if (!empty($_GET['id'])) {
	$resourceID = $_GET['id'];
	$index = false;
} else {
	$resourceID = 1;
	$index = true;
}

// set up our data array for easy passing to the template
$d = array();

// include files
require_once 'HTML/QuickForm.php';
require_once 'HTML/QuickForm/altselect.php';
require_once 'HTML/QuickForm/Renderer/Tableless.php';
require_once '../include/global.inc.php';

// get an instance of the calendar object
$resource = new Resource($resourceID);

// return and store the subcalendar information in an array, get the parent too, but not just the parent (true, false)
$resourceInfo = $resource->getGoogleInfo(true, false);

// begin building the form
$form =& new HTML_QuickForm('rs_admin', 'post', 'add.php?id='.$resourceID.'');
$renderer =& new HTML_QuickForm_Renderer_Tableless();

// H I D D E N  E L E M E N T S
$form->addElement('hidden', 'parentCalendarID', $resourceID);

// D E F A U L T  M A X  F I L E  S I Z E
$form->setMaxFileSize(1048576);

// let's create a large array of name => value pairs for the resource selector selection
foreach ($resourceInfo as $resourceKey => $resourceArray) {

	$resourceIDs[] = $resourceArray['id'];
	$resourceTitles[] = $resourceArray['title'];
	$resourceArray = array_combine($resourceIDs, $resourceTitles);
}

// after looping through $resourceInfo, let's pull out the first element, the primary resource calendar, to display its title back to the user
$categoryInfo = array_slice($resourceArray,0,1);
$categoryTitles = array_values($categoryInfo);
$d['pageTitle'] = $categoryTitles[0];

// this is the rest of our $resourceArray, which is the subcalendar info
$resourceArray = array_slice($resourceArray,1);

// F O R M  E L E M E N T S
$form->addElement('select','resource','Resource:', $resourceArray);
$form->addElement('textarea','desc', 'Description:', array('rows' => 5, 'cols' => 26));
$form->addElement('text', 'days_available', 'Days Available:', array('size' => 2, 'maxlength' => 4));
$form->addElement('file', 'file1', 'Thumbnail:');
$form->addElement('file', 'file2', 'Image 1:');
$form->addElement('file', 'file3', 'Image 2:');
$form->addElement('file', 'file4', 'Image 3:');
$form->addElement('submit', null, 'Submit');

// G E N E R A L  R U L E S
$form->addRule('desc', 'Please enter a description', 'required');
$form->addRule('days_available', 'Please enter a number of days', 'required');
$form->addRule('file1', 'Please provide a thumbnail graphic', 'uploadedfile');
$form->addRule('file2', 'Please provide a full graphic', 'uploadedfile');

$form->applyFilter('__ALL__','trim');

// Try validating the form
if ($form->validate()) {

    // get and store the user's submitted values
    $submitValues = $form->getSubmitValues();

    // insert the contestant's data into the database
    $results = $form->process('addResource',false);

	if ($results) {
		
		// store a confirmation flag in the session, then redirect the user back to the form
		session_start();
		$_SESSION['success'] = 1;
		header('Location: add.php?id='.$resourceID);

	} else {

		// error, something didn't work
		$windowTitle = 'An error occurred.  Fix it dude!';
		$d['body'] = '<div id="confContainer">the data did not get inserted, go find the problem</div>';
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
	
	$windowTitle = 'Enter a new resource!';

	$d['body'] = $formBody;
	
	$pageBody = build_display('add.tpl.php',$d);

}

$extra_stylesheet = FULL_URL.'include/admin.css';

require(TEMPLATE_FOLDER.'mainpage.tpl.php');

?>