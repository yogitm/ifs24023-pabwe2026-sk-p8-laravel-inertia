<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class RoutingTest extends TestCase
{
    public function test_all_expected_named_routes_exist(): void
    {
        $expectedRoutes = [
            'home',
            'articles.index',
            'articles.show',
            'login',
            'login.store',
            'register',
            'register.store',
            'logout',
            'posts.index',
            'posts.store',
            'posts.show',
            'posts.update',
            'posts.destroy',
            'posts.publish',
            'posts.cover',
            'posts.cover.delete',
            'posts.export',
            'posts.import',
            'posts.ai-generate',
            'posts.ai-save',
            'profile.edit',
            'profile.update',
            'admin.users.index',
            'admin.users.posts',
            'admin.users.posts.export',
            'admin.posts.index',
            'admin.posts.export',
        ];

        foreach ($expectedRoutes as $name) {
            $this->assertTrue(Route::has($name), "Rute '{$name}' harus terdaftar dalam aplikasi.");
        }
    }
}
