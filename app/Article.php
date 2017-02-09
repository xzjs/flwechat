<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Image;

class Article extends Model
{
    public function images(){
        return $this->hasMany('Image');
    }
}
