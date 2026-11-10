<?php

namespace Tests\Feature\Admin;

use App\Features\Post\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPostControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_member_cannot_access_all_posts_monitoring(): void
    {
        $member = User::factory()->create(['role' => 'member']);

        $response = $this->actingAs($member)->get('/admin/posts');
        $response->assertForbidden();
    }

    public function test_admin_can_view_all_posts(): void
    {
        $admin = User::factory()->admin()->create();
        $author = User::factory()->create();
        Post::factory()->count(3)->for($author)->create();

        $response = $this->actingAs($admin)->get('/admin/posts');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/PostList')
                ->has('posts.data')
            );
    }

    public function test_admin_can_export_all_posts(): void
    {
        $admin = User::factory()->admin()->create();
        $author = User::factory()->create();
        Post::factory()->count(2)->for($author)->create();

        $response = $this->actingAs($admin)->get('/admin/posts/export');

        $response->assertOk();
        $this->assertTrue(str_contains(
            $response->headers->get('content-disposition'),
            'semua-artikel.xlsx'
        ));
    }
}
