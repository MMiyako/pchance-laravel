<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class LocalGallerySort extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'local-gallery:sort';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Move files from galleries to _OUTPUT';

    /**
     * Execute the console command.
     */
    public function handle()
    {

        $files = Storage::disk('tmp')->allFiles('galleries');

        $jsons = collect($files)->filter(fn($file) => Str::endsWith($file, '.json'))->all();
        $images = collect($files)->reject(fn($file) => Str::endsWith($file, '.json'))->all();

        // Verify counts match
        if (count($jsons) !== count($images)) {
            $this->error('Mismatch between JSON and image file counts!');
            $this->table(
                ['File Type', 'Count'],
                [
                    ['JSON Files', count($jsons)],
                    ['Image Files', count($images)]
                ]
            );
            return;
        }

        $total = count($jsons);
        $progress = $this->output->createProgressBar($total * 2); // For both JSONs and images
        $progress->setFormat("%current%/%max% [%bar%] %percent:3s%%");

        $successJson = 0;
        $successImage = 0;
        $failedJson = 0;
        $failedImage = 0;
        $skippedJson = 0;
        $skippedImage = 0;

        // Prepare target directories
        $jsonTargetDir = '_OUTPUT/jsons/';
        $imageTargetDir = '_OUTPUT/images/';
        Storage::disk('tmp')->makeDirectory($jsonTargetDir);
        Storage::disk('tmp')->makeDirectory($imageTargetDir);

        // Process JSON files
        foreach ($jsons as $file) {
            $targetPath = $jsonTargetDir . basename($file);

            // Skip if file already exists in target
            if (Storage::disk('tmp')->exists($targetPath)) {
                $skippedJson++;
                $progress->advance();
                continue;
            }

            try {
                Storage::disk('tmp')->move($file, $targetPath);
                $successJson++;
            } catch (\Exception $e) {
                $failedJson++;
                $this->newLine();
                $this->warn("Failed to move JSON {$file}: " . $e->getMessage());
            }

            $progress->advance();
        }

        // Process image files
        foreach ($images as $file) {
            $targetPath = $imageTargetDir . basename($file);

            // Skip if file already exists in target
            if (Storage::disk('tmp')->exists($targetPath)) {
                $skippedImage++;
                $progress->advance();
                continue;
            }

            try {
                Storage::disk('tmp')->move($file, $targetPath);
                $successImage++;
            } catch (\Exception $e) {
                $failedImage++;
                $this->newLine();
                $this->warn("Failed to move image {$file}: " . $e->getMessage());
            }

            $progress->advance();
        }

        $progress->finish();
        $this->newLine(2);

        // Verification
        $remainingFiles = count(Storage::disk('tmp')->allFiles('galleries'));
        if ($remainingFiles > 0) {
            $this->warn("Warning: There are {$remainingFiles} files remaining in the source directory!");
        }

        // Results
        $this->table(
            ['JSON', 'Count'],
            [
                ['Total', $total],
                ['Moved', $successJson],
                ['Skipped', $skippedJson],
                ['Failed', $failedJson]
            ]
        );

        $this->table(
            ['Image', 'Count'],
            [
                ['Total', $total],
                ['Moved', $successImage],
                ['Skipped', $skippedImage],
                ['Failed', $failedImage]
            ]
        );
    }
}
