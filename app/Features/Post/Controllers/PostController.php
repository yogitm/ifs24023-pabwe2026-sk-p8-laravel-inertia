<?php

namespace App\Features\Post\Controllers;

use App\Features\Ai\Contracts\AiClientInterface;
use App\Features\Post\Contracts\PostRepositoryInterface;
use App\Features\Post\Enums\PostCategory;
use App\Features\Post\Models\Post;
use App\Features\Post\Services\PostExcelService;
use App\Features\Post\Services\PostService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PostController extends Controller
{
    public function __construct(
        private readonly PostRepositoryInterface $postRepository
    ) {}

    public function index(Request $request): Response
    {
        $userId = (int) $request->user()->id;
        $posts = $this->postRepository->paginateForUser($userId, 10);

        $stats = [
            'total' => Post::where('user_id', $userId)->count(),
            'published' => Post::where('user_id', $userId)->where('is_published', true)->count(),
            'draft' => Post::where('user_id', $userId)->where('is_published', false)->count(),
        ];

        return Inertia::render('Post/Index', [
            'posts' => $posts,
            'stats' => $stats,
            'categories' => PostCategory::values(),
        ]);
    }

    public function store(Request $request, PostService $service): RedirectResponse
    {
        $data = $this->validated($request);
        $service->create((int) $request->user()->id, $data);

        return back()->with('success', 'Artikel berhasil dibuat.');
    }

    public function show(Post $post): Response
    {
        $this->authorize('view', $post);

        return Inertia::render('Post/Show', [
            'post' => $post,
        ]);
    }

    public function update(Request $request, Post $post, PostService $service): RedirectResponse
    {
        $this->authorize('update', $post);
        $data = $this->validated($request);
        $service->update($post, $data);

        return back()->with('success', 'Artikel diperbarui.');
    }

    public function destroy(Post $post, PostService $service): RedirectResponse
    {
        $this->authorize('delete', $post);

        if ($post->cover_image_path) {
            Storage::disk('public')->delete($post->cover_image_path);
        }

        $service->delete($post);

        return redirect()->route('posts.index')->with('success', 'Artikel dihapus.');
    }

    public function publish(Post $post, PostService $service): RedirectResponse
    {
        $this->authorize('update', $post);
        $service->togglePublish($post);

        return back()->with('success', 'Status publikasi diperbarui.');
    }

    public function cover(Request $request, Post $post): RedirectResponse
    {
        $this->authorize('update', $post);

        $request->validate([
            'cover' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        if ($post->cover_image_path) {
            Storage::disk('public')->delete($post->cover_image_path);
        }

        $post->cover_image_path = $request->file('cover')->store('covers', 'public');
        $post->save();

        return back()->with('success', 'Cover berhasil diunggah.');
    }

    public function deleteCover(Post $post): RedirectResponse
    {
        $this->authorize('update', $post);

        if ($post->cover_image_path) {
            Storage::disk('public')->delete($post->cover_image_path);
        }

        $post->update(['cover_image_path' => null]);

        return back()->with('success', 'Cover dihapus.');
    }

    public function export(Request $request, PostExcelService $excel): BinaryFileResponse
    {
        $posts = Post::where('user_id', $request->user()->id)->get();
        $path = $excel->export($posts);

        return response()->download($path, 'artikel-saya.xlsx')->deleteFileAfterSend();
    }

    public function import(Request $request, PostExcelService $excel): RedirectResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls|max:10240',
        ]);

        $count = $excel->import($request->file('file')->getRealPath(), (int) $request->user()->id);

        return back()->with('success', "{$count} artikel berhasil diimpor.");
    }

    public function aiGenerate(Request $request, AiClientInterface $ai): JsonResponse
    {
        $data = $request->validate([
            'prompt' => 'required|string|min:5|max:1000',
            'count' => 'required|integer|min:1|max:5',
        ]);

        $articles = $ai->generate($data['prompt'], (int) $data['count']);

        return response()->json(['articles' => $articles]);
    }

    public function aiSave(Request $request, PostService $service): RedirectResponse
    {
        $data = $request->validate([
            'articles' => 'required|array|min:1|max:5',
            'articles.*.title' => 'required|string|max:255',
            'articles.*.category' => 'required|in:' . implode(',', PostCategory::values()),
            'articles.*.excerpt' => 'nullable|string',
            'articles.*.content' => 'required|string',
        ]);

        foreach ($data['articles'] as $article) {
            $service->create((int) $request->user()->id, $article);
        }

        return back()->with('success', 'Draft hasil AI berhasil disimpan.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|in:' . implode(',', PostCategory::values()),
            'excerpt' => 'nullable|string|max:1000',
            'content' => 'required|string',
            'is_published' => 'sometimes|boolean',
        ]);
    }
}
