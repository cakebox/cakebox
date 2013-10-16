<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ParameterBag;

$app->get("/api/", function (Request $request) use ($app) {

    return "return bidule";
});
