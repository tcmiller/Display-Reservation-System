<?php

/**
* resource.php - Resource screen (pop-up window from reservation screen)
*
* @name       - resource.php
* @author     - Tim Chang-Miller <tcmiller@u.washington.edu>
*
* @package    - UW Marketing Resources
* @subpackage - Mobile Display Reservation System
*/

// get the resource ID from the URL
if (!empty($_GET['id'])) {
	$resourceID = (int)$_GET['id'];
} else {
	echo "you must supply a resource ID for this to work, yo!!!";
	exit;
}

// get the parent calendar ID from the URL
if (!empty($_GET['parentID'])) {
	$parentID = (int)$_GET['parentID'];
} else {
	echo 'you must supply a parent calendar ID for this to work, yo!!!';
	exit;
}

// include files
require_once '../include/global.inc.php';

// call the googleInfo() function and store the returned array
$resource = new Resource($parentID);
$resourceInfo = $resource->getCombinedInfo(false, $resourceID);

$d = array();
$d['resource'] = $resourceInfo;
$d['resource']['images'] = array_slice($d['resource']['images'],1);

$windowTitle = $d['resource']['title'];

$pageBody = build_display('resource.tpl.php',$d);

require(TEMPLATE_FOLDER.'popup-mainpage.tpl.php');

?>