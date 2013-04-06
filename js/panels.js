var panel_handles = $(".panel > h1");
            var ph = $("#placeholder");
            var landing_col = 0;
            var hit_col = null;
            var current_panel;
            var is_dragging = false;
            var mouse_offset = {};
            var static_y = 0;
            var static_x = 0;
            var static_height = 0;
            var static_width = 0;
            var panel_padding = 10;
            var panel_container = $(".main");
            var container_width = parseInt(panel_container.css("padding"));
            var global_attrs = {};
            global_attrs.panel_width = 200;
            var interior_offset = function () {
                return panel_container.offset().left + container_width;
            };
            var get_x_for_column = function (i) {
                var offset = panel_padding;
                if (i > 0) {
                    offset = (panel_padding * i);
                }
                var ret = (global_attrs.panel_width * i) + offset;
                ret = ret + ((panel_padding * 4) * i)
                if (i == 1) ret = ret + 5;
                return ret;
            };

            $(function () {
                var i = 0;
                panel_handles.each(function () {
                    current_panel = $(this).parent();
                    var y = parseInt(current_panel.offset().top);
                    var w = parseInt(current_panel.width());
                    var h = parseInt(current_panel.height());
                    //var x = parseInt(current_panel.offset().left + (w * i));
                    var x = get_x_for_column(i);
                    console.log("var x = " + x);
                    current_panel.css("position", "absolute")
                        .css("width", w + "px")
                        .css("height", h + "px")
                        .css("top", y + "px")
                        .css("left", x + "px");
                    i++;
                });
            });

            panel_handles.bind("mousedown", function (e) {
                current_panel = $(this).parent();

                is_dragging = true;
                mouse_offset.x = e.offsetX;
                mouse_offset.y = e.offsetY;
                static_y = parseInt(current_panel.css("top"));
                static_x = parseInt(current_panel.css("left"));
                static_width = parseInt(current_panel.width());
                static_height = parseInt(current_panel.height());
                panel_padding = parseInt(current_panel.css("padding"));

                current_panel.addClass("seethru");
                ph.css("position", "relative")
                    .css("width", static_width + "px")
                    .css("height", static_height + "px")
                    .css("top", static_y + "px")
                    .css("left", static_x + "px")
                    .show();
                current_panel.css("position", "absolute")
                    .css("width", static_width + "px")
                    .css("height", static_height + "px")
                    .css("top", static_y + "px")
                    .css("left", static_x + "px");
            });

            $(window).bind("mousemove", function (e) {
                if (!is_dragging) {
                    return false;
                }
                var new_left = (e.clientX - mouse_offset.x);
                if (
                new_left >= interior_offset() && ((new_left + static_width - (panel_padding * hit_col)) <= panel_container.width())) {
                    current_panel.css("left", new_left);
                    var CC = Math.floor((new_left + (global_attrs.panel_width / 2)) / global_attrs.panel_width);
                    landing_col = CC;
                    var ph_x = get_x_for_column(CC);
                    //ph.css("left", ph_x + "px");
                    if (hit_col !== CC) {
                        ph.animate({
                            left: ph_x + "px"
                        }, 55);
                    }
                    hit_col = landing_col;
                }

            });

            $(window).bind("mouseup", function (e) {
                if (!is_dragging) {
                    return false;
                }
                ph.hide();
                current_panel.removeClass("seethru");
                var landing_x = get_x_for_column(landing_col);
                current_panel.animate({
                    left: landing_x + "px"
                }, 55, function () {
                    ph.hide();
                });
                is_dragging = false;
                current_panel = null;
            });