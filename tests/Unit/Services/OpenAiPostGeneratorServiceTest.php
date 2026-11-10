<?php

namespace Tests\Unit\Services;

use App\Features\Ai\Services\OpenAiPostGeneratorService;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Tests\TestCase;

class OpenAiPostGeneratorServiceTest extends TestCase
{
    public function test_empty_prompt_throws_exception(): void
    {
        $service = new OpenAiPostGeneratorService();

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Prompt tidak boleh kosong.');

        $service->generate('   ', 1);
    }

    public function test_missing_api_key_throws_exception(): void
    {
        config(['openai.api_key' => null]);
        $service = new OpenAiPostGeneratorService();

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('OPENAI_API_KEY belum dikonfigurasi.');

        $service->generate('Belajar Laravel', 1);
    }

    public function test_failed_api_response_throws_exception(): void
    {
        config(['openai.api_key' => 'mock-key']);

        Http::fake([
            'https://api.openai.com/v1/chat/completions' => Http::response([
                'error' => ['message' => 'Rate limit exceeded'],
            ], 429),
        ]);

        $service = new OpenAiPostGeneratorService();

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('OpenAI API Error: Rate limit exceeded');

        $service->generate('Belajar Laravel', 1);
    }

    public function test_invalid_json_format_throws_exception(): void
    {
        config(['openai.api_key' => 'mock-key']);

        Http::fake([
            'https://api.openai.com/v1/chat/completions' => Http::response([
                'choices' => [
                    ['message' => ['content' => 'not json']],
                ],
            ], 200),
        ]);

        $service = new OpenAiPostGeneratorService();

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Format respons AI tidak valid.');

        $service->generate('Belajar Laravel', 1);
    }

    public function test_successful_article_generation(): void
    {
        config(['openai.api_key' => 'mock-key']);

        Http::fake([
            'https://api.openai.com/v1/chat/completions' => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => json_encode([
                                'articles' => [
                                    [
                                        'title' => 'Artikel 1',
                                        'category' => 'Teknologi',
                                        'excerpt' => 'Ringkasan 1',
                                        'content' => 'Konten 1',
                                    ],
                                    [
                                        'title' => 'Artikel 2',
                                        'category' => null,
                                        'excerpt' => null,
                                        'content' => 'Konten 2',
                                    ],
                                ],
                            ]),
                        ],
                    ],
                ],
            ], 200),
        ]);

        $service = new OpenAiPostGeneratorService();
        $articles = $service->generate('Belajar Coding', 2);

        $this->assertCount(2, $articles);
        $this->assertSame('Artikel 1', $articles[0]['title']);
        $this->assertSame('Teknologi', $articles[0]['category']);
        $this->assertSame('Artikel 2', $articles[1]['title']);
        $this->assertSame('Umum', $articles[1]['category']);
    }
}

