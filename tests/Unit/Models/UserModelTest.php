<?php

namespace Tests\Unit\Models;

use App\Features\Post\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_has_many_posts(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create();

        $this->assertTrue($user->posts->contains($post));
    }

    public function test_user_is_admin_check(): void
    {
        $member = User::factory()->create(['role' => 'member']);
        $admin = User::factory()->admin()->create();

        $this->assertFalse($member->isAdmin());
        $this->assertTrue($admin->isAdmin());
    }

    public function test_user_casts(): void
    {
        $user = User::factory()->create(['password' => 'secret123']);

        $this->assertTrue(\Illuminate\Support\Facades\Hash::check('secret123', $user->password));
        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $user->email_verified_at);
    }
}

