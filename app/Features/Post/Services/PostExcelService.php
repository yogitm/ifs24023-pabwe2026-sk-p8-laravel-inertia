<?php

namespace App\Features\Post\Services;

use App\Features\Post\Enums\PostCategory;
use App\Features\Post\Models\Post;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class PostExcelService
{
    public function export(iterable $posts): string
    {
        $book = new Spreadsheet();
        $sheet = $book->getActiveSheet();
        $sheet->setTitle('Daftar Artikel');

        $sheet->fromArray([
            'title',
            'category',
            'excerpt',
            'content',
            'is_published',
            'published_at',
        ], null, 'A1');

        $row = 2;
        foreach ($posts as $post) {
            $sheet->fromArray([
                $post->title,
                $post->category,
                $post->excerpt,
                $post->content,
                $post->is_published ? 1 : 0,
                $post->published_at?->toDateTimeString(),
            ], null, 'A' . $row++);
        }

        $path = tempnam(sys_get_temp_dir(), 'blog-export-') . '.xlsx';
        $writer = new Xlsx($book);
        $writer->save($path);

        return $path;
    }

    public function import(string $path, int $userId): int
    {
        $sheet = IOFactory::load($path)->getActiveSheet();
        $rows = $sheet->toArray();
        $header = array_map(fn ($v) => strtolower(trim((string) $v)), array_shift($rows) ?? []);
        $count = 0;

        foreach ($rows as $row) {
            if (empty($row) || empty($header)) {
                continue;
            }

            $data = array_combine($header, array_slice($row, 0, count($header)));
            if (!$data || blank($data['title'] ?? null) || blank($data['content'] ?? null)) {
                continue;
            }

            Validator::make($data, [
                'title' => 'required|string|max:255',
                'category' => 'required|in:' . implode(',', PostCategory::values()),
                'content' => 'required|string',
                'is_published' => 'nullable|boolean',
            ])->validate();

            Post::create([
                'user_id' => $userId,
                'title' => $data['title'],
                'category' => $data['category'],
                'excerpt' => $data['excerpt'] ?? null,
                'content' => $data['content'],
                'is_published' => (bool) ($data['is_published'] ?? false),
                'published_at' => !empty($data['is_published']) ? now() : null,
            ]);

            $count++;
        }

        return $count;
    }
}
