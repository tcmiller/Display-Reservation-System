<?php

/**
* delete.php  - deletes a resource or reservation
*
* @name       - delete.php
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

$query = sprintf('SELECT mrsvn.event_id,
                 		 mres.parent_id,
		                 mres.resource_id
				    FROM mktng_reservations as mrsvn,
				         mktng_resources as mres
				   WHERE mrsvn.id = \'%s\'
				     AND mrsvn.resource_id = mres.id
				     AND mrsvn.deleted_p = 0',$id);

// Proceed with getting some data...
$res =& $mdb2->query($query);

// Get each row of data on each iteration until
// there are no more rows
while (($row = $res->fetchRow(MDB2_FETCHMODE_ASSOC))) {
    $deleteData[] = $row;
}

switch ($mode) {
	
	case 'resource':
		if (deleteResource($id)) {
			header('Location: '.REFERRING_URL);
		} else {
			echo 'there was a problem with deleting that resource';
		}
		break;
		
	case 'reservation':
		if (deleteReservation($id, $deleteData[0]['event_id'], $deleteData[0]['parent_id'], str_replace('%40','@',$deleteData[0]['resource_id']))) {
			header('Location: '.REFERRING_URL);
		} else {
			echo 'there was a problem with deleting that reservation';
		}
		break;
	
}

?>