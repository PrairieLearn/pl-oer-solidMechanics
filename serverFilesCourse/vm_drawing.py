#################################################
#
# DOCUMENTATION IS AVAILABLE AT THIS ADDRESS:   
# https://files.jcrayb.com/pretty/files/misc/vm_drawing_docs.md
#
#################################################

import numpy as np
import sympy as sp

class ShearDiagram:
    def __init__(self, length):
        self.length = length
        self.forces = {0: 0}
        self.dist_loads = []
        self.main_function = 0
    
    def add_force(self, location, force):
        if location > self.length or location < 0:
            raise Exception('Force located out of bounds')
        
        if not force:
            return

        if location in self.forces:
            self.forces[location] += force
        else:
            self.forces[location] = force
            
        self.forces = dict(sorted(self.forces.items()))

    def add_distributed_load(self, start_location, width, load):
        if width < 0:
            raise Exception('Width should be positive')

        if start_location + width > self.length or start_location < 0:
            raise Exception('Distributed load located out of bounds')

        if load:
            self.dist_loads += [(start_location, width, load)]

            self.dist_loads = sorted(self.dist_loads, key= lambda x: x[0])

    def return_shear_function(self):
        if not self.main_function:
            self.return_lines()
            
        return self.main_function

    def return_lines(self):
        x = sp.Symbol('x')
        eps = .0000001
        points = []
        locs = list(self.forces.keys())

        main_function = 0

        for i, (loc, force) in enumerate(self.forces.items()):
            if loc == self.length:
                continue

            main_function += sp.Piecewise((0, x <= loc), \
                                            (force, True))

        for (start_loc, width, load) in self.dist_loads:
            locs += [start_loc, start_loc + width]
            main_function += sp.Piecewise((0, x <= start_loc), \
                                          (load*(x-start_loc), x <= start_loc+width), \
                                            (load*width, True))

        locs = np.unique(locs)

        for i, loc in enumerate(locs):
            if loc == self.length:
                continue

            if i+1 == len(locs):
                points += [(loc, main_function.subs(x, loc+eps)), \
                           (self.length, main_function.subs(x, loc+eps))]
            else:
                points += [(loc, main_function.subs(x, loc+eps)), \
                           (locs[i+1], main_function.subs(x, locs[i+1]-eps))]

        lines = [(points[i], points[i+1]) for i in range(len(points)) \
                 if (i+1 != len(points) and i % 2 == 0)]

        self.locs = locs
        self.points = points
        self.main_function = main_function
        self.lines = lines
        return lines
    
class MomentDiagram:
    def __init__(self, length, ShearDiagram):
        self.length = length
        self.ShearDiagram = ShearDiagram
        self.moments = {0: 0}
        self.main_function = 0

    def add_moment(self, location, moment):
        if location > self.length or location < 0:
            raise Exception('Moment located out of bounds')

        if not moment:
            return

        if location in self.moments:
            self.moments[location] += moment
        else:
            self.moments[location] = moment

        self.moments = dict(sorted(self.moments.items()))
    
    def return_moment_function(self):
        if not self.main_function:
            self.return_lines()
            
        return self.main_function

    def return_lines(self):
        x = sp.Symbol('x')
        eps = .0000001
        lines = []

        v_func = self.ShearDiagram.main_function
        
        if not v_func:
            v_func = self.ShearDiagram.return_shear_function()

        locs = list(self.ShearDiagram.locs) 
        
        main_function = sp.integrate(v_func)
        for loc, moment in self.moments.items():
            locs += [loc]
            locs = sorted(np.unique(locs))
            main_function += sp.Piecewise((0, x <= loc), \
                                        (-moment, True))
        #print(locs)
        self.main_function = main_function
        for i, loc in enumerate(locs):
            if loc == self.length:
                continue
            
            if i+1 == len(locs):
                l0 = loc+eps
                l1 = self.length-eps
            else:
                l0 = loc
                l1 = locs[i+1]
            line = [(l0, main_function.subs(x, l0+eps)), \
                        (l1, main_function.subs(x, l1-eps))]
            
            p0, p1 = (v_func.subs(x, l0+eps), v_func.subs(x, l1-eps))

            if p0 != p1:
                x0 = l0
                y0 = main_function.subs(x, l0 + eps)
                x1 = l1
                y1 = main_function.subs(x, l1 - eps)
                
                s1 = v_func.subs(x, l0 + eps)
                s2 = v_func.subs(x,  l1 - eps)
        
                p3x = (s1*x0-s2*x1-y0+y1)/(s1-s2)
        
                p3y = s2*(p3x-x1)+y1

                line += [(p3x, p3y)]
            lines += [line]
        return lines

def generate_coords(p):
    return '{"x": ' + str(p[0]) + ',"y": ' + str(p[1]) + '}'

def generate_labels(axis,loc,lab,offsetx=None,offsety=None):
    text = '{"axis": "' + axis + '", "pos": ' + str(loc) + ', "lab": "' + lab + '" '
    if offsetx is not None:
        text += ', "offsetx": ' + str(offsetx)
    if offsety is not None:
        text += ', "offsety": ' + str(offsety)
    text += '}'
    return text
