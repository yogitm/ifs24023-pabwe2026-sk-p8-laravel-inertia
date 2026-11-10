<?php

namespace Tests\Unit\Enums;

use App\Features\Post\Enums\PostCategory;
use PHPUnit\Framework\TestCase;

class PostCategoryTest extends TestCase
{
    public function test_category_descriptions(): void
    {
        $this->assertSame('Teknologi & Koding', PostCategory::Teknologi->description());
        $this->assertSame('Pendidikan & Tutorial', PostCategory::Pendidikan->description());
        $this->assertSame('Gaya Hidup & Produktivitas', PostCategory::GayaHidup->description());
        $this->assertSame('Bisnis & Karir', PostCategory::Bisnis->description());
        $this->assertSame('Opini & Pemikiran', PostCategory::Opini->description());
        $this->assertSame('Umum', PostCategory::Umum->description());
    }

    public function test_category_values(): void
    {
        $values = PostCategory::values();
        $this->assertSame([
            'Teknologi',
            'Pendidikan',
            'Gaya Hidup',
            'Bisnis',
            'Opini',
            'Umum',
        ], $values);
    }
}

