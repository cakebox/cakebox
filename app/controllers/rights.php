<?php

namespace App\Controllers\Rights;

use Silex\Application;
use Symfony\Component\HttpFoundation\JsonResponse;

/** @var $app Application */
$app->get("/api/rights",  __NAMESPACE__ . "\\get");


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
