<?php

namespace App\Jobs;

use App\Expand;
use App\Image;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Storage;

class GetUrl implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;
    protected $image;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Image $image)
    {
        $this->image = $image;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            //此处需要图片识别获取url
            $ch = curl_init();
            $uri = 'public/' . Storage::url($this->image->img);
            //echo $uri;
            //echo getcwd();
            $data['image'] = curl_file_create($uri);
            $data['max_x'] = $this->image->max_x;
            $data['min_x'] = $this->image->min_x;
            $data['max_y'] = $this->image->max_y;
            $data['min_y'] = $this->image->min_y;
            curl_setopt($ch, CURLOPT_SAFE_UPLOAD, true);
            curl_setopt($ch, CURLOPT_URL, 'http://112.74.36.180:8080/api/getimginfo');
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HEADER, false);

            $return_data = curl_exec($ch);
            $log = curl_getinfo($ch);
            if ($return_data == false) {
                throw new \Exception(curl_error($ch), curl_errno($ch));
            }
            curl_close($ch);
            echo $return_data;
            $url_data = \GuzzleHttp\json_decode($return_data);
            foreach ($url_data as $item) {
                $expand = new Expand;
                $expand->image_id = $this->image->id;
                $expand->href = $item->href;
                $expand->title = $item->title;
                $expand->abstract = $item->abstract;
                $expand->domain = $item->domain;
                $expand->pubdate = $item->pubdate;
                $expand->dimension=$item->dimension;
                $expand->save();
            }
        } catch (\Exception $exception) {
            echo $exception->getMessage();
            throw $exception;
        }
    }
}
