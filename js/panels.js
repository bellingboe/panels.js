var Panels = (function() {



var panel_handles = $(".panel > h1"),
    ph = $("#placeholder"),
    landing_col = 0,
    hit_col = null,
    landing_col = null,
    current_panel,
    is_dragging = false,
    mouse_offset = {},
    static_y = 0,
    static_x = 0,
    static_height = 0,
    static_width = 0,
    panel_padding = 10,
    panel_container = $(".main"),
    snap_offset_fix = 0,
    container_width = parseInt(panel_container.css("padding"), 10),
    global_attrs = {
      panel_width: 200
    },

  exports = {

    interior_offset: function () {
      return panel_container.offset().left + container_width;
    },
    
    get_column_for_x: function (x) {
      var col = ((x + (global_attrs.panel_width / 2)) / global_attrs.panel_width);
      return col;
    },

    get_x_for_column: function(i) {
      var offset = panel_padding;

      if (i > 0) {
        offset = (panel_padding * i+1) + panel_padding;
      }
      
      //var num = global_attrs.panel_width * i + offset + ((panel_padding * 4) * i);
      //console.log( ""+global_attrs.panel_width+" * "+i+" + "+offset+" + ("+panel_padding+" * "+4+") * "+i+") = "+num);
      
      var num = (global_attrs.panel_width * i);
      
      return num;
    },

    init: function() {
      var self = this,
          i = 0;
          
      // just some preloading
      panel_handles.each(function() {
        current_panel = $(this).parent();

        var x = self.get_x_for_column(i),
            y = ~~(current_panel.offset().top + panel_padding),
            w = ~~(current_panel.outerWidth()),
            h = ~~(current_panel.outerHeight());

        current_panel.css("position", "absolute").css({
          width: w,
          height: h,
          left: x,
          top: y
        }).attr("data-pi",i);

        i++;
      });

      // Mouse down event
      panel_handles.on('mousedown', function(e) {
        current_panel = $(this).parent();

        is_dragging = true;
        mouse_offset.x = e.offsetX;
        mouse_offset.y = e.offsetY;
        static_y = ~~(current_panel.offset().top);
        static_x = ~~(self.get_x_for_column(current_panel.attr('data-pi')));
        static_width = ~~(current_panel.outerWidth());
        static_height = ~~(current_panel.outerHeight());

        current_panel.addClass("seethru");

        ph.css({
          position: 'relative',
          width: static_width,
          height: static_height,
          top: static_y,
          left: static_x
        }).show();

        current_panel.css({
          position: 'absolute',
          width: static_width,
          height: static_height,
          top: static_y,
          left: static_x
        });
      });

      // mouse move event
      $(window).on("mousemove", function (e) {
        var new_left = (e.clientX - mouse_offset.x),
                  CC = landing_col,
                ph_x;

        if (!is_dragging) {
          return false;
        }
        
        if (
              new_left>= self.interior_offset()
             // && (current_panel.offset().left + current_panel.width())  <= panel_container.innerWidth() 
          ){

          current_panel.css("left", new_left - panel_padding);
          var cur_col = parseInt(current_panel.attr('data-pi'));
          var cur_offset = (cur_col>0 ? cur_col*panel_padding : 0)  -10;
          
          //new_left = ~~(new_left - cur_offset);

          landing_col = ~~(self.get_column_for_x(new_left));
          
          ph_x = self.get_x_for_column(landing_col);
          
          if (hit_col !== landing_col) {
            ph.css({
              left: ph_x + "px"
            });
            current_panel.attr("data-pi",landing_col);
          }

          hit_col = landing_col;

        }
      });

      // mouse up event
      $(window).on("mouseup", function (e) {
        if(landing_col == null){
          current_panel.removeClass("seethru");
          is_dragging = false;
          current_panel = null;
          landing_col = null;
          return;
        }
        
        var landing_x = self.get_x_for_column(landing_col);
        if (!is_dragging) {
          return false;
        }

        current_panel.removeClass("seethru");

        current_panel.animate({
          left: landing_x + "px"
        }, 55, function () {
          ph.hide();
        });

        is_dragging = false;
        current_panel = null;
        landing_col = null;
      });
      
    }
  };

  return exports;

}());

Panels.init();
