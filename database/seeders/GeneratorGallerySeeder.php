<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

use App\Models\Generator;
use App\Models\Gallery;

class GeneratorGallerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = Storage::json('galleries.json');

        DB::transaction(function () use ($data) {
            foreach ($data as $item) {
                
                $generator = Generator::firstOrCreate(
                    ['name' => $item['generator']]
                );
                
                foreach ($item['gallery'] as $gallery) {
                    Gallery::firstOrCreate(
                        [
                            'generator_id' => $generator->id,
                            'name' => $gallery
                        ]
                    );
                }
            }
        });
    }
}
