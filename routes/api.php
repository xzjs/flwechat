<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


    Route::resource('notices', 'NoticeController');
    Route::resource('topics', 'TopicController');
    Route::resource('articles', 'ArticleController');
    Route::resource('friends', 'FriendController');
    Route::resource('users', 'UserController');
    Route::resource('images', 'ImageController');
    Route::resource('actions', 'ActionController');
    Route::resource('agrees', 'AgreeController');
    Route::resource('opposes', 'OpposeController');
