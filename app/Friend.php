<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Friend extends Model
{
    protected $fillable = ['friend_post', 'friend_receive','agree'];
}
