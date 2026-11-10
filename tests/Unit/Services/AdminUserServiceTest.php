<?php

namespace Tests\Unit\Services;

use App\Features\Admin\Services\AdminUserService;
use App\Features\Post\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_pagination_with_post_count(): void
    {
        $service = new AdminUserService();
        $user = User::factory()->create(['name' => 'Budi']);
        Post::factory()->count(3)->for($user)->create();

        $paginator = $service->users();

        $this->assertTrue($paginator->total() >= 1);
        $found = collect($paginator->items())->firstWhere('id', $user->id);
        $this->assertNotNull($found);
        $this->assertEquals(3, $found->posts_count);
    }

    public function test_find_user_with_posts(): void
    {
        $service = new AdminUserService();
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create();

        $found = $service->find($user->id);

        $this->assertSame($user->id, $found->id);
        $this->assertTrue($found->posts->contains($post));
    }
}
