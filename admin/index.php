<?php

/**
* index.php   - UW Resource Scheduler Admin
*
* @name       - index.php
* @author     - Tim Chang-Miller <tcmiller@u.washington.edu>
*
* @package    - UW Marketing Resources
* @subpackage - Mobile Display Reservation System
*/

require_once '../include/global.inc.php';

$d = array();

$windowTitle = 'Admin home';

$extra_stylesheet = FULL_URL.'include/admin.css';

function get_upcoming_reservations() {
	
	global $mdb2;
	
	$orderby_clause = '';
	$orderby_clause = 'ORDER BY check_out ASC, lname ASC';
	
	$days_in_advance_clause = '';
	// $days_in_advance_clause = 'UNIX_TIMESTAMP(mrsn.check_out) BETWEEN UNIX_TIMESTAMP(CURDATE()) AND UNIX_TIMESTAMP(TIMECURDATE()+'.DAYS_FROM_TODAY_FOR_RESERVATIONS.')';
	$days_in_advance_clause = 'UNIX_TIMESTAMP(mrsn.check_out) BETWEEN UNIX_TIMESTAMP(CURDATE()) AND UNIX_TIMESTAMP(TIMESTAMPADD(DAY,'.DAYS_FROM_TODAY_FOR_RESERVATIONS.',now()))';
	
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
					         %s',$days_in_advance_clause,$orderby_clause);
	
	$res =& $mdb2->query($query);
			
	if (PEAR::isError($res)) {
	    die($res->getMessage());
	}
	
	while ($row = $res->fetchRow(MDB2_FETCHMODE_ASSOC)) {
		
		$data[] = $row;
			
	}
	
	//echo $query;
	
	return $data;	
	
}

function get_previous_reservations() {
	
	global $mdb2;
	
	$orderby_clause = '';
	$orderby_clause = 'ORDER BY check_out ASC, lname ASC';
	
	$days_previous_clause = '';
	//$days_previous_clause = 'UNIX_TIMESTAMP(mrsn.check_out) BETWEEN UNIX_TIMESTAMP(CURDATE()-'.DAYS_FROM_TODAY_FOR_RESERVATIONS.') AND UNIX_TIMESTAMP(CURDATE())';
	// get previous 7 days
	$days_previous_clause = 'UNIX_TIMESTAMP(mrsn.check_out) BETWEEN UNIX_TIMESTAMP(TIMESTAMPADD(DAY,-'.DAYS_FROM_TODAY_FOR_RESERVATIONS.',now())) AND UNIX_TIMESTAMP(CURDATE())';
	
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
					         %s',$days_previous_clause,$orderby_clause);
	
	$res =& $mdb2->query($query);
			
	if (PEAR::isError($res)) {
	    die($res->getMessage());
	}
	
	while ($row = $res->fetchRow(MDB2_FETCHMODE_ASSOC)) {
		
		$data[] = $row;
			
	}
	
	//echo $query;
	
	return $data;
	
}

$previousReservations = get_previous_reservations();

if (!empty($previousReservations) && is_array($previousReservations)) {
	
	foreach ($previousReservations as $key => $value) {
		
		$d['previous'][] = $value;
		//echo 'Previous 5 days: '.$value['title'].' - '.$value['check_out'].'<br />';
		
	}
	
} else {
	
	$d['none'] = true;
	
}

// return and store any upcoming reservations
$upcomingReservations = get_upcoming_reservations();

if (!empty($upcomingReservations) && is_array($upcomingReservations)) {

	// loop through the reservations and break them into 3 distinct groups (today, tomorrow and other)
	foreach ($upcomingReservations as $key => $value) {
		
		if ($value['check_out'] == date('Y-m-d')) {
			
			$d['today'][] = $value;		
			//echo 'Today: '.$value['title'].' - '.$value['check_out'].'<br />';
			
		} elseif ($value['check_out'] == date('Y-m-d',strtotime('Tomorrow'))) {
			
			$d['tomorrow'][] = $value;
			//echo 'Tomorrow: '.$value['title'].' - '.$value['check_out'].'<br />';
			
		} else {
					
			$d['other'][] = $value;
			//echo 'Other: '.$value['title'].' - '.$value['check_out'].'<br />';
			
		}
		
	}
	
} else {
	
	$d['none'] = true;
	
}


$pageBody = build_display('index-admin.tpl.php',$d);

$extra_js = 'https://www.washington.edu/common/js/prototype.js';

$extra_inline_js .= '<script type="text/javascript">

			<!-- Defaults -->
			Event.observe(window, \'load\', function() {
			 	document.search.tp[0].checked=true;
				document.search.query.focus();
			});
			
			function sendRequest() {
				new Ajax.Request("search.php", 
					{ 
					method: \'post\', 
					parameters: \'type=\'+$F(\'type\')+\'&query=\'+$F(\'query\')+\'&cal=\'+$F(\'cal\')+\'&tp=\'+$F(\'tp\'),
					onComplete: showResponse 
					});
				document.search.query.value="";
			}

			function showResponse(req){
				$(\'results\').innerHTML = req.responseText;
			}
			
			function callDatePicker(val) {
			
			    document.search.query.value = "";
			    		    
			    if (val == \'check_out\') {
			    	document.getElementById(\'calendar_icon\').style.visibility="visible";
			    	document.getElementById(\'tp_toggle\').style.visibility="hidden";
			    	document.search.tp[0].checked=false;
			    	document.search.tp[1].checked=false;
			    	document.search.query.readOnly=true;
			    	document.getElementById(\'queryContainer\').style.display="none";
			    	document.getElementById(\'calendarContainer\').style.display="inline";
			    	   	
			    } else {
			    	document.getElementById(\'calendar_icon\').style.visibility="hidden";
			    	document.getElementById(\'tp_toggle\').style.visibility="visible";
			    	document.search.tp[0].checked=true;
			    	document.search.query.readOnly=false;
			    	document.getElementById(\'queryContainer\').style.display="inline";
			    	document.getElementById(\'calendarContainer\').style.display="none";
			    	document.search.cal.value=null;
			    	document.search.query.focus();
			    }
			    
		
			}
			
		</script>
		
		<!-- Loading Calendar JavaScript files -->
		<script type="text/javascript" src="../include/zapatec.js"></script>
		<script type="text/javascript" src="../include/zpdate.js"></script>
		<script type="text/javascript" src="../include/calendar.js"></script>
		
		<!-- Loading language definition file -->
		<script type="text/javascript" src="../include/calendar-en.js"></script>
		
		<script type="text/javascript">
		function confirm_delete(url)
		{
		var r=confirm("Are you sure that you want to delete this?");
		if (r==true)
		  {
		  location.href=url;
		  }
		}
		</script>';

$extra_stylesheet2 = '../include/winter.css';

require(TEMPLATE_FOLDER.'mainpage.tpl.php');

?>