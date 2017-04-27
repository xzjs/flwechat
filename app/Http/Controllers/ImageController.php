<?php

namespace App\Http\Controllers;

use App\Article;
use App\Image;
use App\Action;
use App\Follow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class ImageController extends Controller
{
    private $img_ids = [];

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $img_id=Input::get('image_id');
        $article_id=Input::get('article_id');
        $user_id=Input::get('user_id');

        if($img_id!=null){
            try {
                $article = Image::with('article')->find($img_id)->article;
                $this->get_img_after($article->id);
                $this->get_img_before($article->reply_id);
                $imgs = Image::with('comments','article.user','expands','article.topic')->find($this->img_ids);
                foreach ($imgs as $img) {
                    $img->article->is_support = Action::where('article_id', $article->id)->where('user_id', $user_id)->where('type', 0)->count();
                    $img->article->is_oppose = Action::where('article_id', $article->id)->where('user_id', $user_id)->where('type', 1)->count();
                    $img->article->is_follow = Follow::where('follow_user', $user_id)->where('be_follow_user', $article->id)->count();
                }
                return response()->json($imgs);
            } catch (\Exception $exception) {
                return response($exception->getMessage());
            }
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
     * 递归获取图片的函数
     * @param $id 文章id
     */
    private function get_img_after($id)
    {
        $imgs = Image::where('article_id', $id)->get(['id'])->toArray();
        $this->img_ids=array_merge($this->img_ids,$imgs);
        $article_ids = Article::where('reply_id', $id)->get(['id'])->toArray();
        foreach ($article_ids as $article_id) {
            $this->get_img_after($article_id);
        }
    }

    private function get_img_before($id)
    {
        if ($id > 0) {
            $article = Article::with('images')->find($id);
            $imgs = Image::where('article_id', $article->id)->get(['id'])->toArray();
            $this->img_ids=array_merge($imgs,$this->img_ids);
//        foreach ($imgs as $img) {
//            array_push($this->img_ids, $img);
//        }
            $this->get_img_before($article->reply_id);

        }
    }

    /**
     * 获取子孙的图片
     * @param $id
     * @return \Illuminate\Http\JsonResponse|string
     */
    public function get_children_imgs($id){
        try {
            $this->img_ids = [];
            $this->get_img_after($id);
            $imgs = Image::with('comments', 'article.user', 'expands')->find($this->img_ids);
            return response()->json($imgs);
        }catch (\Exception $exception){
            return $exception->getMessage();
        }
    }

    /**
     * 获取图片接口
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function get_image(Request $request){
        try {
            $article = Image::with('article')->find($request->id)->article;
            $user_id=$request->user_id;
            $this->get_img_after($article->id);
            $this->get_img_before($article->reply_id);
            $imgs = Image::with('comments','article.user','expands','article.topic')->find($this->img_ids);
            foreach ($imgs as $img) {
                $img->article->is_support = Action::where('article_id', $img->article->id)->where('user_id', $user_id)->where('type', 0)->count();
                $img->article->is_oppose = Action::where('article_id', $img->article->id)->where('user_id', $user_id)->where('type', 1)->count();
                $img->article->is_follow = Follow::where('follow_user', $user_id)->where('be_follow_user', $img->article->id)->count();
            }
            return response()->json($imgs);
        } catch (\Exception $exception) {
            echo $exception->getMessage();
        }
    }
}
