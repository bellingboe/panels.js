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
      return ((x + (global_attrs.panel_width / 2)) / global_attrs.panel_width);
    },

    get_x_for_column: function(i) {
      var offset = panel_padding;

      if (i > 0) {
        offset = (panel_padding * i+1) + panel_padding;
      }
      
      //var num = global_attrs.panel_width * i + offset + ((panel_padding * 4) * i);
      //console.log( ""+global_attrs.panel_width+" * "+i+" + "+offset+" + ("+panel_padding+" * "+4+") * "+i+") = "+num);
      
      snap_offset_fix = offset;
      var num = (global_attrs.panel_width * i) + offset;
      
      return num;
    },
    
    in_padding_space_for_col: function(x,c){

      var self = this, in_sapce;
      var starting_x = self.get_x_for_column(c+1);
      var ending_x = starting_x + global_attrs.panel_width;
      
      var starting_padding_left = starting_x - panel_padding;
      var ending_padding_left = starting_x;
      
      var starting_padding_right = ending_x;
      var ending_padding_right = ending_x + panel_padding;
      
      console.log("["+starting_padding_left +"     "+ending_padding_left+"] ======= "+x+" ====== ["+starting_padding_right +"     "+ending_padding_right+"] ");
      
      if(
         (x >= starting_padding_left && x <= ending_padding_left) ||
         (x >= starting_padding_right && x <= ending_padding_right) 
        ) {
          in_space = true;
      }else{
        in_space = false;
      }
      
      return in_space;
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
          var cur_offset = cur_col>0 ? cur_col*panel_padding : 0;
          
          new_left = ~~(new_left - cur_offset);
          
          // This logic to find which column your mouse is in, is faulty.
          // The further right you move a panel, the less space you have to move before jumping to the next column
          // Maybe it has something to do with the "+ offset;" on line 42. If I take that out, the snapping seems just fine.
          
          // the logic is as follows:
          // (our mouse position + half panel width) / panel width = column
          // that's obviously wrong, but barely.

          landing_col = ~~(self.get_column_for_x(new_left));
          
          ph_x = self.get_x_for_column(landing_col);
          var inspace = self.in_padding_space_for_col(new_left,landing_col);
          
          if (hit_col !== landing_col && !inspace) {
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
