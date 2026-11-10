<?php

namespace Tests\Unit\Middleware;

use App\Features\Post\Models\Post;
use App\Http\Middleware\EnsurePostOwnership;
use App\Http\Middleware\EnsureRole;
use App\Http\Middleware\HandleInertiaRequests;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tests\TestCase;

class MiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function test_ensure_role_allows_authorized_role(): void
    {
        $middleware = new EnsureRole();
        $user = User::factory()->admin()->create();

        $request = Request::create('/admin/users', 'GET');
        $request->setUserResolver(fn () => $user);

        $response = $middleware->handle($request, fn () => new Response('OK', 200), 'admin');

        $this->assertSame(200, $response->getStatusCode());
    }

    public function test_ensure_role_blocks_unauthorized_role(): void
    {
        $middleware = new EnsureRole();
        $user = User::factory()->create(['role' => 'member']);

        $request = Request::create('/admin/users', 'GET');
        $request->setUserResolver(fn () => $user);

        $this->expectException(HttpException::class);
        $middleware->handle($request, fn () => new Response('OK', 200), 'admin');
    }

    public function test_ensure_post_ownership_allows_owner(): void
    {
        $middleware = new EnsurePostOwnership();
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create();

        $request = Request::create('/dashboard/posts/' . $post->id, 'PUT');
        $request->setUserResolver(fn () => $user);
        $request->setRouteResolver(fn () => new class($post) {
            public function __construct(private Post $post) {}
            public function parameter($name) { return $this->post; }
        });
        // Route mock returning $post
        $route = new \Illuminate\Routing\Route('PUT', '/dashboard/posts/{post}', []);
        $route->bind($request);
        $route->setParameter('post', $post);
        $request->setRouteResolver(fn () => $route);

        $response = $middleware->handle($request, fn () => new Response('OK', 200));
        $this->assertSame(200, $response->getStatusCode());
    }

    public function test_ensure_post_ownership_blocks_non_owner(): void
    {
        $middleware = new EnsurePostOwnership();
        $owner = User::factory()->create();
        $stranger = User::factory()->create();
        $post = Post::factory()->for($owner)->create();

        $request = Request::create('/dashboard/posts/' . $post->id, 'PUT');
        $request->setUserResolver(fn () => $stranger);

        $route = new \Illuminate\Routing\Route('PUT', '/dashboard/posts/{post}', []);
        $route->bind($request);
        $route->setParameter('post', $post);
        $request->setRouteResolver(fn () => $route);

        $this->expectException(HttpException::class);
        $middleware->handle($request, fn () => new Response('OK', 200));
    }

    public function test_ensure_post_ownership_allows_non_post_parameter(): void
    {
        $middleware = new EnsurePostOwnership();
        $user = User::factory()->create();

        $request = Request::create('/other/route', 'GET');
        $request->setUserResolver(fn () => $user);

        $route = new \Illuminate\Routing\Route('GET', '/other/route', []);
        $route->bind($request);
        $request->setRouteResolver(fn () => $route);

        $response = $middleware->handle($request, fn () => new Response('OK', 200));
        $this->assertSame(200, $response->getStatusCode());
    }

    public function test_handle_inertia_requests_shares_data(): void
    {
        $middleware = new HandleInertiaRequests();
        $user = User::factory()->create(['name' => 'Inertia User', 'role' => 'member']);

        $request = Request::create('/', 'GET');
        $session = app('session.store');
        $session->put('success', 'Berhasil!');
        $session->put('error', 'Gagal!');
        $request->setLaravelSession($session);
        $request->setUserResolver(fn () => $user);

        $shared = $middleware->share($request);

        $this->assertArrayHasKey('auth', $shared);
        $this->assertSame('Inertia User', $shared['auth']['user']['name']);
        $this->assertSame('Berhasil!', $shared['flash']['success']());
        $this->assertSame('Gagal!', $shared['flash']['error']());
    }
}
