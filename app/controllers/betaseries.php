<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ParameterBag;

function fetch($url, $params = array(), $method = "get")
{
    global $app;

    $params = array_merge($params, array('key' => $app["bs.apikey"]));

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

    if ($method != "get" || $method != "post") {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    }

    $response = curl_exec($ch);

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $data = substr($response, $headerSize);
    curl_close($ch);

    if ($httpCode != 200) {
        return false;
    }

    return json_decode($data);
}

$app->post("/api/betaseries/watched/{name}", function (Request $request, $name) use ($app) {

    $auth = fetch("/members/auth", array('login' => $app["bs.login"], 'password' => md5($app["bs.passwd"])), "post");
    if ($auth) {

        $episodes = fetch("/episodes/scraper", array("token" => $auth->token, "file" => $name));
        if ($episodes) {

            $watched = fetch("/episodes/watched", array("token" => $auth->token, "id" => $episodes->episode->id, "bulk" => true), "post");
        }
    }

    return (isset($watched)) ? $app->json($watched) : $app->json($auth);
});

// not used yet
$app->delete("/api/betaseries/watched/{name}", function (Request $request, $name) use ($app) {

    $auth = fetch("/members/auth", array('login' => $app["bs.login"], 'password' => md5($app["bs.passwd"])), "post");
    if ($auth) {

        $episodes = fetch("/episodes/scraper", array("token" => $auth->token, "file" => $name));
        if ($episodes) {

            $watched = fetch("/episodes/watched", array("token" => $auth->token, "id" => $episodes->episode->id), "delete");
        }
    }

    return (isset($watched)) ? $app->json($watched) : $app->json($auth);
});
