<?php

// Include files for extension
require_once('Zend/Loader.php');
Zend_Loader::loadClass('Zend_Gdata');
Zend_Loader::loadClass('Zend_Gdata_ClientLogin');
Zend_Loader::loadClass('Zend_Gdata_Calendar');
Zend_Loader::loadClass('Zend_Http_Client');

class HttpAuth extends Zend_Http_Client
{
    private $username    = 'uwbanners@gmail.com';
    private $password    = 'replacewithwhatsonproduction';
    // predefined service name for calendar (cl)
    private $service     = Zend_Gdata_Calendar::AUTH_SERVICE_NAME;

    public function getAuth()
    {
        try
        {
            return $this->auth;
        }
        catch ( Exception $e )
        {
            return $e->getMessage();
        }
    }
}
?>
