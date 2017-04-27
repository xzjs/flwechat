<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    protected $dates = ['deleted_at'];

    public function article(){
        return $this->belongsTo('App\Article');
    }

    public function user(){
        return $this->belongsTo('App\User');
    }
}
