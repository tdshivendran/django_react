# Guide on building webapps with Django and React

In this guide we will create a fully working single web application using Python Django and ReactJS. 
This guide aims to answer the question *"How to use ReactJS with a new or existing Django project?"*.

## Table of contents
  * [Guide on building webapps with Django and React](#guide-on-building-webapps-with-django-and-react)
  * [Table of contents](#table-of-contents)
  * [Requirements](#requirements)
  * [1. Create a Django project](#1-create-a-django-project)
    * [Create a virtual environment](#create-a-virtual-environment)
    * [Starting django project](#starting-django-project)
  * [2. Installing and configuring Webpack](#2-installing-and-configuring-webpack)
  * [3. Installing and creating React App](#3-installing-and-creating-react-app)
  * [4. Integrating Django with React](#4-integrating-django-with-react)
  * [5. Using the bundles](#5-using-the-bundles)
  * [Try my project on your machine](#try-my-project-on-your-machine)
    
## Requirements
+ [Virtualenv](http://docs.python-guide.org/en/latest/dev/virtualenvs/)
+ [Virtualenvwrapper](http://docs.python-guide.org/en/latest/dev/virtualenvs/)
+ [NodeJS with npm](https://www.npmjs.com/get-npm)

## 1. Create a Django project
Let us start by building a simple Django project.
### Create a virtual environment 
Using a virtual environment for python projects is a common practice inorder to create a self-contained environments which helps in isolating different versions of packages and libraries.
To create a django project we have to start by creating a virtual environment using `virtualenv` package.
Open your termainal and run the following command.
```
virtualenv [project-name]
```
After creating the virtual environment activate the environment using the following command.
```
source [project-name]/bin/activate 
```
### Install reqired packages Packages
Install django by using pip installer.
```
pip install django
```
Install django-webpack-loader.
```
pip install django-webpack-loader
```
### Starting django project
To create and start a Django project, run the following command.
```
django-admin.py startproject [project-name]
```
This creats a new Django project in the virtual environment created. 
After the project is created you can see a set of files and folders that is automatically created by Django.
To know more about the Django project structure click on [this](http://django-project-skeleton.readthedocs.io/en/latest/structure.html) link.

To run the Django project run `./manage.py runserver`. This starts the Django server and hosts on your local host port 8000
`http://localhost:8000` or `http://127.0.0.1`.

To stop the server press 'CTRL-BREAK'.

For a better understanding of Django let us create a simple Hello World page and try to render it using Django.

In the 'templates' folder create a `base.html` and `index.html` file by the following commands
```
cd templates
touch index.html
touch base.html
```
Add the following html code in the `base.html` file.
```
<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
  </head>
  <body align="center">
    {% block main %}{% endblock %}
  </body>
</html>
```
Add the following html code in the `index.html` file.
```
{% extends "base.html" %}

{% block main %}
    <div>
      <h1>Hello World</h1>
    </div>
{% endblock %}
```
Here the index.html file loads the components in base.html file which gives a simple Hello World rendering html file.

Let us create a url to render the index.html file by adding the folliwing code in the `urls.py` file located in the directory with the name of your project in the root directory.
*For the project in this repository, the urls.py is located in django_react/urls.py* 
```
from django.contrib import admin
from django.views import generic
from django.conf.urls import url

urlpatterns = [
  url(r'^admin/', admin.site.urls),
  url(r'^$', generic.TemplateView.as_view(template_name='index.html')),
]
```
Now run `./manage.py runserver` and go to `http://localhost:8000` on your browser. 
This will show a `Hello world` page in your browser.

## 2. Installing and configuring Webpack
Webpack is a javascript module bundler and a build tool whcih is used for handling assets or resources to be handled by the browser.

Before we setup  webpack, let us generate a `package.json` file. 
This file holds the information about the application and its dependencies. 
To generate a package.json file run the following command.
```
npm init
```
Enter the information that is requested by the npm and click on yes. 
This will create a package.json file in your project root directory which looks like this.
```
{
  "name": "[project-name]",
  "version": "1.0.0",
  "description":,
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Author Name",
  "license": "ISC",
}
```
Now install webpack and other webpack packages by running the followinng command.
```
npm install webpack webpack-bundle-tracker --save-dev  
```
This installs webpack which is a bundling tool and webpack-bundle-tracker which tracks the bundles and saves the bundle information in a json file(webpack-stats.json).

ReactJS scripts are non-compatible for browsers. 
So we need a compiler to get browser-compatible javascripts. 

Babel is a javascript compiler that can compiles the ReactJS scripts and convert them to browser compatible script.

To install Babel and its packages run the following command.
```
npm install babel babel-loader babel-core babel-preset-es2015  babel-preset-react --save-dev 
```
We have to configure babel to compile ES6 and react scripts.
```
touch .babelrc
```
The above command creates a `.babelrc` file which holds the configuration for Babel.

Add the following code in the .babelrc file.
```
{
  "presets": ["es2015", "react"]
}
```
We have to configure the webpack to create bundles. 
This configuration is done by adding a `webpack.config,js` in the project root directory.
```
touch webpack.config.js
```
This command creates the webpack.config.js which serves as a configuration file for webpack.

Add the following code in the webpack configuration file.
```
var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
    context: __dirname,

    entry:  {
        App1: './assets/js/App1.jsx'
    },

    output: {
        path: path.resolve('./assets/bundles/'),
        filename: "[name]-[hash].js",
    },

    plugins: [
        new BundleTracker({filename: './webpack-stats.json'}),
        new webpack.optimize.CommonsChunkPlugin({name: 'vendors', filename: 'vendors.js'}),
    ],

    module: {
        loaders: [
        { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
        { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
        ],
    },

}
```
`entry` specifies the entry file of the bundle.
The entry for our project is App1.jsx which is located in assets/js folder which we will be creating in next section. 

`output` specifies the location of the bundled file to be saved.
The output for our project is saved in bundles directory which is located in assets folder which we will be creating in next section. 

`loaders` specifies the call for js files. In this case babel-loader.

`plugins` specifies webpack plugins.

At this point webpack is setup and configured to bundle React scripts to be integrated with django.

## 3. Installing and creating React App
To use react with Django we have to install React its dependencies with the following command.
```
npm install --save-dev react react-dom 
```
The above command installs react and react-dom which is a dependency for the react. 
React-dom package serves as the entry point for DOM rendering paths.

Now let us create a React app in assets/js folder to be integrated with Django.
Create a directory named assets in your root directory.

*Make sure that you are in your root directory of your project.*
```
mkdir assets
```
Now navigate into the assets directory and create a directory named js and add a `App1.jsx` file.
```
cd assets
mkdir js
touch App1.jsx
```
Add the following React script in the `App1.jsx` file.
```
import React from "react"
import { render } from "react-dom"

const display = (
    <div>
        <h1>Hello.</h1>
        <p>This is a django application integrated with react.</p>
    </div>
);

render(display, document.getElementById('root'));
```
This is a simple react script that renders a *Hello. This is a django application integrated with react* to an element defined by the id:root in th ehtml page.

Now let us test if webpack is running without an error by running the following command.
```
./node_modules/.bin/webpack --config webpack.config.js
```
This should run webpack without any errors. 

To run webpack to watch for any changes in the React scripts and bundle them again, use the following command.
```
./node_modules/.bin/webpack --config webpack.config.js --watch
```

## 4. Integrating Django with React
Weboack will take care of bundling the react app and place it in the bundles folder located in the assets.
The package `django-webpack-loader` that was installed earlier will use the webpack-bundle-tracker and lets us use the bundlesin Django.

We have to configeure the django-webpack-loader in the settings.py file. This file is located in the directory with the name of the project.

Add `webpack-loader' in the installed apps inside the settings.py file.

```
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'webpack_loader'
]
```
We also specify our assets folder to static files directory. 
Also the configuration for webpack bundles and stats is also added in the settings.py file.

Add the following code at the end of `settings.py` file.
```
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'assets'),
)

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'bundles/',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.json'),
    }
}
```
`BUNDLE_DIR_NAME` tells Django where to look for bundles in `assets' folder.
`STATS_FILE` tells Django where to find the bundled file names.

At this point, Django is integrated with React. 

## 5. Using the bundles
Let us see how to use the bundles that is created by the webpack, so that Django can load React scripts in its web applications.
To use the bundles, change the `index.html` file code so that it looks like this.
```
{% extends "base.html" %}
{% load render_bundle from webpack_loader %}

{% block main %}
    <div id="root"></div>
    {% render_bundle 'vendors' %}
    {% render_bundle 'App1' %}
{% endblock %}
```
`{% render_bundle 'App1' %}` loads the App1.js file, which is transpiled version of App1.jsx and bundled by webpack.

Now run `./manage.py runserver` and go to `http://localhost:8000` on your browser. 
This will show a `Hello.This is a django application integrated with react.` which was written in the React script earlier.  

Your Django is now integrated with ReactJS. 

## Try my project on your machine
You can clone this repository, and try it in your machine easily.
```
git clone https://github.com/tdshivendran/django_react.git
cd django_react
mkvirtualenv django_react
npm install
./manage.py migrate
./manage.py runserver
```




