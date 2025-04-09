<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Laravel</title>
</head>

<body>

    <h2>Galleries</h2>

    <ul>
        @foreach ($galleries as $gallery)
            <li>
                <a href="{{ route('galleries.show', $gallery->id) }}">{{ $gallery->name }}</a>
            </li>
        @endforeach
    </ul>

</body>

</html>
