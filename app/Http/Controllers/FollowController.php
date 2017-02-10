<?php

namespace App\Http\Controllers;

use App\Follow;
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
            $follow->be_follow_user=$request->be_follow_user_id;
            $follow->save();
            $follow_user=User::find($request->follow_user_id);
            $follow_user->follow+=1;
            $follow_user->save();
            $be_follow_user=User::find($request->be_follow_user_id);
            $be_follow_user->be_follow+=1;
            $be_follow_user->save();
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
        try{
            $be_follow_user_ids=Follow::where('follow_user',$id)->pluck('be_follow_user')->toArray();
            $be_follow_user=User::find($be_follow_user_ids);
            echo \GuzzleHttp\json_encode($be_follow_user);
        }catch (\Exception $exception){
            echo $exception->getMessage();
        }
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
        //
    }
}
