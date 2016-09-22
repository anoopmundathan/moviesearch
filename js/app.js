$(document).ready(function() {

	// Handle keyboard events 
	$('input').keyup(function() {

		// Hide Movie description page and show main page
		$('.movie-plot-header').hide();
		$('.poster').remove();
		$('#movies').show();

		searchMovies();
	})

    // Search Movies - Perform ajax request
	function searchMovies() {

		// Retrieve the user input
		var movieTitle = $('#search').val().toLowerCase();
		var movieYear  = $('#year').val().toLowerCase();
		var innerHTML  = "";
		
		// Request data from the OMDb API to display movie information
		$.ajax({

			url: "https://www.omdbapi.com/?s=" + movieTitle + "&y=" + movieYear + "&r=json",
			method: "GET",
			dataType: 'json',
			success: function(data) { // If ajax request is succesful display movie information

				if(data.Response === "True") {
					$.each(data.Search, function(index, movie) {
						innerHTML += "<li id='" + movie.imdbID + "'><a href='#'><div class='poster-wrap'>";
						if (movie.Poster !== 'N/A') { // Display movie poster if it is available
							innerHTML += "<img class='movie-poster' src=" + movie.Poster + ">";
						} else { //Display a placeholder icon when the API does not return poster data
							innerHTML += "<i class='material-icons poster-placeholder'>crop_original</i>";
						}
						innerHTML += "</a></div>";
          				innerHTML += "<span class='movie-title'>" + movie.Title + "</span>";     // Display movie title
          				innerHTML += "<span class='movie-year'>" + movie.Year + "</span></li>";  // Display movie year
					}); // End each method


				} else if(data.Response === "False") { // If no movies found
					innerHTML += "<li class='no-movies'>";
					innerHTML += "<i class='material-icons icon-help'>help_outline</i>No movies found that match: " + movieTitle ;
					innerHTML += "</li>";
				}

				$('#movies').html(innerHTML); // Display search results on the page	

				// Do not register click event if there are no movies
				if(data.Response === "True") {
					$('li').click(function(e) {
						e.preventDefault();
						
						// Make ajax request to get movie description
						$.ajax({
							url: "https://www.omdbapi.com/?i=" + $(this).attr('id') + "&plot=full&r=json",
							method: "GET",
							dataType: 'json',

							success: function(data) {
			
								var imdbURL  = 'http://www.imdb.com/title/' + data.imdbID + '/';
								$('#movies').hide();
								$('.movie-button').unbind('click'); // Remove button click event 
								
								// Generate dynamic content 
								$('.movie-plot-poster').append("<img class='poster' src='" + data.Poster + "'>");
								$('.movie-plot-title').html('<h1>' + data.Title + '</h1><p>IMDB Rating : ' + data.imdbRating + '</p>');
								$('.movie-plot-story').html('<h3>Plot Synopsis</h3><p>' + data.Plot + '</p');

								$('.movie-plot-header').show();

								// Go back to search results page 
								$('.search-result').click(function(e) {
									e.preventDefault();
									$('.movie-plot-header').hide();
									$('.poster').remove();
									$('#movies').show();
								});

								// Open imdb site in a new window tab
								$('.movie-button').click(function() {
									//window.location.href = 'http://www.imdb.com/title/' + data.imdbID + '/';
									window.open(imdbURL, '_blank');
								})

							} // End success function for movie description

						}); // End ajax method for plot

					}); // End li click
				} // End if condition

			} // End success function

		}); // End ajax method

	} // End searchMovies function

}); // End document.ready