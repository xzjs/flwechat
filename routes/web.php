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

Route::any('/', 'WechatController@serve');
Route::post('/getconfig', 'WechatController@getconfig');

Route::get('/test', function () {
    return view('welcome');
});

Route::resource('user', 'UserController');

Route::post('/article/article_list', 'ArticleController@article_list');
Route::post('/article/get_article', 'ArticleController@get_article');
Route::resource('article', 'ArticleController');

Route::get('/comment/get_comments_by_user_id/{user_id}', 'CommentController@get_comments_by_user_id');
Route::resource('comment', 'CommentController');
Route::post('/follow/get_follow_list', 'FollowController@get_follow_list');
Route::post('/follow/cancel_follow', 'FollowController@cancel_follow');
Route::resource('follow', 'FollowController');

Route::post('/friend/get_friends', 'FriendController@get_friends');
Route::post('/friend/agree_friend', 'FriendController@agree_friend');
Route::resource('friend', 'FriendController');

Route::post('/action/cancel','ActionController@cancel');
Route::resource('action', 'ActionController');

Route::get('/image/get_children_imgs/{id}','ImageController@get_children_imgs');
Route::post('/image/get_image','ImageController@get_image');
Route::resource('image', 'ImageController');

Route::group(['middleware' => ['web', 'wechat.oauth:snsapi_userinfo']], function () {
    Route::get('/getuser', 'WechatController@getuser');
});

Route::resource('topic', 'TopicController');

Route::resource('notices','NoticeController');

//test
Route::post('test_post', 'TestController@test_post');