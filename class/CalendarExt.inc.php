<?php
/**
 * CalendarExt.inc.php - CalendarExt Class
 *
 * @name       - CalendarExt.inc.php
 * @author     -  Chris Heiland <cheiland@u.washington.edu>
 *
 * @package    - UW Marketing Resources
 * @subpackage - Mobile Display Reservation System
 * 
 * Summary; Calendar Extention - provides methods to update
 * the Title and the Color of a given Google Calendar based on 
 * the URL (ID)
 *
 * Synopsys: 
 * $calendar = new CalendarExt('uwbanners@gmail.com'); //Email of parent calendar
 * $calendar->connect('http://www.google.com/calendar/feeds/default/owncalendars/full/uwbanners%40gmail.com'); // This would be whatever calendar id you want to update
 * $calendar->title('New Title');
 * $calendar->color('#FFFFFF');
 * $calendar->save(); 
 */

class CalendarExt
{
    // To make this work we will need the email address of the calendar
    // and the calendar ID - once we have those we can set the title and
    // the color.

    //Public Methods
    public $strEmail;
    public $strColor;
    public $strTitle;
    //These last two are public but not advertised, should not
    //need them unless something goes horribly wrong
    //public $strResult;
    public $arrEventLog = array(); // Result log

    //Private Methods
    private $_strToken; // Authorization token returned by Google post authentication
    private $_strRawCalendarXML; // XML used to update Event
    private $_strCalendar; // Calendar Object (SimpleXML)
    private $_strCalendarID; // Full URL of the Calendar to Update
    private $_strCalendarEditURL; // URL to Edit the Calendar
    private $_strAuthHeader; //used to store the authorization string parsed by gsession
    
    function __construct($strEmail)
    {
        // Load up the ID to authenticate with
        $this->strEmail = $strEmail;
    }

    // Authenticate to the Google Calendar Service via ClientLogin
    public function connect($strCalendarID)
    {
        // We have the Calendar ID, grab the authToken and get the XML 
        // from the existing calendar
        $this->_strCalendarID = $strCalendarID;
        $this->authToken();
        $this->getCalendar();
        $this->getEditURL();
    }
    
    // Starts the save process
    public function save()
    {
        // Create the XML used to send to the calendar, grab the URL to send
        // the  PUT request to, send the PUT request and grab the session ID
        // Since we have the session ID, we can send the PUT request to the 
        // new location and cross our fingers it will work
        $this->sendPut($this->_strCalendarEditURL);
        $strLocation = CalendarExt::gsession($this->_strAuthHeader);
        $this->sendPut($strLocation, true);
    }
    
    //status - upon a successful update the google calendar service returns XML,
    //if we can parse whatever we get back as XML, then we assume everything
    //went fine, otherwise we return the exception plus the raw result
    public function status()
    {
        try
        {
            $strFinal = simplexml_load_string($this->strResult);
        }
        catch (Exception $e)
        {
            return 'Caught exception: ' .  $e->getMessage() . 
            '. Event Log: ' . var_dump($this->arrEventLog);
        }
        
        return 'Success';
    }

    //findIT - search for a specific pattern in a block of text
    private static function findIt($strPattern, $strContent)
    {
        $arrResult = array();
        
        preg_match($strPattern, $strContent, $arrResult);

        return $arrResult[1];
    }

    //gsession  - parses out the Location to send the PUT request to for updating events
    private static function gsession($strAuthHeader)
    {
        $strLocation = CalendarExt::findIt('/.*Location\:\s(.*)[\n\r]/', $strAuthHeader);
        
        return chop( $strLocation );
    }

    //title - sets the Title of the Calendar
    public function title($strTitle)
    {
        $this->strTitle = $strTitle;
    }
    
    //color - sets the color of the Calendar
    public function color($strColor)
    {
        $this->strColor = $strColor;
    }
    
    //authToken - get authorization token based on Calendar ID (email)
    private function authToken()
    {
        $strURL            = 'https://www.google.com/accounts/ClientLogin'; // URL to send request login to
        $strEmail          = $this->strEmail;
        $strPaswd          = 'replacewithwhatsonproduction'; // Same Password used for all google accounts
        $strSource         = 'UW-ResourceApp-0.5'; // Completely made up and passed to Google
        $strService        = 'cl'; // Calendar Service
        $strAccountType    = 'HOSTED_OR_GOOGLE'; // Needed to explain what type of account is passed
        
        $arrPostFields = array(
                        'accountType'   => $strAccountType,
                        'Email'         => utf8_encode($strEmail), // Encode for POST
                        'Passwd'        => utf8_encode($strPaswd), // Encode for POST
                        'source'        => $strSource,
                        'service'       => $strService
                       );

        $arrCurlOptions = array(
            CURLOPT_POST            => TRUE,
            CURLOPT_URL             => $strURL,
            CURLOPT_POSTFIELDS      => $arrPostFields,
            CURLOPT_RETURNTRANSFER  => 1,
            CURLOPT_CONNECTTIMEOUT  => 20,
            CURLOPT_USERAGENT       => 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11'
            );

        $ch = curl_init();    // Initialize a CURL session. 
        curl_setopt_array($ch, $arrCurlOptions);
        
        $strRawAuth = curl_exec($ch); // grab URL and pass it to the variable.
        curl_close($ch); // close curl resource, and free up system resources.
        array_push($this->arrEventLog, $strRawAuth);
        
        $this->_strToken = CalendarExt::findIt('/.*Auth=(.*)$/', $strRawAuth);
    }
    
