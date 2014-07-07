<?php

namespace App\Controllers\Rights;

use Silex\Application;


$app->get("/api/rights",  __NAMESPACE__ . "\\get_rights");


function get_rights(Application $app) {

    $rights                        = [];
    $rights["canPlayMedia"]        = $app["rights.canPlayMedia"];
    $rights["canDownloadFile"]     = $app["rights.canDownloadFile"];
    $rights["canArchiveDirectory"] = $app["rights.canArchiveDirectory"];

    return $app->json($rights);
}
