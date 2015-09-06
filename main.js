"use strict";

(function() {
    var BROWSER_PREFIXES = ["-webkit-", "-moz-", "-ms-", "-o-", ""];

    function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function getQuery() {
        var query = {};
        var pairs = window.location.search.substring(1).split("&");
        var pair;
        for(var i = 0; i < pairs.length; i++) {
            pair = pairs[i].split('=');
            query[pair[0]] = pair[1];
        }
        return query;
    }

    function injectStyle(rules) {
        $("head").append("<style>" + rules + "</style>");
    }

    function injectAnimationStyle(element, width, height, angle, speed) {
        var radians = -angle * Math.PI / 180;

        if (speed < 0) {
            speed = Math.abs(speed);
            radians += Math.PI;
        }

        var x = width * Math.round(1000 * Math.cos(radians));
        var y = height * Math.round(1000 * Math.sin(radians));
        var distance = Math.sqrt(x * x + y * y);
        var time = distance / speed;

        if (!isNumeric(time)) {
            return;
        }

        var baseKeyframeString = "keyframes animate-background { 0% { background-position: 0 0; } 100% { background-position: " + x + "px "  + y + "px; } }\n";
        var baseAnimationString = "animation: animate-background " + time + "s linear infinite;";

        var rules = "";

        for (var i = 0; i < BROWSER_PREFIXES.length; i++) {
            rules += "@" + BROWSER_PREFIXES[i] + baseKeyframeString;
        }

        rules += element + " {";
        for (var i = 0; i < BROWSER_PREFIXES.length; i++) {
            rules += BROWSER_PREFIXES[i] + baseAnimationString;
        }
        rules += "}"

        injectStyle(rules);
    }

    function main(query) {
        var url = decodeURIComponent(query["url"]);
        var angle = parseFloat(query["angle"]) || 0;
        var speed = query["speed"] || 200;

        $("<img />").attr("src", url).load(function() {
            var imageWidth = this.width;
            var imageHeight = this.height;

            injectAnimationStyle("body", imageWidth, imageHeight, angle, speed);
            $("body").css("background-image", "url(" + url + ")");
        });
    }

    $(document).ready(function() {
        var query = getQuery();

        if (query["url"]) {
            $("#content").hide();
            main(query);
        } else {
            $("#main-form input").keyup(function() {
                var empty = false;
                $("#main-form input").each(function() {
                    if ($(this).val() === "") {
                        empty = true;
                    }
                });

                if (empty) {
                    $("#submit-button").prop("disabled", true);
                } else {
                    $("#submit-button").prop("disabled", false);
                }
            });
        }
    })
})();