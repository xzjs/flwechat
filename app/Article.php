<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    public function images(){
        return $this->hasMany('App\Image');
    }

    public function topic(){
        return $this->belongsTo('App\Topic');
    }

    public function user(){
        return $this->belongsTo('App\User');
    }

    public function agrees(){
        return $this->hasMany('App\Agree');
    }

    public function opposes(){
        return $this->hasMany('App\Oppose');
    }

    public function comments(){
        return $this->hasMany('App\Article');
    }
}
