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
            return 'http://xzjs.love/flwechat/web/';
        });
        Log::info('return response');
        return $wechat->server->serve();
    }

    /**
     * 获取用户的信息
     */
    public function getuser(){
        try {
            $user = session('wechat.oauth_user');
            //var_dump($user);
            if($user!=null) {
                $u = User::firstOrNew(['openid' => $user['id']]);
                if($u->nickname==null){
                    $u->nickname = $user["nickname"];
                    $u->head_img = $user['avatar'];
                    $u->follow=0;
                    $u->be_follow=0;
                    $u->save();
                }
//            echo $u->id;
                setcookie('id', $u->id, time()+3600,"/");
                header("Location: /flwechat/web/index.html");
                exit;
            }else{
                echo 0;
            }
        } catch (\Exception $exception) {
            echo $exception->getMessage();
        }

    }
}
