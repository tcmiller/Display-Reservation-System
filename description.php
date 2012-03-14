<?php

/**
* description.php - UW Marketing Resource Description page
*
* @name       - description.php
* @author     - Tim Chang-Miller <tcmiller@u.washington.edu>
*
* @package    - UW Marketing Resources
* @subpackage - Mobile Display Reservation System
*/

// get the parent calendar ID (resource category) from the URL
if (!empty($_GET['id'])) {
	$resourceID = $_GET['id'];
} else {
	$resourceID = '';
}

// initialize our data array
$d = array();

// include files
require_once 'include/global.inc.php';

// switch on the resource cat ID and provide appropriate content
switch($resourceID) {
	
	case "1":
		$d['title'] = 'Retractable Banners';
		$d['body'] = '<h2>Eye-Catching. Lightweight. Easy-to-Use.</h2>
		<p>Retractable banners are contained within a light, compact banner
stand for easy travel. Banners pull in and out of the stand much like a
window shade. Each banner stand comes with its own carrying case.</p>

<p>There are <strong>9 banners available</strong>.  Stands are 37" wide. Banners are 34" wide x 80" tall.</p>
<p><strong>These banners are for indoor use only.</strong></p>';
		$d['image'] = 'full_banner.jpg';
		$d['width'] = '200';
		$d['height'] = '400';
		$d['buttonText'] = 'Reserve Banners';
		$d['buttonID'] = '1';
		break;
				
	case "2":
		$d['title'] = 'Media Backdrops';
		$d['body'] = '<h2>Large, Dramatic and Professional.</h2>
		              <p>These 8\' x 8\' Media backdrops are great for on-stage and at both indoor and outdoor events. All are made with heavy fabric with grommets around the edges. An optional aluminum backdrop frame is available for checkout as well, but does require you to use your own Allen wrench and zip ties for proper set-up.</p>';
		$d['image'] = 'full_backdrop_b.jpg';
		$d['width'] = '200';
		$d['height'] = '201';
		$d['buttonText'] = 'Reserve Media Backdrops';
		$d['buttonID'] = '2';
		break;
	
}

// assign the window title
$windowTitle = $d['title'];

// build and assign the page body
$pageBody = build_display('description.tpl.php',$d);

// include an IE6 only stylesheet
if (strstr($_SERVER['HTTP_USER_AGENT'], 'MSIE 6.0')) {
	
	$extra_stylesheet = FULL_URL.'include/ie6.css';
}

// include and display the mainpage
require(TEMPLATE_FOLDER.'mainpage.tpl.php');

?>
