<?php

namespace App\Http\Controllers;

use App\Friend;
use Illuminate\Http\Request;

class FriendController extends Controller
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
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $friend = new Friend;
            $friend->friend_post = $request->friend_post_id;
            $friend->friend_receive = $request->friend_receive_id;
            $friend->agree = false;
            $friend->save();
            echo \GuzzleHttp\json_encode(true);
        } catch (\Exception $exception) {
            echo $exception->getMessage();
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        try {
            $friend = Friend::find($id);
            $friend->agree=true;
            $friend->save();
            echo 'true';
        } catch (\Exception $exception) {
            echo $exception->getMessage();
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * 获取好友关系
     * @param Request $request
     */
    public function get_friends(Request $request){
        try {
            $friends=Friend::where('friend_post',$request->user_id)->orWhere('friend_receive',$request->user_id)->get();
        } catch (\Exception $exception) {
            echo $exception->getMessage();
        }
    }
}
