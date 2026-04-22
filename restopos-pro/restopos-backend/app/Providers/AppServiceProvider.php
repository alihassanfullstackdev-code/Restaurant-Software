<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void { }

    public function boot(): void
{
    Gate::before(function ($user, $ability) {
        // Sirf user_permissions table se slugs uthayein
        $userDirectSlugs = $user->permissions ? $user->permissions->pluck('slug')->toArray() : [];

        // Ab Role wali logic ki zaroorat nahi agar aap manual control chahte hain
        if (in_array($ability, $userDirectSlugs)) {
            return true;
        }

        return null; 
    });
}
}