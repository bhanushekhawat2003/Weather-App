   
    // Accessing all the Html Element using the DOM.
    

    const userTab=document.querySelector("[data-userWeather]");
    const searchTab=document.querySelector("[data-searchWeather]");
    const userContainer=document.querySelector(".weather-container");

    const grantAccessContainer=document.querySelector(".grant-location-container");
    const searchFrom=document.querySelector("[data-searchForm]");
    const loadingScreen=document.querySelector(".loading-container");
    const userInfoContainer=document.querySelector(".user-info-container");

  
     // Tab switching of Your Weather and Search Weather .


      //  intially currentTab is userTab

      let currentTab=userTab;
  
     // API KEY for the accesing the weather of searched and your weather using openweather API. 
     const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
      currentTab.classList.add("current-tab");

    
    // switching Tab function.

     function switchTab(clickedTab){
       
         if(currentTab!=clickedTab){
            currentTab.classList.remove("current-tab");
            currentTab=clickedTab;
            currentTab.classList.add("current-tab");

            // searchForm is not active persent .
              
            if(!searchFrom.classList.contains("active")){
                userInfoContainer.classList.remove("active");
                grantAccessContainer.classList.remove("active");
                searchFrom.classList.add("active");
            }
     
            // searchTab is active now I want to move to userTab.
            else{
                searchFrom.classList.remove("active");
                userInfoContainer.classList.remove("active");
                //check get coordinates of the user from local storage in  a session.
                
                getfromSessionStorage();
            }

         } 
     }


      // add event-listner on Yourweather and searchweather .

      userTab.addEventListener("click",() =>{
          // pass clicked tab as a userTab.
          switchTab(userTab);
      });

      searchTab.addEventListener("click",() =>{
        // pass clicked tab as a searchTab.
        switchTab(searchTab);
    });

 
     
    function getfromSessionStorage(){
      
        const localCoordinates=sessionStorage.getItem("user-coordinates");
        
        if(!localCoordinates) {
                  // if local coordinates are not persent then.
                  grantAccessContainer.classList.add("active");
        }
        else{
            // parse-> converts json string to json object format.
             const coordinates = JSON.parse(localCoordinates);
             fetchUserWeatherInfo(coordinates);
        }
    }

     // user weather fetching using API.

     async function fetchUserWeatherInfo(coordinates){
              const {lat,lon}=coordinates;
              
              // make grantcontainer invisible.
              grantAccessContainer.classList.remove("active");

              // make loader visible.

              loadingScreen.classList.add("active");

              try{
                const response = await fetch(  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
                const data = await response.json();

                loadingScreen.classList.remove("active");
                userInfoContainer.classList.add("active");
                renderWeatherInfo(data);
              }
 
              catch(err){
                  // remove loading screen
              }
            
     }

    
 

    
     
    function renderWeatherInfo(weatherInfo){

    // fetch the elements which we want to show on the UI.

    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

      // fetch values from weatherInfo object and put it in UI element's.

      cityName.innerText = weatherInfo?.name;
      countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
      desc.innerText = weatherInfo?.weather?.[0]?.description;
      weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
      temp.innerText = `${weatherInfo?.main?.temp} °C`;
      windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
      humidity.innerText = `${weatherInfo?.main?.humidity}%`;
      cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
  

    }

    // fetching the user coordinates using the geolocation API.


    function getLocation(){
               // check if it support on the device.
            
               
       if(navigator.geolocation){
       
                 navigator.geolocation.getCurrentPosition(showPosition);
       }
       else{
      
        // show alert for no geoloction support available.
        console.log("hi");
       }
    }

    
    function showPosition(position){
           
                 const userCoordinates = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                 }
            
                // storing user coordinates in session storage.
                
                 sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
                 fetchUserWeatherInfo(userCoordinates);
    }

   const grantAccessButton=document.querySelector("[data-grantAcess]");
  
   grantAccessButton.addEventListener("click",getLocation);

       //  SearchForm Response Submitted by the User.

    const searchInput=document.querySelector("[data-searchInput]");

      searchFrom.addEventListener("submit",(e) =>{
                e.preventDefault();
             let cityName = searchInput.value;
          
            if( cityName === ""){
                return;
            }

             fetchSearchWeatherInfo(cityName);

      });


      async function fetchSearchWeatherInfo(city){
      
        
        // make grantcontainer invisible.
        grantAccessContainer.classList.remove("active");

        // make loader visible.

        loadingScreen.classList.add("active");

        userInfoContainer.classList.remove("active");


        try{
          const response = await fetch( `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
          const data = await response.json();
          
          loadingScreen.classList.remove("active");
          userInfoContainer.classList.add("active");
          renderWeatherInfo(data);
        }

        catch(err){
            // remove loading screen
        }
      
}


       