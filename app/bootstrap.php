<?php

namespace App;

require_once __DIR__ . "/../tmp/composer/autoload.php";

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ParameterBag;

define("APPLICATION_ENV", getenv("APPLICATION_ENV") ?: "production");

$app = new Application();
if (APPLICATION_ENV != "production") {
    $app["debug"] = true;
}

$app["error"] = $app->protect(function ($e) use ($app) {
    $code = $e->getCode();
    if ( $code === 400 || $code === 404 || $code === 403) {
        return $app["json"]($e->getMessage(), $e->getCode());
    }
    $msg = null;
    if (APPLICATION_ENV != "production") {
        $msg = $e->getMessage();
    }
    return $app["json"]($msg, 500);
});

// Return magique
$app["json"] = $app->protect(function ($data, $status = 200, $headers = array()) use ($app) {
    $message = "undefined";
    switch ($status) {
        case 200: $message = "OK"; break;
        case 201: $message = "Created"; break;
        case 202: $message = "Accepted"; break;
        case 203: $message = "Non-Authoritative Information"; break;
        case 204: $message = "No Content"; break;
        case 205: $message = "Reset Content"; break;
        case 206: $message = "Partial Content"; break;
        case 300: $message = "Multiple Choices"; break;
        case 301: $message = "Moved Permanently"; break;
        case 302: $message = "Found"; break;
        case 303: $message = "See Other"; break;
        case 304: $message = "Not Modified"; break;
        case 305: $message = "Use Proxy"; break;
        case 306: $message = "unused"; break;
        case 307: $message = "Temporary Redirect"; break;
        case 400: $message = "Bad Request"; break;
        case 401: $message = "Authorization Required"; break;
        case 402: $message = "Payment Required"; break;
        case 403: $message = "Forbidden"; break;
        case 404: $message = "Not Found"; break;
        case 405: $message = "Method Not Allowed"; break;
        case 406: $message = "Not Acceptable"; break;
        case 407: $message = "Proxy Authentication Required"; break;
        case 408: $message = "Request Time-out"; break;
        case 409: $message = "Conflict"; break;
        case 410: $message = "Gone"; break;
        case 411: $message = "Length Required"; break;
        case 412: $message = "Precondition Failed"; break;
        case 413: $message = "Request Entity Too Large"; break;
        case 414: $message = "Request-URI Too Large"; break;
        case 415: $message = "Unsupported Media Type"; break;
        case 416: $message = "Requested Range Not Satisfiable"; break;
        case 417: $message = "Expectation Failed"; break;
        case 418: $message = "I am a teapot"; break;
        case 500:
            $message = "Internal Server Error";
            syslog(LOG_ERR, "data => " . $data);
            break;
        case 501: $message = "Method Not Implemented"; break;
        case 502: $message = "Bad Gateway"; break;
        case 503: $message = "Service Temporarily Unavailable"; break;
        case 504: $message = "Gateway Time-out"; break;
        case 505: $message = "HTTP Version Not Supported"; break;
        default:  throw new \Exception("{$status} is not supported");
    }
    $headers = array_merge(array(
        "Content-Type" => "application/json",
        "ETag"         => md5(json_encode($data)),
    ), $headers);

    return $app->json($data, $status, $headers);
});

// Gere le JSON en body
$app->before(function (Request $request) {
    if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
        $data = json_decode($request->getContent(), true);
        $request->request->replace(is_array($data) ? $data : array());
    }
});

// Include specific user conf
$user = $_SERVER["PHP_AUTH_USER"];
if (isset($user) && file_exists(__DIR__ . "/config/{$user}.php"))
    require_once __DIR__ . "/config/{$user}.php";
else
    require_once __DIR__ . "/config/default.php";

// Append ending slash if needed
if (substr($app["cakebox.root"], -1) !== '/')
    $app["cakebox.root"] .= "/";

// Include controllers and models
foreach (glob(__DIR__ . "/{controllers,models}/*.php", GLOB_BRACE) as $file) {
    require_once $file;
}

return $app;
