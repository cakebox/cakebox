<?php

/**
 * App routes
 */
$app->get('/app', 'Cakebox\Controller\MainController::getAppInfos');

/**
 * Directories routes
 */
$app->get('/directories',         'Cakebox\Controller\DirectoryController::get');
$app->delete('/directories',      'Cakebox\Controller\DirectoryController::delete');
$app->get('/directories/archive', 'Cakebox\Controller\DirectoryController::archive');

/**
 * Files routes
 */
$app->get('/files',          'Cakebox\Controller\FileController::get');
$app->delete('/files',       'Cakebox\Controller\FileController::delete');
$app->get('/files/download', 'Cakebox\Controller\FileController::download');

/**
 * Betaseries routes
 */
$app->get('/betaseries/config',          'Cakebox\Controller\BetaseriesController::getConfig');
$app->get('/betaseries/info/{name}',     'Cakebox\Controller\BetaseriesController::getInfos');
$app->post('/betaseries/watched/{id}',   'Cakebox\Controller\BetaseriesController::setWatched');
$app->delete('/betaseries/watched/{id}', 'Cakebox\Controller\BetaseriesController::unsetWatched');
