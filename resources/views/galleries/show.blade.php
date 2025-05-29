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

        .flash-message {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px;
            border-radius: 5px;
            color: white;
            z-index: 1000;
            animation: slideIn 0.5s forwards;
        }

        .flash-message.success {
            background-color: #4CAF50;
        }

        .flash-message.error {
            background-color: #f44336;
        }

        @keyframes slideIn {
            from {
                right: -300px;
            }

            to {
                right: 20px;
            }
        }
    </style>
</head>

<body>

    <h2>Gallery {{ $gallery->name }}</h2>

    <div id="wrapper">
        @foreach ($gallery->images->reverse() as $image)
            <div>
                <div class="image">
                    <img
                        src="{{ asset("storage/{$gallery->generator->name}_{$gallery->name}/" . $image->name . '.' . $image->type) }}">
                </div>
                <div class="footer">
                    <p>{{ $image->index }}</p>
                    <a class="favourite-btn" data-id="{{ $image->id }}">
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
                            showFlashMessage('Added to favorites! Total favorites: ' + response.favourite_count, 'success');
                        } else {
                            button.text('🤍');
                            showFlashMessage('Removed from favorites! Total favorites: ' + response.favourite_count, 'success');
                        }
                    },
                    error: function(xhr) {
                        console.log(xhr.responseText);
                    }
                });
            });
        });

        function showFlashMessage(message, type) {
            // Create a flash message element (adjust this to match your UI)
            var flashDiv = $('<div class="flash-message ' + type + '">' + message + '</div>');
            $('body').append(flashDiv);

            // Auto-hide after 3 seconds
            setTimeout(function() {
                flashDiv.fadeOut('slow', function() {
                    $(this).remove();
                });
            }, 3000);
        }
    </script>

</body>

</html>
