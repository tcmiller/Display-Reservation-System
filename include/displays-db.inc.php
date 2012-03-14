<?php

require_once 'MDB2.php';

$dsn = 'mysqli://lookitup_user:lookitup_pass@ovid.u.washington.edu:lookitup_port/lookitup_db';
$options = array(
    'debug' => 2,
    'result_buffering' => true,
);

$mdb2 =& MDB2::factory($dsn, $options);
if (PEAR::isError($mdb2)) {
    die($mdb2->getMessage());
}

$mdb2->disconnect();

?>
