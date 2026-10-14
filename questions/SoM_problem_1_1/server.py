import random


def generate(data):
    # All lengths are proportional to the single randomized base a (ft).
    a = random.randint(2, 4)
    k1 = random.randint(1, 3)
    k2 = random.randint(2, 4)
    k3 = random.randint(3, 5)
    k4 = random.randint(1, 3)
    d1, d2, d3, d4 = k1*a, k2*a, k3*a, k4*a
    P = random.randrange(5, 50)
    w = random.randrange(20, 100) / 10

    p_dir = random.choice((-1, 1))  # +1 downward, -1 upward
    w_dir = random.choice((-1, 1))

    L = d1 + d2 + d3 + d4
    # Reaction moments about A: B_y * L = w*d2*(d1+d2/2) + P*(d1+d2+d3)
    By = (w_dir * w * d2 * (d1 + d2 / 2) + p_dir * P * (d1 + d2 + d3)) / L
    Ay = w_dir * w * d2 + p_dir * P - By

    data["params"].update({"k1": k1, "k2": k2, "k3": k3, "k4": k4})
    data["params"].update(k1_label=("a" if k1 == 1 else f"{k1}a"), k2_label=("a" if k2 == 1 else f"{k2}a"), k3_label=("a" if k3 == 1 else f"{k3}a"), k4_label=("a" if k4 == 1 else f"{k4}a"))
    data["params"].update({"P": P, "w": w, "a": a, "d1": d1, "d2": d2, "d3": d3, "d4": d4, "p_angle": 90 if p_dir == 1 else -90,
                           "p_y": 52 if p_dir == 1 else 155})
    data["correct_answers"]["answer1"] = Ay
    data["correct_answers"]["answer2"] = By

    # Map each variant to the same fixed-size 650-pixel beam (A at 55, B at 705).
    scale = 650 / L
    x0 = 55
    x1 = x0 + d1 * scale
    x2 = x1 + d2 * scale
    x3 = x2 + d3 * scale
    x4 = 705
    data["params"].update({
        "x1": round(x1, 2), "x2": round(x2, 2), "x3": round(x3, 2),
        "t1": round((x0 + x1) / 2, 2),
        "t2": round((x1 + x2) / 2, 2),
        "t3": round((x2 + x3) / 2, 2),
        "t4": round((x3 + x4) / 2, 2),
        "wlabel": round((x1 + x2) / 2, 2),
        "plabel": round(x3 - 4, 2),
    })
    # Use 7 evenly spaced arrows, with independently randomized direction.
    arrow_y = 92 if w_dir == 1 else 155
    arrow_angle = 90 if w_dir == 1 else -90
    parts = [f'<pl-line x1="{x1:.2f}" y1="92" x2="{x2:.2f}" y2="92" stroke-color="#a14e49" stroke-width="3"></pl-line>']
    for i in range(7):
        x = x1 + (x2 - x1) * i / 6
        parts.append(f'<pl-vector x1="{x:.2f}" y1="{arrow_y}" width="63" angle="{arrow_angle}" color="#a14e49"></pl-vector>')
    parts.append(f'<pl-text x1="{(x1 + x2) / 2:.2f}" y1="65" label="w" font-size="22"></pl-text>')
    data["params"]["distributed_load"] = "\n".join(parts)
