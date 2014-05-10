<?php

use Symfony\Component\HttpFoundation\Request;

$app->get("/api/player/settings", function (Request $request) use ($app) {

    $settings                    = [];
    $settings["default_type"]    = strtolower($app["player.default_type"]);
    $settings["avalaible_types"] = [
        ['name'=> "HTML 5 Web Player", 'type'=> "html5"],
        ['name'=> "VLC Web Player",    'type'=> "vlc"],
        ['name'=> "DivX Web Player",   'type'=> "divx"]
    ];

    return $app->json($settings);
});
