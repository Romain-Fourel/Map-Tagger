package com.glproject.map_tagger.ws;

import javax.jdo.PersistenceManager;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.glproject.map_tagger.dao.DAO;
import com.glproject.map_tagger.dao.Map;
import com.glproject.map_tagger.dao.Place;

@Path("/Place")
public class PlaceResource {

	/**
	 * The data newPlaceData has to be like that:
	 * "name
	 * description
	 * id
	 * latitude
	 * longitude"
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
		double latitude = Double.parseDouble(dataTab[3]);
		double longitude = Double.parseDouble(dataTab[4]);
		
		Place place = new Place(name);
		place.setDescription(description);
		place.setLocation(latitude, longitude);
		
		PersistenceManager pm = DAO.getPmf().getPersistenceManager();
		
		Map map = pm.getObjectById(Map.class, mapId);
		map.addPlace(place);
		pm.close();
		
		System.out.println(place+" : ["+place.getDescription()+"] at {"+place.getLatitude()+","+place.getLongitude()+"}");
		
		return Response.ok(place).build();
	}
	
	/**
	 * the data has to be like:
	 * "id
	 * name
	 * description"
	 * @param data
	 * @return
	 */
	@POST
	@Consumes(MediaType.TEXT_PLAIN)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/update")
	public Response updatePlace(String data) {
		
		String[] dataTab = data.split("\n");
		long placeId = Long.parseLong(dataTab[0]);
		String name = dataTab[1];
		String description = dataTab[2];
		
		PersistenceManager pm = DAO.getPmf().getPersistenceManager();
		
		Place place = DAO.getPlaceDao().getPlace(placeId);
		place.setName(name);
		place.setDescription(description);
		
		place.getName();
		place.getDescription();
		
		pm.close();
		
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








