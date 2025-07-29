<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class LocalGalleryVerify extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'local-gallery:verify';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verify JSONs & Images are matching 1:1 in _OUTPUT';

    /**
     * Execute the console command.
     */
    public function handle()
    {

        $jsonTargetDir = '_OUTPUT/jsons/';
        $imageTargetDir = '_OUTPUT/images/';

        $jsonFiles = collect(Storage::disk('tmp')->allFiles($jsonTargetDir))
            ->map(function ($file) {
                return Str::remove('.info', pathinfo($file, PATHINFO_FILENAME));
            });

        $imageFiles = collect(Storage::disk('tmp')->allFiles($imageTargetDir))
            ->map(function ($file) {
                return pathinfo($file, PATHINFO_FILENAME);
            });

        // Find differences
        $jsonOnly = $jsonFiles->diff($imageFiles);
        $imageOnly = $imageFiles->diff($jsonFiles);

        if ($jsonOnly->isEmpty() && $imageOnly->isEmpty()) {
            $this->info('All files match perfectly!');
            return 0;
        }

        if (!$jsonOnly->isEmpty()) {
            $this->error('JSON files without matching images:');
            $this->line(implode(', ', $jsonOnly->toArray()));
        }

        if (!$imageOnly->isEmpty()) {
            $this->error('Image files without matching JSON:');
            $this->line(implode(', ', $imageOnly->toArray()));
        }

        return 1;
    }
}
