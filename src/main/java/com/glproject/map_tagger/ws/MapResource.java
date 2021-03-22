package com.glproject.map_tagger.ws;

import java.util.List;

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
import com.glproject.map_tagger.dao.Map.Confidentiality;
import com.glproject.map_tagger.dao.Place;
import com.glproject.map_tagger.dao.User;

@Path("/Map")
public class MapResource {

	/**
	 * Data has to be like the following format:
	 * "mapid
	 * visibility"
	 * @param data
	 * @return
	 */
	@POST
	@Consumes(MediaType.TEXT_PLAIN)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/update/visibility")
	public Response updateVisibility(String data) {
		
		String[] dataTab = data.split("\n");
		
		Long mapid = Long.parseLong(dataTab[0]);
		boolean isVisible = Boolean.parseBoolean(dataTab[1]);
		
		PersistenceManager pm = DAO.getPmf().getPersistenceManager();
		Map map = pm.getObjectById(Map.class, mapid);
		map.setVisibility(isVisible);
		
		return Response.ok(map).build();
	}
	
	/**
	 * Data has to be like the following format:
	 * "mapid
	 * 	nameMap
	 *  descriptionMap
	 *  confidentiality"
	 * @param data
	 * @return
	 */
	@POST
	@Consumes(MediaType.TEXT_PLAIN)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/update")
	public Response updateMap(String data) {
		
		String[] dataTab = data.split("\n");
		
		PersistenceManager pm = DAO.getPmf().getPersistenceManager();
		
		long mapid = Long.parseLong(dataTab[0]);
		String nameMap = dataTab[1];
		String descriptionMap = dataTab[2];
		Confidentiality confidentiality = Confidentiality.parseConfidentiality(dataTab[3]);
		
		Map map = pm.getObjectById(Map.class, mapid);
		map.setName(nameMap);
		map.setDescription(descriptionMap);
		map.setConfidentiality(confidentiality);
		
		map.getName();
		map.getDescription();
		map.getConfidentiality();
		map.getPlaces();
		for (Place place : map.getPlaces()) {
			place.getName();
		}
		
		pm.close();
		
		return Response.ok(map).build();
	}
	
	
	
	/**
	 * Data has to be like the following format:
	 * "nameMap
	 *  descriptionMap
	 *  confidentiality"
	 * @param data
	 * @return
	 */
	@POST
	@Consumes(MediaType.TEXT_PLAIN)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/create")
	public Response createMap(String data) {
		
		String[] dataTab = data.split("\n");
		System.out.println(data);
		
		PersistenceManager pm = DAO.getPmf().getPersistenceManager();
		
		User owner = pm.getObjectById(User.class, UserResource.getCurrentSession());
		
		Map map = new Map(owner.getName(), dataTab[0]);
		map.setDescription(dataTab[1]);
		map.setConfidentiality(Confidentiality.parseConfidentiality(dataTab[2]));
		
		owner.addMap(map);
		
		pm.close();
			
		return Response.ok(map).build();
	}
	
	
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/allPublic")
	public List<Map> getPublicMap(){
		return DAO.getMapDao().getPublicMaps();
	}
	
	
	//################ FAKE  BELOW ##################
	
	

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/fakeMap")
	public Map getFakeMap() {
		Map map = new Map("Alfred");
		map.setConfidentiality(Confidentiality.PRIVATE);
		map.setDescription("a new map");
		map.setName("Map 1");

		return map;
	}
}
