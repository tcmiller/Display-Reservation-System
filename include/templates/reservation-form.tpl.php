<div id="reservationWrapper">
<div id="calendarBlock">
<?php
session_start();

if (!empty($_SESSION['calendardown']) && $_SESSION['calendardown'] == 1)
{ // the calendar is down, oh no!
?>
<div id="calendarDownMsg">Google Calendar is currently experiencing technical difficulties. Please try again later.
<br />
<a href="http://calendar.google.com/" title="Google Calendar"><img src="../images/google_calendar_logo.jpg" width="140" height="49" alt="Google Calendar logo" /></a>
</div>
<?php
}
else
{ // the calendar is up and running, yeah! 
?>
<iframe src="https://www.google.com/calendar/embed?title=<?=$d['body']['parentCalendarTitle']?>&amp;height=800&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;<?=$d['body']['calendarURIstring']?>&amp;ctz=America%2FLos_Angeles" class="googleCalBorder" width="600" height="800" frameborder="0" scrolling="no"></iframe>
<?php
}
session_destroy();
?>
</div>
<div id="resvnFormBlock">

<ul id="rsvnNav">
 <li><span>Reserve a:</span></li>
 <?=$d['body']['rsvnNavHTML']?>
</ul>

<?php
session_start();
if (!empty($_SESSION['success']) && $_SESSION['success'] == 1) {
	$message = '<div class="message">Thank you for your reservation: Feel free to find it in the calendar to the left.<br /><br />A confirmation email with reservation details was just sent and should arrive shortly in your inbox.</div>';
}
session_destroy();
?>

<? echo $message; ?>

