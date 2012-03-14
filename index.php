<?php

/**
* index.php - UW Marketing Resources Index
*
* @name       - index.php
* @author     - Tim Chang-Miller <tcmiller@u.washington.edu>
*
* @package    - UW Marketing Resources
* @subpackage - Mobile Display Reservation System
*/

// include our global file
require_once 'include/global.inc.php';

// set our window title
$windowTitle = 'UW Marketing Displays: Check-Out System';

// build the display and assign it to a $pageBody var
$pageBody = build_display('index.tpl.php',$d);

// include an IE6 only stylesheet
if (strstr($_SERVER['HTTP_USER_AGENT'], 'MSIE 6.0')) {
	$extra_stylesheet = FULL_URL.'include/ie6.css';
}

// get our mainpage template
require(TEMPLATE_FOLDER.'mainpage.tpl.php');

?>