<?php

namespace Tests\Unit\Services;

use App\Features\Post\Contracts\PostRepositoryInterface;
use App\Features\Post\Models\Post;
use App\Features\Post\Repositories\PostRepository;
use App\Features\Post\Services\PostService;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostServiceTest extends TestCase
{
    use RefreshDatabase;

    private PostService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new PostService(new PostRepository());
    }

    public function test_service_crud_lifecycle(): void
    {
        $user = User::factory()->create();

        // Create
        $post = $this->service->create($user->id, [
            'title' => 'Artikel Service',
            'category' => 'Bisnis',
            'content' => 'Konten bisnis',
        ]);

        $this->assertInstanceOf(Post::class, $post);
        $this->assertSame('Artikel Service', $post->title);

        // Update
        $updated = $this->service->update($post, [
            'title' => 'Artikel Service Updated',
        ]);
        $this->assertSame('Artikel Service Updated', $updated->title);

        // Toggle publish
        $this->assertFalse($post->is_published);
        $toggled = $this->service->togglePublish($post);
        $this->assertTrue($toggled->is_published);
        $this->assertNotNull($toggled->published_at);

        $toggledAgain = $this->service->togglePublish($post);
        $this->assertFalse($toggledAgain->is_published);
        $this->assertNull($toggledAgain->published_at);

        // Delete
        $this->service->delete($post);
        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }
}
