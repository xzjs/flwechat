<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/

Route::any('/','WechatController@serve');

Route::resource('user', 'UserController');
Route::post('/article/add_topic','ArticleController@add_topic');
Route::resource('article', 'ArticleController');

Route::group(['middleware' => ['web', 'wechat.oauth:snsapi_userinfo']], function () {
    Route::get('/getuser', 'WechatController@getuser');
});

