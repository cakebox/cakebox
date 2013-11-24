<?php

$app = require_once __DIR__ . "/../app/bootstrap.php";
$app->get(
    "/",
    function () use ($app) {
        return $app->redirect("index.html");
    }
);
$app->run();