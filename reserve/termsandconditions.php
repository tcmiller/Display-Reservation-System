<?php

/**
* termsandconditions.php - Terms and Conditions Popup
*
* @name       - termsandconditions.php
* @author     - Tim Chang-Miller <tcmiller@u.washington.edu>
*
* @package    - UW Marketing Resources
* @subpackage - Mobile Display Reservation System
*/

// include files
require_once '../include/global.inc.php';

$d = array();
$d['body'] = '

<h1>Mobile Display Checkout<br />Terms of Agreement</h1>
These displays are loaned out to University of Washington staff free of charge. In the unlikely event that the displays are returned damaged, and/or pieces are missing, the reservation\'s budget number will be charged for the repair/replacement cost.
<p>It is also very important that displays are returned on time so that they are available for the next user. In the unlikely event that the checked-out displays are returned late (defined as the day after the last day of the reservation), a $100 late fee will charged to the reservation\'s budget number.</p>
<p>By checking the "I agree to the terms and conditions." checkbox on the reservation form, you affirm that you have read and agree to the terms of this agreement.</p>
';

$windowTitle = 'Mobile Display Checkout Terms of Agreement';

$pageBody = build_display('popup.tpl.php',$d);

require(TEMPLATE_FOLDER.'popup-mainpage.tpl.php');

?>