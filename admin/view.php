<?php

/**
* view.php   - UW Resource Scheduler Admin portal into each view mode
*
* @name       - view.php
* @author     - Tim Chang-Miller <tcmiller@u.washington.edu>
*
* @package    - UW Marketing Resources
* @subpackage - Mobile Display Reservation System
*/

// include files
require_once '../include/global.inc.php';

$d = array();

if (!empty($_GET['mode'])) {
	$d['mode'] = (string)$_GET['mode'];
} else {
	$d['mode'] = 'resource';
}

if (!empty($_GET['orderby'])) {
	$d['orderby'] = (string)$_GET['orderby'];
} else {
	$d['orderby'] = 'created_on';
}

if (!empty($_GET['sort']) && $_GET['sort'] == 'desc') {
	$d['sort'] = 'asc';
} else {
	$d['sort'] = 'desc';
}

/**
 * getData() - Retrieves data for the admin view portal
 *
 * @param string $mode
 * @param array $options
 * @return array $data
 */
function getData($mode, $orderby, $sort, $options = false) {

	global $mdb2;
	$orderby_clause = '';
	$orderby_clause = 'ORDER BY '.$orderby.' '.$sort;
	
	switch ($mode) {
		case 'resource':
			$query = sprintf('SELECT mres.id,
					         		 mres.title,
							         mimg.new_file as image,
							         mres.description,
							         mres.color,
							         mres.days_available,
							         mres.deleted_p as deleted,
							         mres.created_on,
							         mres.modified_on
							    FROM mktng_resources as mres,
							         mktng_images as mimg       
							   WHERE mres.resource_id = mimg.resource_id
							     AND mimg.img_use = \'%s\'
							     AND mimg.deleted_p = \'0\' %s','thumb',$orderby_clause);
			
			break;
		
		case 'reservation':
			
			// 90 days back, 90 days forward
			$range_clause = '';
			$range_clause = 'UNIX_TIMESTAMP(mrsn.check_out) BETWEEN UNIX_TIMESTAMP(SUBDATE(CURDATE(),INTERVAL '.NUM_DAYS_RESERVATIONS_TO_RETURN.' DAY)) AND UNIX_TIMESTAMP(TIMESTAMPADD(DAY,'.NUM_DAYS_RESERVATIONS_TO_RETURN.',CURDATE()))';
			
			$query = sprintf('SELECT mrsn.id,
									 mres.title,
							         mimg.new_file as image,
							         mrsn.fname,
							         mrsn.lname,
							         mrsn.email,
							         mrsn.phone,
							         mrsn.location,
							         mrsn.notes,
							         substring(mrsn.check_out FROM 1 FOR 10) as check_out,
							         substring(mrsn.check_in FROM 1 FOR 10) as check_in,
							         mrsn.deleted_p as deleted,
							         mrsn.created_on,
							         mrsn.modified_on
							    FROM mktng_reservations as mrsn,
							         mktng_resources as mres,
							         mktng_images as mimg       
							   WHERE mrsn.resource_id = mres.id
							     AND mres.resource_id = mimg.resource_id
							     AND mimg.img_use = \'%s\'
							     AND %s %s','thumb',$range_clause, $orderby_clause);
			
			break;
	}
	
	$res =& $mdb2->query($query);
			
	if (PEAR::isError($res)) {
	    die($res->getMessage());
	}
	
	while ($row = $res->fetchRow(MDB2_FETCHMODE_ASSOC)) {
		
		$data[] = $row;
			
	}
	
	return $data;
	
}

$d['rows'] = getData($d['mode'], $d['orderby'], $d['sort'], false);

/**
 * Let's set up pagination for the view screen
 */
require_once 'Pager/Pager.php';
$params = array(
    'mode'       => 'Jumping',
    'perPage'    => 10,
    'delta'      => 20,
    'itemData'   => $d['rows']
);
$pager = & Pager::factory($params);

// assign our paginated data
$d['rows'] = $pager->getPageData();

// pull out and assign our pagination links "HTML"
$links = $pager->getLinks();
$d['links'] = $links['all'];

switch($d['mode']) {
	case 'resource':
		$d['pageTitle'] = 'Resources';
		$windowTitle = 'Manage Resources';
		break;
	case 'reservation':
		$d['pageTitle'] = 'Reservations (3 months back, 3 months forward)';
		$windowTitle = 'Manage Reservations';
		break;		
}

$pageBody = build_display('view.tpl.php',$d);

$extra_stylesheet = FULL_URL.'include/admin.css';
$extra_inline_js = '<script type="text/javascript">
function confirm_delete(url)
{
var r=confirm("Are you sure that you want to delete this?");
if (r==true)
  {
  location.href=url;
  }
}
function confirm_restore(url)
{
var r=confirm("Are you sure that you want to restore this?");
if (r==true)
  {
  location.href=url;
  }
}
</script>';

require(TEMPLATE_FOLDER.'mainpage.tpl.php');

?>