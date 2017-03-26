<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
    protected $fillable = ['content'];

    public function articles()
    {
        return $this->hasMany('App\Article');
    }
}
