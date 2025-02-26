# Getting Started

In the project directory, To open the webpage,
Go to './front-end/':

Type:

### `npm install`

Then:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## REST API/Server

First time building the docker image/running the server:\
'awt-predictor' is the image name, any name will suffice

### `sudo docker build -t awt-predictor .`

Change port number '5000' to the same port in webpage's API call

### `sudo docker run -d -p 5000:5000 awt-predictor`

If you want any code changes on your local machine are\
immediately reflected in the container without needing to rebuild the image:

### `docker run -d -p 5000:5000 -v "$(pwd)":/app awt-predictor`

## Or you can run the server via python script

At dir './API-predictor/'

Run 

### `pip install -r requirements.txt`

then 

### `python server.py`

## Project Structure

The project is divided to 3 parts:

### Script for data processing and model training

They are python script files located at the parent directory

### Webpage source code

They are at dir './front-end/', if there are port number
conflict, change the port number at the API call of **handleSubmit**
function of './front-end/src/APP.js'

### REST API/Server

They are at dir './API-predictor/', if there are port number\
conflict, change the port number at the API call of **main**\
function of './API-predictor/server.py'

**server.py** also contain a hard coded data record to bake the \
input from website, and use it for model prediciton.\
Change the hard coded value to experiment different result.
