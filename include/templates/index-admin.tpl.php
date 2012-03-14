<div id="bodyPanel">

<!--<img src="../images/up-arrow.jpg" width="10" height="14" alt="Up arrow graphic" id="arrowGraphic" />Welcome to the Admin section for the Display Reservation System.  Use the navigation bar above to start managing the Reservation System.-->

<div id="adminPanel">
 <div class="lftAdmn">
  <h2>Current reservations</h2>
  
  <?php if (!empty($d['previous']) && is_array($d['previous'])) { ?>
 	  
  <h3>Previous <?php echo DAYS_FROM_TODAY_FOR_RESERVATIONS; ?> days:</h3>
  
  <ul>
  <?php $date = date('Y-m-d',strtotime("now")); ?>
  
  <?php foreach ($d['previous'] as $key => $value) {  

  	$delete_restore = '<a href="#" onclick="javascript:confirm_delete(\'delete.php?id='.$value['id'].'&amp;mode=reservation\'); return false;" class="edit_delete">delete</a>';
  	
  ?>

  <?php
  
  if ($value['check_out'] == $date) {
  	
  	echo '<li><a href="mailto:'.$value['email'].'">'.$value['fname'].' '.$value['lname'].'</a> - '.$value['title'].'&nbsp;&nbsp;(<a href="edit.php?id='.$value['id'].'&mode=reservation" title="Edit this reservation">edit</a> | '.$delete_restore.')</li>';
  	
  } else {
  	
  	echo '</ul><h4>'.$value['check_out'].'</h4><ul>';
  	echo '<li><a href="mailto:'.$value['email'].'">'.$value['fname'].' '.$value['lname'].'</a> - '.$value['title'].'&nbsp;&nbsp;(<a href="edit.php?id='.$value['id'].'&mode=reservation" title="Edit this reservation">edit</a> | '.$delete_restore.')</li>';
  	$date = $value['check_out'];
  	
  }
  
  ?> 
    
  <?php } ?>
 	  
  </ul>
  
  <?php } ?>
  
  <?php if (!empty($d['today']) && is_array($d['today'])) { ?>
 	  
  <h3>Today:</h3>
  <ul>
  
  <?php foreach ($d['today'] as $key => $value) {

$delete_restore = '<a href="#" onclick="javascript:confirm_delete(\'delete.php?id='.$value['id'].'&amp;mode=reservation\'); return false;" class="edit_delete">delete</a>';

?>

   <?php echo '<li><a href="mailto:'.$value['email'].'">'.$value['fname'].' '.$value['lname'].'</a> - '.$value['title'].'&nbsp;&nbsp;(<a href="edit.php?id='.$value['id'].'&mode=reservation" title="Edit this reservation">edit</a> | '.$delete_restore.')</li>'; ?>
   
  <?php } ?>
  
  </ul>
  
  <?php } ?>
  
  
  <?php if (!empty($d['tomorrow']) && is_array($d['tomorrow'])) { ?>
 	  
  <h3>Tomorrow:</h3>
  <ul>
  
  <?php foreach ($d['tomorrow'] as $key => $value) {

$delete_restore = '<a href="#" onclick="javascript:confirm_delete(\'delete.php?id='.$value['id'].'&amp;mode=reservation\'); return false;" class="edit_delete">delete</a>';

?>

   <?php echo '<li><a href="mailto:'.$value['email'].'">'.$value['fname'].' '.$value['lname'].'</a> - '.$value['title'].'&nbsp;&nbsp;(<a href="edit.php?id='.$value['id'].'&mode=reservation" title="Edit this reservation">edit</a> | '.$delete_restore.')</li>'; ?>
   
  <?php } ?>
 	  
  </ul>
  
  <?php } ?>
  
  <?php if (!empty($d['other']) && is_array($d['other'])) { ?>
 	  
  <h3>Next <?php echo DAYS_FROM_TODAY_FOR_RESERVATIONS; ?> days:</h3>
  
  <ul>
  <?php $date = date('Y-m-d',strtotime("now")); ?>
  
  <?php foreach ($d['other'] as $key => $value) {
  	
  	$delete_restore = '<a href="#" onclick="javascript:confirm_delete(\'delete.php?id='.$value['id'].'&amp;mode=reservation\'); return false;" class="edit_delete">delete</a>';
  	
  	?>

  <?php
  
  if ($value['check_out'] == $date) {
  	  	
  	echo '<li><a href="mailto:'.$value['email'].'">'.$value['fname'].' '.$value['lname'].'</a> - '.$value['title'].'&nbsp;&nbsp;(<a href="edit.php?id='.$value['id'].'&mode=reservation" title="Edit this reservation">edit</a> | '.$delete_restore.')</li>';
  	
  } else {
  	
  	echo '</ul><h4>'.$value['check_out'].'</h4><ul>';
  	echo '<li><a href="mailto:'.$value['email'].'">'.$value['fname'].' '.$value['lname'].'</a> - '.$value['title'].'&nbsp;&nbsp;(<a href="edit.php?id='.$value['id'].'&mode=reservation" title="Edit this reservation">edit</a> | '.$delete_restore.')</li>';
  	$date = $value['check_out'];
  	
  }
  
  ?> 
    
  <?php } ?>
 	  
  </ul>
  
  <?php } ?>
 
 </div>
 <div class="rhtAdmn">
 <h2>Search for a reservation</h2>
 
 <form name="search" id="search" onsubmit="return false;">
  <div id="selectContainer">
   Search by...
   <select name="type" id="type" onchange="callDatePicker(this.value);">
    <option value="fname">First name</option>
    <option value="lname">Last name</option>
    <option value="department">Department</option>
    <option value="check_out">Check out date</option>
   </select>
  </div>
  <div id="queryContainer"><input type="text" name="query" id="query" />
   <div id="tp_toggle"><input type="radio" name="tp" id="tp" value="prsnt-ftre" />Current&nbsp;&nbsp;<input type="radio" name="tp" id="tp" value="all" />All</div>
  </div>
  <div id="calendarContainer"><input type="text" name="cal" id="cal" />
   <img src="../images/calendar.gif" class="cal-cursor" width="18" height="13" alt="Calendar icon" id="calendar_icon" onmouseover="this.style.cursor='pointer'" onmouseout="this.style.cursor='default'" border="0" />
    <script type="text/javascript">//<![CDATA[
     var cal = new Zapatec.Calendar({
        lang              : "en",
     	theme             : "winter",
     	showEffectSpeed   : 10,
     	hideEffectSpeed   : 10,
        showOthers        : true,
        step              : 1,
        electric          : false,
        inputField        : "cal",
        button            : "calendar_icon",
        ifFormat          : "%Y-%m-%d",
        daFormat          : "%Y/%m/%d"
      });
    //]]></script>
    <script type="text/javascript">//<![CDATA[
     var cal = new Zapatec.Calendar({
        lang              : "en",
     	theme             : "winter",
     	showEffectSpeed   : 10,
     	hideEffectSpeed   : 10,
        showOthers        : true,
        step              : 1,
        electric          : false,
        inputField        : "cal",
        button            : "cal",
        ifFormat          : "%Y-%m-%d",
        daFormat          : "%Y/%m/%d"
      });
    //]]></script>
  </div>
  <div id="submitContainer">
   <input type="submit" value="Go" onClick="sendRequest()" />
  </div>
</form>


<div id="clearForm">&nbsp;</div>
  
  <div id="results"></div>

<h2>Reservations via Excel</h2>
 
<form name="excel" id="excel" method="post" action="excel.php">
 <input type="submit" value="Download" />
</form>

 </div>
</div>

</div>