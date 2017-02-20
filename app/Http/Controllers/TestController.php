<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestController extends Controller
{
    public function test_post(Request $request){
        return response($request->uname);
    }
}
