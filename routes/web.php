<?php

use App\Features\Admin\Controllers\AdminUserController;
use App\Features\Auth\Controllers\AuthController;
use App\Features\Post\Controllers\AdminPostController;
use App\Features\Post\Controllers\PostController;
use App\Features\Post\Controllers\PublicPostController;
use App\Features\Profile\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Public (Guest) Routes
Route::get('/', [PublicPostController::class, 'index'])->name('home');
Route::get('/articles', [PublicPostController::class, 'index'])->name('articles.index');
Route::get('/articles/{slug}', [PublicPostController::class, 'show'])->name('articles.show');

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/login', [AuthController::class, 'authenticate'])->name('login.store');
    Route::get('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/register', [AuthController::class, 'store'])->name('register.store');
});

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

// Member Routes (Authenticated)
Route::middleware('auth')->group(function () {
    Route::get('/dashboard/posts', [PostController::class, 'index'])->name('posts.index');
    Route::post('/dashboard/posts', [PostController::class, 'store'])->name('posts.store');
    Route::get('/dashboard/posts/export', [PostController::class, 'export'])->name('posts.export');
    Route::post('/dashboard/posts/import', [PostController::class, 'import'])->name('posts.import');
    Route::post('/dashboard/posts/ai-generate', [PostController::class, 'aiGenerate'])->name('posts.ai-generate');
    Route::post('/dashboard/posts/ai-save', [PostController::class, 'aiSave'])->name('posts.ai-save');
    Route::get('/dashboard/posts/{post}', [PostController::class, 'show'])->name('posts.show');
    Route::put('/dashboard/posts/{post}', [PostController::class, 'update'])->name('posts.update');
    Route::delete('/dashboard/posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');
    Route::patch('/dashboard/posts/{post}/publish', [PostController::class, 'publish'])->name('posts.publish');
    Route::post('/dashboard/posts/{post}/cover', [PostController::class, 'cover'])->name('posts.cover');
    Route::delete('/dashboard/posts/{post}/cover', [PostController::class, 'deleteCover'])->name('posts.cover.delete');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
});

// Admin Routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('/users/{user}/posts', [AdminUserController::class, 'posts'])->name('users.posts');
    Route::get('/users/{user}/posts/export', [AdminUserController::class, 'exportUser'])->name('users.posts.export');
    Route::get('/posts', [AdminPostController::class, 'index'])->name('posts.index');
    Route::get('/posts/export', [AdminPostController::class, 'export'])->name('posts.export');
});
