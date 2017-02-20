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

Route::resource('user', 'UserController');

Route::post('/article/add_topic', 'ArticleController@add_topic');
Route::get('/article/get_article_by_user_id/{user_id}', 'ArticleController@get_article_by_user_id');
Route::get('/article/support/{id}', 'ArticleController@support');
Route::get('/article/oppose/{id}', 'ArticleController@oppose');
Route::get('/article/article_list/{reply_id}', 'ArticleController@article_list');
Route::get('/article/comment_articles/{user_id}', 'ArticleController@comment_articles');
Route::get('/article/get_article_by_topic/{topic_id}', 'ArticleController@get_article_by_topic');
Route::resource('article', 'ArticleController');

Route::get('/comment/get_comments_by_user_id/{user_id}', 'CommentController@get_comments_by_user_id');
Route::resource('comment', 'CommentController');
Route::post('/follow/get_follow_list', 'FollowController@get_follow_list');
Route::post('/follow/cancel_follow', 'FollowController@cancel_follow');
Route::resource('follow', 'FollowController');

Route::post('/friend/get_friends', 'FriendController@get_friends');
Route::post('/friend/agree_friend','FriendController@agree_friend');
Route::resource('friend', 'FriendController');

Route::resource('action', 'ActionController');

Route::resource('image','ImageController');

Route::group(['middleware' => ['web', 'wechat.oauth:snsapi_userinfo']], function () {
    Route::get('/getuser', 'WechatController@getuser');
});

//test
Route::post('test_post','TestController@test_post');