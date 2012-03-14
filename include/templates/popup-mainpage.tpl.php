<?header('Content-Type: text/html; charset=utf-8');?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title><?=htmlentities($windowTitle,ENT_NOQUOTES,CHARSET)?> - UW Marketing - University of Washington</title>
<link href="<?=BASE_FOLDER?>include/rs.css" rel="stylesheet" type="text/css" />
</head>
<body id="popupBodyBG">
<div id="header">
 <div id="lgo"><img src="https://depts.washington.edu/coenv/header/w.gif" width="207" height="18" alt="UW wordmark graphic" /></div>
</div>

<div id="popupBody">
 <?=$pageBody?>
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