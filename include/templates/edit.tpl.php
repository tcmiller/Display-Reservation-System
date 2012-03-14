<h1><?=$d['pageTitle']?></h1>

<div id="editLeftPanel">

<?php
session_start();
if (!empty($_SESSION['success']) && $_SESSION['success'] == 1) {
	$message = '<h3 class="message">Update successful.</h3>';
}
session_destroy();
?>

<?=$message?>

<?=$d['body']['errorOnSubmission']?>

<?php if (!empty($d['mode']) && $d['mode'] == 'reservation') { ?>
<h2><?=$d['rsvnData']['title']?></h2>
<span class="rsvnDateTxt">
Reservation created on: <strong><?=$d['rsvnData']['created_on']?></strong>
<br />
Reservation last modified on: <strong><?=$d['rsvnData']['modified_on']?></strong>
</span>
<br />
<br />
<?php } ?>

<?=$d['body']?>

</div>

<div id="editRightPanel">
<?php if (!empty($d['mode']) && $d['mode'] == 'reservation') { ?>
	<img src="<?=RESOURCE_IMAGES_FOLDER?><?=$d['rsvnData']['image']?>" width="75" height="113" alt="Resource photo" />
<?php } ?>
</div>