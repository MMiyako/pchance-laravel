<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\GalleryController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\SlideshowController;
 
Route::resource('galleries', GalleryController::class);
Route::get('gallery', [GalleryController::class, 'gallery'])->name('galleries.gallery');

Route::post('/images/{id}/favourite', [ImageController::class, 'toggleFavourite'])->name('images.favourite');

Route::get('/slideshow', [SlideshowController::class, 'index']);
Route::get('/slideshow/generators/{generator}/galleries', [SlideshowController::class, 'getGalleries']);
Route::get('/slideshow/galleries/{gallery}/images', [SlideshowController::class, 'getImages']);

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
