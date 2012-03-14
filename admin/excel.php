<?php

// include files
require_once '../include/global.inc.php';

global $mdb2;

$query = sprintf('SELECT rsvn.id,
					     res.title,
					     rsvn.fname,
					     rsvn.lname,
					     rsvn.email,
					     rsvn.phone,
					     rsvn.location,
					     rsvn.department,
					     rsvn.notes,
					     rsvn.deleted_p,
					     rsvn.check_out,
					     rsvn.check_in,
					     rsvn.created_on,
					     rsvn.modified_on
					FROM `mktng_reservations` as rsvn,
					     `mktng_resources` as res
					WHERE rsvn.resource_id = res.id
				 ORDER BY rsvn.id ASC');

$res =& $mdb2->query($query);
			
if (PEAR::isError($res)) {
    die($res->getMessage());
}

// column headers
$data[] = array('id','title','fname','lname','email','phone','location','department','notes','deleted','check_out','check_in','created_on','modified_on');

while ($row = $res->fetchRow(MDB2_FETCHMODE_ASSOC)) {
	
	$data[] = $row;
		
}

foreach ($data as $key => $value) {

	$tsv[] = implode("\t", str_replace("\r\n"," ",$value));

}

$tsv = implode("\r\n", $tsv);

$fileName = date("Y.m.d-H.i.s").'_rsvns.xls';
header("Content-type: application/vnd.ms-excel");
header("Content-Disposition: attachment; filename=$fileName");

echo $tsv;

?>