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
      panel_width: 210
    },

  exports = {

    interior_offset: function () {
      return panel_container.offset().left;
    },

    get_x_for_column: function(i) {
      var offset = panel_padding;

      if (i > 0) {
        offset = (panel_padding * i+1) + panel_padding;
      }
      
      //var num = global_attrs.panel_width * i + offset + ((panel_padding * 4) * i);
      //console.log( ""+global_attrs.panel_width+" * "+i+" + "+offset+" + ("+panel_padding+" * "+4+") * "+i+") = "+num);
      
      snap_offset_fix = offset;
      var num = (global_attrs.panel_width * i) + 5;
      
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
        
        console.log(e);
        
        var xpos, ypos;
        
        if(e.offsetX==undefined) {
          xpos = e.pageX-$(this).offset().left;
          ypos = e.pageY-$(this).offset().top;
        }else{
          xpos = e.offsetX;
          ypos = e.offsetY;
        }

        is_dragging = true;
        mouse_offset.x = xpos;
        mouse_offset.y = ypos;
        static_y = ~~(current_panel.offset().top);
        static_x = ~~(self.get_x_for_column(current_panel.attr('data-pi')));
        static_width = current_panel.width();
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
              new_left >= self.interior_offset()
          ){

          current_panel.css("left", new_left - panel_padding);
          
          var column = ((new_left + (global_attrs.panel_width / 2)) / global_attrs.panel_width) ;
          landing_col = ~~(column);
          
          ph_x = self.get_x_for_column(landing_col);

          if (hit_col !== landing_col) {
            ph.animate({
              left: ph_x + "px"
            }, 55);
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
