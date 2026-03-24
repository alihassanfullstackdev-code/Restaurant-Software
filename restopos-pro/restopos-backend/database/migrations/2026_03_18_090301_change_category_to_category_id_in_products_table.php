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
        Schema::table('products', function (Blueprint $table) {
            // 1. Purana string column delete karein
            $table->dropColumn('category');

            // 2. Naya category_id column add karein (Foreign Key)
            // after('name') se yeh column 'name' ke baad show hoga
            $table->foreignId('category_id')->after('name')->constrained()->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            // Rollback ke liye foreign key drop karein
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');

            // Purana column wapis add karein
            $table->string('category')->after('name');
        });
    }
};
