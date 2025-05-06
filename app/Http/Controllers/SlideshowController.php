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

    public function getGalleries($generatorId, Request $request)
    {

        if ($request->is_favourite) {
            $galleries = Gallery::withCount(['images' => function($query) {
                $query->where('is_favourite', 1);
            }])
            ->where('generator_id', $generatorId)
            ->get();
        } else {
            $galleries = Gallery::withCount('images')
            ->where('generator_id', $generatorId)
            ->get();
        }

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

    public function getImagesFavourite($galleryId, Request $request)
    {
        $images = Image::with('gallery.generator')
            ->where('gallery_id', $galleryId)
            ->where('is_favourite', 1)
            ->skip($request->from - 1)
            ->take($request->to)
            ->get()
            ->append('url');

        return response()->json($images);
    }
}
