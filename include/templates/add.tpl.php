<h1>Add a Resource</h1>

<div id="bodyPanel">

<?php if ($index == true) { ?>

Select a category below in which to add resources

<?php } ?>

<h3>Step 1: Select a resource category:</h3>

<ul id="subSubNav">
 <li><a href="add.php?id=1" title="Add resources to this category">Retractable Banners</a>&nbsp;&nbsp;|&nbsp;</li>
 <li><a href="add.php?id=2" title="Add resources to this category">Media Backdrops</a></li>
</ul>

<h3>Step 2: Add a resource into the "<?=$d['pageTitle']?>" category</h3>

<?php

session_start();
if (!empty($_SESSION['success']) && $_SESSION['success'] == 1) {
	$message = '<h3 class="message">Successfully entered.  Feel free to enter another below.</h3>';
}
session_destroy();

?>

<?=$message?>

<?=$d['body']['errorOnSubmission']?>

<?=$d['body']?>

</div>
