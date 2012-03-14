<?php

if (empty($d['rows'])) {
	$nothingCurrent = 'No current ';
} else {
	$nothingCurrent = '';
}

$html = '<h1>'.$nothingCurrent.$d['pageTitle'].'</h1>';
$html .= '<div class="viewSpacer1"></div>';

if (!empty($d['rows'])) {

	$html .= '<div class="viewSpacer2">'.$d['links'].'</div>';
	
	$html .= '<div class="viewSpacer3"></div>';
	
	$html .= '<table class="viewTable"><tr>';
	
	$i = 0;
	
	foreach($d['rows'] as $key => $value) {
		
		if ($i==0) {
		
			foreach ($value as $column => $fieldValue) {
			
				if ($column == 'fname') {
					$html .= '<th colspan="2"><a href="view.php?mode='.$d['mode'].'&amp;orderby='.$column.'&amp;sort='.$d['sort'].'">name</a></th>';
				} elseif ($column == 'parent_id') {
					$html .= '';
				} elseif ($column == 'lname') {
					$html .= '';
				} elseif ($column == 'email') {
					$html .= '';
				} elseif ($column == 'image') {
					$html .= '';
				} else {
					$html .= '<th><a href="view.php?mode='.$d['mode'].'&amp;orderby='.$column.'&amp;sort='.$d['sort'].'">'.$column.'</a></th>';	
				}			
			
			}
			
			$html .= '<th colspan="2" class="actions">actions</th>';
			
			$html .= '</tr>';
			
		}
		
		if ($i%2) {
			$bgcolor = 'e8e8e8';
		} else {
			$bgcolor = 'ccc';
		}
		
		$html .= '<tr>';
		
		foreach ($value as $column => $fieldValue) {
			
			if ($value['deleted'] == 1) {
				$deleted = 'yes';
			} else {
				$deleted = 'no';
			}
			if ($column == 'fname') {
				$html .= '<td style="background-color: #'.$bgcolor.';" colspan="2"><a href="mailto:'.$value['email'].'">'.$value['fname'].' '.$value['lname'].'</a></td>';
			} elseif ($column == 'lname') {
				$html .= '';
			} elseif ($column == 'parent_id') {
				$html .= '';
			} elseif ($column == 'email') {
				$html .= '';
			} elseif ($column == 'image') {
				$html .= '';
			} elseif ($column == 'title') {
				$html .= '<td style="background-color: #'.$bgcolor.'; font-weight: bold;"><a href="edit.php?id='.$value['id'].'&amp;mode='.$d['mode'].'" class="info">'.$fieldValue.'<span><img src="'.RESOURCE_IMAGES_FOLDER.$value['image'].'" width="75" height="113" alt="Resource photo" /></span></a></td>';
			} elseif ($column == 'description') {
				$html .= '<td style="background-color: #'.$bgcolor.'; text-align: left;">'.$fieldValue.'</td>';
			} elseif ($column == 'color') {
				$html .= '<td style="background-color: '.$fieldValue.'; font-weight: bold; color: #fff;">'.$fieldValue.'</td>';
			} elseif ($column == 'deleted') {
				$html .= '<td style="background-color: #'.$bgcolor.'; color: #000;">'.$deleted.'</td>';
			} else {			
				$html .= '<td style="background-color: #'.$bgcolor.';">'.$fieldValue.'</td>';
			}
		
		}
		
		$html .= '<td style="background-color: #'.$bgcolor.';" colspan="2">';
		
		if ($value['deleted'] == 0) {
			$html .= '<a href="edit.php?id='.$value['id'].'&amp;mode='.$d['mode'].'" class="edit_delete">edit</a>&nbsp;|&nbsp;';
		}
		if ($value['deleted'] == 1) {
			$delete_restore = '<a href="#" onclick="javascript:confirm_restore(\'restore.php?id='.$value['id'].'&amp;mode='.$d['mode'].'\'); return false;" class="edit_delete">restore</a>';
		} else {
			$delete_restore = '<a href="#" onclick="javascript:confirm_delete(\'delete.php?id='.$value['id'].'&amp;mode='.$d['mode'].'\'); return false;" class="edit_delete">delete</a>';
		}
		$html .= $delete_restore.'</td>';	
		$html .= '</tr>';
		
		$i++;
	
	}
	
	$html .= '</table>';
	$html .= '<div class="viewSpacer4">'.$d['links'].'</div>';
	
}

?>


<?=$html?>