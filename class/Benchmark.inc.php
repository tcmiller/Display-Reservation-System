<?php
/**
 * Benchmark.inc.php - Benchmark Class
 *
 * @name       - Benchmark.inc.php
 * @author     -  Chris Heiland <cheiland@u.washington.edu>
 * 
 * Summary; Wrapper around the getruasage function, returns
 * system and user timers.  
 * Note: This function is not implemented on Windows platforms.
 *
 * Synopsys: 
 * $bench = new Benchmark();
 * $bench->start();
 * $bench->stop();
 * $results = $bench->results(); 
 */
  
class Benchmark
{
    // System Time
    private $_STimeBefore;
    private $_STimeAfter;
    // User Time
    private $_UTimeBefore;
    private $_UTimeAfter;

    function __construct()
    {
        // Don't have to do anything here yet
    }    

    public function start()
    {   
        $_strUTimer = getrusage();
        $this->_UTimeBefore = $_strUTimer["ru_utime.tv_sec"].$_strUTimer["ru_utime.tv_usec"];
        $this->_STimeBefore = $_strUTimer["ru_stime.tv_sec"].$_strUTimer["ru_stime.tv_usec"];
    }

    public function stop()
    {   
        $_strUTimer = getrusage();
        $this->_UTimeAfter = $_strUTimer["ru_utime.tv_sec"].$_strUTimer["ru_utime.tv_usec"];
        $this->_STimeAfter = $_strUTimer["ru_stime.tv_sec"].$_strUTimer["ru_stime.tv_usec"];
    }

    public function results()
    {
        $_strUTimeElapsed = ($this->_UTimeAfter - $this->_UTimeBefore);
        $_strSTimeElapsed = ($this->_STimeAfter - $this->_STimeBefore);

        return "User: $_strUTimeElapsed µseconds<br />" .
               "System: $_strSTimeElapsed µseconds";
    }
}
?>