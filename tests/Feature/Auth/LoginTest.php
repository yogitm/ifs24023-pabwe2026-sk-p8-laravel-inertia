<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_page_renders_inertia_component(): void
    {
        $response = $this->get('/login');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page->component('Auth/Login'));
    }

    public function test_authenticated_user_cannot_access_login(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/login');
        $response->assertRedirect('/');
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'penulis@blogverse.test',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->post('/login', [
            'username' => 'penulis@blogverse.test',
            'password' => 'password123',
            'remember' => true,
        ]);

        $response->assertRedirect('/dashboard/posts');
        $this->assertAuthenticatedAs($user);
    }

    public function test_user_cannot_login_with_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'penulis@blogverse.test',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->post('/login', [
            'username' => 'penulis@blogverse.test',
            'password' => 'salah123',
        ]);

        $response->assertSessionHasErrors('username');
        $this->assertGuest();
    }

    public function test_user_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $response->assertRedirect('/');
        $this->assertGuest();
    }
}
