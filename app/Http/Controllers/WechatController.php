<?php

namespace App\Http\Controllers;

use App\User;
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

    /**
     * 获取用户的信息
     */
    public function getuser(){
        $user = session('wechat.oauth_user');
        var_dump($user);
        $u=User::firstOrNew(['openid'=>$user['id']]);
        $u->nickname=$user["nickname"];
        $u->head_img=$user['avatar'];
        $u->save();
        echo $u->id;
    }
}
