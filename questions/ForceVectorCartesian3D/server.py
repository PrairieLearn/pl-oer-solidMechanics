import random, math
import numpy as np
from pl_drawing import *

def create_points():
    maxim = 5
    amaxim = 3

    a1 = random.randint(2,amaxim)
    a2 = random.randint(-maxim,maxim)
    b1 = random.randint(2,amaxim)
    b2 = random.randint(-maxim,maxim)

    if a2 == 0:
      a2 = 2

    if b2 == 0:
       b2 = 3 

    


    #f_mag = ((a**2)+(b**2)+(c**2))**0.5
    rA = np.array([a2,0,a1])
    rB = np.array([b2,b1,0])
    return rA, rB, a1, a2, b1, b2, maxim

def generate(data):

    rA, rB, a1, a2, b1, b2, maxim = create_points()
    
    t2 = np.radians(10)
    t1 = np.radians(45)
    
    rC = np.array([300, 250])
    
    P = np.array([
        [-np.sin(t1), np.cos(t1)],
        [np.cos(t2), np.sin(t2)],
        [0, -1]
        ])
    
    scaling = 30
    
    rA_prime = (P.T@rA.reshape(3, 1)*scaling).reshape(1, 2)[0]+rC
    rB_prime = (P.T@rB.reshape(3, 1)*scaling).reshape(1, 2)[0]+rC
    
    
    
    fab_prime = rB_prime - rA_prime

        
    dot = abs(np.dot(fab_prime, np.array([0, 1])))
    
    if dot/np.linalg.norm(fab_prime) > np.cos(np.radians(5)):
       # print('re-rolled')
        rA, rB, a1, a2, b1, b2, maxim = create_points()
        rA_prime = (P.T@rA.reshape(3, 1)*scaling).reshape(1, 2)[0]+rC
        rB_prime = (P.T@rB.reshape(3, 1)*scaling).reshape(1, 2)[0]+rC
        
    
    az = abs(a1)
    ax = abs(a2)
    bx = abs(b2)
    by = abs(b1)

    
    vec = rB- rA
    
    fab = random.randint(200,600)
    
    v_mag = ((vec[0]**2)+(vec[1]**2)+(vec[2]**2))**0.5

    vec2 = vec*(fab/v_mag)

    
    xv = Vector(300, 250, 'x', width=180, angle=135, color='black', stroke_width=1.5)
    yv = Vector(300, 250, 'y', width=180, angle=10, color='black', stroke_width=1.5)
    zv = Vector(300, 250, 'z', width=140, angle=-90, color='black', stroke_width=1.5)
    
    end_negative_x_line = (P.T@np.array([-6, 0, 0]).reshape(3, 1)*scaling).reshape(1, 2)[0]+rC
    
    nx = Line(300, 250, x2=end_negative_x_line[0], y2=end_negative_x_line[1], stroke_width=1.5)
    
    xa_x = (P.T@np.array([rA[0], 0, 0]).reshape(3, 1)*scaling).reshape(1, 2)[0]+rC
    xa_z = (P.T@np.array([0, 0, rA[2]]).reshape(3, 1)*scaling).reshape(1, 2)[0]+rC
    
    zadim = Dimensions(rA_prime[0], rA_prime[1], x2=xa_x[0], y2=xa_x[1], color='gray', stroke_width=1.5, label="b", draw_start_arrow="false", draw_end_arrow="false")
    xadim = Dimensions(rA_prime[0], rA_prime[1], x2=xa_z[0], y2=xa_z[1], color='gray', stroke_width=1.5, label="a", draw_start_arrow="false", draw_end_arrow="false")
    
    pa = Point(rA_prime[0], rA_prime[1], 'A', offsety=-25, offsetx=-10)
    
    xb_x = (P.T@np.array([rB[0], 0, 0]).reshape(3, 1)*scaling).reshape(1, 2)[0]+rC
    xb_y = (P.T@np.array([0, rB[1], 0]).reshape(3, 1)*scaling).reshape(1, 2)[0]+rC
    
    yadim = Dimensions(rB_prime[0], rB_prime[1], x2=xb_x[0], y2=xb_x[1], color='gray', stroke_width=1.5, label="d", draw_start_arrow="false", draw_end_arrow="false")
    xadim = Dimensions(rB_prime[0], rB_prime[1], x2=xb_y[0], y2=xb_y[1], color='gray', stroke_width=1.5, label="c", draw_start_arrow="false", draw_end_arrow="false")
    
    pb = Point(rB_prime[0], rB_prime[1], 'B')
    
    Fab = Dimensions(rA_prime[0], rA_prime[1], '', x2=rB_prime[0], y2=rB_prime[1], stroke_width=1.5, color='blue', draw_start_arrow="false")
    
    data['params']['drawing'] = yv.compile()
    

    data["params"]["a1"] = a1
    data["params"]["a2"] = a2
    data["params"]["b1"] = b1
    data["params"]["b2"] = b2
    data["params"]["az"] = az
    data["params"]["ax"] = ax
    data["params"]["bx"] = bx
    data["params"]["by"] = by
    data["params"]["maxim"] = maxim
    data["params"]["fab"] = fab
    
    data["correct_answers"]["ix"] = vec2[0]
    data["correct_answers"]["iy"] = vec2[1]
    data["correct_answers"]["iz"] = vec2[2]

        
    return data
