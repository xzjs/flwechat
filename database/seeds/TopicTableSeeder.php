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
        $topics = ['互联网', '创业', '科技', '经济学'];
        foreach ($topics as $topic) {
            DB::table('topics')->insert([
                'content' => $topic,
                'follow_num' => 0
            ]);
        }
    }
}
