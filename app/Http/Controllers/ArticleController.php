<?php

namespace App\Http\Controllers;

use App\Action;
use App\Article;
use App\Follow;
use App\Image;
use App\Jobs\GetUrl;
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
            $topic_id = Input::get('topic_id');
//            $user_id = $request->user_id;
//            $reply_id = $request->reply_id;
//            $key_word = $request->key_word;
//            $comment = $request->comment;
            $is_public = Input::get('is_public');
            if (is_null($is_public)) {
                $is_public = 1;
            }
//            $follow_article = $request->follow_article;
//            $type = $request->type;

            $order_by = 'desc';

            $articles = Article::with('topic', 'user');
            //话题查询0
            if (!is_null($topic_id)) {
                if ($topic_id != 0) {
                    $articles = $articles->where('topic_id', $topic_id);
                }
                $articles = $articles->where('reply_id', 0);
            }
            //回复id查询,为0就是首页的文章1
//            if (!is_null($reply_id)) {
//                $articles = $articles->where('reply_id', $reply_id);
//                if ($reply_id > 0) {
//                    $order_by = 'asc';
//                }
//            }
            //关键字查询2
//            if (!is_null($key_word)) {
//                $articles = $articles->where('content', 'like', "%" . $key_word . "%");
//            }
            //查询用户关注的文章3
//            if (!is_null($follow_article)) {
//                $article_ids = Follow::where('follow_user', $user_id)->get(['be_follow_user'])->toArray();
//                $articles->whereIn('id', $article_ids);
//            }
            //个人文章查询4
//            if ($type == 4) {
//                $articles = $articles->where('user_id', $request->user_id);
//            }
            $articles = $articles->where('is_public', $is_public)->orderBy('created_at', $order_by)->paginate(15);
            $user_id=Auth::id();
            foreach ($articles->items() as $article) {
                $article->is_support = Action::where('article_id', $article->id)->where('user_id', $user_id)->where('type', 0)->count();
                $article->is_oppose = Action::where('article_id', $article->id)->where('user_id', $user_id)->where('type', 1)->count();
                $article->is_follow = Follow::where('follow_user', $user_id)->where('be_follow_user', $article->id)->count();
                $this->img_ids = [];
                $this->get_img_after($article->id);
                $article->images = Image::find($this->img_ids);
            }
            $temp=$articles->toJson();
            return response($articles->toJson());
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
            $id = $request->id;
            $arr = ['image0', 'image1', 'image2'];
            if ($id == null) {
                $article = new Article;
                $article->user_id = $request->user_id;
                $article->content = $request->comment;
                $article->support_num = 0;
                $article->transmit_num = 0;
                $article->comment_num = 0;
                $article->oppose_num = 0;
                $article->topic_id = $request->topic_id;
                $article->reply_id = $request->reply_id;
                $article->is_deleted = 0;
                $article->is_public = $request->is_public;
                if ($article->reply_id != 0) {
                    $article2 = Article::find($article->reply_id);
                    $article2->comment_num += 1;
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
        try {
            $article = Article::with('topic', 'user')->find($request->article_id);
            $article->is_support = Action::where('article_id', $request->article_id)->where('user_id', $request->user_id)->where('type', 0)->count();
            $article->is_oppose = Action::where('article_id', $request->article_id)->where('user_id', $request->user_id)->where('type', 1)->count();
            $article->is_follow = Follow::where('follow_user', $request->user_id)->where('be_follow_user', $request->article_id)->count();
            $this->img_ids = [];
            $this->get_img_after($article->id);
            $article->images = Image::find($this->img_ids);
            return response()->json($article);
        } catch (\Exception $exception) {
            echo $exception->getMessage();
        }
    }

    /**
     * 递归获取图片的函数
     * @param $id 文章id
     */
    private function get_img_after($id)
    {
        $imgs = Image::where('article_id', $id)->get(['id'])->toArray();
        $this->img_ids = array_merge($this->img_ids, $imgs);
        $article_ids = Article::where('reply_id', $id)->get(['id'])->toArray();
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
