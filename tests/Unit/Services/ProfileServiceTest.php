<?php

namespace Tests\Unit\Services;

use App\Features\Profile\Services\ProfileService;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_update_profile(): void
    {
        $service = new ProfileService();
        $user = User::factory()->create([
            'name' => 'Nama Lama',
            'email' => 'lama@example.com',
        ]);

        $updated = $service->update($user, [
            'name' => 'Nama Baru',
            'email' => 'baru@example.com',
        ]);

        $this->assertSame('Nama Baru', $updated->name);
        $this->assertSame('baru@example.com', $updated->email);
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Nama Baru',
            'email' => 'baru@example.com',
        ]);
    }
}

