// Copyright (c) 2020 by adult swim (https://codepen.io/adultswim/pen/QEbzKJ)
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// uses plax.js

$(document).ready(function() {
    Preloader.init();
})

Preloader = {
    init: function() {
        var imagesSrcArray = [];
        $('.preload').each(function(i) {
            imagesSrcArray[i] = $(this).data('src');
        })

        $.imgpreload(imagesSrcArray, {
            each: function() {},
            all: function() {
                Preloader.loaded();
                $('#preloader').remove();
            }
        });
    },

    loaded: function() {
        Cursor.init();
        Imagery.init();
        Audio.init();
    }
}

Cursor = {
    self: null,
    selectedCursorIndex: 0,
    cursors: [{
        'name': 'finesse',
        'src': 'images/finesse.png'
    }, {
        'name': 'hangloose',
        'src': 'images/hangloose.png'
    }, {
        'name': 'moqueca',
        'src': 'images/moqueca.png'
    }, {
        'name': 'slap-that',
        'src': 'images/slap-that.png'
    }, {
        'name': 'slap-this',
        'src': 'images/slap-this.png'
    }],

    init: function() {
        var selectedCursor = Cursor.cursors[Math.floor(Math.random() * Cursor.cursors.length)];
        Cursor.selectedCursorIndex = Cursor.cursors.indexOf(selectedCursor);

        $('body').css('cursor', 'url(' + Cursor.cursors[Cursor.selectedCursorIndex].src + '), auto');
    },

    followMouse: function() {
        $(document).mousemove(function(e) {
            Cursor.self.css({
                left: e.pageX - (Cursor.self.width() / 2),
                top: e.pageY - (Cursor.self.height() / 2)
            });
        });
    },

    hide: function() {
        Cursor.self.hide();
    },

    show: function() {
        Cursor.self.show();
    }
}

Audio = {
    init: function() {
        $(".animated-head").each(function() {
            var $this = $(this);
            var path = $this.data("sound");

            $this.jPlayer({
                ready: function() {
                    $this.jPlayer("setMedia", {
                        mp3: path + ".mp3",
                        oga: path + ".ogg"
                    });
                },
                size: {
                    width: $this.data('width'),
                    height: $this.data('height')
                },
                preload: 'auto',
                supplied: "mp3, ogg",
                loop: true,
                swfPath: "Jplayer.swf"
            });
        });

        $('#intro').jPlayer({
            ready: function() {
                $(this).jPlayer("setMedia", {
                    mp3: "sounds/intro.mp3",
                    oga: "sounds/intro.ogg"
                });

                var click = document.ontouchstart === undefined ? 'click' : 'touchstart';
                var kickoff = function () {
                    $('#intro').jPlayer("play");
                    $('.intro').fadeOut(16000);
                    document.documentElement.removeEventListener(click, kickoff, true);
                };

                document.documentElement.addEventListener(click, kickoff, true);
            },
            preload: 'auto',
            supplied: "mp3, ogg",
            loop: false,
            swfPath: "Jplayer.swf"
        });
    }
}

Imagery = {
    tileWidth: 800,
    windowWidth: 0,

    init: function() {
        Imagery.insertIntoCSS();
        Imagery.parallax();
    },

    insertIntoCSS: function() {
        $('.preload').each(function(i) {
            $(this).css('background-image', 'url(' + $(this).data('src') + ')');
        })
    },

    parallax: function() {
        Imagery.sizeToFit()

        $(window).resize(function() {
            Imagery.sizeToFit();
        })

        $('#background-1').plaxify({
            "xRange": 40,
            "yRange": 40
        })
        $('#background-2').plaxify({
            "xRange": 20,
            "yRange": 20,
            "invert": true
        })
        $('#background-3').plaxify({
            "xRange": 100,
            "yRange": 100,
            "invert": true
        })
        $('#background-4').plaxify({
            "xRange": 50,
            "yRange": 50,
            "invert": true
        })
        $('#background-5').plaxify({
            "xRange": 30,
            "yRange": 30,
            "invert": true
        })

        $('.animated-head').each(function(i) {
            var $this = $(this);

            var range = Math.floor((Math.random() * 10) + 1) * 10;
            var invert = Math.random() < 0.5 ? true : false;

            $this.plaxify({
                "xRange": range,
                "yRange": range,
                "invert": invert
            })

            $this.hover(function() {
                // console.log($this)
                $this.jPlayer("play");
            }, function() {
                $this.jPlayer("stop");
            })
        })

        $.plax.enable()
    },

    sizeToFit: function() {
        Imagery.windowWidth = $(window).width();
        var tileAmnt = Imagery.windowWidth / Imagery.tileWidth;
        tileAmnt = Math.ceil(tileAmnt);
        var newTileWidth = Imagery.windowWidth / tileAmnt;

        $('.background').css('background-size', newTileWidth);
    }
}