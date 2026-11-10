<?php

namespace Tests\Feature\Post;

use App\Features\Post\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicPostControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_view_home_gallery(): void
    {
        $user = User::factory()->create();
        $published = Post::factory()->for($user)->create([
            'is_published' => true,
            'published_at' => now()->subHour(),
        ]);
        $draft = Post::factory()->for($user)->create([
            'is_published' => false,
            'published_at' => null,
        ]);

        $response = $this->get('/');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Public/PostIndex')
                ->has('posts.data')
            );
    }

    public function test_guest_can_filter_and_search_articles(): void
    {
        $user = User::factory()->create();
        Post::factory()->for($user)->create([
            'title' => 'Panduan React 18',
            'category' => 'Teknologi',
            'is_published' => true,
            'published_at' => now()->subHour(),
        ]);
        Post::factory()->for($user)->create([
            'title' => 'Tips Produktivitas',
            'category' => 'Gaya Hidup',
            'is_published' => true,
            'published_at' => now()->subHour(),
        ]);

        $response = $this->get('/articles?q=React&category=Teknologi');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Public/PostIndex')
                ->has('posts.data', 1)
                ->where('posts.data.0.title', 'Panduan React 18')
            );
    }

    public function test_guest_can_view_article_detail_by_slug(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create([
            'title' => 'Belajar Inertia.js',
            'is_published' => true,
            'published_at' => now()->subHour(),
        ]);

        $response = $this->get("/articles/{$post->slug}");

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Public/PostShow')
                ->where('post.id', $post->id)
                ->where('post.title', 'Belajar Inertia.js')
            );
    }

    public function test_guest_cannot_view_draft_via_public_slug(): void
    {
        $user = User::factory()->create();
        $draft = Post::factory()->for($user)->create([
            'title' => 'Draft Rahasia',
            'is_published' => false,
            'published_at' => null,
        ]);

        $response = $this->get("/articles/{$draft->slug}");
        $response->assertNotFound();
    }
}
