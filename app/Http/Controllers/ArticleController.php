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
            $article = new Article;
            $article->user_id = $request->user_id;
            $article->content = $request->comment;
            $article->url = $request->url;
            $article->support_num = 0;
            $article->transmit_num = 0;
            $article->comment_num = 0;
            $article->oppose_num = 0;
            $article->reply_id = $request->reply_id;
            if ($article->reply_id != 0) {
                $article2 = Article::find($article->reply_id);
                $article2->comment_num += 1;
                $article2->save();
                $article->topic_id = $article2->topic_id;
            }
            $article->saveOrFail();
            $arr = ['pic_file1', 'pic_file2', 'pic_file3'];
            foreach ($arr as $value) {
                if ($request->hasFile($value)) {
                    $path = $request->file($value)->store('public');
                    $path = explode('/', $path)[1];

                    //此处需要图片识别获取url
                    $ch = curl_init();

                    //$data = array('image' => "@public/storage/$path");
                    $data['image']=curl_file_create("storage/$path");
                    curl_setopt($ch, CURLOPT_SAFE_UPLOAD, true);
                    curl_setopt($ch, CURLOPT_URL, 'http://112.74.36.180:8080/api/getimginfo');
                    curl_setopt($ch, CURLOPT_POST, 1);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
                    //curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                    curl_setopt($ch, CURLOPT_HEADER, false);
                    //curl_setopt($ch, CURLINFO_HEADER_OUT, true);

                    $return_data = curl_exec($ch);
                    $log=curl_getinfo($ch);
                    if ($return_data == false) {
                        throw new \Exception(curl_error($ch), curl_errno($ch));
                    }
                    curl_close($ch);

                    $url_data = \GuzzleHttp\json_decode($return_data);
                    $url = '';
                    if (count($url_data) > 1) {
                        $url = $url_data[0]->href;
                    }
                    $img = new Image(['img' => $path, 'url' => $url]);
                    $article->images()->save($img);
                }
            }

            //TODO 此处需要计算话题
            $result['id'] = $article->id;
            $result['topic'] = '宝宝离婚了';
            return response()->json($result);
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
        //
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
}
