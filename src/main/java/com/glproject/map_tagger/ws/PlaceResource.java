package com.glproject.map_tagger.ws;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.glproject.map_tagger.dao.DAO;
import com.glproject.map_tagger.dao.Place;

@Path("/Place")
public class PlaceResource {

	/**
	 * The data newPlaceData has to be like that:
	 * "name\ndescription\nid"
	 * @param newPlaceDatas
	 * @return
	 */
	@POST
	@Consumes(MediaType.TEXT_PLAIN)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/create")
	public Response createPlace(String newPlaceData) {
		
		String[] dataTab = newPlaceData.split("\n");
		
		String name  = dataTab[0];
		String description = dataTab[1];
		Long mapId = Long.parseLong(dataTab[2]);
		
		Place place = new Place(name);
		place.setDescription(description);
		place = DAO.getPlaceDao().addPlace(place);
		DAO.getMapDao().getMap(mapId).addPlace(place);
		
		System.out.println(place+" : ["+place.getDescription()+"] at {"+place.getLatitude()+","+place.getLongitude()+"}");
		
		return Response.ok(place).build();
	}
	
	
	
	
	
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








