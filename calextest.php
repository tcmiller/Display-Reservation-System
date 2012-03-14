<?php

require_once('class/CalendarExt.inc.php');
require_once('class/Benchmark.inc.php');

$bench = new Benchmark();
$bench->start();
$calendar = new CalendarExt('uwbanners@gmail.com'); //Email of parent calendar
$calendar->connect('http://www.google.com/calendar/feeds/default/owncalendars/full/uwbanners%40gmail.com'); // This would be whatever calendar id you want to update
$calendar->title('Retractable Banners');
$calendar->color('#FFFFFF')
$calendar->save();
$bench->stop();

echo "<p>" . $bench->results() . "</p>";
echo "<p>Status: " . $calendar->status() . "</p>";

?>