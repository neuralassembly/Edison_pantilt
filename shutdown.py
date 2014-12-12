import mraa
import time
import subprocess

switch = mraa.Gpio(15)
switch.dir(mraa.DIR_IN)
switch.mode(mraa.MODE_PULLUP)

state = 0

while True:
    if switch.read() == 0:
        if state == 2:
            state = 0
            args = ['poweroff']
            subprocess.Popen(args)
        else:
            state += 1
    else:
        state = 0

    time.sleep(0.5)
