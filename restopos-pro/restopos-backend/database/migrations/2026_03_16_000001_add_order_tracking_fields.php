<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->boolean('is_split')->default(false);
            $table->unsignedInteger('split_count')->nullable();
            $table->foreignId('transferred_from_table_id')->nullable()->constrained('restaurant_tables')->onDelete('set null');
            $table->foreignId('merged_into_table_id')->nullable()->constrained('restaurant_tables')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['transferred_from_table_id']);
            $table->dropForeign(['merged_into_table_id']);
            $table->dropColumn(['is_split', 'split_count', 'transferred_from_table_id', 'merged_into_table_id']);
        });
    }
};