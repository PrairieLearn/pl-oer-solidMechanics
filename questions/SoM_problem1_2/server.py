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
        "p_y": 174.0, "p_anchor_tail": "false" if p_dir == 1 else "true", "p_label_y": -119 if p_dir == 1 else -19,
    })

    load_center = (x1 + x2) / 2
    load_y = 174.0
    load_angle = 0 if w_dir == 1 else 180
    parts = [
        f'<pl-distributed-load x1="{load_center:.2f}" y1="{load_y:.2f}" '
        f'width="{x2-x1:.2f}" w1="79" w2="79" '
        f'anchor-is-tail="{str(w_dir == -1).lower()}" angle="{load_angle}" '
        f'color="red3" stroke-width="2" spacing="20" '
        f'offsetx1="-8" offsety1="-96"></pl-distributed-load>'
    ]
    # Label sits above the distributed-load arrows for either direction.
    parts.append(
        f'<pl-text x1="{load_center:.2f}" y1="{load_y-98:.2f}" '
        f'label="w" font-size="18"></pl-text>'
    )
    data["params"]["distributed_load"] = "\n".join(parts)
