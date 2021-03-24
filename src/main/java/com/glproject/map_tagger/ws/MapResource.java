package com.glproject.map_tagger.ws;

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
import com.glproject.map_tagger.dao.User;

@Path("/Map")
public class MapResource {


	@POST
	@Consumes(MediaType.TEXT_PLAIN)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/update/{id}/visibility")
	public Response updateVisibility(@PathParam("id") String mapId, String isVisible) {
		
		Map map = DAO.getMapDao().getMap(Long.parseLong(mapId));
		System.out.println(map.toCompleteString());
		map.setVisibility(Boolean.parseBoolean(isVisible));
		
		map = DAO.getMapDao().updateMap(map);
		
		return Response.ok(map).build();
	}
	

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/update")
	public Response updateMap(Map map) {
		
		map = DAO.getMapDao().updateMap(map);	
		
		System.out.println(map.toCompleteString());
		
		return Response.ok(map).build();
	}
	
	
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/create/{userId}")
	public Response createMap(@PathParam("userId") String userId, Map map) {
		
		map = DAO.getMapDao().addMapTo(Long.parseLong(userId), map);	
			
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
