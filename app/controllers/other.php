<?php

namespace App\Controllers\Other;

use Silex\Application;


$app->get("/api/app/version",  __NAMESPACE__ . "\\get_app_version");


function get_app_version(Application $app) {

    $local  = json_decode(file_get_contents("{__DIR___}/../../bower.json"));
    $remote = json_decode(file_get_contents("https://raw.github.com/Cakebox/Cakebox-light/master/bower.json"));

    $infos           = [];
    $infos["local"]  = $local->version;
    $infos["remote"] = $remote->version;

    return $app->json($infos);
}
