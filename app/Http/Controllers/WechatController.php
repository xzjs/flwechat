<?php

namespace App\Http\Controllers;

use App\User;
use EasyWeChat\Support\Log;
use Illuminate\Http\Request;
use EasyWeChat\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;

class WechatController extends Controller
{
    public function serve()
    {
        Log::info('request arrived');
        $wechat = app('wechat');
        $wechat->server->setMessageHandler(function ($message) {
            return 'http://xzjs.love/flwechat/web/';
        });
        Log::info('return response');
        return $wechat->server->serve();
    }

    /**
     * 获取用户的信息
     */
    public function getuser(){

            $user = session('wechat.oauth_user');
            //var_dump($user);
            if ($user != null) {
                $u = User::firstOrNew(['openid' => $user['id']]);
                if ($u->nickname == null) {
                    $u->nickname = $user["nickname"];
                    $u->head_img = $user['avatar'];
                    $u->follow = 0;
                    $u->be_follow = 0;
                    $u->save();
                }
                $token = $u->createToken('access_token')->accessToken;
                Auth::login($u);
                $call_back=Input::get('callback');
                return redirect("http://$call_back/#/login/$token");
            } else {
                echo 0;
            }
    }

    public function getconfig(Application $wechat, Request $request)
    {
        $js = $wechat->js;
        $js->setUrl($request->url);
        $result = $js->config(array('onMenuShareTimeline', 'onMenuShareAppMessage'), true);
        return response($result);
    }
}
