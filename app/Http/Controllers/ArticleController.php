<?php

namespace App\Http\Controllers;

use App\Action;
use App\Article;
use App\Follow;
use App\Image;
use App\Jobs\GetUrl;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
{
    private $img_ids = [];

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $user_id=Input::get('user_id');
            if(is_null($user_id)){
                $user = Auth::user();
            }else{
                $user=User::find($user_id);
            }
            $topic_id = Input::get('topic_id');
            $article_id = Input::get('article_id');
            $key_word = Input::get('key_word');
//            $comment = $request->comment;

            $public = 1;
            $type = Input::get('type');
            $order_by = 'desc';

            $articles = Article::with('topic');
            //话题查询0
            if (!is_null($topic_id)) {
                if ($topic_id != 0) {
                    $articles = $articles->where('topic_id', $topic_id);
                }
                $articles = $articles->where('article_id', $article_id);
            }
            //回复id查询,为0就是首页的文章1
            if (!is_null($article_id)) {
                $articles = $articles->where('article_id', $article_id);
                if ($article_id > 0) {
                    $order_by = 'asc';
                }
            }
            if (!is_null($type)) {
                switch ($type) {
                    case 'private':
                        $public = 0;
                        $articles = $user->articles();
                        break;
                    case 'public':
                        $articles = $user->articles();
                        break;
                    case 'follow':
                        $user = Auth::user();
                        $articles = $user->follow_articles();
                }
            }
            //关键字查询2
            if (!is_null($key_word)) {
                $articles = $articles->where('content', 'like', "%" . $key_word . "%");
            }

            $articles = $articles->where('public', $public)->orderBy('created_at', $order_by)->with('topic', 'user', 'agrees', 'opposes','comments','followers')->paginate(15);
            foreach ($articles->items() as $article) {
                $this->img_ids = [];
                $this->get_img_after($article->id);
                $article->images = Image::find($this->img_ids);
            }
            return response()->json($articles);
        } catch (\Exception $exception) {
            return response($exception->getMessage());
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
            $id = $request->id;
            $arr = ['image0', 'image1', 'image2'];
            if ($id == null) {
                $article = new Article;
                $article->user_id = Auth::id();
                $article->content = $request->comment;
                $article->topic_id = $request->topic_id;
                $article->article_id = $request->article_id;
                $article->deleted = 0;
                $article->public = $request->is_public;
                if ($article->article_id != 0) {
                    $article2 = Article::find($article->article_id);
                    $article2->save();
                    $article->topic_id = $article2->topic_id;
                }
                $article->saveOrFail();

                foreach ($arr as $value) {
                    if ($request->$value != null) {
                        $temp = $request->$value;
                        $pic = $this->store_base64($temp['img']);

                        $disk = \Storage::disk('qiniu');
                        if (!$disk->exists($pic)) {
                            $disk->put($pic, Storage::get('public/' . $pic));
                        }

                        $mark = $this->store_base64($temp['position']['mark']);

                        $img = new Image;
                        $img->img = $pic;
                        $img->article_id = $article->id;
                        $img->position = $value;
                        $img->max_x = $temp['position']['max_x'];
                        $img->min_x = $temp['position']['min_x'];
                        $img->max_y = $temp['position']['max_y'];
                        $img->min_y = $temp['position']['min_y'];
                        $img->mark = $mark;
                        $article->images()->save($img);
                        dispatch(new GetUrl($img));
                    }
                }
            } else {
//                $article = Article::find($id);
//                $article->content = $request->comment;
//                $article->topic_id = $request->topic_id;
//                $article->save();
//                foreach ($arr as $value) {
//                    if ($request->hasFile($value)) {
//                        $path = $request->file($value)->store('public');
//                        $path = explode('/', $path)[1];
//                        $img = new Image(['img' => $path, 'article_id', $article->id]);
//                        $img->position = $value;
//                        $article->images()->save($img);
//                        dispatch(new GetUrl($img));
//                    }
//                }
            }

            return response('true');
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
            $article = Article::with('topic', 'user', 'agrees', 'opposes','comments','followers')->find($id);
            $this->img_ids = [];
            $this->get_img_after($article->id);
            $article->images = Image::find($this->img_ids);
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
        $article=Article::find($id);
        $user_id=Auth::id();
        $type=$request->type;
        if($type=='attach'){
            $article->followers()->attach($user_id);
        }else{
            $article->followers()->detach($user_id);
        }
        return response('true');
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
            $article = Article::find($id);
            $article->is_deleted = 1;
            $article->save();
        } catch (\Exception $exception) {
            echo $exception->getMessage();
        }
    }

    /**
     * 获取文章列表
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function article_list(Request $request)
    {

    }

    /**
     * 获取单个文章
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function get_article(Request $request)
    {

    }

    /**
     * 递归获取图片的函数
     * @param $id 文章id
     */
    private function get_img_after($id)
    {
        $imgs = Image::where('article_id', $id)->get(['id'])->toArray();
        $this->img_ids = array_merge($this->img_ids, $imgs);
        $article_ids = Article::where('article_id', $id)->get(['id'])->toArray();
        foreach ($article_ids as $article_id) {
            $this->get_img_after($article_id);
        }
    }

    /**
     * 存储base64的图片
     * @param $base64 图片base64字符串
     * @return string 存储后的图片名
     * @throws \Exception 图片存储异常
     */
    private function store_base64($base64)
    {
        $r = explode(',', $base64);
        $img_name = md5($base64) . '.png';

        $img = base64_decode($r[1]);
        $status = Storage::put("public/$img_name", $img);
        if ($status == false) {
            throw new \Exception('图片存储错误');
        }
        return $img_name;
    }
}
