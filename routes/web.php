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
Route::get('/article/get_article_by_user_id/{user_id}','ArticleController@get_article_by_user_id');
Route::resource('article', 'ArticleController');
Route::get('/comment/get_comments_by_user_id/{user_id}','CommentController@get_comments_by_user_id');
Route::resource('comment','CommentController');
Route::post('/follow/get_follow_list','FollowController@get_follow_list');
Route::post('/follow/cancel_follow','FollowController@cancel_follow');
Route::resource('follow','FollowController');
Route::resource('friend','FriendController');

Route::group(['middleware' => ['web', 'wechat.oauth:snsapi_userinfo']], function () {
    Route::get('/getuser', 'WechatController@getuser');
});

