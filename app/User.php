<?php

namespace App;

use Illuminate\Broadcasting\Channel;
use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $fillable = ['openid'];

    use Notifiable, HasApiTokens;

    //你关注的人
    public function follow_users()
    {
        return $this->belongsToMany('App\User', 'follow_users', 'user_id', 'follow_user');
    }

    //关注你的人
    public function fans()
    {
        return $this->belongsToMany('App\User', 'follow_users', 'follow_user', 'user_id');
    }

    //关注的文章
    public function follow_articles()
    {
        return $this->belongsToMany('App\Article', 'follow_articles');
    }

    //发布的文章
    public function articles()
    {
        return $this->hasMany('App\Article');
    }

    //发出的朋友邀请
    public function post_friends()
    {
        return $this->belongsToMany('App\User', 'friends', 'friend_post', 'friend_receive');
    }

    //收到的好友邀请
    public function receive_friends()
    {
        return $this->belongsToMany('App\User', 'friends', 'friend_receive', 'friend_post');
    }

}
