<?php

namespace App\Controllers\BetaSeries;

use Silex\Application;


$app->get("/api/betaseries/info/{name}",     __NAMESPACE__ . "\\get_infos");
$app->post("/api/betaseries/watched/{id}",   __NAMESPACE__ . "\\set_watched");
$app->delete("/api/betaseries/watched/{id}", __NAMESPACE__ . "\\unset_watched");


function fetch($url, $params = [], $method = "get")
{
    $query = '';
    if ($method == "get") {
        $query = '?' . http_build_query($params);
    }
    $url = "https://api.betaseries.com" . $url . $query;

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HEADER, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    if ($method == "post") {
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
    }

    /*
    if ($method != "get" || $method != "post") {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    }
    */

    $response = curl_exec($ch);

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $data = substr($response, $headerSize);
    curl_close($ch);

    return json_decode($data);
}

function get_infos(Application $app, $name) {

    $auth_params = [
        "key" => $app["bs.apikey"]
    ];

    if ($app["bs.login"] && $app["bs.passwd"]) {
        $auth = fetch("/members/auth", [
            "key"      => $app["bs.apikey"],
            "login"    => $app["bs.login"],
            "password" => md5($app["bs.passwd"])
        ],  "post");

        if (empty($auth->errors)) {
            $auth_params = array_merge($auth_params, ["token" => $auth->token]);
        }
    }

    $data = [];
    if ($app["bs.apikey"]) {
        $data = fetch("/episodes/scraper", array_merge($auth_params, ["file" => $name]));
        if (!empty($data->errors))
            $data = fetch("/movies/scraper", array_merge($auth_params, ["file" => $name]));
    }

    return $app->json($data);
}

function set_watched(Application $app, $id) {

    $auth = fetch("/members/auth", [
        "key"      => $app["bs.apikey"],
        "login"    => $app["bs.login"],
        "password" => md5($app["bs.passwd"])
    ],  "post");

    if (empty($auth->errors)) {
        $watched = fetch("/episodes/watched", [
            "key"   => $app["bs.apikey"],
            "token" => $auth->token,
            "id"    => $id,
            "bulk"  => true
        ],  "post");
    }

    return (isset($watched)) ? $app->json($watched) : $app->json($auth);
}

// not used yet
function unset_watched(Application $app, $id) {

    $auth = fetch("/members/auth", [
        "key"      => $app["bs.apikey"],
        "login"    => $app["bs.login"],
        "password" => md5($app["bs.passwd"])
    ],  "post");

    if (empty($auth->errors)) {
        $watched = fetch("/episodes/watched", [
            "key"   => $app["bs.apikey"],
            "token" => $auth->token,
            "id"    => $id
        ],  "delete");
    }

    return (isset($watched)) ? $app->json($watched) : $app->json($auth);
}
