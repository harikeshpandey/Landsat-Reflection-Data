~ api/v1/user/setnotify
-> used to add notification realted details to user-wheels
#allowed medium at present [email]
#sample data format to be sent which should be a json file
{
    "time_stamp":74274892375897,
    "user_email":"raw@email.com",
    "long":266.45,
    "lat":28.902,
    "methods":[{
        "medium":"email",
        "details":"raw@rawmail.com"
    }]
}