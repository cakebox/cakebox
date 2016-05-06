<?php

namespace App\Controllers\Player;

use Silex\Application;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Models\Utils;

/**
 * Route declaration
 *
 * @var Application $app Silex Application
 */
$app->get("/api/player",  __NAMESPACE__ . "\\get_infos");

/**
 * Get player configuration
 *
 * @param Application $app Silex Application
 *
 * @return JsonResponse Object containing player informations
 */
function get_infos(Application $app) {

    if ($app["user.auth"]) {
        Utils\get_infos($app, $_SESSION['username']);
        if (!(Utils\check_cookie($app, htmlspecialchars($_COOKIE["cakebox"], ENT_QUOTES)))) {
            $app->abort(410, "Wrong cookie");
        }
    }

    if ($app["rights.canPlayMedia"] == false) {
        $app->abort(403, "This user doesn't have the rights to retrieve player informations");
    }

    $settings                    = [];
    $settings["default_type"]    = strtolower($app["player.default_type"]);
    $settings["available_types"] = [
        'html5'=> ['name'=> "HTML 5 Web Player", "type"=> "html5"],
        'vlc'  => ['name'=> "VLC Web Player", "type"  => "vlc"],
        'divx' => ['name'=> "DivX Web Player", "type" => "divx"]
    ];
    $settings["auto_play"]       = $app["player.auto_play"];

    return $app->json($settings);
}
