<?php

namespace Tests\Unit\Actions;

use App\Features\Auth\Actions\LoginUserAction;
use App\Features\Auth\Actions\RegisterUserAction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class AuthActionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_user_action_success(): void
    {
        $user = User::factory()->create([
            'email' => 'login@example.com',
            'password' => Hash::make('password123'),
        ]);

        $action = new LoginUserAction();
        $action->execute([
            'email' => 'login@example.com',
            'password' => 'password123',
        ]);

        $this->assertTrue(auth()->check());
        $this->assertTrue(auth()->user()->is($user));
    }

    public function test_login_user_action_failure_throws_validation_exception(): void
    {
        User::factory()->create([
            'email' => 'login@example.com',
            'password' => Hash::make('password123'),
        ]);

        $action = new LoginUserAction();

        $this->expectException(ValidationException::class);
        $action->execute([
            'email' => 'login@example.com',
            'password' => 'wrongpassword',
        ]);
    }

    public function test_register_user_action_creates_member(): void
    {
        $action = new RegisterUserAction();
        $user = $action->execute([
            'name' => 'Member Baru',
            'email' => 'memberbaru@example.com',
            'password' => Hash::make('password123'),
        ]);

        $this->assertInstanceOf(User::class, $user);
        $this->assertSame('memberbaru@example.com', $user->email);
        $this->assertSame('member', $user->role);
        $this->assertDatabaseHas('users', ['email' => 'memberbaru@example.com', 'role' => 'member']);
    }
}

