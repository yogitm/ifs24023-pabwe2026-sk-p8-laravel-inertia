<?php

namespace Tests\Unit\Models;

use App\Features\Post\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_post_belongs_to_user(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create();

        $this->assertTrue($post->user->is($user));
    }

    public function test_post_casts(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create([
            'is_published' => true,
            'published_at' => '2026-11-10 12:00:00',
        ]);

        $this->assertIsBool($post->is_published);
        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $post->published_at);
    }

    public function test_auto_slug_generation_and_uniqueness(): void
    {
        $user = User::factory()->create();
        $p1 = Post::factory()->for($user)->create(['title' => 'Tutorial Laravel']);
        $p2 = Post::factory()->for($user)->create(['title' => 'Tutorial Laravel']);
        $p3 = Post::factory()->for($user)->create(['title' => 'Tutorial Laravel']);

        $this->assertSame('tutorial-laravel', $p1->slug);
        $this->assertSame('tutorial-laravel-2', $p2->slug);
        $this->assertSame('tutorial-laravel-3', $p3->slug);
    }

    public function test_auto_slug_with_empty_title_fallbacks_to_artikel(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create(['title' => '   ']);

        $this->assertStringStartsWith('artikel', $post->slug);
    }

    public function test_updating_title_updates_slug(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create(['title' => 'Judul Awal']);
        $this->assertSame('judul-awal', $post->slug);

        $post->update(['title' => 'Judul Baru']);
        $this->assertSame('judul-baru', $post->fresh()->slug);
    }

    public function test_publishing_sets_and_unpublishing_clears_published_at(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create(['is_published' => false]);
        $this->assertNull($post->published_at);

        $post->is_published = true;
        $post->save();
        $this->assertNotNull($post->fresh()->published_at);

        $post->is_published = false;
        $post->save();
        $this->assertNull($post->fresh()->published_at);
    }

    public function test_scope_published_filters_only_public_articles(): void
    {
        $user = User::factory()->create();
        $published = Post::factory()->for($user)->create([
            'is_published' => true,
            'published_at' => now()->subDay(),
        ]);
        $draft = Post::factory()->for($user)->create([
            'is_published' => false,
            'published_at' => null,
        ]);
        $future = Post::factory()->for($user)->create([
            'is_published' => true,
            'published_at' => now()->addDay(),
        ]);

        $results = Post::published()->get();

        $this->assertTrue($results->contains($published));
        $this->assertFalse($results->contains($draft));
        $this->assertFalse($results->contains($future));
    }
}

