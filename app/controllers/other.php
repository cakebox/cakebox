<?php

namespace App\Controllers\Other;

use Silex\Application;

$app->get("/api/app",  __NAMESPACE__ . "\\get");

function get(Application $app) {

    $local  = json_decode(file_get_contents("{__DIR___}/../../bower.json"));
    $remote = json_decode(file_get_contents("https://raw.github.com/Cakebox/Cakebox-light/master/bower.json"));

    $app_infos = array(
        'language' => $app["cakebox.language"], 
        'version'  => array(
            'local' => $local->version, 
            'remote' => $remote->version
        )
    );

    return $app->json($app_infos);  
}