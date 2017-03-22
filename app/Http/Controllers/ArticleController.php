<?php

namespace App\Http\Controllers;

use App\Action;
use App\Article;
use App\Follow;
use App\Image;
use App\Jobs\GetUrl;
use App\Topic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use phpDocumentor\Reflection\Types\Null_;

class ArticleController extends Controller
{
    private $img_ids=[];
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
            $id = $request->id;
            $arr = ['pic_file1', 'pic_file2', 'pic_file3'];
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

//                foreach ($arr as $value) {
//                    if ($request->hasFile($value)) {
//                        $path = $request->file($value)->store('public');
//                        $path = explode('/', $path)[1];
//                        $img = new Image(['img' => $path, 'article_id', $article->id]);
//                        $img->position=$value;
//                        $article->images()->save($img);
//                        dispatch(new GetUrl($img));
//                    }
//                }
                foreach ($arr as $value) {
                    if ($request->$value != null) {
                        $path = $request->file($value . 'file')->store('public');
                        $path = explode('/', $path)[1];
                        $temp = \GuzzleHttp\json_decode($request->$value);
                        $r = explode(',', $temp->mark);
                        $img = base64_decode($r[1]);
                        $img_name = time() . rand(0, 10000) . '.png';
                        $status = Storage::put("public/$img_name", $img);
                        if ($status == false) {
                            throw new \Exception('图片存储错误');
                        }
                        $img = new Image;
                        $img->img = $path;
                        $img->article_id = $article->id;
                        $img->position = $value;
                        $img->max_x = $temp->max_x;
                        $img->min_x = $temp->min_x;
                        $img->max_y = $temp->max_y;
                        $img->min_y = $temp->min_y;
                        $img->mark = $img_name;
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
//    public function article_list($reply_id)
//    {
//        try {
//            $articles = Article::with('images', 'topic', 'user')->where('reply_id', $reply_id)->orderBy('created_at', 'desc')->get();
//            return response()->json($articles);
//        } catch (\Exception $exception) {
//            echo $exception->getMessage();
//        }
//    }

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
            $articles = Article::with('images', 'topic', 'user')->where('content', 'like', "%" . $request->keyword . "%")->orderBy('created_at', 'desc')->get();
            return response()->json($articles);
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
        try {
            $page = $request->page;
            $size = $request->size;
            $topic_id = $request->topic_id;
            $user_id = $request->user_id;
            $reply_id = $request->reply_id;
            $key_word = $request->key_word;
            $comment = $request->comment;
            $is_public = $request->is_public;
            $follow_article=$request->follow_article;

            $articles = Article::with('topic', 'user');
            //话题查询
            if ($topic_id != null) {
                $articles = $articles->where('topic_id', $topic_id)->where('reply_id', 0);
            } //用户id查询
            elseif ($user_id != null) {
                //获取评论过的文章
                if ($comment == 1) {
                    $reply_ids = Article::where('user_id', $user_id)->where('reply_id', '>', 0)->get(['reply_id'])->toArray();
                    $articles = Article::with('topic', 'user')->whereIn('id', $reply_ids);
                } else {
                    //获取用户发布的文章
                    $articles = $articles->where('user_id', $user_id);
                }
                if (!is_null($is_public)) {
                    //查询用户未公开的文章
                    $articles = $articles->where('is_public', $is_public);
                }
                if (!is_null($follow_article)) {
                    //查询用户关注的文章
                    $article_ids=Follow::where('follow_user',$user_id)->where('type',1)->get(['be_follow_user'])->toArray();
                    $articles = Article::with('topic', 'user')->whereIn('id', $article_ids);
                }
            } //回复id查询
            elseif ($reply_id != null) {
                $articles = $articles->where('reply_id', $reply_id);
            } //关键字查询
            elseif ($key_word != null) {
                $articles = $articles->where('content', 'like', "%" . $request->keyword . "%");
            } //首页展示文章查询
            else {
                $articles = $articles->where('reply_id', 0);
            }
            $articles = $articles->orderBy('created_at', 'desc')->skip($page * $size)->take($size)->get();
            foreach ($articles as $article) {
                $article->is_support = Action::where('article_id', $article->id)->where('user_id', $request->user_id)->where('type', 0)->count();
                $article->is_oppose = Action::where('article_id', $article->id)->where('user_id', $request->user_id)->where('type', 1)->count();
                $article->is_follow = Follow::where('follow_user', $article->id)->where('be_follow_user', $request->article_id)->count();
                $this->img_ids=[];
                $this->get_img_after($article->id);
                $article->images=Image::find($this->img_ids);
            }

            return response()->json($articles);
        } catch (\Exception $exception) {
            echo $exception->getMessage();
        }
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
            $this->img_ids=[];
            $this->get_img_after($article->id);
            $article->images=Image::find($this->img_ids);
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
        $this->img_ids=array_merge($this->img_ids,$imgs);
        $article_ids = Article::where('reply_id', $id)->get(['id'])->toArray();
        foreach ($article_ids as $article_id) {
            $this->get_img_after($article_id);
        }
    }
}
