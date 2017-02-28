<?php

namespace App\Http\Controllers;

use App\User;
use EasyWeChat\Support\Log;
use Illuminate\Http\Request;
use EasyWeChat\Foundation\Application;

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
                $url='/flwechat/web/index.html';
                if(isset($_COOKIE["parameter"])){
                    $url=$_COOKIE["parameter"];
                }
                header("Location: $url");
                exit;
            }else{
                echo 0;
            }
        } catch (\Exception $exception) {
            echo $exception->getMessage();
        }
    }

    public function getconfig(Application $wechat){
        $js=$wechat->js;
        $result=$js->config(array('onMenuShareTimeline', 'onMenuShareAppMessage'), true);
        return response($result);
    }
}
