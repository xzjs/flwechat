<?php

use Illuminate\Database\Seeder;

class TopicTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $topics = ['互联网', '创业', '科技', '游戏', '运动', '艺术', '阅读', '美食', '动漫', '房产', '生活方式', '教育', '摄影', '历史', '文化', '旅行', '职业发展', '经济学', '体育', '投资', '音乐'];
        foreach ($topics as $topic) {
            DB::table('topics')->insert([
                'content' => $topic,
                'follow_num' => 0
            ]);
        }
    }
}
