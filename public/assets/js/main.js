document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("location-form");
    const locationInput = document.getElementById("location-input");
    const tempElement = document.getElementById("temp");
    const descriptionElement = document.getElementById("description");
    const iconElement = document.getElementById("icon");
    const futureWeatherElement = document.getElementById("future-weather");
    const airQualityElement = document.getElementById("air-quality");
    const timeZoneElement = document.getElementById("time-zone");

    let airQualityChart; 

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const location = locationInput.value.trim();
        console.log("User entered location:", location); // checking input

        if (location) {
            try {
                const apiKey = "ed3ad66c31e14729b3b235942252701";
                const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&days=3&aqi=yes`;
                console.log("Fetching data from:", url); // checking API URL
                
                const response = await fetch(url);
                console.log("API Response Status:", response.status); // checking response status

                if (!response.ok) {
                    throw new Error(`Failed to fetch weather data. Status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Received Data:", data); // checking full API response

                // Current weather data
                tempElement.textContent = `${Math.round(data.current.temp_c)}°C`;
                descriptionElement.textContent = `${data.current.condition.text}`;
                iconElement.src = data.current.condition.icon;

                // Future weather data
                futureWeatherElement.innerHTML = "";
                data.forecast.forecastday.forEach(day => {
                    const originalDate = new Date(day.date);
                    const weekday = originalDate.toLocaleDateString('en-US', { weekday: 'long' });
                    const monthDay = originalDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

                    const condition = day.day.condition.text;
                    const temp = `${Math.round(day.day.avgtemp_c)}°C`;
                    const icon = day.day.condition.icon;

                    const dayElement = document.createElement("div");
                    dayElement.innerHTML = `
                        <img src="${icon}" alt="Weather icon">
                        <p><strong>${weekday}</strong><br>${monthDay}</p>
                        <h3>${temp}</h3>
                        <p>${condition}</p>
                    `;
                    futureWeatherElement.appendChild(dayElement);
                });

                // Air quality data
                const aqi = data.current.air_quality;
                airQualityElement.textContent = `PM2.5: ${aqi.pm2_5.toFixed(1)}, PM10: ${aqi.pm10.toFixed(1)}, O3: ${aqi.o3.toFixed(1)}`;

                // Air Quality Chart
                if (airQualityChart) {
                    airQualityChart.destroy(); // remove chart
                }

                const ctx = document.getElementById("air-quality-chart").getContext("2d");
                airQualityChart = new Chart(ctx, {
                    type: "bar",
                    data: {
                        labels: ["PM2.5", "PM10", "O3"],
                        datasets: [{
                            label: "Air Quality Levels",
                            data: [aqi.pm2_5, aqi.pm10, aqi.o3],
                            backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(75, 192, 192, 0.2)"],
                            borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(75, 192, 192, 1)"],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });

                // Time zone data
                timeZoneElement.textContent = `Time Zone: ${data.location.tz_id}, Local Time: ${data.location.localtime}`;
            } catch (error) {
                console.error("Error fetching weather data:", error); // checking error message
                tempElement.textContent = "Error fetching weather data.";
                descriptionElement.textContent = "";
                iconElement.src = "";
                futureWeatherElement.innerHTML = "";
                airQualityElement.textContent = "";
                timeZoneElement.textContent = "";
            }
        }
    });
});

// hiding info until user input data
document.getElementById('location-form').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('weather-result').style.display = 'block';
});
