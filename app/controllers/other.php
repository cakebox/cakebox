<?php

namespace App\Controllers\Other;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\Finder\Finder;

/**
 * Route declaration
 *
 * @var Application $app Silex Application
 */
$app->get("/api/app",    __NAMESPACE__ . "\\get");
$app->get("/api/login",  __NAMESPACE__ . "\\login");

/**
 * Get informations about cakebox
 *
 * @param Application $app Silex Application
 *
 * @return JsonResponse Object containing application informations
 */
function get(Application $app) {

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

    $username = $app["user.name"];
    $password = $app["user.password"];

    if ($username === $request->get('username'))
        if ($password === $request->get('password'))
            return $app->json("login ok");
    $app->abort(403, "Wrong crendential");
}