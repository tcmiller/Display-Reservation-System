<?php

/**
* faq.php - Frequently Asked Questions page
*
* @name       - faq.php
* @author     - Tim Chang-Miller <tcmiller@u.washington.edu>
*
* @package    - UW Marketing Resources
* @subpackage - Mobile Display Reservation System
*/

// initialize our data array
$d = array();

// include files
require_once 'include/global.inc.php';

// assign a window title
$windowTitle = 'Frequently Asked Questions';

// build and store the page body
$pageBody = build_display('faq.tpl.php',$d);

// output the mainpage
require(TEMPLATE_FOLDER.'mainpage.tpl.php');

?>