<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Generator extends Model
{
    /** @use HasFactory<\Database\Factories\GeneratorFactory> */
    use HasFactory;

    public function galleries()
    {
        return $this->hasMany(Gallery::class);
    }
}
