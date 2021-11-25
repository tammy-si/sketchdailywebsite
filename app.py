from flask import Flask, render_template, request
from datetime import date, timedelta
from dotenv import load_dotenv, dotenv_values
import praw

app = Flask(__name__)

# config is like the connection to the .env files for the secret keys and stuff
config = dotenv_values(".env")
# authenticating for praw
reddit = praw.Reddit(
    client_id = config["REDDIT_CLIENT_ID"],
    client_secret = config["REDDIT_SECRET"],
    user_agent = config["REDDIT_USER_AGENT"]
)


# directs to the about page, for if someone clicks the logo thing
@app.route("/")
def hello_world():
    return render_template("about.html")

# about page with info and overview about the web app
@app.route("/about")
def about():
    return render_template("about.html")

# today's themes page
@app.route("/today")
def today():
    global alttheme
    # gets today's date
    today = date.today()
    today = today.strftime("%m/%d/%Y")

    # get the first post in sketchdaily because it's usually the current day's theme
    for post in reddit.subreddit("SketchDaily").hot(limit=1):
        # get the main theme
        title = post.title.split("- ")
        print(title)
        theme = title[-1]
        # getting the alternate theme by getting the post's body
        body = post.selftext.split(": ")
        alternatetheme = body[1].split("\r")[0]
        alternatetheme = alternatetheme.split("\n")[0]

    # getting the reference pictures
    return render_template("theme.html", today = today, maintheme = theme, alttheme = alternatetheme, upsplash_access=config["UPSPLASH_ACCESS_KEY"])

# route for the past week page
@app.route("/pastweek", methods = ['GET', 'POST'])
def pastweek():
    if request.method == 'GET':
        # get today's date
        today = date.today()
        # week array to hold the dates of the week like mm/dd/yy type of date
        week = []
        # week day array to hold which day of the week it is corresponding to the dates in the week array
        weekdays = []
        # get past 7 days including today
        for i in range(7):
            week.append(today - timedelta(days=i))
            weekdays.append((today - timedelta(days=i)).weekday())
        # now we turn the weekdays array, which is currently numbers to be the actual weekday by list comprehension 
        d = {0 : "Monday", 1 : "Tuesday", 2: "Wednesday", 3: "Thursday", 4: "Friday", 5: "Saturday", 6: "Sunday"}
        weekdays = [d[j] for j in weekdays]
        # also format the dates in the week array better so it's not a datetime object, but a mm/dd/yy string instead
        week = [k.strftime('%m/%d/%Y') for k in week]
        # reverse the arrays so that the current day/today is at the end of the array.
        week = week[::-1]
        weekdays = weekdays[::-1]

        # list to hold the themes of the past 7 days as tuples. Each element of the list should be the main theme and alternate theme for that date.
        # list goes from today -> yesterday -> onwards
        themeList = []
        # get the last 7 in sketchdaily because they're the theme for the last 7 days
        for post in reddit.subreddit("SketchDaily").hot(limit=7):
            # get the main theme
            title = post.title.split("- ")
            print(title)
            theme = title[-1]
            # getting the alternate theme by getting the post's body
            body = post.selftext.split(": ")
            alternatetheme = body[1].split("\r")[0]
            alternatetheme = alternatetheme.split("\n")[0]
            themeList.append((theme, alternatetheme))
        # reverse the theme list so that we have today's theme at the end
        themeList = themeList[::-1]
        print(themeList)
        return render_template("pastweek.html", week = week, weekdays = weekdays, themeList = themeList)
    elif request.method == 'POST':
        mainTheme = request.form.get("mainThemeChoice")
        altTheme = request.form.get("altThemeChoice")
        return f"Main theme: {mainTheme} Alt theme: {altTheme}"