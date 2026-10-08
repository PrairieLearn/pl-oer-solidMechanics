import json

def print_nice_dict(d):
    print(json.dumps(d, indent=2))
    return 

class BetterDict:
    def __init__(self, dict):
        for key, value in dict.items():
            setattr(self, key, value)