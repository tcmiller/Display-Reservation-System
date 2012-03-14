<div id="leftPanel">
 <img src="images/<?=$d['image']?>" width="<?=$d['width']?>" height="<?=$d['height']?>" alt="Resource photo" />
 <?php if (!empty($d['images'])) { ?>
 <?=$d['images']?>
 <?php } ?>
</div>
<?php 
switch ($d['buttonID']) {
	case "1":
		$btnWdth = 124;
		break;
	case "2":
		$btnWdth = 185;
		break;	
}
?>
<div id="rightPanel">
 <h1><?=$d['title']?></h1>
 <?=$d['body']?>
 <br />
 <div class="purple_border" style="width: <?=$btnWdth?>px;">
  <b class="bt">
   <b></b>
  </b>
  <a href="reserve/index.php?id=<?=$d['buttonID']?>"><?=$d['buttonText']?></a>
  <b class="bb">
   <b></b>
  </b>
 </div>
</div>