<?php

namespace App\Controllers\Other;

use Silex\Application;


$app->get("/api/app",  __NAMESPACE__ . "\\get");


/**
 * Get informations about cakebox
 *
 * @param Application $app Silex Application
 *
 * @return JsonResponse Object containing application informations
 */
function get(Application $app) {
    //si la variable n'est pas presente suite a une mise a jour
    if(!isset($app["cakebox.name"])||$app["cakebox.name"]==''){
        $app["cakebox.name"]="Cakebox";
    };

    $local  = json_decode(file_get_contents("{__DIR___}/../../bower.json"));
    $remote = json_decode(file_get_contents("https://raw.github.com/Cakebox/Cakebox-light/master/bower.json"));

    $app_infos = array(
        'name'     => $app["cakebox.name"],
        'language' => $app["cakebox.language"],
        'version'  => array(
            'local' => $local->version,
            'remote' => $remote->version
        )
    );

    return $app->json($app_infos);
}
