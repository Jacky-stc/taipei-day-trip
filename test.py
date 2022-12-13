import re
name = ""
email = "testg@gmail.com"
password = "easdgasd"

def nameValid(name) :
    if re.match("^(?!\s*$).+", name):
        return True
    return False
def emailValid(email) :
    if re.match("^\w+@\w+(\.\w+)*\.\w+$", email):
        return True
    return False
def passwordValid(password) :
    if re.match("\w{8,100}", password):
        return True
    return False

if not (nameValid(name) and emailValid(email) and passwordValid(password)):
    print("no")

print("ok")
        