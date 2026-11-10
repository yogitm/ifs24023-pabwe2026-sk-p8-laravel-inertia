<?php

namespace Tests\Unit\Providers;

use App\Features\Ai\Contracts\AiClientInterface;
use App\Features\Ai\Services\OpenAiPostGeneratorService;
use App\Features\Post\Contracts\PostRepositoryInterface;
use App\Features\Post\Repositories\PostRepository;
use App\Providers\AppServiceProvider;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class AppServiceProviderTest extends TestCase
{
    public function test_service_bindings(): void
    {
        $repo = app(PostRepositoryInterface::class);
        $this->assertInstanceOf(PostRepository::class, $repo);

        $ai = app(AiClientInterface::class);
        $this->assertInstanceOf(OpenAiPostGeneratorService::class, $ai);
    }

    public function test_force_https_configuration(): void
    {
        config(['app.force_https' => true]);

        $provider = new AppServiceProvider($this->app);
        $provider->boot();

        $generated = URL::to('/test');
        $this->assertStringStartsWith('https://', $generated);

        // Reset
        config(['app.force_https' => false]);
    }
}
