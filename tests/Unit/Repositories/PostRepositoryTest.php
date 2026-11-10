<?php

namespace Tests\Unit\Repositories;

use App\Features\Post\Models\Post;
use App\Features\Post\Repositories\PostRepository;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostRepositoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_paginate_for_user(): void
    {
        $repo = new PostRepository();
        $user = User::factory()->create();
        $other = User::factory()->create();

        Post::factory()->count(3)->for($user)->create();
        Post::factory()->count(2)->for($other)->create();

        $paginator = $repo->paginateForUser($user->id, 2);

        $this->assertSame(3, $paginator->total());
        $this->assertCount(2, $paginator->items());
    }

    public function test_create_post(): void
    {
        $repo = new PostRepository();
        $user = User::factory()->create();

        $post = $repo->create($user->id, [
            'title' => 'Artikel Baru',
            'category' => 'Teknologi',
            'content' => 'Konten teks',
        ]);

        $this->assertInstanceOf(Post::class, $post);
        $this->assertSame($user->id, $post->user_id);
        $this->assertSame('Artikel Baru', $post->title);
    }

    public function test_update_post(): void
    {
        $repo = new PostRepository();
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create(['title' => 'Judul Lama']);

        $updated = $repo->update($post, ['title' => 'Judul Baru']);

        $this->assertSame('Judul Baru', $updated->title);
        $this->assertDatabaseHas('posts', ['id' => $post->id, 'title' => 'Judul Baru']);
    }

    public function test_delete_post(): void
    {
        $repo = new PostRepository();
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create();

        $repo->delete($post);

        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }
}

