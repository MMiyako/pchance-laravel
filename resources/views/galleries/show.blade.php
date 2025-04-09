<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Laravel</title>
    <style>
        
        body {
            background-color: #e3e3e3;
        }

        #wrapper {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 1rem;
        }

        #wrapper>div {
            border: 2px solid #000;
        }

        .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px;
        }

        .footer p {
            margin: 0;
            padding: 0;
        }

        .favourite-btn {
            cursor: pointer;
        }

    </style>
</head>

<body>

    <h2>Gallery {{ $gallery->name }}</h2>

    <div id="wrapper">
        @foreach ($gallery->images->reverse() as $image)
            <div>
                <div class="image">
                    <img src="{{ asset("storage/{$gallery->generator->name}_{$gallery->name}/" . $image->name . '.' . $image->type) }}">
                </div>
                <div class="footer">
                    <p>{{ $image->index }}</p>
                    <a class="favourite-btn"
                        data-id="{{ $image->id }}">
                        {{ $image->is_favourite ? '❤️' : '🤍' }}
                    </a>
                </div>
            </div>
        @endforeach
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <script>
        $(document).ready(function() {
            $('.favourite-btn').on('click', function() {
                var button = $(this);
                var imageId = button.data('id');

                $.ajax({
                    url: '/images/' + imageId + '/favourite',
                    type: 'POST',
                    data: {
                        _token: '{{ csrf_token() }}'
                    },
                    success: function(response) {
                        if (response.is_favourite) {
                            button.text('❤️');
                        } else {
                            button.text('🤍');
                        }
                    },
                    error: function(xhr) {
                        console.log(xhr.responseText);
                    }
                });
            });
        });
    </script>

</body>

</html>
