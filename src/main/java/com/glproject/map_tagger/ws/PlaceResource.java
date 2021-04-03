package com.glproject.map_tagger.ws;

import java.util.ArrayList;
import java.util.List;

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
		
		return place;
	}
	
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/fromUser/{id}")
	public List<Place> getUserPlaces(@PathParam("id") String id){
		return DAO.getUserDao().getUser(Long.parseLong(id)).getPlaces();
	}
	

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/byTags")
	public Response getResearchedPlaces(List<String> tags){
		
		List<Place> places = new ArrayList<>();
		
		List<Map> publicMaps = DAO.getMapDao().getPublicMaps();
		
		for (Map map : publicMaps) {
			for (Place place : map.getPlaces()) {
				if (place.getTags().containsAll(tags)) {
					places.add(place);
				}
			}
		}
		
		return Response.ok(places).build();
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
	
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/create/{mapId}")
	public Response createPlace(@PathParam("mapId") String mapId, Place place) {

		Place detached = DAO.getPlaceDao().addPlaceTo(Long.parseLong(mapId), place);
		
		return Response.ok(detached).build();		
	}

	

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/update")
	public Response updatePlace(Place place) {
		
		place = DAO.getPlaceDao().updatePlace(place);
		
		return Response.ok(place).build();
	}
	

}








