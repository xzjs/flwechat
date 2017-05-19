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

Route::any('wechat/serve', 'WechatController@serve');
Route::post('wechat/getconfig', 'WechatController@getconfig');

Route::get('/', function () {
    return view('welcome');
});

Route::group(['middleware' => ['web', 'wechat.oauth:snsapi_userinfo']], function () {
    Route::get('/wechat/getuser', 'WechatController@getuser');
});

//test
Route::post('test_post', 'TestController@test_post');