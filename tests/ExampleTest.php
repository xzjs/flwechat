<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ExampleTest extends TestCase
{
    use DatabaseTransactions;
    /**
     * A basic functional test example.
     *
     * @return void
     */
    public function testBasicExample()
    {
        $this->json('POST','/article',['user_id'=>1,'comment'=>'祝大家新年快乐','url'=>'http://www.baidu.com'])->seeJsonStructure(['id','topic']);
        $this->get('/article/support/1')->see('true');
        $this->get('/article/oppose/1')->see('true');
        $this->get('/article')->seeJsonStructure([
            '*'=>['user']
        ]);
    }
}
