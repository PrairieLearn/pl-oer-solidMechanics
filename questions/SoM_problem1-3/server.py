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
    # Native distributed loads preserve the distinct roof, drift and room regions.
    # Snow on the mechanical room ends at its roof, leaving the room empty.
    parts = []
    def load(left, right, y, w1, w2, name=""):
        parts.append(
            f'<pl-distributed-load x1="{(left+right)/2:.2f}" y1="{y:.2f}" '
            f'width="{right-left:.2f}" w1="{w1:.2f}" w2="{w2:.2f}" '
            f'anchor-is-tail="false" color="red3" stroke-width="2" spacing="18" '
            f'></pl-distributed-load>'
        )
        if name:
            parts.append(
                f'<pl-text x1="{(left+right)/2:.2f}" '
                f'y1="{y-max(w1,w2)-18:.2f}" label="w" '
                f'font-size="18"></pl-text>'
            )
    def line(x1, y1, x2, y2, color="#555555"):
        parts.append(f'<pl-line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke-color="{color}" stroke-width="2"></pl-line>')
    def label(x, y, value):
        parts.append(f'<pl-point x1="{x:.2f}" y1="{y:.2f}" radius="0" opacity="0" label="{value}" offsetx="0" offsety="0"></pl-point>')
    def bracket(x, y1, y2, name, offsetx):
        parts.append(
            f'<pl-dimensions x1="{x:.2f}" y1="{y1:.2f}" '
            f'x2="{x:.2f}" y2="{y2:.2f}" label="{name}" '
            f'stroke-color="#919c68" stroke-width="2" '
            f'offsetx="{offsetx}" draw-start-arrow="true" draw-end-arrow="true" arrow-head-width="10" arrow-head-length="0.25"></pl-dimensions>'
        )
        for yy in (y1, y2):
            parts.append(f'')
    # The main roof snow consists of uniform d and increasing drift to 3d.
    load(xA,xD,184,33,33,"W")
    load(xD,xC,184,33,72,"")
    # Room boundary is deliberately left empty; snow acts on its upper roof.
    line(xC,112,xC,184)
    line(xC,112,xB,112)
    line(xB,112,xB,184)
    label((xC+xB)/2,145,"room")
    load(xC,xB,112,40,40,"W")
    bracket(xA-23,151,184,"d",-13)
    bracket(xC+18,112,184,"3d",25)
    bracket(xB+25,72,112,"d",25)
    p['load_drawing'] = "\n".join(parts)
    data['correct_answers']['answer1']=Ay/1000
    data['correct_answers']['answer2']=By/1000
