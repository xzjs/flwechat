<?php

namespace App\Http\Controllers;

use App\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
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
            $comment=new Comment;
            $comment->article_id=$request->article_id;
            $comment->user_id=$request->user_id;
            $comment->content=$request->comment;
            $comment->save();
            echo \GuzzleHttp\json_encode(true);
        }catch (\Exception $exception){
            echo $exception->getMessage();
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
            $comments=Comment::with('user')->where('article_id',$id)->get();
            echo \GuzzleHttp\json_encode($comments);
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

    /**
     * 根据用户id获取评论
     * @param $user_id
     */
    public function get_comments_by_user_id($user_id){
        try{
            $comments=Comment::with('article')->where('user_id',$user_id)->get();
            echo \GuzzleHttp\json_encode($comments);
        }catch (\Exception $exception){
            echo $exception->getMessage();
        }
    }
}
