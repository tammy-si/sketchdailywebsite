from flask import Flask, render_template
from datetime import date
from dotenv import load_dotenv, dotenv_values
import praw

app = Flask(__name__)

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
    config = dotenv_values(".env")
    print(config)
    print(config["REDDIT_CLIENT_ID"])
    print(config["REDDIT_SECRET"])
    print(config["REDDIT_USER_AGENT"])

    # authenticating for praw
    reddit = praw.Reddit(
        client_id = config["REDDIT_CLIENT_ID"],
        client_secret = config["REDDIT_SECRET"],
        user_agent = config["REDDIT_USER_AGENT"]
    )

    # get the first post in sketchdaily because it's usually the current day's theme
    for post in reddit.subreddit("SketchDaily").hot(limit=1):
        # get the main theme
        title = post.title.split()
        print(title[-1])
        theme = title[-1]
        # getting the alternate theme by getting the post's body and looking of the words alt theme.
        body = post.selftext.split()
        for i in range(len(body)):
            if body[i] == "Alt" or body[i] == "alt":
                alternatetheme = " ".join((body[i], body[i+1], body[i+2])) 

    # getting the reference pictures
    return render_template("theme.html", today = today, maintheme = theme, alttheme = alternatetheme, upsplash_access=config["UPSPLASH_ACCESS_KEY"])