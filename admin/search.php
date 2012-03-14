<?php

require_once '../include/global.inc.php';

if(!empty($_POST['type']) && is_string($_POST['type'])) {
	
	$type = $_POST['type'];
	
	if ($_POST['type'] == 'check_out') {
		
		if(!empty($_POST['cal'])) {
			$query = $_POST['cal'];
		} else {
			$query = 'Please provide a check-out date';
		}
		
	} else {
		
		if(!empty($_POST['query']) && is_string($_POST['query'])) {
			$query = $_POST['query'];
		} else {
			$query = 'Please provide a search term';
		}		
	}
} else {
	$type = 'Please select a data type';
}

if(!empty($_POST['tp']) && is_string($_POST['tp'])) {
	$tp = $_POST['tp'];
} else {
	$tp = 'prsnt-ftre';
}

// take our two inputs and build a query out of it
function get_search_results($type,$query,$tp) {
	
	global $mdb2;
	
	$query_clause = '';
	$query_clause = '(mrsn.'.$type.' = \''.$query.'\' or mrsn.'.$type.' like \''.$query.'%\' or mrsn.'.$type.' like \'%'.$query.'\')';
	
	// if the "present and future" radio button is selected, we only get present and future reservations
	if ($tp == 'prsnt-ftre') {
		
		$tp_clause = 'AND UNIX_TIMESTAMP(mrsn.check_out) >= UNIX_TIMESTAMP(CURDATE())';
		
	// otherwise, get every matching reservation
	} else {
		
		$tp_clause = '';	
	
	}
	
	$orderby_clause = '';
	$orderby_clause = 'ORDER BY check_out ASC, lname ASC';
	
	$query = sprintf('SELECT mrsn.id,
							 mres.title,
					         mrsn.fname,
					         mrsn.lname,
					         mrsn.email,
					         substring(mrsn.check_out FROM 1 FOR 10) as check_out,
					         substring(mrsn.check_in FROM 1 FOR 10) as check_in
					    FROM mktng_reservations as mrsn,
					         mktng_resources as mres					                
					   WHERE mrsn.resource_id = mres.id
					     AND mrsn.deleted_p = 0
					     AND %s
					         %s
					         %s',$query_clause,$tp_clause,$orderby_clause);
	
	$res =& $mdb2->query($query);
			
	if (PEAR::isError($res)) {
	    die($res->getMessage());
	}
	
	while ($row = $res->fetchRow(MDB2_FETCHMODE_ASSOC)) {
		
		$data[] = $row;
			
	}
	
	return $data;	
	
}

// call and store the function results
$results = get_search_results($type,$query,$tp);

$html = '';

if (!empty($results) && is_array($results)) {
	if ($type == 'check_out') {
		$query = date('F j, Y', strtotime($query));	
	}
	
	$html .= '<h3>You searched for: <span style="color: #000">'.$query.'</span></h3>';
	
	$html .= '<ul>';
	
	// $delete_restore = '<a href="#" onclick="javascript:confirm_delete(\'delete.php?id='.$value['id'].'&amp;mode=reservation\'); return false;" class="edit_delete">delete</a>';
	
	foreach ($results as $key => $value) {
		$html .= '<li><a href="mailto:'.$value['email'].'">'.$value['fname'].' '.$value['lname'].'</a> - '.$value['title'].'&nbsp;&nbsp;(<a href="edit.php?id='.$value['id'].'&mode=reservation" title="Edit this reservation">edit</a> | <a href="#" onclick="javascript:confirm_delete(\'delete.php?id='.$value['id'].'&amp;mode=reservation\'); return false;" class="edit_delete">delete</a>)</li>';
	}

	$html .= '</ul>';	
} else {
	$html .= 'Your search yielded <strong>0</strong> results.  Try a new search!';
}

echo $html;

?>