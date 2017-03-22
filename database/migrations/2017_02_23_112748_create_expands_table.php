<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExpandsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('expands', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('image_id');
            $table->text('href');
            $table->string('title');
            $table->string('abstract');
            $table->string('domain');
            $table->string('pubdate')->nullable();
            $table->string('dimension');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('expands');
    }
}
