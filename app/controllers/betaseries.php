<?php

namespace App\Controllers\BetaSeries;

use Silex\Application;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Models\Utils;

/**
 * Route declaration
 *
 * @var Application $app Silex Application
 */
$app->get("/api/betaseries/config",          __NAMESPACE__ . "\\get_config");
$app->get("/api/betaseries/info/{name}",     __NAMESPACE__ . "\\get_infos");
$app->post("/api/betaseries/watched/{id}",   __NAMESPACE__ . "\\set_watched");
$app->delete("/api/betaseries/watched/{id}", __NAMESPACE__ . "\\unset_watched");


/**
* Execute routes to Betaseries API and retrieve informations
*
* @param String $url Betaseries route
* @param Array $params Url parameters
* @param String $method Specify the route method, default GET
*
* @return JsonResponse Object containing betaseries informations
*/
function fetch($url, $params = [], $method = "GET")
{
    $query = '';
    if ($method == "GET" || $method != "POST") {
        $query = '?' . http_build_query($params);
    }
    $url = "https://api.betaseries.com{$url}{$query}";

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HEADER, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    if ($method == "POST") {
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
    }

    if ($method != "GET" && $method != "POST") {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    }

    $response = curl_exec($ch);

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $data = substr($response, $headerSize);
    curl_close($ch);

    return json_decode($data);
}

/**
 * Get betaseries configuration
 *
 * @param Application $app Silex Application
 *
 * @return JsonResponse Object containing betaseries informations
 */
function get_config(Application $app) {

    if ($app["user.auth"]) {
        Utils\get_infos($app, $_SESSION['username']);
        if (!(Utils\check_cookie($app, htmlspecialchars($_COOKIE["cakebox"], ENT_QUOTES)))) {
            $app->abort(410, "Wrong cookie");
        }
    }

    $bs_config           = [];
    $bs_config["apikey"] = (!empty($app["bs.apikey"])) ? true : false;
    $bs_config["login"]  = (!empty($app["bs.login"])) ? true : false;
    $bs_config["passwd"] = (!empty($app["bs.passwd"])) ? true : false;

    return $app->json($bs_config);
}

/**
 * Get file informations (note, resume, imdb_id ...)
 *
 * @param Application $app Silex Application
 * @param String $name File name
 *
 * @return JsonResponse
 */
function get_infos(Application $app, $name) {

    if ($app["user.auth"]) {
        Utils\get_infos($app, $_SESSION['username']);
        if (!(Utils\check_cookie($app, htmlspecialchars($_COOKIE["cakebox"], ENT_QUOTES)))) {
            $app->abort(410, "Wrong cookie");
        }
    }

    if ($app["rights.canPlayMedia"] == false) {
        $app->abort(403, "This user doesn't have the rights to retrieve episode informations");
    }

    $auth_params = ["key" => $app["bs.apikey"]];

    // Logged in if login and passwd are set.
    // If not, we can retrieve anyway episode or movie informations.
    if (!empty($app["bs.login"]) && !empty($app["bs.passwd"])) {
        $auth_params = array_merge($auth_params, [
            "login"    => $app["bs.login"],
            "password" => md5($app["bs.passwd"])
        ]);

        $auth = fetch("/members/auth", $auth_params, "POST");
        if (!empty($auth->errors)) {
            $app->abort(401, "BetaSeries: " . $auth->errors[0]->text);
        }

        $auth_params = array_merge($auth_params, ["token" => $auth->token]);
    }

    // First, check if it's a TV Show
    $file_info = fetch("/episodes/scraper", array_merge($auth_params, ["file" => $name]));

    // if it's not a TV Show it should be a Movie
    if (!empty($file_info->errors)) {
        $file_info = fetch("/movies/scraper", array_merge($auth_params, ["file" => $name]));
    }

    return $app->json($file_info);
}

/**
 * Set a show or movie as watched
 *
 * @param Application $app Silex Application
 * @param Number $id show/movie id
 *
 * @return JsonResponse
 */
function set_watched(Application $app, $id) {

    if ($app["user.auth"]) {
        Utils\get_infos($app, $_SESSION['username']);
        if (!(Utils\check_cookie($app, htmlspecialchars($_COOKIE["cakebox"], ENT_QUOTES)))) {
            $app->abort(410, "Wrong cookie");
        }
    }

    if ($app["rights.canPlayMedia"] == false) {
        $app->abort(403, "This user doesn't have the rights to set an episode as watched");
    }

    $auth = fetch("/members/auth", [
        "key"      => $app["bs.apikey"],
        "login"    => $app["bs.login"],
        "password" => md5($app["bs.passwd"])
    ],  "POST");

    if (!empty($auth->errors)) {
        $app->abort(401, "BetaSeries: " . $auth->errors[0]->text);
    }

    $watched = fetch("/episodes/watched", [
        "key"   => $app["bs.apikey"],
        "token" => $auth->token,
        "id"    => $id,
        "bulk"  => true
    ],  "POST");

    return $app->json($watched);
}

/**
 * Unset a show or movie as watched
 *
 * @param Application $app Silex Application
 * @param Number $id show/movie id
 *
 * @return JsonResponse
 */
function unset_watched(Application $app, $id) {

    if ($app["user.auth"]) {
        Utils\get_infos($app, $_SESSION['username']);
        if (!(Utils\check_cookie($app, htmlspecialchars($_COOKIE["cakebox"], ENT_QUOTES)))) {
            $app->abort(410, "Wrong cookie");
        }
    }

    if ($app["rights.canPlayMedia"] == false) {
        $app->abort(403, "This user doesn't have the rights to unset an episode as watched");
    }

    $auth = fetch("/members/auth", [
        "key"      => $app["bs.apikey"],
        "login"    => $app["bs.login"],
        "password" => md5($app["bs.passwd"])
    ],  "POST");

    if (!empty($auth->errors)) {
        $app->abort(401, "BetaSeries: " . $auth->errors[0]->text);
    }

    $unwatched = fetch("/episodes/watched", [
        "key"   => $app["bs.apikey"],
        "token" => $auth->token,
        "id"    => $id
    ],  "DELETE");

    return $app->json($unwatched);
}
