<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

use App\Models\Generator;
use App\Models\Image;

class ImportImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import image data from "storage/app/private/image_json" to database.';

    /**
     * Execute the console command.
     */
    public function handle()
    {

        $files = Storage::files('image_json');

        if (empty($files)) {
            $this->info('No files found in storage/app/private/image_json');
            return;
        }

        $file = $this->choice('Please choose an image data', $files);

        $json = Storage::json($file);

        $parsed = explode('_', basename($file));

        $generator = Generator::firstOrCreate(['name' => $parsed[0]]);

        $gallery = $generator->galleries()->firstOrCreate(['name' => $parsed[1]]);

        $existingImages = $gallery->images()->pluck('index');

        $newImages = [];

        foreach (array_reverse($json) as $image) {
            if (!$existingImages->contains($image['index'])) {
                $newImages[] = [
                    'gallery_id' => $gallery->id,
                    'index' => $image['index'],
                    'name' => $image['imageId'],
                    'type' => $image['type'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        if (!empty($newImages)) {
            Image::insert($newImages);
            $this->info("Total " . count($newImages) . " images imported.");
        } else {
            $this->info("No images imported.");
        }
    }
}
