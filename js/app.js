$(document).ready(function() {

	$('input').keyup(function() {
		searchMovies();
	})

	function searchMovies() {
		var movieTitle = $('#search').val().toLowerCase();
		var movieYear = $('#year').val().toLowerCase();
		var innerHTML = "";
		
		// Request data from the OMDb API to display movie information
		$.ajax({

			url: "http://www.omdbapi.com/?s=" + movieTitle + "&y=" + movieYear + "&r=json",
			method: "GET",
			dataType: 'json',
			success: function(data) { // If ajax request is succesful display movie information

				if(data.Response === "True") {
					$.each(data.Search, function(index, movie) {
						innerHTML += "<li><a href='#'><div class='poster-wrap'>";
						if (movie.Poster !== 'N/A') { // Display movie poster if it is available
							innerHTML += "<img class='movie-poster' src=" + movie.Poster + "></div></a>";
						} else { //Display a placeholder icon when the API does not return poster data
							innerHTML += "<i class='material-icons poster-placeholder'>crop_original</i>";
						}
          				innerHTML += "<span class='movie-title'>" + movie.Title + "</span>";     // Display movie title
          				innerHTML += "<span class='movie-year'>" + movie.Year + "</span></li>";  // Display movie year
					}); // End each method
				} else if(data.Response === "False") {
					innerHTML += "<li class='no-movies'>";
					innerHTML += "<i class='material-icons icon-help'>help_outline</i>No movies found that match: " + movieTitle ;
					innerHTML += "</li>";
				}

				$('#movies').html(innerHTML); // Display search results on the page	
			} // End success function
		}); // End ajax method
	} // End searchMovies function
}); // End document.ready