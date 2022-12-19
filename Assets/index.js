// Date displayed in header
var currentDate = moment().format('dddd, MMMM Do YYYY');
$('.date').text(currentDate);

$(document).ready(function () {
    //search button 
    $("#search-btn").on("click", function () {
      //getting values from id search-value.
      var searchCity = $("#search-value").val().trim();
      $("#search-value").val("");
      startWeather(searchCity);
      weatherForecast(searchCity);
    });
  
    //search button enter key feature. 
    $("#search-btn").keypress(function (event) {
      var code = (event.code ? event.code : event.which);
      if (code === 13) {
        startWeather(searchCity);
        weatherForecast(searchCity);
      }
    });
  
    //previous city searched 
    var history = JSON.parse(localStorage.getItem("history")) || [];
  
    //set the history array to  length
    if (history.length > 0) {
      startWeather(history[history.length - 1]);
    }
    for (var i = 0; i < history.length; i++) {
      createRow(history[i]);
    }
  
    //appends cities searched
    function createRow(text) {
      var listItem = $("<li>").addClass("list-group").text(text);
      $(".history").append(listItem);
    }
  
    //When listed city is clicked, display current 5-day forecast
    $(".history").on("click", "li", function () {
      startWeather($(this).text());
      weatherForecast($(this).text());
    });
  
    function startWeather(searchCity) {
      $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&appid=40238c556b6406b810e18d4225a53c0c",
  
  
      }).then(function (data) {
        //if index of search value does not exist
        if (history.indexOf(searchCity) === -1) {
          //push searchValue to history array
          history.push(searchCity);
          //places item pushed into local storage
          localStorage.setItem("history", JSON.stringify(history));
          createRow(searchCity);
        }
        // clears out old content
        $("#today").empty();
  
        var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
  
  
        // Kelvin to °F converter
        var temper = data.main.temp;
        f = (temper - 273.15) * 9 / 5 + 32;

        // Todays current forecast
        var card = $("<div>").addClass("card");
        var cardBody = $("<div>").addClass("card-body");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + " %");
        var temp = $("<p>").addClass("card-text").text("Temperature: " + f.toFixed(2) + " °F");
        console.log(data)
        var lon = data.coord.lon;
        var lat = data.coord.lat;
  
        $.ajax({
          type: "GET",
          url: "https://api.openweathermap.org/data/2.5/uvi?appid=40238c556b6406b810e18d4225a53c0c&lat=" + lat + "&lon=" + lon,
  
  
        }).then(function (response) {
          console.log(response);
  
          var uvResponse = response.value;
          var uvIndex = $("<p>").addClass("card-text").text("UV Index: ");
          var btn = $("<span>").addClass("btn btn-sm").text(uvResponse);
  
          // Display UV index color 
          if (uvResponse < 3) {
            btn.addClass("btn-success");
          } else if (uvResponse < 7) {
            btn.addClass("btn-warning");
          } else {
            btn.addClass("btn-danger");
          }
  
          cardBody.append(uvIndex);
          $("#today .card-body").append(uvIndex.append(btn));

          // Clear Local Storage & once cleared page is reloaded
          $("#clear-btn").on("click", (event) => {
            localStorage.clear();
            location.reload()

        });
  
        });
  
        // merge and add weather images to page
        title.append(img);
        cardBody.append(title, temp, humid, wind);
        card.append(cardBody);
        $("#today").append(card);
        console.log(data);
      });
    }
    // function weatherForecast(searchCity) 
    function weatherForecast(searchCity) {
      $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity + "&appid=40238c556b6406b810e18d4225a53c0c&units=imperial",
  
      }).then(function (data) {
        console.log(data);
        $("#forecast").html("<h2 class='forecast-title'>5-Day Forecast:</h2>").append("<div class=\"row\">");
  
        //loop to create a new card for 5 days pull data image from search
        for (var i = 0; i < data.list.length; i++) {
  
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
  
            var titleForcast = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
            var imgForcast = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
            var colForcast = $("<div>").addClass("col-md-2.5");
            var cardForcast = $("<div>").addClass("card text-black");
            var cardBodyForcast = $("<div>").addClass("card-body p-2");
            var humidForcast = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
            var tempForcast = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");
  
            //merge together append
            colForcast.append(cardForcast.append(cardBodyForcast.append(titleForcast, imgForcast, tempForcast, humidForcast)));
            //append card to column, body to card, and other elements to body
            $("#forecast .row").append(colForcast);
          }
        }
      });
    }
  
  });