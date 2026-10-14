import random


def generate(data):
    # One base dimension a (meters); all spans scale together.
    a = random.randint(15, 25) / 10
    k1 = random.randint(1, 2)
    k2 = random.randint(2, 4)
    k3 = random.randint(1, 2)
    d1, d2, d3 = k1*a, k2*a, k3*a
    P = random.randrange(5, 30)
    w = random.randrange(20, 50) / 10
    p_dir = random.choice((-1, 1))  # +1 downward, -1 upward
    w_dir = random.choice((-1, 1))

    L = d1 + d2 + d3
    # Positive A_y is upward; positive M_A is counterclockwise.
    Ay = p_dir * P + w_dir * w * d2
    MA = p_dir * P * L + w_dir * w * d2 * (d1 + d2 / 2)
    data["correct_answers"].update({"answer1": Ay, "answer2": MA})

    x0, x3 = 75, 705
    scale = (x3 - x0) / L
    x1 = x0 + d1 * scale
    x2 = x1 + d2 * scale
    data["params"].update({"k1": k1, "k2": k2, "k3": k3})
    data["params"].update(k1_label=("a" if k1 == 1 else f"{k1}a"), k2_label=("a" if k2 == 1 else f"{k2}a"), k3_label=("a" if k3 == 1 else f"{k3}a"))
    data["params"].update({
        "P": P, "w": w, "a": a, "d1": d1, "d2": d2, "d3": d3,
        "x1": round(x1, 2), "x2": round(x2, 2),
        "t1": round((x0 + x1) / 2, 2),
        "t2": round((x1 + x2) / 2, 2),
        "t3": round((x2 + x3) / 2, 2),
        "p_angle": 90 if p_dir == 1 else -90,
        "p_y": 70 if p_dir == 1 else 173,
    })

    arrow_y = 106 if w_dir == 1 else 173
    angle = 90 if w_dir == 1 else -90
    parts = [f'<pl-line x1="{x1:.2f}" y1="106" x2="{x2:.2f}" y2="106" stroke-color="#a14e49" stroke-width="3"></pl-line>']
    for i in range(7):
        x = x1 + (x2 - x1) * i / 6
        parts.append(f'<pl-vector x1="{x:.2f}" y1="{arrow_y}" width="67" angle="{angle}" color="#a14e49"></pl-vector>')
    parts.append(f'<pl-text x1="{(x1 + x2)/2:.2f}" y1="77" label="w" font-size="22"></pl-text>')
    data["params"]["distributed_load"] = "\n".join(parts)
