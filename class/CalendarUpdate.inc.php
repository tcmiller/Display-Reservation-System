<?php
// Test for Updating Google Calendar

// Include files for extension
require_once('Zend/Loader.php');
Zend_Loader::loadClass('Zend_Gdata');
Zend_Loader::loadClass('Zend_Gdata_ClientLogin');
Zend_Loader::loadClass('Zend_Gdata_Calendar');
Zend_Loader::loadClass('Zend_Http_Client');

class CalendarUpdate extends Zend_Gdata_Calendar
{
    //Public Methods
    public $service;
    
    public function getAuth()
    {
        try
        {
            echo "<h1>Client</h1><pre>";
            print_r($this->client);
            echo "<h2>Authorization Token: " . $this->client->auth[1] . "</h2>";
            echo "</pre><hr /><h1>Service</h1><pre>";
            print_r($this->service);
            echo "</pre>";
            
            return 1;
        }
        catch ( Exception $e )
        {
            return $e->getMessage();
        }
    }

}
?>
