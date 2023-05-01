# Datavis homework

## Data
Data contains an array of countries with information about country and some parameters changing over time:
- population;
- gdp;
- child-mortality;
- life-expectancy;
- fertility-rate.

## First step
Create a bubble chart on which:
- X and Y positions of elements is defined by selected parameters;
- An area of bubbles is defined by selected parameter;
- Axises changing dynamically with parameters changes;
- Bubbles is colored by region field;
![](/gifs/step-1.gif)

## Second step
Update bubble chart with time slider position changing.
![](/gifs/step-2.gif)

## Third step
Create a bar chart on which:
- Mean value of chosen parameter for each country in region is shown;
- An order of bars matches the legend;
- Bars is colored by region field;
Bar chart should update on parameter or time slider change.
![](/gifs/step-3.gif)

## Fourth step
On click to the bar this bar should be highlighted using opacity. Bouble chart must display only disply only elements of the chosen region.
![](/gifs/step-4.gif)

## Fifth step
On the bubble:
- Chosen bubble must be drown over other elements in bubble chart and highlighted using stroke;
- Based on selected country data must be created a line chart on which:
  - X axes represents a time scale;
  - Y axes represents choosen parameter.
Line chart must update on parameter or time slider change.
![](/gifs/step-5.gif)

## Submission
To submit the homework:
- Make a fork of current repository;
- Make changes;
- Configure Github Pages in repository settings;
- Submit a link to the solution page in tg(@PapaKKKarlo).

For debugging, you can run a [local server in python](https://developer.mozilla.org/ru/docs/Learn/Common_questions/set_up_a_local_testing_server).
