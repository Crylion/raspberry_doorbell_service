
import time
import RPi.GPIO as GPIO

def button_callback(channel):
	GPIO.output(17, GPIO.LOW)
	time.sleep(2)
	GPIO.output(17, GPIO.HIGH)

GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.IN,pull_up_down=GPIO.PUD_UP)
GPIO.setup(17, GPIO.OUT)

GPIO.add_event_detect(18,GPIO.RISING,callback=button_callback)

message = input("Press enter to quit\n\n")

GPIO.cleanup()