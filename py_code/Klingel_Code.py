import time
import RPi.GPIO as GPIO

def klingel_patrick(channel):
    print ("Palim Palim")
    time.sleep(5)
    
def klingel_tom(channel):
    print ("Ding Dong")
    GPIO.output(27, GPIO.LOW)
    time.sleep(5)
    GPIO.output(27, GPIO.HIGH)

GPIO.setmode(GPIO.BCM)
GPIO.setup(27, GPIO.OUT)
GPIO.setup(12, GPIO.IN,pull_up_down=GPIO.PUD_UP)
GPIO.setup(16, GPIO.IN,pull_up_down=GPIO.PUD_UP)

GPIO.add_event_detect(12,GPIO.RISING,callback=klingel_patrick)
GPIO.add_event_detect(16,GPIO.RISING,callback=klingel_tom)

message = input("Press enter to quit\n\n")

GPIO.cleanup()