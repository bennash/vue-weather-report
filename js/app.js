$(function(){

	$("#locationsearch, .back-btn").on("click", function(){
		$(".weather-widget").toggleClass("search-toggled");
		$("input#location").focus();
	});

});

var app = new Vue({
	el: '#app',
	data: {
		weather_img: "img/weather-img/sunny.jpeg",
		month: "",
		day: "",
		place: "Mumbai, India",
		weather_descrip: '',
		kelvin_temp: '',
		humidity: '',
		rain: '',
		wind: '',
		wind_speed: '',
		temp_unit: "C",
		speed_unit: "m/s",
		main_icon: "wi wi-sunny"
	},
	computed: {
		month: function(){
			var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			now = new Date();
			return monthNames[now.getMonth()];
		},
		day: function(){
			now = new Date();
			return now.getDate();
		},
		temp: function(){
			if(this.temp_unit=="C"){
				return (this.kelvin_temp-273.15).toFixed(0);
			} else {
				return (this.kelvin_temp*9/5-459.67).toFixed(0);
			}
		},
		wind_speed: function(){
			if(this.temp_unit=="F"){
				return (this.wind*0.000621371*3600).toFixed(2);
			}
			return this.wind;
		}
	},
	created: function(){
		this.getWeatherData();
		this.$watch('place', function(){
			this.getWeatherData();
		});
	},
	methods: {
		getWeatherData: function(){
			encoded_place = this.place.replace(/ /g,'');
			api_key = "d5f1a069fefa16b7bb17670101c52892";
			this.$http.get("http://api.openweathermap.org/data/2.5/weather?q="+encoded_place+"&appid="+api_key).then(function(response){
				this.weather_descrip = response['data']['weather'][0]['description'];
				this.kelvin_temp = response['data']['main']['temp'];
				this.humidity = response['data']['main']['humidity'];
				this.rain = response['data']['main']['rain'] || 0;
				this.wind = response['data']['wind']['speed'];

				icon_prfix = 'wi wi-';
				code = response['data']['weather'][0]['id'];
				img_icon = weatherIcons[code].icon;

				this.weather_img = "img/weather-img/"+img_icon+".jpeg";
				
				// If we are not in the ranges mentioned above, add a day/night prefix.
				if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
					img_icon = 'day-' + img_icon;
				}
				// Finally tack on the prefix.
				this.main_icon = icon_prfix + img_icon;
			});
		},
		setLocation: function(){
			this.place = $("input#location").val();
			$(".weather-widget").toggleClass("search-toggled");
			$("input#location").val(''); // clear the search box
		},
		toggleUnit: function(){
			if(this.temp_unit=="C"){
				this.temp_unit = "F";
				this.speed_unit = "mi/hr"
			} else {
				this.temp_unit = "C";
				this.speed_unit = "m/s"
			}
		}
	}
});
