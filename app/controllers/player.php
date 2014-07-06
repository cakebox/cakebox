<?php

use Symfony\Component\HttpFoundation\Request;

$app->get("/api/player/settings", function (Request $request) use ($app) {

    $settings                    = [];
    $settings["default_type"]    = strtolower($app["player.default_type"]);
    $settings["avalaible_types"] = [
        'html5'=> ['name'=> "HTML 5 Web Player", "type"=> "html5"],
        'vlc'  => ['name'=> "VLC Web Player", "type"  => "vlc"],
        'divx' => ['name'=> "DivX Web Player", "type" => "divx"]
    ];
    $settings["auto_play"] = $app["player.auto_play"];

    return $app->json($settings);
});
