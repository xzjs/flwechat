<?php

namespace App\Console;

use App\Expand;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(function () {
            try {
                $expands=Expand::where('domain','weixin')->where('updated_at','<',time())->get();
                foreach ($expands as $expand) {
                    //此处需要图片识别获取url
                    $ch = curl_init();

                    $data['title'] = $expand->title;
                    $data['src'] = $expand->src;
                    curl_setopt($ch, CURLOPT_SAFE_UPLOAD, true);
                    curl_setopt($ch, CURLOPT_URL, 'http://112.74.36.180:8080/api/updateweixinurl');
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
                    $url_data = \GuzzleHttp\json_decode($return_data);
                    $expand->href=$url_data->href;
                    $expand->save();
                }
            } catch (\Exception $exception) {
                echo $exception->getMessage();
            }
        })->hourly()->appendOutputTo('/usr/share/nginx/html/flwechat/public/log');
    }

    /**
     * Register the Closure based commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        require base_path('routes/console.php');
    }
}