<?php if (RESERVATION_SWITCH == 'on') { ?>

	<?=$d['body']['errorOnSubmission']?>
<form <?=$d['form']['attributes']?> onsubmit="disable(this)">
    <fieldset>
        <div class="blue_border">
         <b class="at">
          <b></b>
	     </b>
	     <span class="steps">Personal Information</span>
	     <b class="aa">
	      <b></b>
	     </b>
	    </div>
	    <div class="clear">&nbsp;</div>
        <?=$d['form']['hiddenItems']?>

        <table border="0">
         <tr>
          <td class="labelsCol"><span class="required">*</span><label for="fname"><?=$d['form']['items']['fname']['label']?></label></td>
          <td class="fieldsCol"><?=$d['form']['items']['fname']['html']?>
          						<?=(!empty($d['form']['errors']['fname']) ? '<br /><span class="formError">'.$d['form']['errors']['fname'].'</span>' : '')?></td>
         </tr>
         <tr>
          <td colspan="2"><div class="formSpacer"></div></td>
         </tr>
         <tr>
          <td class="labelsCol"><span class="required">*</span><label for="lname"><?=$d['form']['items']['lname']['label']?></label></td>
          <td class="fieldsCol"><?=$d['form']['items']['lname']['html']?>
                				<?=(!empty($d['form']['errors']['lname']) ? '<br /><span class="formError">'.$d['form']['errors']['lname'].'</span>' : '')?></td>
         </tr>
         <tr>
          <td colspan="2"><div class="formSpacer"></div></td>
         </tr>
         <tr>
          <td class="labelsCol"><span class="required">*</span><label for="email"><?=$d['form']['items']['email']['label']?></label></td>
          <td class="fieldsCol"><?=$d['form']['items']['email']['html']?>
                				<?=(!empty($d['form']['errors']['email']) ? '<br /><span class="formError">'.$d['form']['errors']['email'].'</span>' : '')?></td>
         </tr>
         <tr>
          <td colspan="2"><div class="formSpacer"></div></td>
         </tr>
         <tr>
          <td class="labelsCol"><span class="required">*</span><label for="phone"><?=$d['form']['items']['phone']['label']?></label></td>
          <td class="fieldsCol"><?=$d['form']['items']['phone']['html']?> <span class="formNote">(e.g. 123-456-7890)</span>
                				<?=(!empty($d['form']['errors']['phone']) ? '<br /><span class="formError">'.$d['form']['errors']['phone'].'</span>' : '')?></td>
         </tr>
        </table>
	</fieldset>
	<fieldset>
	 <div class="blue_border">
         <b class="at">
          <b></b>
	     </b>
	     <span class="steps">Reservation Information</span>
	     <b class="aa">
	      <b></b>
	     </b>
	    </div>
	    <div class="clear">&nbsp;</div>
	    <table border="0">
         <tr>
	      <td class="labelsCol"><span class="required">*</span><label for="check_out"><?=$d['form']['items']['check_out']['label']?></label></td>
	      <td class="fieldsCol"><?=$d['form']['items']['check_out']['html']?><img src="../images/calendar.gif" class="cal-cursor" alt="Calendar icon" id="trigger_out_icon" onmouseover="this.style.cursor='pointer'" onmouseout="this.style.cursor='default'" border="0" />	      
	<script type="text/javascript">//<![CDATA[
     var cal = new Zapatec.Calendar({
        lang              : "en",
     	theme             : "winter",
     	showEffectSpeed   : 10,
     	hideEffectSpeed   : 10,
        showOthers        : true,
        step              : 1,
        electric          : false,
        inputField        : "check_out",
        button            : "trigger_out_field",
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
        inputField        : "check_out",
        button            : "trigger_out_icon",
        ifFormat          : "%Y-%m-%d",
        daFormat          : "%Y/%m/%d"
      });
    //]]></script>
    <?=(!empty($d['form']['errors']['check_out']) ? '<br /><span class="formError">'.$d['form']['errors']['check_out'].'</span>' : '')?></td>
	     </tr>
	     <tr>
          <td colspan="2"><div class="formSpacer"></div></td>
         </tr>
	     <tr>
	      <td class="labelsCol"><span class="required">*</span><label for="check_in"><?=$d['form']['items']['check_in']['label']?></label></td>
	      <td class="fieldsCol"><?=$d['form']['items']['check_in']['html']?><img src="../images/calendar.gif" class="cal-cursor" alt="Calendar icon" id="trigger_in_icon" onmouseover="this.style.cursor='pointer'" onmouseout="this.style.cursor='default'" border="0" />
    <script type="text/javascript">//<![CDATA[
     var cal = new Zapatec.Calendar({
        lang              : "en",
     	theme             : "winter",
     	showEffectSpeed   : 10,
     	hideEffectSpeed   : 10,
        showOthers        : true,
        step              : 1,
        electric          : false,
        inputField        : "check_in",
        button            : "trigger_in_field",
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
        inputField        : "check_in",
        button            : "trigger_in_icon",
        ifFormat          : "%Y-%m-%d",
        daFormat          : "%Y/%m/%d"
      });
    //]]></script><?=(!empty($d['form']['errors']['check_in']) ? '<br /><span class="formError">'.$d['form']['errors']['check_in'].'</span>' : '')?></td>
	     </tr>
        </table>

	<div class="clear" id="resourceBlkSpacer"></div>
	<div id="resourceContainer">

	 <table border="0" id="resBlk">
	  <tr>
	  <?php

	  $i = 1;
	  $columns = 2;

	  $count = count($d['form']['items']['resource']['elements']);

	  if ($count < $columns) {
	  	$columns = $count;
	  }

        foreach ($d['form']['items']['resource']['elements'] as $key => $value) { ?>

        <td class="resCell">
        	  <table border="0" cellpadding="0" cellspacing="0" class="indRes">
        	   <tr>
        	    <td class="checkbox"><?=$value['html']?></td>
        	    <td class="image"><label for="resource<?=$d['body']['extraHTML'][$i]['resource_id']?>"><?=$d['body']['extraHTML'][$i]['link']?></label>
        	        <br />
        	        <?=$d['body']['extraHTML'][$i]['thumb'];?>
        	    </td>
        	   </tr>
        	   <tr>
        	    <td colspan="2" class="resLimit">reservation limit: <?=$d['body']['extraHTML'][$i]['days'];?> days</td>
        	   </tr>
        	   <?php if ($d['body']['extraHTML'][$i]['resource_id'] == 1 || $d['body']['extraHTML'][$i]['resource_id'] == 2 || $d['body']['extraHTML'][$i]['resource_id'] == 3 || $d['body']['extraHTML'][$i]['resource_id'] == 4 || $d['body']['extraHTML'][$i]['resource_id'] == 36) { ?>
        	     <tr>
        	      <td colspan="2" class="standNote">Note: Stand not included.  Please select one from above.</td>
        	     </tr>
        	   <?php } ?>
        	  </table>
        	 </td>

        	 <?php

        	 if (($i % $columns) == 0) { ?>
			        </tr><tr>
			    <?php }

			    $i++;

         }   ?>

	  </tr>
	 </table>

	</div>

	<?=(!empty($d['form']['errors']['resource']) ?
	'<table border="0">
	 <tr>
      <td><span class="formError">'.$d['form']['errors']['resource'].'</span></td>
	 </tr>
	</table>' : '') ?>

	<div id="resourceBlkSpacerBottom"></div>

	 <table border="0">
      <tr>
       <td class="labelsCol"><span class="required">*</span><label for="location"><?=$d['form']['items']['location']['label']?></label></td>
       <td class="fieldsCol"><?=$d['form']['items']['location']['html']?> <span class="formNote">(e.g. Odegaard 220)</span>
                		     <?=(!empty($d['form']['errors']['location']) ? '<br /><span class="formError">'.$d['form']['errors']['location'].'</span>' : '')?></td>
      </tr>
      <tr>
       <td colspan="2"><div class="formSpacer"></div></td>
      </tr>
      <tr>
       <td class="labelsCol"><span class="required">*</span><label for="department"><?=$d['form']['items']['department']['label']?></label></td>
       <td class="fieldsCol"><?=$d['form']['items']['department']['html']?>
                		     <?=(!empty($d['form']['errors']['department']) ? '<br /><span class="formError">'.$d['form']['errors']['department'].'</span>' : '')?></td>
      </tr>
      <tr>
       <td colspan="2"><div class="formSpacer"></div></td>
      </tr>
      <tr>
       <td class="labelsCol"><span class="required">*</span><label for="budget_num1"><?=$d['form']['items']['budget_num1']['label']?></label></td>
       <td class="fieldsCol"><?=$d['form']['items']['budget_num1']['html']?>-<?=$d['form']['items']['budget_num2']['html']?> <span class="formNote">(e.g. 12-3456)</span>
                		     <?=(!empty($d['form']['errors']['budget_num1']) ? '<br /><span class="formError">'.$d['form']['errors']['budget_num1'].'</span>' : '')?></td>
      </tr>
      <tr>
       <td colspan="2"><div class="formSpacer"></div></td>
      </tr>
      <tr>
       <td class="labelsCol"><label for="notes"><?=$d['form']['items']['notes']['label']?></label></td>
       <td class="fieldsCol"><?=$d['form']['items']['notes']['html']?>
                		     <?=(!empty($d['form']['errors']['notes']) ? '<br /><span class="formError">'.$d['form']['errors']['notes'].'</span>' : '')?></td>
      </tr>
      <tr>
       <td colspan="2"><div class="formSpacer"></div></td>
      </tr>
      <tr>
       <td class="labelsCol"><label for="agreement"><?=$d['form']['items']['agreement']['label']?></label></td>
       <td class="fieldsCol"><?=$d['form']['items']['agreement']['html']?>
                		     <?=(!empty($d['form']['errors']['agreement']) ? '<br /><span class="formError">'.$d['form']['errors']['agreement'].'</span>' : '')?></td>
      </tr>
      <tr>
       <td class="labelsCol">&nbsp;</td>
       <td class="fieldsCol"><?=$d['form']['items']['submit']['html']?></td>
      </tr>
      <tr>
       <td class="labelsCol">&nbsp;</td>
       <td class="fieldsCol" id="requiredFieldsNote"><span class="required">*</span> denotes required field</td>
      </tr>
     </table>

     </fieldset>

	</form>
	
<?php } else {

	echo '<div style="clear: both; margin: 24px 14px 0 14px; color: #39275b;">The reservation system is currently offline for maintenance, but should return soon.  Thanks!</div>';

} ?>

</div>
</div>
