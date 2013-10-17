<?php

namespace App\Config\Dir;

if (!isset($app)) {
    throw new \Exception('$app is not set');
}

if (!defined("APPLICATION_ENV")) {
    throw new \Exception('APPLICATION_ENV is not set');
}

$app["dir.path"] = array("/var/www/");