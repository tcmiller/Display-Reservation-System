<?php

/**
 * Resource.inc.php - Resource Class
 *
 * @name       - Resource.inc.php
 * @author     - Tim Chang-Miller <tcmiller@u.washington.edu>
 *
 * @package    - UW Marketing Resources
 * @subpackage - Mobile Display Reservation System
 */
	
// Replaces Calendar.inc.php

require_once('displays-db.inc.php');

define('NUM_BANNER_STANDS','5');
//define('NUM_TRIPOD_STANDS','8');
//define('FOOTBALL_SEASON_BEGIN','2010-09-10');
//define('FOOTBALL_SEASON_END','2010-11-16');

if (!class_exists('Resource')) {
	
	class Resource {
		
		// Available to the World
		public $id;
		public $googleInfo;
		public $localInfo;
		public $combinedInfo;
		public $imageInfo;
		public $googleCalendarID;
		public $googleTitle;
		public $googleColor;
		public $localTitle;
		public $seconds;
		public $daysInSeconds;
		public $error; // used if there is an error, otherwise null
		// Available only to Class
		private $mdb2; // should be protected maybe?
		private $res;
		private $pwd = 'replacewithpasswordwhenpushingtoproduction';
		private $client;
		private $calendarIDs = array('','uwbanners@gmail.com','uwmediabackdrop@gmail.com');
		public $bannerIDs = array('34','30','31','12','26','27','28','29');
		private $googleID;
		
		// query the database for a resource and its related info
		public function __construct($id) 
		{
			
			/**
			 * @see Zend_Loader
			 */
			require_once('Zend/Loader.php');
			
			/**
			 * @see Zend_Gdata
			 */
			Zend_Loader::loadClass('Zend_Gdata');
			
			/**
			 * @see Zend_Gdata_AuthSub
			 */
			Zend_Loader::loadClass('Zend_Gdata_AuthSub');
			
			/**
			 * @see Zend_Gdata_ClientLogin
			 */
			Zend_Loader::loadClass('Zend_Gdata_ClientLogin');
			
			/**
			 * @see Zend_Gdata_Calendar
			 */
			Zend_Loader::loadClass('Zend_Gdata_Calendar');
			
			/**
			 * Switch the ID from an integer input into a Google string
			 */
			 
			$this->googleID = $this->calendarIDs[$id];
			
			/**
			 * @return $this->client
			 */
			
			// TODO: pull this out of here

			$this->client = $this->getGoogleClient();
		} // end constructor

		/**
		 * connect - actually connects to the google calendar
		 * 
		 */
		private function connect()
		{
			try
			{
				// The assumption is if the client login fails then we don't have a connection to the calendar
				$this->client = Zend_Gdata_ClientLogin::getHttpClient($this->googleID, $this->pwd, 'cl');
				//$this->client = false;
			}
			catch (Exception $e)
			{
				session_start();
				//$this->error = 'Problem Obtaining Calender Client Object. Caught exception: '.$e->getMessage();
				$_SESSION['calendardown'] = 1; //$this->error;
			}
		}
		
		/**
		 * getGoogleClient - returns a valid $client object
		 * 
		 */
		public function getGoogleClient() 
		{
			$this->connect();
			// TODO: What should we return if the client is null??
			return $this->client;
		}
		
		/**
		 * setGoogleInfo() - Creates an array of Google Calendar info based on a parent calendar ID
		 *
		 * @param string $id
		 * 
		 * @return array $googleInfo
		 */
		public function setGoogleInfo($no_parent = false, $parent_only = false) 
		{
			try
			{
				$gdataCal = new Zend_Gdata_Calendar($this->client);
				$calFeed = $gdataCal->getCalendarListFeed();
			}
			catch (Exception $e)
			{
				$this->error = 'Problem Obtaining Calender Object. Caught exception: '.$e->getMessage();
			}
			
			if ($e)
			{				
				session_start();
				//$this->error = 'Problem Obtaining Calender Client Object. Caught exception: '.$e->getMessage();
				$_SESSION['calendardown'] = 1; // $this->error;
			}
			else
			{
				// Disabling the system by order of Dox 4/30/2010 - cheiland
                //$_SESSION['calendardown'] = 1;
                
			  	$googleInfo = array();
			
			  	foreach ($calFeed as $calendar) {
			
					// explode on the '/' and get the sixth value in the resulting array, our calendarID
					$calendarParts = explode('/',$calendar->id->text);
			
					$calendarID = $calendarParts[6];
			
					$googleInfo[$calendarID] = array('id'    => $calendarID,
					                                 'title' => $calendar->title->text,
					                                 'color' => $calendar->color->value,
					                                 'desc'  => $calendar->summary->text);
					
					$titles[] = $calendar->title->text;
			
			  	}
			  	
			  	// slice off the first array in the $calendarInfo array, since it's the parent calendar
				if ($no_parent == false) {
					$googleInfo = array_slice($googleInfo, 1);
				}
				
				// simply return the parent calendar info
				if ($parent_only == true) {
					$googleInfo = array_slice($googleInfo, 0, 1);
				}
				
			  	$this->googleInfo = $googleInfo;
			}		
			
		}
		
		public function getGoogleInfo($no_parent, $parent_only) {
			
			$this->setGoogleInfo($no_parent, $parent_only);
			return $this->googleInfo;
			
		}
		
		/**
		 * set the local information by getting it from the db
		 * 
		 * @param - $child int optional $child, ID which tells method to simply retrieve a single row of info for the given resource ID (child ID)
		 * 
		 * @todo figure out how to access the $mdb2 object without making it global
		 * @todo if the child id is set, figure out how to return a $localInfo[] array without keys like $localInfo, do it in a smarter way than you do it now
		 */
		public function setLocalInfo($child_id = false) {
			
			global $mdb2;
			
			if ($child_id == true && is_int($child_id)) {
				$where_clause = 'id';
				$where_id = $child_id;
			} else {
				$where_clause =  'parent_id';
				$where_id = $this->googleID;
			}
			
			$query = sprintf("SELECT * 
								FROM mktng_resources 
							   WHERE $where_clause = '%s' 
								 AND deleted_p = '0'
							ORDER BY sequence_id asc, title asc", $where_id);
			
			$localInfo = array();
			
			$localRes =& $mdb2->query($query);
			
			if (PEAR::isError($localRes)) {
			    die($localRes->getMessage());
			}
			
			if ($child_id == true && is_int($child_id)) {
			
				while ($row = $localRes->fetchRow(MDB2_FETCHMODE_ASSOC)) {
					
					$localInfo = $row;
					
				}
				
			} else {
				
				while ($row = $localRes->fetchRow(MDB2_FETCHMODE_ASSOC)) {
				
				$localInfo[] = $row;
				
				}
				
			}
			
			$this->localInfo = $localInfo;
			
		}
		
		public function getLocalInfo($child_id) {
			
			$this->setLocalInfo($child_id);
			return $this->localInfo;
			
		}
		
		/**
		 * setImageInfo - Sets an array of image information based on a given $resource_id
		 *
		 * @param string $resource_id - which resource ID should we return images for
		 * @param boolean $thumb_only - tells our setImageInfo function whether we just want the thumb or everything
		 * 
		 */
		public function setImageInfo($resource_id, $thumb_only) {
			
			global $mdb2;			
			$imageInfo = array();
			
			$optional_thumb_clause = '';
			
			if ($thumb_only == true) {
				$optional_thumb_clause = ' AND img_use = \'thumb\'';
			} else {
				$optional_thumb_clause = ' ';
			}

			$query = sprintf("SELECT * 
							    FROM mktng_images 
							   WHERE resource_id = '%s' 
							         $optional_thumb_clause 
							     AND deleted_p = '0'", $resource_id);

			// Perform Query
			$imageRes =& $mdb2->query($query);
			
			if (PEAR::isError($imageRes)) {
			    die($imageRes->getMessage());
			}
			
			while ($row = $imageRes->fetchRow(MDB2_FETCHMODE_ASSOC)) {
				
				$imageInfo[] = $row;
				
			}
			
			$this->imageInfo = $imageInfo;			
			
		}
		
		public function getImageInfo($resource_id, $thumb_only) {
			
			$this->setImageInfo($resource_id, $thumb_only);
			return $this->imageInfo;
			
		}
		
		/**
		 * setCombinedInfo() - set the combined info of google info, local info and image info
		 *
		 * @param boolean $thumb_only
		 * @param int $child_id
		 * 
		 * @return array $combinedInfo
		 * 
		 * @todo definitely need to clean up the $combinedInfo array, must be a better way that doesn't repeat so much
		 * 
		 */
		public function setCombinedInfo($thumb_only, $child_id) {
						
			$googleInfo = $this->getGoogleInfo($no_parent, $parent_only);
			$localInfo = $this->getLocalInfo($child_id);
			
			if ($child_id == true && is_int($child_id)) {
			
				$combinedInfo = array('id' => $localInfo['id'],
				                      'googleID' => $googleInfo[$localInfo['resource_id']]['id'],
				                      'title'    => $googleInfo[$localInfo['resource_id']]['title'],
				                      'color'    => $googleInfo[$localInfo['resource_id']]['color'],
				                      'parent_id' => $localInfo['parent_id'],
				                      'desc' => $localInfo['description'],
				                      'days_available' => $localInfo['days_available'],
				                      'images' => $this->getImageInfo($googleInfo[$localInfo['resource_id']]['id'],$thumb_only));					
				
			} else {
			
				foreach ($localInfo as $key => $value) {
					
					$combinedInfo[] = array('id'=>$value['id'],
					                        'googleID'=>$googleInfo[$value['resource_id']]['id'],
					                        'title'=>$googleInfo[$value['resource_id']]['title'],
				                            'color'=>$googleInfo[$value['resource_id']]['color'],
				                            'parent_id'=>$value['parent_id'],
				                            'desc' =>$value['description'],
				                            'days_available'=>$value['days_available'],
				                            'images'=>$this->getImageInfo($googleInfo[$value['resource_id']]['id'],$thumb_only));					
					
					
				}
			  	
			}
			
			$this->combinedInfo = $combinedInfo;
						
		}
		
		public function getCombinedInfo($thumb_only, $child_id) {
			
			$this->setCombinedInfo($thumb_only, $child_id);
			return $this->combinedInfo;
			
		}
		
		/**
		 * set the reservation information by getting it from the db
		 * 
		 * @param - $resource_id int, ID which tells method to simply retrieve a single row of info for the given resource ID
		 * @param - $resourceIDs array optional, array of IDs to retrieve a "set" of reservation information
		 * 
		 * @todo - figure out how to access the $mdb2 object without making it global 
		 * 
		 */
		public function setReservationInfo($resource_id = false, $resourceIDs = false) {
			
			global $mdb2;			
			$rsvnInfo = array();
			
			// check to see if we have an array of resource IDs
			if (!empty($resourceIDs) && is_array($resourceIDs)) {
				
				// format the array of IDs into a useable MySQL string
				foreach($resourceIDs as $key => $value) {
					
					$resourceIDstring .= '\''.$value.'\',';
				}				
				
				// chop off the final ','
				$resourceIDstring = substr($resourceIDstring,0,-1);
				
				// set our $where_clause var
				$where_clause = 'in('.$resourceIDstring.')';
			
			// we're not an array of IDs, rather a single resource ID
			} else {
				$where_clause = '= \''.$resource_id.'\'';
			}

			$query = sprintf("SELECT * 
							    FROM mktng_reservations 
							   WHERE resource_id %s 
							     AND deleted_p = '0'", $where_clause);
							
			$rsvnRes =& $mdb2->query($query);
			
			if (PEAR::isError($rsvnRes)) {
			    die($rsvnRes->getMessage());
			}
			
			while ($row = $rsvnRes->fetchRow(MDB2_FETCHMODE_ASSOC)) {
				
				$rsvnInfo[] = $row;
				
			}
			
			$this->rsvnInfo = $rsvnInfo;
			
		}
		
		public function getReservationInfo($resource_id = false, $resourceIDs = false) {
			
			$this->setReservationInfo($resource_id, $resourceIDs);
			return $this->rsvnInfo;
			
		}
		
		/**
		 * This method returns our Google Calendar parent ID based on an integer input
		 *
		 * @return string googleID
		 */
		public function getParentID() {
			return str_replace('@','%40',$this->googleID);			
		}
		
		/**
		 * This method returns our Google Calendar parent ID without the %40 symbol (encoded version)
		 *
		 * @return string $this->googleID
		 */
		public function getEncodedParentID() {
			return $this->googleID;			
		}
		
		/**
		 * convertDaysToSeconds() - Given a set number of days, return a number of seconds, good for timestamp comparison
		 * 
		 * @param int $days
		 *
		 * @return int $seconds
		 */
		public function convertDaysToSeconds($days) {
			
			$this->seconds = 86400*($days);
			
			return $this->seconds;
			
		}
		
		/**
		 * Given a resource id, find out if the resource is available
		 *
		 * @param int $resource_id
		 * 
		 * @return bool true/false
		 */
		public function not_available ($resource_id, $checkout, $checkin) {
			
			$rsvnInfo = $this->getReservationInfo($resource_id, false);
			
			// store each row decision in an $is_available array
			$is_available = array();
  
			foreach ($rsvnInfo as $key => $value) {
						
				// pretest		
				if (strtotime($checkout) < strtotime($value['check_out']) && strtotime($checkin) < strtotime($value['check_out'])) {

					//echo "this resource is available<br />";
					$is_available[] = 'yes';
		
				} else {
		
					// failed the pretest, do a post-test
					if (strtotime($checkout) > strtotime($value['check_in']) && strtotime($checkin) > strtotime($value['check_in'])) {
						
						//echo "this resource is available<br />";
						$is_available[] = 'yes';
						
					// failed both the pretest and post test, must be in the range somewhere
					} else {
						//echo "this resource is NOT available<br /><br />";
						$is_available[] = 'no';	
						
					}					
		
				}
				
			}
			
			// if we find 'no' in the $is_available, return true	
			if (in_array('no', $is_available)) {
				
				return true;
				
			} else {
				
				return false;
				
			}
			
		} // end is_available
		
		
		/**
		 * is_over_days_available() - for a particular resource, test to see if the number of days requested is greater than the number of days available
		 *
		 * @param int $resource_id
		 * @param string $checkout
		 * @param string $checkin
		 * @return boolean
		 */
		public function is_over_days_available ($resource_id, $checkout, $checkin) {
			
			$localInfo = $this->getLocalInfo($resource_id);
			
			$days_available_in_seconds = $this->convertDaysToSeconds($localInfo['days_available']);
			$days_requested_in_seconds = strtotime($checkin) - strtotime($checkout);
	
			if ($days_requested_in_seconds >= $days_available_in_seconds) {
				return true;
				
			} else {			
				return false;
			
			}
				
		} // end is_under_days_available
		
		
		/**
		 * in_future() - check to see if the checkout date is ahead of the checkin date (the checkout date should be < the checkin date, ideally)
		 *
		 * @param string $checkout
		 * @param  string $checkin
		 * @return boolean
		 */
		public function in_future ($checkout, $checkin) {
			
			if (strtotime($checkout) > strtotime($checkin)) {
				return true;
				
			} else {
				return false;
			
			}
			
		}
		
		/**
		 * is_banner_stand_available() - given a check_in, check_out date, determine whether a banner stand is available
		 * 
		 * @param string $checkout
		 * @param string $checkin
		 * 
		 * @return bool true/false
		 */
		public function is_banner_stand_available($checkout, $checkin, $num_requested) {
			
			$rsvnInfo = $this->getReservationInfo(false,$this->bannerIDs);
			
			//$num_checked_out=0;
			
			// loop through each reservation and check their reservation dates against existing reservation dates
			for ($i=0;$i<count($rsvnInfo);$i++) {
				
				// pretest		
				if (strtotime($checkout) < strtotime($rsvnInfo[$i]['check_out']) && strtotime($checkin) < strtotime($rsvnInfo[$i]['check_out'])) {

					//echo "this resource is available<br />";
		
				} else {
		
					// failed the pretest, do a post-test
					if (strtotime($checkout) > strtotime($rsvnInfo[$i]['check_in']) && strtotime($checkin) > strtotime($rsvnInfo[$i]['check_in'])) {
						
						//echo "this resource is available<br />";
						
					// failed both the pretest and post test, must be in the range, add to the $num_checked_out incrementor
					} else {
						
						//echo "this resource is NOT available<br />";
						//$num_checked_out++;	
						
					}					
		
				}
				
			}
			
			// if the checkout range is outside of football season, then 8 stands are available.... otherwise, only 6 are available for checkout
			// 4/14/2009: normally, 8 would be available during non-football season, but one of them is currently broken
			/*if ((strtotime($checkout) < strtotime(FOOTBALL_SEASON_BEGIN) && strtotime($checkin) < strtotime(FOOTBALL_SEASON_BEGIN)) || (strtotime($checkin) > strtotime(FOOTBALL_SEASON_END) && strtotime($checkout) > strtotime(FOOTBALL_SEASON_END))) {
				
				
				
			} else {
				
				define('NUM_BANNER_STANDS','6');
				
			}*/			
			
			// total number of resources must be calculated as the number checked out + the number requested in the current reservation
			//$total = $num_checked_out + $num_requested;
			
			echo 'num checked out: '.$num_checked_out.'<br />';
			echo 'num_requested: '.$num_requested.'<br />';
			echo 'total: '.$total;
			
			// if the number of stands checked out is equal to the number of stands available, then you can't check out any	fool!		
			if ($total > NUM_BANNER_STANDS) {
				return false;
			} else {
				return true;
			}
			
			
			
		} // end is_banner_stand_available()
	
	} // end class declaration
	
} // end class_exists

?>
