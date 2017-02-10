<?php

namespace App\Http\Controllers;

use App\Article;
use App\Image;
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
            $articles = Article::with('images','topic')->orderBy('created_at', 'desc')->get();
            echo \GuzzleHttp\json_encode($articles);
        }catch (\Exception $exception){
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
            $article = new Article;
            $article->user_id = $request->user_id;
            $article->content = $request->comment;
            $article->url = $request->url;
            $article->saveOrFail();
            $arr = ['pic_file1', 'pic_file2', 'pic_file3'];
            foreach ($arr as $value) {
                if ($request->hasFile($value)) {
                    $path = $request->file($value)->store('public');
                    //TODO 此处需要图片识别获取url
                    $path=explode('/',$path)[1];
                    $img = new Image(['img' => $path, 'url' => '']);
                    $article->images()->save($img);
                }
            }
            //TODO 此处需要计算话题
            $result['id']=$article->id;
            $result['topic']='宝宝离婚了';
            echo \GuzzleHttp\json_encode($result);
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
        //
    }

    /**
     * 为文章增加话题
     * @param Request $request
     */
    public function add_topic(Request $request){
        try{
            $topic=Topic::firstOrNew(['content'=>$request->name]);
            if($topic->user_id==null){
                $topic->user_id=$request->user_id;
                $topic->follow_num=0;
                $topic->save();
            }
            $article=Article::find($request->article_id);
            $article->topic_id=$topic->id;
            $article->save();
            echo \GuzzleHttp\json_encode(true);
        }catch (\Exception $exception){
            echo \GuzzleHttp\json_encode($exception->getMessage());
        }
    }

    /**
     * 根据用户id获取用户的文章
     * @param $user_id
     */
    public function get_article_by_user_id($user_id){
        try{
            $articles=Article::with('images','topic')->where('user_id',$user_id)->orderBy('created_at','desc')->get();
            echo \GuzzleHttp\json_encode($articles);
        }catch (\Exception $exception){
            echo $exception->getMessage();
        }
    }
}
