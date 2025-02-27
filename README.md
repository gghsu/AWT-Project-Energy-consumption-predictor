# Getting Started

In the project directory, To open the webpage,
Go to folder named **"front-end"**:

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
'awt-predictor' is the image name, any name will suffice.\
You will also need to install docker on your machine.

### `sudo docker build -t awt-predictor .`

Change port number '5001' to the same port in front end webpage's API call.

### `sudo docker run -d -p 5001:5000 awt-predictor`

If you want any code changes on your local machine are\
immediately reflected in the container without needing to rebuild the image:

### `sudo docker run -d -p 5001:5000 -v "$(pwd)":/app awt-predictor`

**Mac M1 user might need to download and open Docker Desktop when running**\

Following operation are also needed, if error

**"failed to resolve source metadata for docker.io/library/python:3.9"**\

Happens:

```
sudo vi  ~/.docker/config.json

Changing

"credsStore": "desktop"

to

"credStore": "desktop"
```

## Or you can run the server via python script

**Mac M1 might have problem running via python script**.\
**Since Mac has compatibility issue with the ML model XGboost**.\
**Run with Docker instead**.

At dir './API-predictor/'

Run

### `pip install -r requirements.txt`

then

### `python server.py`

## Project Structure

The project is divided to 3 parts:

### Script for data processing and model training

They are python jupiter notebooks located at the parent directory.\
`AWTxgboost.ipynb` is the notebook responsible for some data processing and\
training XGBoost model.\
`LSTM.ipynb` is the notebook responsible for training LSTM model.\
It is best to run these 2 notebooks on Google Colab.\
You can also view `data preprocessing.py` to see how we are pre processing the dataset.

### Webpage source code

They are at dir './front-end/', the source code is **App.js**
If there are port number conflict,\
change the port number at the API call of **handleSubmit** function\
at './front-end/src/APP.js', and also change the docker instructions.\
See below

### REST API/Server

They are at dir './API-predictor/', it contains a preloaded model, **server.py**,\
the saved pca and scaler file when doing pca and scaler operation during data processing.\
If you are changing data processing, be sure to saved and place these files here.\
If there are port number conflict, change the port number at of docker comminstructions\

`sudo docker run -d -p NEWPORTNUMBER:5000 awt-predictor`

dont change the second number 5000.

**server.py** also contain a hard coded data record to bake the \
input from website, and use it for model prediciton.\
Change the hard coded values to experiment with different results.
