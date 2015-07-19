<?php

namespace Cakebox\Controller;

use Silex\Application;
use Symfony\Component\HttpFoundation\JsonResponse;


class MainController
{
    /**
     * Get informations about cakebox
     *
     * @param Application $app Silex Application
     *
     * @return JsonResponse Object containing application informations
     */
    public function get(Application $app) {

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

    /**
     * Get player configuration
     *
     * @param Application $app Silex Application
     *
     * @return JsonResponse Object containing player informations
     */
    public function get_infos(Application $app) {

        if ($app["rights.canPlayMedia"] == false) {
            $app->abort(403, "This user doesn't have the rights to retrieve player informations");
        }

        $settings                    = [];
        $settings["default_type"]    = strtolower($app["player.default_type"]);
        $settings["available_types"] = [
            'html5'=> ['name'=> "HTML 5 Web Player", "type"=> "html5"],
            'vlc'  => ['name'=> "VLC Web Player", "type"  => "vlc"],
            'divx' => ['name'=> "DivX Web Player", "type" => "divx"]
        ];
        $settings["auto_play"]       = $app["player.auto_play"];

        return $app->json($settings);
    }

    /**
     * Get rights configuration
     *
     * @param Application $app Silex Application
     *
     * @return JsonResponse Object containing rights informations
     */
    function get(Application $app) {

        $rights                        = [];
        $rights["canPlayMedia"]        = $app["rights.canPlayMedia"];
        $rights["canDownloadFile"]     = $app["rights.canDownloadFile"];
        $rights["canArchiveDirectory"] = $app["rights.canArchiveDirectory"];
        $rights["canDelete"]           = $app["rights.canDelete"];

        return $app->json($rights);
    }
}
