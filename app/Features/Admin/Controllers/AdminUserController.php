<?php

namespace App\Features\Admin\Controllers;

use App\Features\Admin\Services\AdminUserService;
use App\Features\Post\Services\PostExcelService;
use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class AdminUserController extends Controller
{
    public function index(AdminUserService $service): Response
    {
        return Inertia::render('Admin/UserList', [
            'users' => $service->users(),
        ]);
    }

    public function posts(User $user): Response
    {
        return Inertia::render('Admin/UserPostList', [
            'user' => $user->only('id', 'name', 'email'),
            'posts' => $user->posts()->latest()->paginate(10),
        ]);
    }

    public function exportUser(User $user, PostExcelService $excel): BinaryFileResponse
    {
        $path = $excel->export($user->posts()->get());

        return response()->download($path, 'artikel-' . $user->id . '.xlsx')->deleteFileAfterSend();
    }
}
