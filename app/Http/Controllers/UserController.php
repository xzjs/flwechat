<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
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

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            if ($id == 0) {
                $id = Auth::id();
            }
            return response()->json(User::with('fans', 'receive_friends','follow_users')->find($id));
        } catch (\Exception $exception) {
            return response($exception->getMessage());
        }
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
        try {
            $user = User::find($id);
            switch ($request->type) {
                case 'follow':
                    $user->follow_users()->attach($request->user_id);
                    break;
                case 'cancel_follow':
                    $user->follow_users()->detach($request->user_id);
                    break;
                case 'make_friend':
                    $user->post_friends()->attach($request->user_id);
                    break;
                case 'delete_friend':
                    $user->post_friends()->detach($request->user_id);
                    break;
            }
            return response('true');
        } catch (\Exception $exception) {
            return response($exception->getMessage());
        }
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
}
