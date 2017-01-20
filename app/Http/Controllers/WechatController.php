<?php

namespace App\Http\Controllers;

use EasyWeChat\Support\Log;
use Illuminate\Http\Request;

class WechatController extends Controller
{
    public function serve(){
        Log::info('request arrived');
        $wechat=app('wechat');
        $wechat->server->setMessageHandler(function ($message){
            return 'hello';
        });
        Log::info('return response');
        return $wechat->server->serve();
    }
}
