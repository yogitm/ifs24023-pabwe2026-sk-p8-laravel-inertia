<?php

namespace Tests\Unit\DTO;

use App\Features\Ai\DTO\GeneratedPostItem;
use PHPUnit\Framework\TestCase;

class GeneratedPostItemTest extends TestCase
{
    public function test_dto_properties_and_to_array(): void
    {
        $dto = new GeneratedPostItem(
            title: 'Judul Artikel',
            category: 'Teknologi',
            excerpt: 'Ringkasan singkat',
            content: 'Isi lengkap markdown'
        );

        $this->assertSame('Judul Artikel', $dto->title);
        $this->assertSame('Teknologi', $dto->category);
        $this->assertSame('Ringkasan singkat', $dto->excerpt);
        $this->assertSame('Isi lengkap markdown', $dto->content);

        $array = $dto->toArray();
        $this->assertSame([
            'title' => 'Judul Artikel',
            'category' => 'Teknologi',
            'excerpt' => 'Ringkasan singkat',
            'content' => 'Isi lengkap markdown',
        ], $array);
    }
}

