<?php

namespace App;

use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $fillable = ['openid'];

    use Notifiable, HasApiTokens;

    public function follow_users(){
        return $this->belongsToMany('App\User','follow_users','user_id','follow_user');
    }

    public function fans(){
        return $this->belongsToMany('App\User','follow_users','follow_user','user_id');
    }

    public function follow_articles(){
        return $this->belongsToMany('App\Article','follow_articles');
    }

    public function articles(){
        return $this->hasMany('App\Article');
    }
}
