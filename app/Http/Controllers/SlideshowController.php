<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Generator;
use App\Models\Gallery;
use App\Models\Image;

class SlideshowController extends Controller
{
    public function index()
    {
        $generators = Generator::all();
        return view('slideshow', compact('generators'));
    }

    public function getGalleries($generatorId)
    {
        $galleries = Gallery::withCount('images')
            ->where('generator_id', $generatorId)
            ->get();

        return response()->json($galleries);
    }

    public function getImages($galleryId, Request $request)
    {
        $images = Image::with('gallery.generator')
            ->where('gallery_id', $galleryId)
            ->whereBetween('index', [$request->from, $request->to])
            ->get()
            ->append('url');

        return response()->json($images);
    }
}
