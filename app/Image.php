<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $fillable = ['img','url'];

    public function comments(){
        return $this->hasMany('App\Comment');
    }
}
