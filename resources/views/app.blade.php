<!DOCTYPE html>
<html class="h-full min-h-full" lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <title>To-Dos</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
        <link href="/favicon.ico" rel="icon" />
        <link href="https://rsms.me/inter/inter.css" rel="stylesheet" />
        <link href="{{ mix('/css/app.css') }}" rel="stylesheet">
    </head>
    <body class="h-full min-h-full font-sans">
        <div class="h-full min-h-full bg-gray-100" id="root"></div>
        <script src="{{ mix('/js/app.js') }}"></script>
    </body>
</html>
