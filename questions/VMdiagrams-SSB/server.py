import math
import random

import numpy as np


def create_dict_xy_coord(p):
    return '{"x": ' + str(p[0]) + ',"y": ' + str(p[1]) + "}"


def create_dict_labels(axis, loc, lab, offsetx=None, offsety=None):
    text = '{"axis": "' + axis + '", "pos": ' + str(loc) + ', "lab": "' + lab + '" '
    if offsetx is not None:
        text += ', "offsetx": ' + str(offsetx)
    if offsety is not None:
        text += ', "offsety": ' + str(offsety)
    text += "}"
    return text


def generate(data):

    """
    Parameters of the question. These are usually randomized.
    """
    a = 120  # spacing along the beam
    w = 1.5  

    x1 = 80
    y1 = 100
    data["params"]["a"] = a
    data["params"]["x1"] = x1
    data["params"]["x2"] = x1 + 3 * a
    data["params"]["x3"] = x1 + 1.5 * a
    data["params"]["y1"] = y1
    data["params"]["xm"] = x1 + a / 2

    Px1 = x1 + 1.5 * a
    Py1 = y1 - 60

    data["params"]["Px1"] = Px1
    data["params"]["Py1"] = Py1

    """####
    Parameters for drawing...
    numbers are only for drawing, otherwise values are nonsense
    #######
    """

    P = 160  # concentrated load,  this number will be only used for drawing
    half_P = P * 0.5
    Quater_PL = P * 0.5

    """
    ######################################################################
    CREATING FREEBODY DIAGRAM
    ######################################################################
    """
    y_fbd = y1
    data["params"]["y_fbd"] = y_fbd

    """
    ######################################################################
    CREATING THE SHEAR DIAGRAM
    ######################################################################
    """

    """
    Origin of V-plot
    This is the origin of the axes wrt the (top,left) of the canvas
    """
    # origin
    V0 = [x1, 600 - 200]
    # data params (no need to change this)
    data["params"]["V_origin"] = create_dict_xy_coord(V0)

    """
    All the following positions are measured wrt the origin of the V-plot
    """

    """Interval 1:"""
    # first point of the interval
    p1 = [0, half_P]
    # second point of the interval
    p2 = [1.5 * a, half_P]
    # data params (no need to change this)
    data["params"]["V1"] = (
        "[" + create_dict_xy_coord(p1) + "," + create_dict_xy_coord(p2) + "]"
    )

    """Interval 2:"""
    # first point of the interval
    p1 = [1.5 * a, -half_P]
    # second point of the interval
    p2 = [3 * a, -half_P]
    # data params (no need to change this)
    data["params"]["V2"] = (
        "[" + create_dict_xy_coord(p1) + "," + create_dict_xy_coord(p2) + "]"
    )

    """ Defining labels for the axes """
    # x-axis label
    loc_x = [1.5 * a, 3 * a]  # location of the text
    lab_x = ["L/2", "L"]  # text
    # y-axis label
    loc_y = [half_P, -half_P]  # location of the text
    lab_y = ["P/2", "-P/2"]  # text
    # data params (no need to change this)
    labels = "["
    for i in range(len(loc_x)):
        labels += create_dict_labels("x", loc_x[i], lab_x[i])
        labels += ","
    for i in range(len(loc_y)):
        labels += create_dict_labels("y", loc_y[i], lab_y[i], offsetx=-20)
        if i != len(loc_y) - 1:
            labels += ","
    labels += "]"
    data["params"]["label_V"] = labels

    """ Defining the supporting lines"""
    line_perp_x = [1.5 * a, 3 * a]
    line_perp_y = [half_P, -half_P]

    sup_line = "["
    for i in range(len(line_perp_x)):
        sup_line += '{"x": ' + str(line_perp_x[i]) + "}"
        sup_line += ","
    for i in range(len(line_perp_y)):
        sup_line += '{"y": ' + str(line_perp_y[i]) + "}"
        sup_line += ","
    sup_line = sup_line.rstrip(",")
    sup_line += "]"
    data["params"]["sup_line"] = sup_line

    """
    ######################################################################
    CREATING THE MOMENT DIAGRAM
    ######################################################################
    """

    """
    Origin of M-plot
    This is the origin of the axes wrt the (top,left) of the canvas
    """
    # origin
    M0 = [80, 1000 - 200]
    # data params (no need to change this)
    data["params"]["M_origin"] = create_dict_xy_coord(M0)

    """
    All the following positions are measured wrt the origin of the V-plot
    """
    """Interval 1:"""
    scale = 0.02
    # first point of the interval
    p1 = [0, 0]
    # second point of the interval
    p2 = [1.5 * a, Quater_PL]
    # data params (no need to change this)
    data["params"]["M1"] = (
        "[" + create_dict_xy_coord(p1) + "," + create_dict_xy_coord(p2) + "]"
    )

    """Interval 2:"""
    # first point of the interval
    p1 = [1.5 * a, Quater_PL]
    # second point of the interval
    p2 = [3 * a, 0]
    # data params (no need to change this)
    data["params"]["M2"] = (
        "[" + create_dict_xy_coord(p1) + "," + create_dict_xy_coord(p2) + "]"
    )

    """ Defining labels for the axes """
    # x-axis label
    loc_x = [1.5 * a, 3 * a]  # location of the text
    lab_x = ["L", "2L"]  # text
    # y-axis label
    loc_y = [Quater_PL, 0.5 * Quater_PL, -0.5 * Quater_PL, -Quater_PL]
    # location of the text
    lab_y = ["PL/4", "PL/8", "-PL/8", "-PL/4"]  # text
    # data params (no need to change this)
    labels = "["
    for i in range(len(loc_x)):
        labels += create_dict_labels("x", loc_x[i], lab_x[i])
        labels += ","
    for i in range(len(loc_y)):
        labels += create_dict_labels("y", loc_y[i], lab_y[i], offsetx=-20)
        if i != len(loc_y) - 1:
            labels += ","
    labels += "]"

    data["params"]["label_M"] = labels

    """ Defining the supporting lines"""
    line_perp_x = [1.5 * a, 3 * a]
    line_perp_y = [Quater_PL, 0.5 * Quater_PL, -0.5 * Quater_PL, -Quater_PL]
    sup_line = "["
    for i in range(len(line_perp_x)):
        sup_line += '{"x": ' + str(line_perp_x[i]) + "}"
        sup_line += ","
    for i in range(len(line_perp_y)):
        sup_line += '{"y": ' + str(line_perp_y[i]) + "}"
        sup_line += ","
    sup_line = sup_line.rstrip(",")
    sup_line += "]"
    data["params"]["sup_line_M"] = sup_line

    return data
