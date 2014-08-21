<?php

namespace App\Controllers\BetaSeries;

use Silex\Application;


$app->get("/api/betaseries/info/{name}",     __NAMESPACE__ . "\\get_infos");
$app->post("/api/betaseries/watched/{id}",   __NAMESPACE__ . "\\set_watched");
$app->delete("/api/betaseries/watched/{id}", __NAMESPACE__ . "\\unset_watched");


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

function get_infos(Application $app, $name) {

    if ($app["rights.canPlayMedia"] == false) {
        $app->abort(403, "This user doesn't have the rights to retrieve episode informations.");
    }

    $auth = fetch("/members/auth", [
        "key"      => $app["bs.apikey"],
        "login"    => $app["bs.login"],
        "password" => md5($app["bs.passwd"])
    ],  "POST");

    if (!empty($auth->errors)) {
        $app->abort(401, "BetaSeries: " . $auth->errors[0]->text);
    }

    // First, check if it's a TV Show
    $file_info = fetch("/episodes/scraper", [
        "key"   => $app["bs.apikey"],
        "token" => $auth->token,
        "file" => $name
    ]);

    // if it's not a TV Show it should be a Movie
    if (!empty($file_info->errors)) {
        $file_info = fetch("/movies/scraper", [
            "key"   => $app["bs.apikey"],
            "token" => $auth->token,
            "file" => $name
        ]);
    }

    return $app->json($file_info);
}

function set_watched(Application $app, $id) {

    if ($app["rights.canPlayMedia"] == false) {
        $app->abort(403, "This user doesn't have the rights to set an episode as watched.");
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

function unset_watched(Application $app, $id) {

    if ($app["rights.canPlayMedia"] == false) {
        $app->abort(403, "This user doesn't have the rights to unset an episode as watched.");
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
