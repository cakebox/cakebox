<?php

use Symfony\Component\HttpFoundation\Request;

$app->get("/api/player/settings", function (Request $request) use ($app) {

    $settings = array();

    $settings["type"] = $app["player.type"];

    return $app->json($settings);
});
