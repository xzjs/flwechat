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
}