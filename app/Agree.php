<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Agree extends Model
{
    public function article(){
        return $this->belongsTo('App\Article');
    }
}
