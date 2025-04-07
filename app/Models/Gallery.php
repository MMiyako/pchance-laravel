<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    /** @use HasFactory<\Database\Factories\GalleryFactory> */
    use HasFactory;

    public function images()
    {
        return $this->hasMany(Image::class);
    }

    public function generator()
    {
        return $this->belongsTo(Generator::class);
    }
}
