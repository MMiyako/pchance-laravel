<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Laravel</title>
    <style></style>

    <!-- Styles / Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class=dragscroll>

    <div id="wrapper">
        <div class="slider" id="slider1">
            @for ($i = 0; $i < 25; $i++)
                <img
                    src="{{ asset("storage/{$gallery->generator->name}_{$gallery->name}/" . $gallery->images[$i]->name . '.' . $gallery->images[$i]->type) }}">
            @endfor
        </div>

        <div class="slider" id="slider2">
            @for ($i = 25; $i < 50; $i++)
                <img
                    src="{{ asset("storage/{$gallery->generator->name}_{$gallery->name}/" . $gallery->images[$i]->name . '.' . $gallery->images[$i]->type) }}">
            @endfor
        </div>
    </div>

</body>

</html>
