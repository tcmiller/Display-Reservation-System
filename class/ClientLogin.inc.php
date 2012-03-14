<?php

// Include files for extension
require_once('Zend/Loader.php');
Zend_Loader::loadClass('Zend_Gdata');
Zend_Loader::loadClass('Zend_Gdata_ClientLogin');
Zend_Loader::loadClass('Zend_Gdata_Calendar');
Zend_Loader::loadClass('Zend_Http_Client');

class ClientLogin extends Zend_Gdata_ClientLogin
{
    private $username   = 'uwbanners@gmail.com';
    private $password   = 'replacewithwhatsonproduction';
    // predefined service name for calendar (cl)
    private $service    = Zend_Gdata_Calendar::AUTH_SERVICE_NAME;
    
    public function getAuth()
    {
        try
        {
            // Can't access protected property
            $client = Zend_Gdata_ClientLogin::getHttpClient($this->username, $this->password, $this->service);  
            return print_r($client, TRUE);
        }
        catch ( Exception $e )
        {
            return $e->getMessage();
        }
    }
}
?>
