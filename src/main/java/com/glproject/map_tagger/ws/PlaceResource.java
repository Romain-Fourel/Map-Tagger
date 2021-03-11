package com.glproject.map_tagger.ws;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.glproject.map_tagger.dao.Place;

@Path("/Place")
public class PlaceResource {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/fakePlace")
	public Place getPlace() {
		Place place = new Place();
		place.setDescription("a new place");
		place.setName("Place 1");
		place.setLocation(48.123654, 2.342148);

		return place;
	}

}








