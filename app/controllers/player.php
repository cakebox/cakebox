<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ParameterBag;

$app->get("/api/player/settings", function (Request $request) use ($app) {

    $settings = array();

    $settings["width"] = $app["player.width"];
    $settings["height"] = $app["player.height"];

    return $app->json($settings);
});
