<?php

if (!isset($app)) {
    throw new \Exception('$app is not set');
}

if (!defined("APPLICATION_ENV")) {
    throw new \Exception('APPLICATION_ENV is not set');
}


/*
  General configuration of Cakebox
*/
$app["cakebox.root"] = "/var/www/"; // Root directory Cakebox have to scan
$app["cakebox.access"] = "/access/"; // Alias used in web server for direct access

/*
  Web player settings
*/
$app["player.type"] = "HTML5";
$app["player.width"] = "710";
$app["player.height"] = "400";
$app["player.preload"] = "auto"; /* auto, metadata, none */

/*
  Betaseries account
  PS: Ask API key here http://www.betaseries.com/api/
*/
$app["bs.login"] = "";
$app["bs.passwd"] = "";
$app["bs.apikey"] = "";
