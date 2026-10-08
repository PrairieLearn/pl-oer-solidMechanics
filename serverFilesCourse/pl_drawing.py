#################################################
#
# DOCUMENTATION IS AVAILABLE AT THIS ADDRESS:   
# https://files.jcrayb.com/pretty/files/misc/pl_drawing_docs.md
#
#################################################


class Drawing:
    elements = []
    def __init__(self) -> None:
        self.elements.append(self)    

    def code(self, obj, shift={}):
        args = []
        for key, value in self.__dict__.items():
            if key == 'obj': continue
            
            args.append(f"{key.replace('_', '-')}={value}" if not key in shift else f"{key.replace('_', '-')}={value+shift[key]}")
            
        arg_string =  ' '.join(args)
        return f'<pl-{obj} {arg_string}></pl-{obj}>'

    def compile(self, clear=True, shift={}):
        html = ' '.join([e.code(e.obj, shift) for e in self.elements])
        if clear: self.elements.clear()
        return html
    
class Element(Drawing):
    def __init__(self, x1, y1, **kwargs):
        super().__init__()

        self.x1 = x1
        self.y1 = y1
        if 'color' in kwargs: self.color = kwargs['color']
        if 'opacity' in kwargs: self.opacity = kwargs['opacity']

class Shape(Element):
    def __init__(self, x1, y1, **kwargs):
        super().__init__(x1, y1, **kwargs)

        if 'stroke_color' in kwargs: self.stroke_color = kwargs['stroke_color']
        if 'stroke_width' in kwargs: self.stroke_width = kwargs['stroke_width']
        if 'angle' in kwargs: self.angle = kwargs['angle']

class Label(Element):
    def __init__(self, x1, y1, label, **kwargs):
        super().__init__(x1, y1, **kwargs)
        self.label = f'\"{label}\"'
        if 'offsetx' in kwargs: self.offsetx = kwargs['offsetx']
        if 'offsety' in kwargs: self.offsety = kwargs['offsety']

class Rectangle(Shape):
    def __init__(self, x1, y1, height, width, top_right_corner=False, **kwargs):
        self.obj = 'rectangle'
        if top_right_corner:
            super().__init__(x1+width/2, y1+height/2, **kwargs)
        else:
            super().__init__(x1, y1, **kwargs)
        self.height = height
        self.width = width
    
class Circle(Shape):
    def __init__(self, x1, y1, radius, **kwargs):
        self.obj = 'circle'
        super().__init__(x1, y1, **kwargs)
        self.radius = radius
        if 'label' in kwargs: self.label = f'\"{kwargs["label"]}\"' 

class Line(Shape):
    def __init__(self, x1, y1, **kwargs):
        self.obj = 'line'
        if 'color' in kwargs: 
            self.stroke_color = kwargs['color']
            kwargs.pop('color', None)
        super().__init__(x1, y1, **kwargs)
        if 'width' in kwargs: self.width = kwargs['width']
        if 'angle' in kwargs: self.angle = kwargs['angle']
        
        
        if 'x2' in kwargs: self.x2 = kwargs['x2']
        if 'y2' in kwargs: self.y2 = kwargs['y2']
        if 'dashed_size' in kwargs: self.dashed_size = kwargs['dashed_size']

class Point(Label):
    def __init__(self, x1, y1, label, **kwargs):
        self.obj = 'point'
        super().__init__(x1, y1, label, **kwargs)
        if 'radius' in kwargs: self.radius = kwargs['radius']

class Vector(Label):
    def __init__(self, x1, y1, label, **kwargs):
        self.obj = 'vector'
        super().__init__(x1, y1, label, **kwargs)
        if 'width' in kwargs: self.width = kwargs['width']
        if 'angle' in kwargs: self.angle = kwargs['angle']
        if 'anchor_is_tail' in kwargs: self.anchor_is_tail = kwargs['anchor_is_tail']
        if 'arrow_head_width' in kwargs: self.arrow_head_width = kwargs['arrow_head_width']
        if 'arrow_head_length' in kwargs: self.arrow_head_length = kwargs['arrow_head_length']
        if 'stroke_width' in kwargs: self.stroke_width = kwargs['stroke_width']

class DoubleVector(Vector):
    def __init__(self, x1, y1, label, **kwargs):
        super().__init__(x1, y1, label, **kwargs)
        self.obj = 'double-headed-vector'

class ArcVector(Vector):
    def __init__(self, x1, y1, radius, label, **kwargs):
        super().__init__(x1, y1, label, **kwargs)
        self.obj = 'arc-vector'
        self.radius = radius
        if 'draw_center' in kwargs: self.draw_center = kwargs['draw_center']
        if 'start_angle' in kwargs: self.start_angle = kwargs['start_angle']
        if 'end_angle' in kwargs: self.end_angle = kwargs['end_angle']
        if 'clockwise_direction' in kwargs: self.clockwise_direction = kwargs['clockwise_direction']
    
class Dimensions(Label):
    def __init__(self, x1, y1, label, **kwargs):
        self.obj = 'dimensions'
        if 'color' in kwargs: 
            self.stroke_color = kwargs['color']
            kwargs.pop('color', None)
        super().__init__(x1, y1, label, **kwargs)
        if 'width' in kwargs: self.width = kwargs['width']
        if 'angle' in kwargs: self.angle = kwargs['angle']
        
        if 'x2' in kwargs: self.x2 = kwargs['x2']
        if 'y2' in kwargs: self.y2 = kwargs['y2']
        
        if 'draw_start_arrow' in kwargs: self.draw_start_arrow = kwargs['draw_start_arrow']
        if 'draw_end_arrow' in kwargs: self.draw_end_arrow = kwargs['draw_end_arrow']
        if 'arrow_head_width' in kwargs: self.arrow_head_width = kwargs['arrow_head_width']
        if 'arrow_head_length' in kwargs: self.arrow_head_length = kwargs['arrow_head_length']
        if 'stroke_width' in kwargs: self.stroke_width = kwargs['stroke_width']

class Text(Label):
    def __init__(self, x1, y1, label, **kwargs):
        self.obj = 'text'
        super().__init__(x1, y1, label, **kwargs)
        if 'latex' in kwargs: self.latex = kwargs['latex']
        if 'font_size' in kwargs: self.font_size = kwargs['font_size']

class Polygon(Drawing):
    def __init__(self, plist, **kwargs):
        self.obj = 'polygon'
        super().__init__()
        self.plist = str(plist)
        if 'color' in kwargs: self.color = kwargs['color']
        if 'opacity' in kwargs: self.opacity = kwargs['opacity']
        if 'stroke_color' in kwargs: self.stroke_color = kwargs['stroke_color']
        if 'stroke_width' in kwargs: self.stroke_width = kwargs['stroke_width']