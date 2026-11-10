<?php

namespace Tests\Unit\Services;

use App\Features\Post\Models\Post;
use App\Features\Post\Services\PostExcelService;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Tests\TestCase;

class PostExcelServiceTest extends TestCase
{
    use RefreshDatabase;

    private PostExcelService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new PostExcelService();
    }

    public function test_export_generates_valid_excel_file(): void
    {
        $user = User::factory()->create();
        $posts = Post::factory()->count(2)->for($user)->create([
            'is_published' => true,
            'published_at' => now(),
        ]);

        $path = $this->service->export($posts);

        $this->assertFileExists($path);
        $this->assertStringEndsWith('.xlsx', $path);

        @unlink($path);
    }

    public function test_import_processes_valid_excel_rows(): void
    {
        $user = User::factory()->create();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Header
        $sheet->fromArray(['title', 'category', 'excerpt', 'content', 'is_published', 'published_at'], null, 'A1');

        // Row 2: Valid
        $sheet->fromArray(['Post Impor 1', 'Teknologi', 'Excerpt 1', 'Content 1', 1, '2026-11-10 10:00:00'], null, 'A2');

        // Row 3: Valid draft
        $sheet->fromArray(['Post Impor 2', 'Pendidikan', 'Excerpt 2', 'Content 2', 0, null], null, 'A3');

        // Row 4: Empty row (should be skipped)
        $sheet->fromArray(['', '', '', '', '', ''], null, 'A4');

        $tempPath = tempnam(sys_get_temp_dir(), 'test_import_') . '.xlsx';
        (new Xlsx($spreadsheet))->save($tempPath);

        $count = $this->service->import($tempPath, $user->id);
        @unlink($tempPath);

        $this->assertSame(2, $count);
        $this->assertDatabaseHas('posts', [
            'user_id' => $user->id,
            'title' => 'Post Impor 1',
            'category' => 'Teknologi',
            'is_published' => true,
        ]);
        $this->assertDatabaseHas('posts', [
            'user_id' => $user->id,
            'title' => 'Post Impor 2',
            'category' => 'Pendidikan',
            'is_published' => false,
        ]);
    }
}
