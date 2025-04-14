<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Slideshow</title>
    @vite(['resources/css/slideshow.css', 'resources/js/slideshow.js'])
</head>

<body>
    <div id="wrapper">

        @for ($i = 1; $i <= 10; $i++)
            <div id="card-{{ $i }}" class="card">
                <div class="settings">
                    <select class="select-generator">
                        <option value="">Generator</option>
                        @foreach ($generators as $generator)
                            <option value="{{ $generator->id }}">{{ $generator->name }}</option>
                        @endforeach
                    </select>

                    <select class="select-gallery">
                        <option value="">Gallery</option>
                    </select>

                    <input type="number" class="input-from" placeholder="From">
                    <input type="number" class="input-to" placeholder="To">

                    <input type="number" class="input-timer" placeholder="Seconds (Default: 7)">

                    <button class="button-submit">Go</button>
                </div>
                <div class="slider"></div>
                <div class="flash-overlay">▶</div>
                <div class="status-overlay">
                    <div class="pause-status"></div>
                    <div class="countdown-timer"></div>
                    <div class="image-status"></div>
                </div>
            </div>
        @endfor

    </div>

    <div class="helper">
        <ul>
            <li><span>🡐</span>Previous</li>
            <li><span>🡒</span>Next</li>
            <li><span>🡑</span>Faster</li>
            <li><span>🡓</span>Slower</li>
            <li><span>H</span>Overlay</li>
            <li><span>P</span>Pause</li>
            <li><span>S</span>Settings</li>
        </ul>
    </div>

</body>

</html>
