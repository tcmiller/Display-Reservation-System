<?php

/**
 * global.inc.php - Contains all defined constants and a function that must be called before functions.inc.php, etc.
 * 
 * @name   - global.inc.php
 * @author - Tim Chang-Miller <tcmiller@u.washington.edu>
 * 
 * @package - UW Marketing
 * @subpackage - Mobile Display Reservation System
 * 
 */

/**
 * curPageURL - returns the URL of the current page
 *
 * @return string $pageURL
 */
function curPageURL() {
	$pageURL = 'http';
	if ($_SERVER["HTTPS"] == "on") {$pageURL .= "s";}
		$pageURL .= "://";
	if ($_SERVER["SERVER_PORT"] != "80") {
		$pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
	} else {
		$pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
	}
	return $pageURL;
}

// define constants
define('CHARSET','utf-8');
define('BASE_URL',$_SERVER['DOCUMENT_ROOT']);
define('BASE_FOLDER','/externalaffairs/uwmarketing/displays/');
define('URL_FOLDER',BASE_URL.BASE_FOLDER);
define('TEST_URL','https://wwwudev.cac.washington.edu'.BASE_FOLDER);
define('LIVE_URL','https://www.washington.edu'.BASE_FOLDER);
if (strstr(curPageURL(),'https://wwwudev.cac.washington.edu')) {
	define('FULL_URL',TEST_URL);
} else {
	define('FULL_URL',LIVE_URL);
}
define('TEMPLATE_FOLDER',URL_FOLDER.'include/templates/');
define('RESOURCE_IMAGES_FOLDER','https://depts.washington.edu/mktg/displays/images/');
define('DAYS_FROM_TODAY_FOR_RESERVATIONS',7);
define('MONTHS_TO_DISPLAY_FOR_RESERVATIONS',3);
define('NUM_DAYS_RESERVATIONS_TO_RETURN',90);
define('REFERRING_URL',$_SERVER['HTTP_REFERER']);
define('RESERVATION_SWITCH','on');

// this changes back to -07 during standard time, for daylight savings, it's -08, has to be updated twice a year
define('TZ_OFFSET','-08');

// includes here
require_once 'functions.inc.php';
require_once 'Resource.inc.php';

?>