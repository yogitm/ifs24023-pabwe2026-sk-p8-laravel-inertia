<?php

namespace Tests\Feature\Admin;

use App\Features\Post\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_access_admin_users(): void
    {
        $member = User::factory()->create(['role' => 'member']);

        $response = $this->actingAs($member)->get('/admin/users');
        $response->assertForbidden();
    }

    public function test_admin_can_access_users_list(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory()->count(3)->create();

        $response = $this->actingAs($admin)->get('/admin/users');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/UserList')
                ->has('users.data')
            );
    }

    public function test_admin_can_view_specific_user_posts(): void
    {
        $admin = User::factory()->admin()->create();
        $target = User::factory()->create();
        Post::factory()->count(2)->for($target)->create();

        $response = $this->actingAs($admin)->get("/admin/users/{$target->id}/posts");

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/UserPostList')
                ->has('posts.data')
                ->where('user.id', $target->id)
            );
    }

    public function test_admin_can_export_user_posts(): void
    {
        $admin = User::factory()->admin()->create();
        $target = User::factory()->create();
        Post::factory()->count(2)->for($target)->create();

        $response = $this->actingAs($admin)->get("/admin/users/{$target->id}/posts/export");

        $response->assertOk();
        $this->assertTrue(str_contains(
            $response->headers->get('content-disposition'),
            "artikel-{$target->id}.xlsx"
        ));
    }
}
