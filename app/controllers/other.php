<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ParameterBag;
use Symfony\Component\Finder\Finder;

$app->get("/api/app/commitid", function (Request $request) use ($app) {

    $infos = array();

    $infos["commitid"] = shell_exec("git rev-parse --short HEAD");

    return $app->json($infos);
});
