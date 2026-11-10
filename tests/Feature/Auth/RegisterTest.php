<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_page_renders_inertia_component(): void
    {
        $response = $this->get('/register');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page->component('Auth/Register'));
    }

    public function test_user_can_register_as_member(): void
    {
        $response = $this->post('/register', [
            'name' => 'Penulis Baru',
            'email' => 'penulisbaru@blogverse.test',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertRedirect('/dashboard/posts');
        $this->assertDatabaseHas('users', [
            'name' => 'Penulis Baru',
            'email' => 'penulisbaru@blogverse.test',
            'role' => 'member',
        ]);

        $user = User::where('email', 'penulisbaru@blogverse.test')->first();
        $this->assertAuthenticatedAs($user);
    }

    public function test_registration_validation_fails_on_duplicate_email(): void
    {
        User::factory()->create(['email' => 'sama@blogverse.test']);

        $response = $this->post('/register', [
            'name' => 'Duplikat',
            'email' => 'sama@blogverse.test',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertSessionHasErrors('email');
    }
}
