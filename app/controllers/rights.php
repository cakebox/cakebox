<?php

namespace App\Controllers\Rights;

use Silex\Application;


$app->get("/api/rights",  __NAMESPACE__ . "\\get");


function get(Application $app) {

    $rights                        = [];
    $rights["canPlayMedia"]        = $app["rights.canPlayMedia"];
    $rights["canDownloadFile"]     = $app["rights.canDownloadFile"];
    $rights["canArchiveDirectory"] = $app["rights.canArchiveDirectory"];
    $rights["canDelete"]           = $app["rights.canDelete"];

    return $app->json($rights);
}
