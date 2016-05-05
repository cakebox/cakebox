<?php

namespace App\Controllers\Other;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\Finder\Finder;
use App\Models\Utils;

/**
 * Route declaration
 *
 * @var Application $app Silex Application
 */
$app->get("/api/app",    __NAMESPACE__ . "\\get");
$app->get("/api/login",  __NAMESPACE__ . "\\login");
$app->get("/api/cookie",  __NAMESPACE__ . "\\cookie_checker");
$app->get("/api/disconnect",  __NAMESPACE__ . "\\disconnect");

/**
 * Get informations about cakebox
 *
 * @param Application $app Silex Application
 *
 * @return JsonResponse Object containing application informations
 */
function get(Application $app) {

    if($app['user.auth'])
        Utils\get_infos($app, $_SESSION['username']);

    $local  = json_decode(file_get_contents("{__DIR___}/../../bower.json"));
    $remote = json_decode(file_get_contents("https://raw.github.com/Cakebox/Cakebox-light/master/bower.json"));

    $app_infos = array(
        'language' => $app["cakebox.language"],
        'version'  => array(
            'local' => $local->version,
            'remote' => $remote->version
        )
    );

    return $app->json($app_infos);
}

/**
 * Login check
 *
 * @param Application $app Silex Application
 *
 * @return JsonResponse Object containing application informations
 */
function login(Application $app, Request $request) {

    if(!$app["user.auth"])
        return $app->json("login ok");

    if (!Utils\get_infos($app, $request->get('username'))) {
        $app->abort(410, "Wrong crendential");
    }

    $_SESSION['username'] = htmlspecialchars($request->get('username'));

    $username = $app["user.name"];
    $password = $app["user.password"];

    if ($username === $request->get('username'))
        if (password_verify("{$request->get('password')}{$app["user.salt"]}", $app["user.password"])) {
            setcookie("cakebox", $request->get('password'), time()+60*60*24*30, '/', $app["cakebox.host"], false, false);

            return $app->json("login ok");
        }
    $app->abort(410, "Wrong crendential");
}

/**
 * Disconnect
 *
 * @param Application $app Silex Application
 *
 * @return JsonResponse Object containing application informations
 */
function disconnect(Application $app) {
    Utils\get_infos($app, $_SESSION['username']);
    unset($_COOKIE['cakebox']);
    setcookie("cakebox","", time()-3600, '/', $app["cakebox.host"], false, false);
    unset($_SESSION["username"]);
    return $app->json("cookie destroyed");
}

/**
 * Cookie checker
 *
 * @param Application $app Silex Application
 *
 * @return JsonResponse Object containing application informations
 */
function cookie_checker(Application $app, Request $request) {

    if(!$app["user.auth"])
        return $app->json("login ok");

    Utils\get_infos($app, $_SESSION['username']);

    if ($app["user.auth"]) {
        if ((Utils\check_cookie($app, $_COOKIE["cakebox"]))) {
            return $app->json("logged");
        } else {
            $app->abort(410, "Wrong crendential");
        }
    }

}