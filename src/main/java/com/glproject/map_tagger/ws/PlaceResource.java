package com.glproject.map_tagger.ws;

import java.util.List;

import javax.jdo.PersistenceManager;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.glproject.map_tagger.dao.DAO;
import com.glproject.map_tagger.dao.Map;
import com.glproject.map_tagger.dao.Place;

@Path("/Place")
public class PlaceResource {
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/{id}")
	public Place getPlace(@PathParam("id") String id) {
		long placeid = Long.parseLong(id);
		
		Place place = DAO.getPlaceDao().getPlace(placeid);
		
		System.out.println(place+" "+place.getDescription());
		
		return place;
	}
	
	
	
	/**
	 * Get the places of a specific map
	 * @param id
	 * @return
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/fromMap/{id}")
	public List<Place> getMapPlaces(@PathParam("id") String id){
		long mapid = Long.parseLong(id);
		
		Map map = DAO.getMapDao().getMap(mapid);
		
		return map.getPlaces();
	}

	
	
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
		
		Place place = pm.getObjectById(Place.class, placeId);
		place.setName(name);
		place.setDescription(description);
		
		place.getName();
		place.getDescription();
		
		pm.close();
		
		return Response.ok(place).build();
	}
	

}








