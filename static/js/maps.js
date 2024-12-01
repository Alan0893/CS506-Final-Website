document.addEventListener("DOMContentLoaded", function () {
	const mapContainer = document.querySelector('.map-container1');

	fetch('/maps/neighborhood_budget')
		.then(response => response.text())
		.then(mapHTML => {
			mapContainer.innerHTML = mapHTML;
			mapContainer.classList.add('loaded'); 
		})
		.catch(error => {
			console.error("Error loading the map:", error);
			mapContainer.innerHTML = "<p style='color: red;'>Failed to load the map. Please try again.</p>";
		});
});

document.addEventListener("DOMContentLoaded", function () {
	const mapContainer = document.querySelector('.map-container2');

	fetch('/maps/per_capita')
		.then(response => response.text())
		.then(mapHTML => {
			mapContainer.innerHTML = mapHTML;
			mapContainer.classList.add('loaded'); 
		})
		.catch(error => {
			console.error("Error loading the map:", error);
			mapContainer.innerHTML = "<p style='color: red;'>Failed to load the map. Please try again.</p>";
		});
});