    // getCalendar based on Authorization Token
    // sets SimpleXML Object with Calendar Data
    private function getCalendar()
    {
        $strURL        = $this->_strCalendarID ? $this->_strCalendarID : 'http://www.google.com/calendar/feeds/default/owncalendars/full';
        $arrHeaders    = array('Authorization: GoogleLogin auth='.$this->_strToken);

        $arrCurlOptions = array(
            CURLOPT_RETURNTRANSFER => 1, // Return Page contents.
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11',
            CURLOPT_URL => $strURL,
            CURLOPT_FOLLOWLOCATION => TRUE,
            CURLOPT_HTTPHEADER => $arrHeaders,
            CURLOPT_HEADER => FALSE
            );
        
        $ch = curl_init();    // Initialize a CURL session.
        curl_setopt_array($ch, $arrCurlOptions);
        
        $strRawCalendarXML = curl_exec($ch);
        //$this->strResult .= $strRawCalendarXML;
        curl_close($ch); // close curl resource, and free up system resources.
        array_push($this->arrEventLog, $strRawCalendarXML);
        $this->_strCalendar = simplexml_load_string($strRawCalendarXML);
    }

    //createCalendarXML - takes XML event object, updates event based on parameters, returns simpleXMLelement
    //we only need to submit the XML to the parts we are changing
    private function createCalendarXML()
    {
        $strTitle = $this->strTitle;
        $strColor = $this->strColor;
    
        $this->_strRawCalendarXML = '<entry xmlns=\'http://www.w3.org/2005/Atom\' '.
        'xmlns:gCal=\'http://schemas.google.com/gCal/2005\' '.
        'xmlns:gd=\'http://schemas.google.com/g/2005\'>'.
        '<id>'.$this->_strCalendar->id.'</id>'.
        ($strTitle ? "<title type='text'>$strTitle</title>" : '').
        ($strColor ? "<gCal:color value='$strColor'/>" : '').
        '<gCal:selected value=\'true\'/>'.
        '</entry>';
    }

    //getEditURL - grabs the edit url from the event XML object
    private function getEditURL()
    {
        foreach ($this->_strCalendar->link as $strLink)
        {
            if ($strLink->attributes()->rel == 'edit')
                $this->_strCalendarEditURL = $strLink->attributes()->href;
        }
    }
    
    
    //sendPut - takes edit url and sends PUT request to google for event details
    //presented in XML
    // Notes: This function runs twice, the first time we grab the session id passed
    // back as a redirect to a new location, the second time we use the new location
    // and send the PUT request there.
    // Both times we send the entire payload XML file - this is probably less effecient 
    // than it could be but we have to make a PUT request both times
    private function sendPut($strURL, $boolData = false)
    {
        if ($boolData)
            $this->createCalendarXML();
        // If the data flag is set, then send the data, otherwise don't
        // Mostly this is here for performance reasons
        $_strRawCalendarXML = $boolData ? $this->_strRawCalendarXML : '';
            
        $fh = fopen('php://memory', 'r');
        fwrite($fh, $_strRawCalendarXML);
        rewind($fh);
        $strLength = strlen($_strRawCalendarXML);            
        
        $arrHeaders  = array(
                    'Content-Type: application/atom+xml',
                    'Authorization: GoogleLogin auth='.$this->_strToken
                    );

        $arrCurlOptions = array(
            CURLOPT_INFILE          => $fh,
            CURLOPT_INFILESIZE      => $strLength,
            CURLOPT_PUT             => TRUE,
            CURLOPT_URL             => $strURL,
            CURLOPT_RETURNTRANSFER  => 1,
            CURLOPT_CONNECTTIMEOUT  => 20,
            CURLOPT_USERAGENT       => 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11',
            CURLOPT_HTTPHEADER      => $arrHeaders,
            CURLOPT_HEADER          => TRUE
            );

        $ch = curl_init();    // Initialize a CURL session.
        curl_setopt_array($ch, $arrCurlOptions);

        // Run twice, this is only needed the firsttime
        $this->_strAuthHeader = curl_exec($ch);
        array_push($this->arrEventLog, $this->_strAuthHeader);
        
        fclose($fh); // start the closing of resources
        curl_close($ch); // close curl resource, and free up system resources.
    }
    
}
?>
