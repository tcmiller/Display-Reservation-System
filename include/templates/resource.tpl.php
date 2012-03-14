<div id="popupRscLftBlk">

<?php
foreach ($d['resource']['images'] as $key => $value) {
?>
	<img src="<?=RESOURCE_IMAGES_FOLDER?><?=$value['new_file']?>" alt="Resource image" /><div class="clear">&nbsp;</div>
<?php
}
?>

</div>
<div id="popupRscRghtBlk"><h1><?=$d['resource']['title']?></h1>
                          <?=$d['resource']['desc']?></div>

<div id="popupRscClsWdw"><a href="javascript: window.close();">close window</a></div>