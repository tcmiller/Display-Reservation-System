<?header('Content-Type: text/html; charset=utf-8');?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title><?=htmlentities($windowTitle,ENT_NOQUOTES,CHARSET)?> - High-Impact Displays - UW Marketing - University of Washington</title>
<link href="<?=BASE_FOLDER?>include/rs.css" rel="stylesheet" type="text/css" />
<?php if(!empty($extra_stylesheet)) { ?>
<link href="<?=$extra_stylesheet?>" rel="stylesheet" type="text/css" />
<?php } ?>
<?php if(!empty($extra_stylesheet2)) { ?>
<link href="<?=$extra_stylesheet2?>" rel="stylesheet" type="text/css" />
<?php } ?>
<?php if(!empty($extra_js)) { ?>
<script type="text/javascript" src="<?=$extra_js?>"></script>
<?php } ?>
<script type="text/javascript">
function launch(newURL, newName, newFeatures, orgName) {
  var remote = open(newURL, newName, newFeatures);
  if (remote.opener == null)
    remote.opener = window;
  remote.opener.name = orgName;
  remote.focus();
  return remote;
}

</script>

<?php

/**
 * curlRequestGenerator - returns a particular CURL resource, based on some inputs
 *
 * @param string $url
 */
function curlRequestGenerator($url) {

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'http://depts.washington.edu/uweb/inc/'.$url);
	curl_setopt($ch, CURLOPT_HEADER, false);
	curl_exec($ch);
	curl_close($ch);

}

?>

<link rel="stylesheet" href="https://depts.washington.edu/uweb/inc/css/header.css" type="text/css" />
<link rel="stylesheet" href="https://depts.washington.edu/uweb/inc/css/footer.css" type="text/css" />
<link rel="stylesheet" href="https://depts.washington.edu/uweb/inc/css/print.css" type="text/css" media="print" />
<script type="text/javascript">// clear out the global search input text field
    function make_blank() {if(document.uwglobalsearch.q.value == "Search the UW") {document.uwglobalsearch.q.value = "";}}
</script>

<?php if (!empty($extra_inline_css)) { echo $extra_inline_css; } ?>
<?php if (!empty($extra_inline_js)) { echo $extra_inline_js; } ?>

</head>
<body>

<?php

curlRequestGenerator('header.cgi?i=displays');

?>

<div id="centered">
 <div id="subheader"><a href="<?=FULL_URL?>index.php" title="High-Impact Displays Home"></a></div>
 <div id="content">
  <?php
  echo buildSubNav(curPageURL());
  ?>
  <div class="clear">&nbsp;</div>
  <?=$pageBody?>
  <div class="clear">&nbsp;</div>
 </div>
</div>

<div id="footerMainNoPatch" class="logoYes wNo">
 <div id="footerLeft">
  <ul>
   <li class="logoArea"><a href="http://www.washington.edu/">&#169; 2010 University of Washington</a></li>
  </ul>
 </div>
 <div id="footerRight">
  <ul>
   <li class="centerText"><a href="http://www.seattle.gov/">Seattle, Washington</a></li>
  </ul>
 </div>
 <div id="footerCenter">
  <ul>
   <li><a href="http://www.washington.edu/home/siteinfo/form/">Contact Us</a></li>
   <li class="footerLinkBorder"><a href="http://www.washington.edu/jobs/">Jobs</a></li>
   <li class="footerLinkBorder"><a href="http://myuw.washington.edu/">My UW</a></li>
   <li class="footerLinkBorder"><a href="http://www.washington.edu/online/privacy/">Privacy</a></li>
   <li class="footerLinkBorder"><a href="http://www.washington.edu/online/terms/">Terms</a></li>
  </ul>
 </div>
</div>

<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
var pageTracker = _gat._getTracker("UA-1629512-3");
pageTracker._trackPageview();
</script>

</body>
</html>