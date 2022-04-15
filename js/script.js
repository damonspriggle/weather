var pastCity =$("#city-list");
var cities = [];
var key = "87fd1092035e1a1dd42ee58651435cca";

//Format for day
function FormatDay(date){
    var date = new Date();
    console.log(date);
    var month = date.getMonth()+1;
    var day = date.getDate();
    var dayOutput = (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day + '/' + date.getFullYear();
    return dayOutput;
}

//Calling function init();
init();

//Function init();
function init(){
   //json steps
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    // local storage array
    if (storedCities !== null) {
        cities = storedCities;
      }
  
    renderCities();
}

//Function StoreCities()
function storeCities(){
   // stringify
  localStorage.setItem("cities", JSON.stringify(cities));
  console.log(localStorage);
}

function renderCities() {

    pastCity.empty();
    
   // creating new list per each new city
    for (var i = 0; i < cities.length; i++) {
      var city = cities[i];
      
      var li = $("<li>").text(city);
      li.attr("id","list");
      li.attr("data-city", city);
      li.attr("class", "list-group-item");
      console.log(li);
      pastCity.prepend(li);
    }
   
    if (!city){
        return
    } 
    else{
        getResponseWeather(city)
    };
}   

  //When form is submitted...
  $("#add-city").on("click", function(event){
      event.preventDefault();

    // This line will grab the city from the input box
    var city = $("#city-input").val().trim();
    
    // Return from function early if submitted city is blank
    if (city === "") {
        return;
    }
    //Adding city-input to the city array
    cities.push(city);
    // Store updated cities in localStorage, re-render the list
  storeCities();
  renderCities();
  });

  //Function get Response Weather 
  
  function getResponseWeather(cityName){
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +cityName+ "&appid=" + key; 

    //Clear content of today-weather
    $("#today-weather").empty();
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        
      // Create a new table row element
      cityTitle = $("<h3>").text(response.name + " "+ FormatDay());
      $("#today-weather").append(cityTitle);
      var TempetureToNum = parseInt((response.main.temp)* 9/5 - 459);
      var cityTemperature = $("<p>").text("Temperature: "+ TempetureToNum + " °F");
      $("#today-weather").append(cityTemperature);
      var cityHumidity = $("<p>").text("Humidity: "+ response.main.humidity + " %");
      $("#today-weather").append(cityHumidity);
      var cityWindSpeed = $("<p>").text("Wind Speed: "+ response.wind.speed + " MPH");
      $("#today-weather").append(cityWindSpeed);
      var CoordLon = response.coord.lon;
      var CoordLat = response.coord.lat;
    
        //Api to get UV index
        var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?appid="+ key+ "&lat=" + CoordLat +"&lon=" + CoordLon;
        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function(responseuv) {
            var cityUV = $("<span>").text(responseuv.value);
            var cityUVp = $("<p>").text("UV Index: ");
            cityUVp.append(cityUV);
            $("#today-weather").append(cityUVp);
            console.log(typeof responseuv.value);
        });
    
        //Api to get 5-day forecast  
        var queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + key;
            $.ajax({
            url: queryURL3,
            method: "GET"
        }).then(function(responseFive) { 
            $("#boxes").empty();
            console.log(responseFive);
            for(var i=0, j=0; j<=4; i=i+4){
                var read_date = responseFive.list[i].dt;
                if(responseFive.list[i].dt != responseFive.list[i+1].dt){
                    var FivedayDiv = $("<div>");
                    FivedayDiv.attr("class","col-3 m-2 bg-primary")
                    var d = new Date(0); 
                    d.setUTCSeconds(read_date);
                    var date = d;
                    console.log(date);
                    var month = date.getMonth()+1;
                    var day = date.getDate();
                    var dayOutput = (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day + '/' + date.getFullYear();
                    var Fivedayh4 = $("<h6>").text(dayOutput);
                  

                    // image
                    var imgtag = $("<img>");
                    var skyconditions = responseFive.list[i].weather[0].main;
                    if(skyconditions==="Clouds"){
                        imgtag.attr("src", "https://img.icons8.com/color/48/000000/cloud.png")
                    } else if (skyconditions==="Clear"){
                        imgtag.attr("src", "https://img.icons8.com/color/48/000000/summer.png")
                    } else if (skyconditions==="Rain"){
                        imgtag.attr("src", "https://img.icons8.com/color/48/000000/rain.png")
                    }

                    var pTemperatureK = responseFive.list[i].main.temp;
                    console.log(skyconditions);
                    var TempetureToNum = parseInt((pTemperatureK)* 9/5 - 459);
                    var pTemperature = $("<p>").text("Tempeture: "+ TempetureToNum + " °F");
                    var pHumidity = $("<p>").text("Humidity: "+ responseFive.list[i].main.humidity + " %");
                    FivedayDiv.append(Fivedayh4);
                    FivedayDiv.append(imgtag);
                    FivedayDiv.append(pTemperature);
                    FivedayDiv.append(pHumidity);
                    $("#boxes").append(FivedayDiv);
                    console.log(responseFive);
                    j++;
                }   
        }
    });
    });
    
  }
  //Click function to each Li 
  $(document).on("click", "#list", function() {
    var yourCity = $(this).attr("data-city");
    getResponseWeather(yourCity);
  });
