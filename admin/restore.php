<?php

/**
* restore.php - restores a resource or reservation to its previous "undeleted" state
*
* @name       - restore.php
* @author     - Tim Chang-Miller <tcmiller@u.washington.edu>
*
* @package    - UW Marketing Resources
* @subpackage - Mobile Display Reservation System
*/

// include files
require_once '../include/global.inc.php';

if (!empty($_GET['id'])) {
	$id = (int)$_GET['id'];
} else {
	$id = '';
}

if (!empty($_GET['mode'])) {
	$mode = (string)$_GET['mode'];
} else {
	$mode = '';
}

switch ($mode) {
	
	case 'resource':
		if (restoreResource($id)) {
			header('Location: '.REFERRING_URL);
		} else {
			echo 'there was a problem with restoring that resource';
		}
		break;
		
	case 'reservation':
		if (restoreReservation($id)) {
			header('Location: '.REFERRING_URL);
		} else {
			echo 'there was a problem with restoring that reservation';
		}
		break;
	
}

?>