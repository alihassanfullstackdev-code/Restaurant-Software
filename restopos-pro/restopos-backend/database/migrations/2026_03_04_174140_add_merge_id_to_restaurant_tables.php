<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('restaurant_tables', function (Blueprint $table) {
            // merge_id column add kar rahe hain jo null ho sakta hai
            $table->unsignedBigInteger('merge_id')->nullable()->after('status');
        });
    }

    public function down()
    {
        Schema::table('restaurant_tables', function (Blueprint $table) {
            $table->dropColumn('merge_id');
        });
    }
};
