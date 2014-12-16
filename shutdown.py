import mraa
import time
import subprocess

sw = mraa.Gpio(15)
sw.dir(mraa.DIR_IN)
sw.mode(mraa.MODE_PULLUP)

state = 0

while True:
    if sw.read() == 0:
        if state == 2:
            state = 0
            args = ['poweroff']
            subprocess.Popen(args)
        else:
            state += 1
    else:
        state = 0

    time.sleep(0.5)
