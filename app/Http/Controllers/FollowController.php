<?php

namespace App\Http\Controllers;

use App\Follow;
use App\Topic;
use App\User;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try{
            $follow=new Follow;
            $follow->follow_user=$request->follow_user_id;
            $follow->be_follow_user=$request->be_follow_id;
            $follow->type=$request->type;
            $follow->save();
            if($request->type==0){
                $follow_user=User::find($request->follow_user_id);
                $follow_user->follow+=1;
                $follow_user->save();
                $be_follow_user=User::find($request->be_follow_user_id);
                $be_follow_user->be_follow+=1;
                $be_follow_user->save();
            }else{
                $topic=Topic::find($request->be_follow_id);
                $topic->follow_num+=1;
                $topic->save();
            }
            echo $follow->id;
        }catch (\Exception $exception){
            echo 0;
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{

        }catch (\Exception $exception){
            echo $exception->getMessage();
        }
    }

    /**
     * 获取用户关注的列表
     * @param Request $request
     */
    public function get_follow_list(Request $request){
        try{
            $be_follow_ids=Follow::where('type',$request->type)->where('follow_user',$request->id)->pluck('be_follow_user')->toArray();
            if($request->type==0){
                $be_follow=User::find($be_follow_ids);
            }else{
                $be_follow=Topic::find($be_follow_ids);
            }
            echo \GuzzleHttp\json_encode($be_follow);
        }catch (\Exception $exception){
            echo $exception->getMessage();
        }
    }

    /**
     * 取消关注
     * @param Request $request
     */
    public function cancel_follow(Request $request){
        try{
            $follow=Follow::where('type',$request->type)->where('follow_user',$request->follow_user_id)->where('be_follow_user',$request->be_follow_id)->first();
            if($request->type==0){
                $follow_user=User::find($request->follow_user_id);
                $follow_user->follow-=1;
                $follow_user->save();
                $be_follow=User::find($request->follow_id);
                $be_follow->be_follow-=1;
                $be_follow->save();
            }else{
                $topic=Topic::find($request->be_follow_id);
                $topic->follow_num-=1;
                $topic->save();
            }
            $follow->delete();
            echo \GuzzleHttp\json_encode(true);
        }catch (\Exception $exception){
            echo $exception->getMessage();
        }
    }
}
