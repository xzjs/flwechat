<?php

namespace App\Http\Controllers;

use App\Article;
use App\Image;
use App\Jobs\GetUrl;
use App\Topic;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $articles = Article::with('images', 'topic', 'user')->orderBy('created_at', 'desc')->get();
            return response()->json($articles);
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
        $ch = curl_init();

        $data = array('uname' => 'Foo');

        curl_setopt($ch, CURLOPT_URL, 'http://112.74.36.180:8080/api/posttest');
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        var_dump(curl_exec($ch));
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
            $id=$request->id;
            $arr = ['pic_file1', 'pic_file2', 'pic_file3'];
            if($id==null){
                $article = new Article;
                $article->user_id = $request->user_id;
                $article->content = $request->comment;
                $article->support_num = 0;
                $article->transmit_num = 0;
                $article->comment_num = 0;
                $article->oppose_num = 0;
                $article->topic_id = $request->topic_id;
                $article->reply_id = $request->reply_id;
                if ($article->reply_id != 0) {
                    $article2 = Article::find($article->reply_id);
                    $article2->comment_num += 1;
                    $article2->save();
                    $article->topic_id = $article2->topic_id;
                }
                $article->saveOrFail();

                foreach ($arr as $value) {
                    if ($request->hasFile($value)) {
                        $path = $request->file($value)->store('public');
                        $path = explode('/', $path)[1];
                        $img = new Image(['img' => $path, 'article_id', $article->id]);
                        $img->position=$value;
                        $article->images()->save($img);
                        dispatch(new GetUrl($img));
                    }
                }
            }else{
                $article=Article::find($id);
                $article->content = $request->comment;
                $article->topic_id = $request->topic_id;
                $article->save();
                foreach ($arr as $value) {
                    if ($request->hasFile($value)) {
                        $path = $request->file($value)->store('public');
                        $path = explode('/', $path)[1];
                        $img = new Image(['img' => $path, 'article_id', $article->id]);
                        $img->position=$value;
                        $article->images()->save($img);
                        dispatch(new GetUrl($img));
                    }
                }
            }

            return response($article->id);
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
        try {
            $article = Article::with('images', 'topic', 'user')->find($id);
            return response()->json($article);
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
            $article=Article::find($id);
            $article->content='作者已删除该文章';
            $article->save();
            $deleteRows=Image::where('article_id',$article->id)->delete();
            return response('true');
        } catch (\Exception $exception) {
            echo $exception->getMessage();
        }
    }

    /**
     * 为文章增加话题
     * @param Request $request
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function add_topic(Request $request)
    {
        try {
            $topic = Topic::firstOrNew(['content' => $request->name]);
            if ($topic->user_id == null) {
                $topic->user_id = $request->user_id;
                $topic->follow_num = 0;
                $topic->save();
            }
            $article = Article::find($request->article_id);
            $article->topic_id = $topic->id;
            $article->save();
            return response('true');
        } catch (\Exception $exception) {
            return response($exception->getMessage());
        }
    }

    /**
     * 获取用户发布的文章
     * @param $user_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function get_article_by_user_id($user_id)
    {
        try {
            $articles = Article::with('images', 'topic', 'user')->where('user_id', $user_id)->orderBy('created_at', 'desc')->get();
            return response()->json($articles);
        } catch (\Exception $exception) {
            echo $exception->getMessage();
        }
    }

    /**
     * 根据回复id获取文章列表
     * @param $reply_id 回复文章的id
     * @return \Illuminate\Http\JsonResponse
     */
    public function article_list($reply_id)
    {
        try {
            $articles = Article::with('images', 'topic', 'user')->where('reply_id', $reply_id)->orderBy('created_at', 'desc')->get();
            return response()->json($articles);
        } catch (\Exception $exception) {
            echo $exception->getMessage();
        }
    }

    /**
     * 获取用户评论过的文章
     * @param $user_id 用户id
     * @return \Illuminate\Http\JsonResponse
     */
    public function comment_articles($user_id)
    {
        try {
            $reply_ids = Article::where('user_id', $user_id)->where('reply_id', '>', 0)->get(['reply_id'])->toArray();
            $articles = Article::with('images', 'topic', 'user')->find($reply_ids);
            return response()->json($articles);
        } catch (\Exception $exception) {
            echo $exception->getMessage();
        }
    }

    /**
     * 根据话题id获取文章
     * @param $topic_id 话题id
     * @return \Illuminate\Http\JsonResponse
     */
    public function get_article_by_topic($topic_id)
    {
        try {
            $articles = Article::with('images', 'topic', 'user')->where('topic_id', $topic_id)->where('reply_id', 0)->orderBy('created_at', 'desc')->get();
            return response()->json($articles);
        } catch (\Exception $exception) {
            echo $exception->getMessage();
        }
    }

    /**
     * 搜索文章
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        try {
            $articles = Article::with('images', 'topic', 'user')->where('content', 'like', "%" . $request->keyword . "%")->orWhere('User->name', 'like', "%" . $request->keyword . "%")->orderBy('created_at', 'desc')->get();
            return response()->json($articles);
        } catch (\Exception $exception) {
            echo $exception->getMessage();
        }
    }
}
