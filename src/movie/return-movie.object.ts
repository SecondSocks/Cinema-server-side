export const returnMovieObject = {
	id: true,
	title: true,
	description: true,
	poster: true,
	bigPoster: true,
	rating: true,
	slug: true,
	countOpened: true,
	videoUrl: true,
	genres: {
		select: {
			id: true,
			name: true,
			slug: true
		}
	},
	actors: {
		select: {
			id: true,
			name: true
		}
	},
	parameters: {
		select: {
			year: true,
			duration: true,
			country: true
		}
	}
}
