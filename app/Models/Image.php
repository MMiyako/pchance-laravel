<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    /** @use HasFactory<\Database\Factories\ImageFactory> */
    use HasFactory;

    public function gallery()
    {
        return $this->belongsTo(Gallery::class);
    }

    public function getUrlAttribute()
    {

        $galleryName = $this->gallery->name;
        $generatorName = $this->gallery->generator->name;

        return asset('storage/' . $generatorName . '_' . $galleryName . '/' . $this->name . "." . $this->type);
    }
}
