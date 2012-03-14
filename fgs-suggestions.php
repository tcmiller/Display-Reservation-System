<?php

/**
* fgs-suggestions.php - Floating Graphics System Suggestions page
*
* @name       - fgs-suggestions.php
* @author     - Tim Chang-Miller <tcmiller@u.washington.edu>
*
* @package    - UW Marketing Resources
* @subpackage - Mobile Display Reservation System
*/

// initialize our data array
$d = array();

// include files
require_once 'include/global.inc.php';

// assign the window title
$windowTitle = 'Floating Graphics System Suggested Combinations';

// build and store our page body
$pageBody = build_display('fgs-suggestions.tpl.php',$d);

// include and output our mainpage
require(TEMPLATE_FOLDER.'mainpage.tpl.php');

?>