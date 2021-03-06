<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $fillable = ['img'];

    public function comments(){
        return $this->hasMany('App\Comment');
    }

    public function article(){
        return $this->belongsTo('App\Article');
    }

    public function expands(){
        return $this->hasMany('App\Expand');
    }
}
