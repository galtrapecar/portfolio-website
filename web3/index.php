<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grab A Token!</title>

    <link rel="stylesheet" href="./style.css">
</head>
<body>
    
    <div class="navbar">
        <div class="balance">BALANCE: </div>
        <div class="account"></div>
        <div class="import">IMPORT</div>
    </div>

    <section class="token">
        <div class="inner">

            <div class="wrapper">
                <div class="btn" data-error="false">
                    <div class="loader">
                        <div class="ball"></div>
                        <div class="ball"></div>
                        <div class="ball"></div>
                    </div>

                    <div class="btn-top"></div>
                    <div class="btn-bottom"></div>
                </div>

                <div id="console"></div>
            </div>
        </div>
    </section>

    <script src="./index.js"></script>
</body>
</html>