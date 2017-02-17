<?php

namespace App\Http\Controllers;

use App\Friend;
use App\User;
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
            $friend = Friend::firstOrNew(['friend_post' => $request->friend_post_id, 'friend_receive' => $request->friend_receive_id]);
            if ($friend->id == null) {
                $friend->agree = false;
                $friend->save();
            }
            return response('true');
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
            $friend->agree = true;
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
     * @return \Illuminate\Http\JsonResponse
     */
    public function get_friends(Request $request)
    {
        try {
            $friends_ids = array();
            switch ($request->type) {
                case 1:
                    //发出的好友邀请
                    $friends_ids = Friend::where('friend_post', $request->id)->where('agree', 0)->get(['friend_receive'])->toArray();
                    break;
                case 2:
                    //收到的好友邀请
                    $friends_ids = Friend::where('friend_receive', $request->id)->where('agree', 0)->get(['friend_post'])->toArray();
                    break;
                case 0:
                    //所有好友
                    $friends_ids1 = Friend::where('friend_post', $request->id)->where('agree', 1)->get(['friend_receive'])->toArray();
                    $friends_ids2 = Friend::where('friend_receive', $request->id)->where('agree', 1)->get(['friend_post'])->toArray();
                    $friends_ids = array_merge($friends_ids1, $friends_ids2);
            }
            $users = User::find($friends_ids);
            return response()->json($users);
        } catch (\Exception $exception) {
            echo $exception->getMessage();
        }
    }
}
