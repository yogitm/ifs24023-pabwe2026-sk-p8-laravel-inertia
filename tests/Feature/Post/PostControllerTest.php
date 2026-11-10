<?php

namespace Tests\Feature\Post;

use App\Features\Ai\Contracts\AiClientInterface;
use App\Features\Post\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Tests\TestCase;

class PostControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_member_can_view_posts_index_and_stats(): void
    {
        $user = User::factory()->create();
        Post::factory()->for($user)->create(['is_published' => true]);
        Post::factory()->for($user)->create(['is_published' => false]);

        $response = $this->actingAs($user)->get('/dashboard/posts');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Post/Index')
                ->has('posts.data', 2)
                ->where('stats.total', 2)
                ->where('stats.published', 1)
                ->where('stats.draft', 1)
            );
    }

    public function test_member_can_create_post(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/dashboard/posts', [
            'title' => 'Artikel Baru Dibuat',
            'category' => 'Teknologi',
            'excerpt' => 'Ringkasan artikel',
            'content' => 'Konten lengkap markdown',
            'is_published' => true,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('posts', [
            'user_id' => $user->id,
            'title' => 'Artikel Baru Dibuat',
            'is_published' => true,
        ]);
    }

    public function test_member_can_view_own_post_detail(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create();

        $response = $this->actingAs($user)->get("/dashboard/posts/{$post->id}");

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Post/Show')
                ->where('post.id', $post->id)
            );
    }

    public function test_member_can_update_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create(['title' => 'Judul Sebelum Update']);

        $response = $this->actingAs($user)->put("/dashboard/posts/{$post->id}", [
            'title' => 'Judul Setelah Update',
            'category' => 'Bisnis',
            'excerpt' => 'Excerpt baru',
            'content' => 'Konten baru',
            'is_published' => false,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'title' => 'Judul Setelah Update',
            'category' => 'Bisnis',
        ]);
    }

    public function test_member_can_delete_post_with_cover(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();

        $coverFile = UploadedFile::fake()->image('cover.jpg');
        $path = $coverFile->store('covers', 'public');

        $post = Post::factory()->for($user)->create([
            'cover_image_path' => $path,
        ]);

        Storage::disk('public')->assertExists($path);

        $response = $this->actingAs($user)->delete("/dashboard/posts/{$post->id}");

        $response->assertRedirect('/dashboard/posts');
        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
        Storage::disk('public')->assertMissing($path);
    }

    public function test_member_can_toggle_publish(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create(['is_published' => false]);

        $response = $this->actingAs($user)->patch("/dashboard/posts/{$post->id}/publish");

        $response->assertRedirect();
        $this->assertTrue($post->fresh()->is_published);

        // Toggle back to draft
        $response2 = $this->actingAs($user)->patch("/dashboard/posts/{$post->id}/publish");
        $response2->assertRedirect();
        $this->assertFalse($post->fresh()->is_published);
    }

    public function test_member_can_upload_and_delete_cover(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create();

        $file = UploadedFile::fake()->image('test_cover.png');

        $response = $this->actingAs($user)->post("/dashboard/posts/{$post->id}/cover", [
            'cover' => $file,
        ]);

        $response->assertRedirect();
        $post->refresh();
        $this->assertNotNull($post->cover_image_path);
        Storage::disk('public')->assertExists($post->cover_image_path);

        // Upload second cover to test replacing existing cover
        $file2 = UploadedFile::fake()->image('test_cover2.png');
        $this->actingAs($user)->post("/dashboard/posts/{$post->id}/cover", ['cover' => $file2]);
        $post->refresh();

        // Delete cover
        $deleteResponse = $this->actingAs($user)->delete("/dashboard/posts/{$post->id}/cover");
        $deleteResponse->assertRedirect();
        $this->assertNull($post->fresh()->cover_image_path);
    }

    public function test_member_can_export_posts_to_excel(): void
    {
        $user = User::factory()->create();
        Post::factory()->count(2)->for($user)->create();

        $response = $this->actingAs($user)->get('/dashboard/posts/export');

        $response->assertOk();
        $this->assertTrue(str_contains(
            $response->headers->get('content-disposition'),
            'artikel-saya.xlsx'
        ));
    }

    public function test_member_can_import_posts_from_excel(): void
    {
        $user = User::factory()->create();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->fromArray(['title', 'category', 'excerpt', 'content', 'is_published', 'published_at'], null, 'A1');
        $sheet->fromArray(['Artikel Import Test', 'Teknologi', 'Ringkasan', 'Isi', 1, '2026-11-10 10:00:00'], null, 'A2');

        $tempPath = tempnam(sys_get_temp_dir(), 'test_upload_') . '.xlsx';
        (new Xlsx($spreadsheet))->save($tempPath);

        $uploadFile = new UploadedFile($tempPath, 'artikel.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', null, true);

        $response = $this->actingAs($user)->post('/dashboard/posts/import', [
            'file' => $uploadFile,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('posts', [
            'user_id' => $user->id,
            'title' => 'Artikel Import Test',
        ]);

        @unlink($tempPath);
    }

    public function test_member_can_generate_and_save_ai_articles(): void
    {
        $user = User::factory()->create();

        $mockAi = new class implements AiClientInterface {
            public function generate(string $prompt, int $count): array
            {
                return [
                    [
                        'title' => 'Artikel AI 1',
                        'category' => 'Teknologi',
                        'excerpt' => 'Excerpt AI',
                        'content' => 'Konten AI',
                    ],
                ];
            }
        };

        $this->app->instance(AiClientInterface::class, $mockAi);

        // Generate endpoint
        $genResponse = $this->actingAs($user)->postJson('/dashboard/posts/ai-generate', [
            'prompt' => 'Topik AI',
            'count' => 1,
        ]);

        $genResponse->assertOk()
            ->assertJsonPath('articles.0.title', 'Artikel AI 1');

        // Save batch endpoint
        $saveResponse = $this->actingAs($user)->post('/dashboard/posts/ai-save', [
            'articles' => [
                [
                    'title' => 'Artikel AI 1',
                    'category' => 'Teknologi',
                    'excerpt' => 'Excerpt AI',
                    'content' => 'Konten AI',
                ],
            ],
        ]);

        $saveResponse->assertRedirect();
        $this->assertDatabaseHas('posts', [
            'user_id' => $user->id,
            'title' => 'Artikel AI 1',
        ]);
    }
}

