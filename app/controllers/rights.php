<?php

namespace App\Controllers\Rights;

use Silex\Application;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Models\Utils;

/**
 * Route declaration
 *
 * @var Application $app Silex Application
 */
$app->get("/api/rights",  __NAMESPACE__ . "\\get");


/**
 * Get rights configuration
 *
 * @param Application $app Silex Application
 *
 * @return JsonResponse Object containing rights informations
 */
function get(Application $app) {

    if ($app["user.auth"]) {
        Utils\get_infos($app, $_SESSION['username']);
        if (isset($_COOKIE["cakebox"])) {
            if (!(Utils\check_cookie($app, htmlspecialchars($_COOKIE["cakebox"], ENT_QUOTES)))) {
                $app->abort(410, "Wrong cookie");
            }
        } else {
            $app->abort(410, "Wrong cookie");
        }
    }

    $rights                        = [];
    $rights["canPlayMedia"]        = $app["rights.canPlayMedia"];
    $rights["canDownloadFile"]     = $app["rights.canDownloadFile"];
    $rights["canArchiveDirectory"] = $app["rights.canArchiveDirectory"];
    $rights["canDelete"]           = $app["rights.canDelete"];
    $rights["canRename"]           = $app["rights.canRename"];
    $rights["canUpload"]           = $app["rights.canUpload"];
    $rights["canCreate"]           = $app["rights.canCreate"];

    return $app->json($rights);
}
