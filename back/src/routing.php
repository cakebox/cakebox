<?php

/**
 * App routes
 */
$app->get('/api/app',        'Cakebox\Controller\MainController::get');
$app->get('/api/app/player', 'Cakebox\Controller\MainController::get_infos');
$app->get('/api/app/rights', 'Cakebox\Controller\MainController::get');

/**
 * Directories routes
 */
$app->get('/api/directories',         'Cakebox\Controller\DirectoryController::get');
$app->delete('/api/directories',      'Cakebox\Controller\DirectoryController::delete');
$app->get('/api/directories/archive', 'Cakebox\Controller\DirectoryController::archive');

/**
 * Files routes
 */
$app->get('/api/files',    'Cakebox\Controller\FileController::get');
$app->delete('/api/files', 'Cakebox\Controller\FileController::delete');

/**
 * Betaseries routes
 */
$app->get('/api/betaseries/config',          'Cakebox\Controller\BetaseriesController::getConfig');
$app->get('/api/betaseries/info/{name}',     'Cakebox\Controller\BetaseriesController::getInfos');
$app->post('/api/betaseries/watched/{id}',   'Cakebox\Controller\BetaseriesController::setWatched');
$app->delete('/api/betaseries/watched/{id}', 'Cakebox\Controller\BetaseriesController::unsetWatched');
