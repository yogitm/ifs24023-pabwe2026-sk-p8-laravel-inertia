<?php

namespace App\Features\Ai\Services;

use App\Features\Ai\Contracts\AiClientInterface;
use App\Features\Ai\DTO\GeneratedPostItem;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class OpenAiPostGeneratorService implements AiClientInterface
{
    public function generate(string $prompt, int $count): array
    {
        $prompt = trim($prompt);
        if ($prompt === '') {
            throw new RuntimeException('Prompt tidak boleh kosong.');
        }

        $key = config('openai.api_key');
        if (!$key) {
            throw new RuntimeException('OPENAI_API_KEY belum dikonfigurasi.');
        }

        $baseUrl = rtrim((string) config('openai.base_url', 'https://api.openai.com/v1'), '/');
        $model = (string) config('openai.model', 'gpt-4o-mini');

        $response = Http::withToken($key)
            ->timeout(90)
            ->post($baseUrl . '/chat/completions', [
                'model' => $model,
                'response_format' => ['type' => 'json_object'],
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'Buat artikel blog berbahasa Indonesia. Balas JSON object dengan key articles berupa array; setiap item memiliki title, category, excerpt, content Markdown. Category harus salah satu: Teknologi, Pendidikan, Gaya Hidup, Bisnis, Opini, Umum.',
                    ],
                    [
                        'role' => 'user',
                        'content' => "Buat {$count} artikel tentang: {$prompt}. Kembalikan tepat {$count} artikel.",
                    ],
                ],
                'temperature' => 0.7,
            ]);

        if ($response->failed()) {
            $msg = $response->json('error.message') ?? 'Permintaan ke API OpenAI gagal.';
            throw new RuntimeException('OpenAI API Error: ' . $msg);
        }

        $content = $response->json('choices.0.message.content');
        $data = json_decode((string) $content, true);

        if (!is_array($data) || !is_array($data['articles'] ?? null)) {
            throw new RuntimeException('Format respons AI tidak valid.');
        }

        $items = [];
        foreach ($data['articles'] as $article) {
            $item = new GeneratedPostItem(
                title: (string) ($article['title'] ?? ''),
                category: (string) ($article['category'] ?? 'Umum'),
                excerpt: (string) ($article['excerpt'] ?? ''),
                content: (string) ($article['content'] ?? '')
            );
            $items[] = $item->toArray();
        }

        return array_slice($items, 0, $count);
    }
}
