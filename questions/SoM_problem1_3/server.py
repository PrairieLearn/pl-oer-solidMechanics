import random

def generate(data):
    d = random.randint(10, 29)
    w = random.randint(40, 79)
    base_a = random.randint(3, 5)  # common base length in ft
    k1 = random.randint(2, 3)
    k2 = random.randint(2, 4)
    k3 = random.randint(2, 4)
    a, b, c = k1*base_a, k2*base_a, k3*base_a
    roof_dir = -1  # Snow loads always act downward
    room_dir = -1  # Mechanical-room load always acts downward
    L = a + b + c
    xA, xB = 75.0, 705.0
    scale = (xB-xA)/L
    xD = xA+a*scale
    xC = xA+(a+b)*scale
    # Load results in lb: uniform roof load, triangular drift, and
    # mechanical-room snow transmitted equally to C and B.
    F_uniform = roof_dir*w*d*(a+b)
    F_drift = roof_dir*w*(2*d)*b/2
    F_room_half = room_dir*w*d*c/2
    moment = (F_uniform*(a+b)/2 + F_drift*(a+2*b/3)
              + F_room_half*(a+b) + F_room_half*L)
    By = -moment/L
    Ay = -(F_uniform+F_drift+2*F_room_half)-By
    p = data['params']
    p.update(k1_label=("a" if k1 == 1 else f"{k1}a"), k2_label=("a" if k2 == 1 else f"{k2}a"), k3_label=("a" if k3 == 1 else f"{k3}a"))
    p.update(k1=k1,k2=k2,k3=k3,d=d,w=w,base_a=base_a,a=a,b=b,c=c,xD=round(xD,2),xC=round(xC,2),
             m1=round((xA+xD)/2,2),m2=round((xD+xC)/2,2),
             m3=round((xC+xB)/2,2),
             roof_direction='upward' if roof_dir==1 else 'downward',
             room_direction='upward' if room_dir==1 else 'downward')
    # Draw the snow loading as THREE distinct physical regions:
    # A--D: depth d on the main roof;
    # D--C: triangular drift increasing from d to 3d;
    # C--B: EMPTY mechanical-room space, with snow only on its roof.
    parts = []
    beam_y = 184.0
    base_y = 151.0
    peak_y = 112.0
    room_roof_y = 112.0
    room_snow_top_y = 72.0
    red = '#a54c45'
    green = '#919c68'

    def line(x1, y1, x2, y2, color=red, width=2):
        parts.append(f'<pl-line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke-color="{color}" stroke-width="{width}"></pl-line>')

    def label(x, y, value, size=17):
        parts.append(f'<pl-text x1="{x:.2f}" y1="{y:.2f}" label="{value}" font-size="{size}"></pl-text>')

    def arrow(x, top, bottom):
        length = bottom - top
        parts.append(f'<pl-vector x1="{x:.2f}" y1="{top:.2f}" width="{length:.2f}" angle="90" color="{red}"></pl-vector>')

    def bracket(x, ytop, ybottom, title, side='right'):
        # Explicit horizontal end caps and a vertical measurement line.
        line(x, ytop, x, ybottom, green, 2)
        line(x-8, ytop, x+8, ytop, green, 2)
        line(x-8, ybottom, x+8, ybottom, green, 2)
        label(x + (23 if side=='right' else -23), (ytop+ybottom)/2, title, 19)

    # Main roof snow, including the sloping drift envelope.
    line(xA, base_y, xD, base_y)
    line(xD, base_y, xC, peak_y)
    for i in range(5):
        arrow(xA+(xD-xA)*i/4, base_y, beam_y)
    for i in range(1, 8):
        t = i/7
        arrow(xD+(xC-xD-10)*t, base_y+(peak_y-base_y)*t, beam_y)

    # Mechanical room: outlined EMPTY interior, C--B.
    # Its roof is at 3d; arrows for its snow terminate at that roof,
    # never at the beam beneath the room.
    line(xC, room_roof_y, xC, beam_y, '#555555', 2)
    line(xC, room_roof_y, xB, room_roof_y, '#555555', 2)
    line(xB, room_roof_y, xB, beam_y, '#555555', 2)
    label((xC+xB-30)/2, (room_roof_y+beam_y)/2, 'room', 17)

    line(xC, room_snow_top_y, xB, room_snow_top_y)
    for i in range(5):
        arrow(xC+(xB-xC)*i/4, room_snow_top_y, room_roof_y)

    # Height measurements: d at A, 3d at C, d above mechanical room.
    bracket(xA-28, base_y, beam_y, 'd', 'left')
    bracket(xB+25, peak_y, beam_y, '3d', 'right')
    bracket(xB+25, room_snow_top_y, room_roof_y, 'd', 'right')
    p['load_drawing'] = '\n'.join(parts)
    data['correct_answers']['answer1']=Ay/1000
    data['correct_answers']['answer2']=By/1000
