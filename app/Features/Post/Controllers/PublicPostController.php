<?php

namespace App\Features\Post\Controllers;

use App\Features\Post\Enums\PostCategory;
use App\Features\Post\Models\Post;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicPostController extends Controller
{
    public function index(Request $request): Response
    {
        $posts = Post::published()
            ->with('user:id,name')
            ->when($request->filled('q'), function ($query) use ($request) {
                $term = '%' . mb_strtolower((string) $request->q) . '%';
                $query->where(function ($sub) use ($term) {
                    $sub->whereRaw('LOWER(title) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(content) LIKE ?', [$term]);
                });
            })
            ->when($request->filled('category'), function ($query) use ($request) {
                $query->where('category', $request->category);
            })
            ->latest('published_at')
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('Public/PostIndex', [
            'posts' => $posts,
            'filters' => $request->only('q', 'category'),
            'categories' => PostCategory::values(),
        ]);
    }

    public function show(string $slug): Response
    {
        $post = Post::published()
            ->with('user:id,name')
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('Public/PostShow', [
            'post' => $post,
        ]);
    }
}
