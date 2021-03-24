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
	

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/update")
	public Response updateMap(Map map) {
		
		map = DAO.getMapDao().updateMap(map);		
		
		return Response.ok(map).build();
	}
	
	
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/create/{userId}")
	public Response createMap(@PathParam("userId") String userId, Map map) {
		
		map.setVisibility(true);
		
		map = DAO.getMapDao().addMap(map);
		
		map = DAO.getUserDao().addMapTo(Long.parseLong(userId), map);	
			
		return Response.ok(map).build();
	}
	
	
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/{id}")
	public Map getMap(@PathParam("id") String id){
		
		long mapid = Long.parseLong(id);
		
		return DAO.getMapDao().getMap(mapid);
	
	}
	
	
	
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/allPublic")
	public List<Map> getPublicMap(){
		return DAO.getMapDao().getPublicMaps();
	}
	
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/fromUser/{id}")
	public List<Map> getUserMaps(@PathParam("id") String id){
		long userid = Long.parseLong(id);
		
		User user = DAO.getUserDao().getUser(userid);
		
		return user.getMapList();
	}
	
}
