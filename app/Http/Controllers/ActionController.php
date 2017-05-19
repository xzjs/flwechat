<?php

namespace App\Http\Controllers;

use App\Action;
use App\Article;
use App\Notice;
use Illuminate\Http\Request;
use App\Notifications\ActionNotice;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;

class ActionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

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
            $user_id=Auth::id();
            $action = Action::firstOrNew(['user_id' => $user_id, 'article_id' => $request->article_id, 'type' => $request->type]);
            if ($action->id == null) {
                $action->save();
                $article = Article::find($request->article_id);

                $notice = new Notice;
                $notice->user_id = $user_id;
                $notice->article_id = $request->article_id;

                if ($request->type == 0) {
                    $article->support_num += 1;
                    $notice->type = 1;//赞
                } else {
                    $article->oppose_num += 1;
                    $notice->type = 2;//踩
                }
                $notice->save();
                $notice->user=Auth::user();
                $article->save();

                //通知
                $user=$article->user;
                $user->notify(new ActionNotice($notice));

                return response('true');
            } else {
                return response('false');
            }
        } catch (\Exception $exception) {
            return response($exception->getMessage());
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
        try {
            $actions = Action::where('user_id', $id)->get();
            return response()->json($actions);
        } catch (\Exception $exception) {
            echo $exception->getMessage();
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
            $user_id=Auth::id();
            $article_id=Input::get('article_id');
            $type=Input::get('type');
            $action = Action::where('user_id', $user_id)->where('article_id', $article_id)->where('type', $type)->first();
            $article = Article::find($article_id);
            if ($type == 0) {
                if ($article->support_num > 0) {
                    $article->support_num -= 1;
                }
            } else {
                if ($article->oppose_num > 0) {
                    $article->oppose_num -= 1;
                }
            }
            $article->save();
            $action->delete();
            return response('true');
        } catch (\Exception $exception) {
            echo $exception->getMessage();
        }
    }
}
