<?php

namespace App\Http\Controllers;

use App\Article;
use App\Follow;
use App\Topic;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;

class FollowController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $type=Input::get('type');
        try {
            $be_follow_ids = Follow::where('type', $type)->where('follow_user', Auth::id())->pluck('be_follow_user')->toArray();
            if ($type == 0) {
                $be_follow = User::find($be_follow_ids);
            } else {
                $be_follow = Article::find($be_follow_ids);
            }
            return response()->json($be_follow);
        } catch (\Exception $exception) {
            echo $exception->getMessage();
        }
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
            $follow = new Follow;
            $follow->follow_user = $request->follow_user_id;
            $follow->be_follow_user = $request->be_follow_id;
            $follow->type = $request->type;
            $follow->save();
            if ($request->type == 0) {
                $follow_user = User::find($request->follow_user_id);
                $follow_user->follow += 1;
                $follow_user->save();
                $be_follow_user = User::find($request->be_follow_id);
                $be_follow_user->be_follow += 1;
                $be_follow_user->save();
            }
            echo $follow->id;
        } catch (\Exception $exception) {
            echo 0;
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

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {

        } catch (\Exception $exception) {
            echo $exception->getMessage();
        }
    }

    /**
     * 取消关注
     * @param Request $request
     */
    public function cancel_follow(Request $request)
    {
        try {
            $follow = Follow::where('type', $request->type)->where('follow_user', $request->follow_user_id)->where('be_follow_user', $request->be_follow_id)->first();
            if ($request->type == 0) {
                $follow_user = User::find($request->follow_user_id);
                if ($follow_user->follow > 0) {
                    $follow_user->follow -= 1;
                }
                $follow_user->save();
                $be_follow = User::find($request->be_follow_id);
                if ($be_follow->be_follow > 0) {
                    $be_follow->be_follow -= 1;
                }
                $be_follow->save();
            }
            $follow->delete();
            echo \GuzzleHttp\json_encode(true);
        } catch (\Exception $exception) {
            echo $exception->getMessage();
        }
    }
}
