import vm_drawing
from sympy.plotting import plot
import sympy
import numpy as np

elements = [
    {
        'type': 'force',
        'location': 'L',
        'value': '10'
    },
    {
        'type': 'moment',
        'location': '2L',
        'value': '10L'
    },
    {
        'type': 'distributed_load',
        'location': {
            'start': '2L',
            'end': '4 L'
        },
        'value': '5'
    }
]

def display_vm(elements):
    v = vm_drawing.ShearDiagram(4)
    moments = []
    for e in elements:
        type = e['type']

        if type == 'distributed_load':
            start = value_to_number(e['location']['start'])
            end = value_to_number(e['location']['end'])

            w = value_to_number(e['value'])

            v.add_distributed_load(start, end-start, w)
        elif type == 'force':
            location = value_to_number(e['location'])
            value = value_to_number(e['value'])

            v.add_force(location, value)
        else:
            moments.append(e)
    
    m = vm_drawing.MomentDiagram(4, v)

    for me in moments:
        location = value_to_number(me['location'])
        value = value_to_number(me['value'])

        m.add_moment(location, value)
    return v.return_shear_function(), m.return_moment_function()

def value_to_number(location):
    location = location.strip().replace(' ', '')
    if isinstance(location, str):
        if location == 'L':
            return 1
        try:
            location = float(location.replace('L', ''))
        except:
            raise ValueError("Location should be either a number, or a multiple of L, e.g. 4 or '2L'")
    elif isinstance(location, int) or isinstance(location, float):
        pass
    else:
        raise ValueError("Location should be either a number, or a multiple of L, e.g. 4 or '2L'")
    return location

def determine_plot_bounds(function, upper_bound_domain, resolution = 0.01):
    x = sympy.Symbol('x')

    xs = np.linspace(0, upper_bound_domain, int(upper_bound_domain/resolution)+1)

    max_ = 0
    min_ = 0
    for xval in xs:
        y = function.subs(x, xval)

        if y < min_:
            min_ = y
        
        if y > max_:
            max_ = y
    return (min_, max_)

