<?php

namespace App\Features\Post\Controllers;

use App\Features\Post\Models\Post;
use App\Features\Post\Services\PostExcelService;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class AdminPostController extends Controller
{
    public function index(): Response
    {
        $posts = Post::with('user:id,name')->latest()->paginate(15);

        return Inertia::render('Admin/PostList', [
            'posts' => $posts,
        ]);
    }

    public function export(PostExcelService $excel): BinaryFileResponse
    {
        $posts = Post::with('user')->latest()->get();
        $path = $excel->export($posts);

        return response()->download($path, 'semua-artikel.xlsx')->deleteFileAfterSend();
    }
}

